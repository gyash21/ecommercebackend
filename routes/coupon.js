const express = require('express');
const router = express.Router();
const Coupon = require('../models/couponmodel');

// Create a new coupon
router.post('/create', async (req, res) => {
  const { code, discountType, discountValue, expiryDate, usageLimit } = req.body;

  try {
    // Check if coupon code already exists
    const existingCoupon = await Coupon.findOne({ code });
    if (existingCoupon) {
      return res.status(400).json({ error: 'Coupon code already exists.' });
    }

    // Create new coupon
    const coupon = new Coupon({
      code,
      discountType,
      discountValue,
      expiryDate,
      usageLimit
    });

    await coupon.save();
    res.status(201).json({ success: true, coupon });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating coupon.' });
  }
});

// Get all coupons
router.get('/', async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.status(200).json({ coupons });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching coupons.' });
  }
});

// Update a coupon (e.g., to change usage limit or expiry date)
router.put('/update/:id', async (req, res) => {
  const { id } = req.params;
  const { usageLimit, expiryDate } = req.body;

  try {
    const coupon = await Coupon.findById(id);
    if (!coupon) {
      return res.status(404).json({ error: 'Coupon not found.' });
    }

    // Update coupon details
    coupon.usageLimit = usageLimit || coupon.usageLimit;
    coupon.expiryDate = expiryDate || coupon.expiryDate;

    await coupon.save();
    res.status(200).json({ success: true, coupon });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating coupon.' });
  }
});

// Delete a coupon
router.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const coupon = await Coupon.findById(id);
    if (!coupon) {
      return res.status(404).json({ error: 'Coupon not found.' });
    }

    await coupon.remove();
    res.status(200).json({ success: true, message: 'Coupon deleted.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error deleting coupon.' });
  }
});

  module.exports = router
  