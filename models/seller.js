const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const SellerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['seller', 'owner'], default: 'seller' }, //Role field
  sellerId: { type: String, unique: true, required: true },
  emailVerified: { type: Boolean, default: false },
  phoneVerified: { type: Boolean, default: false },
  phoneNumber: { type: String, required: true },
  businessName: { type: String, required: true },
  businessAddress: { type: String, required: true },
  businessType: { type: String, required: true },
  otp: { type: String },
  loggedIn: { type: String, enum: ['loggedin', 'loggedout'], default: 'loggedout' },

  verified:{ type: Boolean, default: false }, 
  verificationToken: { type: String, required: false },
});

const Seller = mongoose.model('Seller', SellerSchema);


// Hash password before saving
SellerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model('Seller', SellerSchema);
