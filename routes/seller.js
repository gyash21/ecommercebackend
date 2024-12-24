const express = require('express');
const { checkSellerRole } = require('../middlewares/roleCheck');  // Import role-check middleware
const Seller = require('../models/seller');
const Product = require('../models/product');

const router = express.Router();


// Add a new product (Only for sellers)
router.post('/add-product', checkSellerRole, async (req, res) => {
    try {
      const { name, description, price, category, stockQuantity } = req.body;
      const sellerId = req.session.sellerId;  // Seller ID is saved in session
  
      if (!name || !description || !price || !category || !stockQuantity) {
        return res.status(400).json({ error: 'All fields are required' });
      }
  
      // Create a new product
      const newProduct = new Product({
        name,
        description,
        price,
        category,
        stockQuantity,
        sellerId
      });
  
      // Save the product to the database
      await newProduct.save();
  
      res.status(201).json({
        success: true,
        message: 'Product added successfully!',
        product: newProduct
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: 'Failed to add product',
        details: error.message
      });
    }
  });
  
  // Remove a product (Only for sellers, and only their own products)
  router.delete('/remove-product/:productId', checkSellerRole, async (req, res) => {
    try {
      const { productId } = req.params;
      const sellerId = req.session.sellerId;
  
      // Find the product by ID
      const product = await Product.findById(productId);
  
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
  
      // Check if the product belongs to the logged-in seller
      if (product.sellerId.toString() !== sellerId) {
        return res.status(403).json({ error: 'You can only delete your own products' });
      }
  
      // Delete the product
      await product.remove();
  
      res.status(200).json({
        success: true,
        message: 'Product removed successfully'
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: 'Failed to remove product',
        details: error.message
      });
    }
  });

module.exports = router;
