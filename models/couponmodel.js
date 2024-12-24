const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discountType: { type: String, enum: ['percentage', 'fixed'], required: true }, // percentage or fixed
  discountValue: { type: Number, required: true }, // Discount value, e.g., 20 for 20% or 50 for $50 off
  expiryDate: { type: Date, required: true },
  usageLimit: { type: Number, required: true }, // How many times the coupon can be used
  usedCount: { type: Number, default: 0 }, // Number of times the coupon has been used
  isActive: { type: Boolean, default: true }, // Whether the coupon is still valid
}, { timestamps: true });

const Coupon = mongoose.model('Coupon', couponSchema);

module.exports = Coupon;
