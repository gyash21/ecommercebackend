const express = require('express');
const crypto = require('crypto');
const User = require('../models/user');
const { sendVerificationEmail } = require('../services/email');
const router = express.Router();

// Register User (Website Owner)
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create a new user
    const newUser = new User({ email, password });

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    newUser.verificationToken = verificationToken;

    // Save the user to the database
    await newUser.save();

    // Send verification email
    await sendVerificationEmail(email, verificationToken);

    res.status(201).json({
      success: true,
      message: 'Registration successful. Please check your email to verify your account.',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'An error occurred during registration.',
      details: error.message
    });
  }
});

module.exports = router;
