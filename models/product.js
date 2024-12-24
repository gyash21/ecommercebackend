const mongoose = require('mongoose');
const seller = require('./seller');
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  images: {
      type: [String], // Array of image URLs
      required: true,
      validate: [arrayLimit, '{PATH} must have at least 4 images.'],
  },
  category: String,
  rating: Number,
  productId: { type: String, unique: true }, // Added productId field
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required:true }, // linking products to its respective seller
  inStockValue: Number, // Available stock value
  soldStockValue: Number, // Number of items sold
  visibility: { type: String, default: 'on' } // Visibility field with default 'on'
  
});


function arrayLimit(val) {
  return val.length >= 4; // Ensure at least 4 images
}

const Product = mongoose.model('Product', productSchema);
module.exports = Product;