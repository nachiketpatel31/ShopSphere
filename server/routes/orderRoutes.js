const express = require('express');
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus
} = require('../controllers/orderController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/admin');
const { validateObjectId } = require('../middleware/validate');

const router = express.Router();

router.use(protect);

router.route('/')
  .post(createOrder)
  .get(adminOnly, getAllOrders);

router.get('/my-orders', getMyOrders);

router.route('/:id')
  .get(validateObjectId('id'), getOrderById);

router.route('/:id/status')
  .put(adminOnly, validateObjectId('id'), updateOrderStatus);

module.exports = router;
