const Cart = require('../models/Cart');
const Product = require('../models/Product');

const populateAndCalculateCart = async (cart) => {
  await cart.populate({
    path: 'items.product',
    select: 'name sku price originalPrice stock images category'
  });

  // Filter out any items whose product reference was deleted
  cart.items = cart.items.filter((item) => item.product != null);

  let subtotal = 0;
  const items = cart.items.map((item) => {
    const itemSubtotal = item.product.price * item.quantity;
    subtotal += itemSubtotal;
    return {
      _id: item._id,
      product: item.product,
      quantity: item.quantity,
      itemTotal: itemSubtotal,
      isAvailable: item.product.stock >= item.quantity
    };
  });

  // Flat shipping logic: Free shipping over ₹1,500, else ₹99
  const shippingFee = subtotal >= 1500 || subtotal === 0 ? 0 : 99;
  const tax = Math.round(subtotal * 0.05); // 5% GST/tax
  const total = subtotal + shippingFee + tax;

  return {
    _id: cart._id,
    items,
    itemCount: items.reduce((acc, i) => acc + i.quantity, 0),
    subtotal,
    shippingFee,
    tax,
    total
  };
};

// @desc    Get current user's cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    const calculated = await populateAndCalculateCart(cart);
    res.status(200).json({ success: true, cart: calculated });
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/items
// @access  Private
const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: 'Product ID is required.' });
    }

    const qty = Math.max(1, parseInt(quantity, 10) || 1);
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    if (product.stock <= 0) {
      return res.status(400).json({ success: false, message: 'This item is currently out of stock.' });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      const newQty = cart.items[itemIndex].quantity + qty;
      if (newQty > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Cannot add more than available stock (${product.stock} available).`
        });
      }
      cart.items[itemIndex].quantity = newQty;
    } else {
      if (qty > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Requested quantity exceeds available stock (${product.stock} available).`
        });
      }
      cart.items.push({ product: productId, quantity: qty });
    }

    await cart.save();
    const calculated = await populateAndCalculateCart(cart);

    res.status(200).json({
      success: true,
      message: 'Item added to cart',
      cart: calculated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update item quantity in cart
// @route   PUT /api/cart/items/:productId
// @access  Private
const updateCartItem = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (quantity === undefined) {
      return res.status(400).json({ success: false, message: 'Quantity is required.' });
    }

    const qty = parseInt(quantity, 10);
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found.' });
    }

    if (qty <= 0) {
      // Remove item
      cart.items = cart.items.filter(
        (item) => item.product.toString() !== productId
      );
    } else {
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found.' });
      }

      if (qty > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Cannot request more than available stock (${product.stock} units available).`
        });
      }

      const itemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity = qty;
      } else {
        cart.items.push({ product: productId, quantity: qty });
      }
    }

    await cart.save();
    const calculated = await populateAndCalculateCart(cart);

    res.status(200).json({
      success: true,
      message: 'Cart updated',
      cart: calculated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/items/:productId
// @access  Private
const removeFromCart = async (req, res, next) => {
  try {
    const { productId } = req.params;
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found.' });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();
    const calculated = await populateAndCalculateCart(cart);

    res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      cart: calculated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear entire cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });

    if (cart) {
      cart.items = [];
      await cart.save();
    }

    res.status(200).json({
      success: true,
      message: 'Cart cleared successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
};
