const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { verify } = require('crypto');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  userId: { type: String, unique: true, required: true }, // Add unique userId
  accountStatus: { type: String, default: 'open' }, // Default account status
  phone: { type: String, default: 'not available' }, // Phone number field with default value

  verified:{ type: Boolean, default: false },
  verificationToken: { type: String, required: false },
});


const User = mongoose.model('User', UserSchema);

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model('User', UserSchema);