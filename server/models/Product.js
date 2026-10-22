const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    sku: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true
    },
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [120, 'Product name cannot exceed 120 characters']
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Product category is required'],
      enum: ['Electronics', 'Fashion', 'Home & Living', 'Accessories'],
      index: true
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price must be positive']
    },
    originalPrice: {
      type: Number,
      min: [0, 'Original price must be positive']
    },
    stock: {
      type: Number,
      required: [true, 'Product stock is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0
    },
    images: {
      type: [String],
      required: [true, 'At least one product image is required'],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: 'At least one image URL must be provided'
      }
    },
    featured: {
      type: Boolean,
      default: false,
      index: true
    },
    isTrending: {
      type: Boolean,
      default: false,
      index: true
    },
    isNewArrival: {
      type: Boolean,
      default: false,
      index: true
    },
    rating: {
      type: Number,
      default: 4.5,
      min: 0,
      max: 5,
      index: true
    },
    numReviews: {
      type: Number,
      default: 0,
      min: 0
    },
    specs: [
      {
        label: { type: String, trim: true },
        value: { type: String, trim: true }
      }
    ],
    tags: [
      {
        type: String,
        trim: true
      }
    ]
  },
  {
    timestamps: true
  }
);

productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, price: 1 });

module.exports = mongoose.model('Product', productSchema);
