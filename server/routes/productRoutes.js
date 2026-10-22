const express = require('express');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/admin');
const { validateObjectId } = require('../middleware/validate');

const router = express.Router();

router.route('/')
  .get(getProducts)
  .post(protect, adminOnly, createProduct);

router.route('/:id')
  .get(validateObjectId('id'), getProductById)
  .put(protect, adminOnly, validateObjectId('id'), updateProduct)
  .delete(protect, adminOnly, validateObjectId('id'), deleteProduct);

module.exports = router;
