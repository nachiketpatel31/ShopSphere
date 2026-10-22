const express = require('express');
const { getDashboardStats, getAllUsers } = require('../controllers/adminController');
const { getAllOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/admin');
const { validateObjectId } = require('../middleware/validate');

const router = express.Router();

// Enforce both authentication and admin authorization for all /api/admin routes
router.use(protect, adminOnly);

router.get('/dashboard', getDashboardStats);
router.get('/users', getAllUsers);
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', validateObjectId('id'), updateOrderStatus);

module.exports = router;
