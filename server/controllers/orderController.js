const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const { isReplicaSet } = require('../config/db');

// Generate unique readable order number
const generateOrderNumber = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `SSP-${timestamp}-${random}`;
};

// @desc    Create new order with failure-safe stock reservation
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res, next) => {
  const replicaSetAvailable = isReplicaSet();
  const session = replicaSetAvailable ? await mongoose.startSession() : null;

  try {
    const { shippingAddress, paymentMethod = 'COD', items: directItems } = req.body;

    // 1. Validate Shipping Address
    if (
      !shippingAddress ||
      !shippingAddress.fullName ||
      !shippingAddress.phone ||
      !shippingAddress.street ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.postalCode
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required shipping fields: Full Name, Phone, Street Address, City, State, and Postal Code.'
      });
    }

    // 2. Resolve items to order (either from direct items payload or from user's persisted Cart)
    let candidateItems = [];
    if (Array.isArray(directItems) && directItems.length > 0) {
      candidateItems = directItems;
    } else {
      const userCart = await Cart.findOne({ user: req.user._id });
      if (!userCart || userCart.items.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Your cart is empty. Please add items before checking out.'
        });
      }
      candidateItems = userCart.items.map((i) => ({
        product: i.product.toString(),
        quantity: i.quantity
      }));
    }

    if (candidateItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No items provided for order.'
      });
    }

    // 3. Fetch trusted database records for every product & verify current availability
    const verifiedItems = [];
    let subtotal = 0;

    for (const item of candidateItems) {
      const qty = parseInt(item.quantity, 10);
      if (isNaN(qty) || qty <= 0) {
        return res.status(400).json({
          success: false,
          message: `Invalid quantity for item: ${item.product}`
        });
      }

      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.product}`
        });
      }

      if (product.stock < qty) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${product.name}". Only ${product.stock} available.`
        });
      }

      const itemTotal = product.price * qty;
      subtotal += itemTotal;

      verifiedItems.push({
        product: product._id,
        sku: product.sku,
        name: product.name,
        image: product.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
        price: product.price, // STRICT: Using DB price, never frontend input!
        quantity: qty
      });
    }

    // 4. Calculate final trusted totals
    const shippingFee = subtotal >= 1500 ? 0 : 99;
    const tax = Math.round(subtotal * 0.05); // 5% tax
    const totalAmount = subtotal + shippingFee + tax;
    const orderNumber = generateOrderNumber();

    // 5. Stock Reservation Execution
    if (replicaSetAvailable && session) {
      // MODE A: Full ACID Transaction (Replica Set / Atlas)
      session.startTransaction();
      try {
        for (const item of verifiedItems) {
          const updated = await Product.findOneAndUpdate(
            { _id: item.product, stock: { $gte: item.quantity } },
            { $inc: { stock: -item.quantity } },
            { session, new: true }
          );

          if (!updated) {
            throw new Error(`Insufficient stock for "${item.name}" during reservation.`);
          }
        }

        const [createdOrder] = await Order.create(
          [
            {
              orderNumber,
              user: req.user._id,
              orderItems: verifiedItems,
              shippingAddress,
              paymentMethod,
              paymentStatus: 'pending',
              subtotal,
              shippingFee,
              tax,
              totalAmount,
              orderStatus: 'Placed',
              statusHistory: [{ status: 'Placed', note: 'Order placed via Cash on Delivery' }]
            }
          ],
          { session }
        );

        // Clear user cart
        await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] }, { session });

        await session.commitTransaction();
        session.endSession();

        return res.status(201).json({
          success: true,
          message: 'Order placed successfully',
          order: createdOrder
        });
      } catch (txErr) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          success: false,
          message: txErr.message || 'Failed to place order due to inventory contention.'
        });
      }
    } else {
      // MODE B: Resilient Atomic Compensating Reservation (Standalone MongoDB)
      const reservedItems = [];

      for (const item of verifiedItems) {
        const updated = await Product.findOneAndUpdate(
          { _id: item.product, stock: { $gte: item.quantity } },
          { $inc: { stock: -item.quantity } },
          { new: true }
        );

        if (!updated) {
          // Compensate / Roll back all items reserved so far
          console.warn(`[Compensating Checkout] Reservation failed for "${item.name}". Rolling back ${reservedItems.length} items...`);
          for (const resItem of reservedItems) {
            try {
              await Product.findByIdAndUpdate(resItem.product, {
                $inc: { stock: resItem.quantity }
              });
            } catch (compErr) {
              console.error(`[Compensating Critical Error] Rollback failed for product ${resItem.product}:`, compErr);
            }
          }

          return res.status(400).json({
            success: false,
            message: `Checkout failed: Insufficient stock for "${item.name}". No stock was deducted.`
          });
        }

        reservedItems.push(item);
      }

      // If all items safely decremented, create Order
      try {
        const order = await Order.create({
          orderNumber,
          user: req.user._id,
          orderItems: verifiedItems,
          shippingAddress,
          paymentMethod,
          paymentStatus: 'pending',
          subtotal,
          shippingFee,
          tax,
          totalAmount,
          orderStatus: 'Placed',
          statusHistory: [{ status: 'Placed', note: 'Order placed via Cash on Delivery' }]
        });

        // Clear user cart
        await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

        return res.status(201).json({
          success: true,
          message: 'Order placed successfully',
          order
        });
      } catch (orderErr) {
        // Rollback all reserved stock if Order document creation fails
        console.error('[Compensating Checkout] Order creation failed. Rolling back all reserved items...', orderErr);
        for (const resItem of reservedItems) {
          try {
            await Product.findByIdAndUpdate(resItem.product, {
              $inc: { stock: resItem.quantity }
            });
          } catch (compErr) {
            console.error(`[Compensating Critical Error] Rollback failed for product ${resItem.product}:`, compErr);
          }
        }
        return res.status(500).json({
          success: false,
          message: 'An error occurred while creating your order. All items have been released.'
        });
      }
    }
  } catch (error) {
    if (session) session.endSession();
    next(error);
  }
};

// @desc    Get logged in user's orders
// @route   GET /api/orders/my-orders
// @access  Private
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID (with ownership check)
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.'
      });
    }

    // Authorization check: User can only view their own order unless admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access forbidden: You cannot view orders that belong to another user.'
      });
    }

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status && status !== 'All') {
      query.orderStatus = status;
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      totalPages: Math.ceil(total / limitNum) || 1,
      currentPage: pageNum,
      orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status (Admin only)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status, note } = req.body;
    const validStatuses = ['Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.'
      });
    }

    // If changing to Cancelled and was not previously cancelled, restock products
    if (status === 'Cancelled' && order.orderStatus !== 'Cancelled') {
      for (const item of order.orderItems) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity }
        });
      }
    }

    order.orderStatus = status;
    order.statusHistory.push({
      status,
      timestamp: new Date(),
      note: note || `Status updated to ${status} by admin`
    });

    // If delivered, mark payment completed
    if (status === 'Delivered') {
      order.paymentStatus = 'completed';
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      order
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus
};
