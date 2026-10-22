const Wishlist = require('../models/Wishlist');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Get current user's wishlist
// @route   GET /api/wishlist
// @access  Private
const getWishlist = async (req, res, next) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate({
      path: 'products',
      select: 'name sku price originalPrice stock images category rating numReviews'
    });

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    }

    // Filter out null products if any were deleted
    wishlist.products = wishlist.products.filter((p) => p != null);

    res.status(200).json({
      success: true,
      count: wishlist.products.length,
      products: wishlist.products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add product to wishlist
// @route   POST /api/wishlist/:productId
// @access  Private
const addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user._id, products: [] });
    }

    const alreadyInWishlist = wishlist.products.some(
      (p) => p.toString() === productId
    );

    if (!alreadyInWishlist) {
      wishlist.products.push(productId);
      await wishlist.save();
    }

    await wishlist.populate({
      path: 'products',
      select: 'name sku price originalPrice stock images category rating numReviews'
    });

    res.status(200).json({
      success: true,
      message: 'Product added to wishlist',
      count: wishlist.products.length,
      products: wishlist.products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
const removeFromWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;

    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      return res.status(404).json({ success: false, message: 'Wishlist not found.' });
    }

    wishlist.products = wishlist.products.filter(
      (p) => p.toString() !== productId
    );

    await wishlist.save();
    await wishlist.populate({
      path: 'products',
      select: 'name sku price originalPrice stock images category rating numReviews'
    });

    res.status(200).json({
      success: true,
      message: 'Product removed from wishlist',
      count: wishlist.products.length,
      products: wishlist.products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Move item from wishlist to cart
// @route   POST /api/wishlist/:productId/move-to-cart
// @access  Private
const moveToCart = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    if (product.stock <= 0) {
      return res.status(400).json({
        success: false,
        message: 'This product is out of stock and cannot be moved to cart.'
      });
    }

    // 1. Remove from Wishlist
    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (wishlist) {
      wishlist.products = wishlist.products.filter(
        (p) => p.toString() !== productId
      );
      await wishlist.save();
    }

    // 2. Add to Cart
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += 1;
    } else {
      cart.items.push({ product: productId, quantity: 1 });
    }

    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Item moved to cart successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  moveToCart
};
