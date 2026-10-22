const Product = require('../models/Product');

// @desc    Fetch products with search, filtering, sorting, pagination
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const {
      keyword,
      category,
      minPrice,
      maxPrice,
      minRating,
      sort,
      page = 1,
      limit = 12,
      featured,
      trending,
      newArrival
    } = req.query;

    const query = {};

    // Keyword search across name, description, or tags
    if (keyword && keyword.trim()) {
      const searchRegex = new RegExp(keyword.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { tags: searchRegex },
        { category: searchRegex }
      ];
    }

    // Category filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // Price range filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined && !isNaN(Number(minPrice))) {
        query.price.$gte = Number(minPrice);
      }
      if (maxPrice !== undefined && !isNaN(Number(maxPrice))) {
        query.price.$lte = Number(maxPrice);
      }
    }

    // Rating filter
    if (minRating !== undefined && !isNaN(Number(minRating))) {
      query.rating = { $gte: Number(minRating) };
    }

    // Editorial flags
    if (featured === 'true') query.featured = true;
    if (trending === 'true') query.isTrending = true;
    if (newArrival === 'true') query.isNewArrival = true;

    // Sorting
    let sortOption = { createdAt: -1 }; // default newest
    if (sort === 'price_asc') sortOption = { price: 1 };
    else if (sort === 'price_desc') sortOption = { price: -1 };
    else if (sort === 'rating') sortOption = { rating: -1, numReviews: -1 };
    else if (sort === 'newest') sortOption = { createdAt: -1 };

    // Pagination
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 12));
    const skip = (pageNum - 1) * limitNum;

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      totalPages: Math.ceil(total / limitNum) || 1,
      currentPage: pageNum,
      products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product details with related products
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.'
      });
    }

    // Retrieve up to 4 related products in same category
    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id }
    })
      .limit(4)
      .select('name price originalPrice images rating numReviews category stock');

    res.status(200).json({
      success: true,
      product,
      relatedProducts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      description,
      category,
      price,
      originalPrice,
      stock,
      images,
      featured,
      isTrending,
      isNewArrival,
      specs,
      tags,
      sku
    } = req.body;

    if (!name || !description || !category || price === undefined || stock === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required product fields (name, description, category, price, stock).'
      });
    }

    const generatedSku =
      sku ||
      `SSP-${category.substring(0, 4).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;

    const product = await Product.create({
      sku: generatedSku,
      name: name.trim(),
      description: description.trim(),
      category,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      stock: Number(stock),
      images: Array.isArray(images) && images.length > 0 ? images : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'],
      featured: Boolean(featured),
      isTrending: Boolean(isTrending),
      isNewArrival: Boolean(isNewArrival),
      specs: Array.isArray(specs) ? specs : [],
      tags: Array.isArray(tags) ? tags : []
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an existing product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.'
      });
    }

    const updates = { ...req.body };
    if (updates.price !== undefined) updates.price = Number(updates.price);
    if (updates.stock !== undefined) updates.stock = Number(updates.stock);
    if (updates.originalPrice !== undefined) updates.originalPrice = Number(updates.originalPrice);

    product = await Product.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.'
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
