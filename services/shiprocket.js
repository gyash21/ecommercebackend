const axios = require('axios');

// Set up Shiprocket API credentials
const API_KEY = process.env.SHIPROCKET_API_KEY;
const API_SECRET = process.env.SHIPROCKET_API_SECRET;
const BASE_URL = 'https://apiv2.shiprocket.in/v1/external';

// Helper function to get the Shiprocket token
async function getAuthToken() {
  const response = await axios.post(`${BASE_URL}/auth/login`, {
    email: process.env.SHIPROCKET_EMAIL,
    password: process.env.SHIPROCKET_PASSWORD,
  });

  if (response.data && response.data.token) {
    return response.data.token;
  }
  throw new Error('Failed to get authentication token');
}

// Function to get shipping rates for an order
async function getShippingRates({ origin, destination, weight }) {
  const token = await getAuthToken();

  const response = await axios.post(
    `${BASE_URL}/courier/rates`,
    {
      origin,
      destination,
      weight,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}

// Function to create a shipping order with Shiprocket
async function createShippingOrder(orderDetails) {
  const token = await getAuthToken();

  const response = await axios.post(
    `${BASE_URL}/shipment/create`,
    orderDetails,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}

// Function to track the shipment
async function trackShipment(shipmentId) {
  const token = await getAuthToken();

  const response = await axios.get(
    `${BASE_URL}/shipment/track/${shipmentId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}

module.exports = {
  getShippingRates,
  createShippingOrder,
  trackShipment,
};
