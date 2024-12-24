const Seller = require('../models/seller');

// Middleware to check if the logged-in user is an owner
const checkOwnerRole = async (req, res, next) => {
  const { sellerId } = req.session;
  if (!sellerId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const seller = await Seller.findOne({ sellerId });
  if (!seller || seller.role !== 'owner') {
    return res.status(403).json({ error: 'Permission denied, owner access required' });
  }

  next(); // Allow access for owners
};

// Middleware to check if the logged-in user is a seller
const checkSellerRole = async (req, res, next) => {
  const { sellerId } = req.session;
  if (!sellerId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const seller = await Seller.findOne({ sellerId });
  if (!seller || seller.role !== 'seller') {
    return res.status(403).json({ error: 'Permission denied, seller access required' });
  }

  next(); // Allow access for sellers
};

module.exports = { checkOwnerRole, checkSellerRole };
