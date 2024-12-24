const express = require('express');
const shiprocket = require('../services/shiprocket');
const router = express.Router();

// Route to get shipping rates for an order
router.post('/shipping-rates', async (req, res) => {
  const { origin, destination, weight } = req.body;

  try {
    const rates = await shiprocket.getShippingRates({ origin, destination, weight });
    res.status(200).json(rates);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching shipping rates.' });
  }
});

// Route to create a shipping order
router.post('/create-shipment', async (req, res) => {
  const orderDetails = req.body; // Assuming it includes all necessary order info like sender, receiver, items, etc.

  try {
    const shipment = await shiprocket.createShippingOrder(orderDetails);
    res.status(200).json(shipment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating shipment.' });
  }
});

// Route to track a shipment
router.get('/track-shipment/:shipmentId', async (req, res) => {
  const { shipmentId } = req.params;

  try {
    const trackingInfo = await shiprocket.trackShipment(shipmentId);
    res.status(200).json(trackingInfo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error tracking shipment.' });
  }
});

module.exports = router;
