const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Cart = require('../models/cartmodel');
const Order = require('../models/complaintmodel'); 
const User = require('../models/user'); 
const Coupon = require('../models/couponmodel'); 
const Product = require('../models/product'); 
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true', // Convert string to boolean
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});


// Add to Cart Route
router.post('/addtocart', async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    let cart = await Cart.findOne({ userId });
    const productQty = parseInt(quantity);

    if (cart) {
      cart.productsInCart.push({ productId, productQty });
      await cart.save();
    } else {
      cart = new Cart({ userId, productsInCart: [{ productId, quantity }] });
      await cart.save();
    }

    res.status(200).json({ success: true, message: 'Product added to cart successfully', cart });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error adding product to cart', error: error.message });
  }
});

// Get Cart by User ID Route
router.post('/get-cart', async (req, res) => {
  try {
    const { userId } = req.body;
    const cart = await Cart.findOne({ userId });

    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found for this user' });

    res.status(200).json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching cart', error: error.message });
  }
});

router.put('/update-quantity', async (req, res) => {
  const { userId, productId, productQty } = req.body;

  if (!userId || !productId || typeof productQty !== 'number') {
    return res.status(400).json({ message: 'userId, productId, and a valid productQty are required.' });
  }

  try {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found.' });
    }

    const product = cart.productsInCart.find(item => item.productId === productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found in the cart.' });
    }

    product.productQty = productQty;
    await cart.save();

    res.status(200).json({ message: 'Quantity updated successfully.' });
  } catch (error) {
    console.error('Error updating quantity:', error);
    res.status(500).json({ message: 'An error occurred while updating the quantity.' });
  }
});
// Delete Item from Cart Route
router.post('/delete-items', async (req, res) => {
  const { userId, productId } = req.body;

  if (!userId || !productId) {
    return res.status(400).json({ message: 'userId and productId are required.' });
  }

  try {
    const result = await Cart.updateOne(
      { userId },
      { $pull: { productsInCart: { productId } } }
    );

    if (result.modifiedCount > 0) {
      res.status(200).json({ message: 'Item deleted successfully.' });
    } else {
      res.status(404).json({ message: 'Item not found in the cart.' });
    }
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ message: 'An error occurred while deleting the item.' });
  }
});

// Route to update quantity

// Place Order Route
router.post('/place-order', async (req, res) => {
  try {
    const { userId, date, time, address, price, productsOrdered } = req.body;

    const orderId = Math.floor(100000 + Math.random() * 900000).toString();
    const trackingId = Math.random().toString(36).substring(2, 14).toUpperCase();

    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    const productIds = productsOrdered.map(item => item.productId);

    const productDetails = await Product.find({ productId: { $in: productIds } });

    const order = new Order({
      userId,
      orderId,
      date,
      time,
      address,
      email: user.email,
      name: user.name,
      productIds,
      trackingId,
      price
    });

    await order.save();

    const emailHtml = `<div>Order Confirmation for ${user.name}...</div>`; // Simplified for brevity
    await transporter.sendMail({ from: `pecommerce8@gmail.com`, to: user.email, subject: 'Order Confirmation', html: emailHtml });

    res.status(200).json({ success: true, message: 'Order placed successfully', orderId, trackingId });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error placing order', error: error.message });
  }
});



// Entire coupon applying route


// Apply a coupon code
router.post('/apply-coupon', async (req, res) => {
  const { cartId, couponCode } = req.body;

  try {
    // Fetch the coupon from the database
    const coupon = await Coupon.findOne({ code: couponCode });
    if (!coupon || coupon.isActive === false) {
      return res.status(400).json({ error: 'Invalid or expired coupon code.' });
    }

    // Check if coupon has expired
    if (coupon.expiryDate < Date.now()) {
      coupon.isActive = false;
      await coupon.save();
      return res.status(400).json({ error: 'Coupon has expired.' });
    }

    // Check if coupon usage limit has been exceeded
    if (coupon.usedCount >= coupon.usageLimit) {
      coupon.isActive = false;
      await coupon.save();
      return res.status(400).json({ error: 'Coupon usage limit exceeded.' });
    }

    // Apply the coupon discount to the cart
    const cart = await Cart.findById(cartId);
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found.' });
    }

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = (coupon.discountValue / 100) * cart.totalAmount;
    } else if (coupon.discountType === 'fixed') {
      discount = coupon.discountValue;
    }

    // Update cart total with discount
    cart.totalAmount -= discount;
    cart.couponApplied = couponCode;

    // Increment the usage count of the coupon
    coupon.usedCount += 1;
    await coupon.save();

    await cart.save();

    res.status(200).json({ success: true, cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error applying coupon.' });
  }
});

module.exports = router;
