const express = require('express');
const { checkSellerRole } = require('../middlewares/roleCheck');  // Import role-check middleware

const router = express.Router();

// Seller Dashboard (for sellers only)
router.post('/dashboard', checkSellerRole, async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Welcome to your seller dashboard!',
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error accessing seller dashboard',
      details: error.message,
    });
  }
});

// Seller Product Management (only for sellers)
router.post('/manage-products', checkSellerRole, async (req, res) => {
  try {
    // Logic for managing products (adding/editing products)
    res.status(200).json({ success: true, message: 'Manage your products here' });
  } catch (error) {
    res.status(500).json({ error: 'Error managing products', details: error.message });
  }
});

module.exports = router;
