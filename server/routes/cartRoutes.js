const express = require('express');
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} = require('../controllers/cartController');
const { protect } = require('../middleware/auth');
const { validateObjectId } = require('../middleware/validate');

const router = express.Router();

router.use(protect); // All cart actions require authentication

router.route('/')
  .get(getCart)
  .delete(clearCart);

router.route('/items')
  .post(addToCart);

router.route('/items/:productId')
  .put(validateObjectId('productId'), updateCartItem)
  .delete(validateObjectId('productId'), removeFromCart);

module.exports = router;
