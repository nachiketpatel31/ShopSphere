const express = require('express');
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  moveToCart
} = require('../controllers/wishlistController');
const { protect } = require('../middleware/auth');
const { validateObjectId } = require('../middleware/validate');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getWishlist);

router.route('/:productId')
  .post(validateObjectId('productId'), addToWishlist)
  .delete(validateObjectId('productId'), removeFromWishlist);

router.route('/:productId/move-to-cart')
  .post(validateObjectId('productId'), moveToCart);

module.exports = router;
