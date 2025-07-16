// models/productModel.js
const mongoose = require('mongoose');

// A sub-schema for product reviews
const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true }, // e.g., 1-5 stars
    comment: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // Creates a reference to the User model
    },
  },
  {
    timestamps: true,
  }
);

const ProductSchema = new mongoose.Schema(
  {
    // Add a reference to the user who created the product (useful for admin tracking)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: [true, 'Please add a product name'],
      trim: true,
    },
    imageUrl: {
      type: String,
      default: 'https://placehold.co/600x400/EEE/31343C?text=Product+Image',
    },
    brand: {
      type: String,
      required: [true, 'Please add a brand'],
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    // Embed the reviews schema as an array of sub-documents
    reviews: [reviewSchema],
    // Add fields for aggregated review data for performance
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'Please add a price'],
      min: [0, 'Price cannot be negative'],
      default: 0,
    },
    stock: {
      type: Number,
      required: [true, 'Please add stock count'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Create a text index for searching by name and category
ProductSchema.index({ name: 'text', category: 'text' });

module.exports = mongoose.model('Product', ProductSchema);
