const express = require('express');
const multer = require('multer');
const Product = require('../models/product');
const router = express.Router();

const upload = multer({ dest: 'uploads/' }); // Configure upload directory and options

// POST route for product creation
router.post('/create', upload.array('images', 5), async (req, res) => {
    try {
        const { name, description, price, seller } = req.body;
        const files = req.files;

        if (files.length < 4) {
            return res.status(400).json({ error: 'At least 4 images are required.' });
        }

        const imageUrls = files.map(file => `/uploads/${file.filename}`); // Assuming you serve these files

        const newProduct = new Product({
            name,
            description,
            price,
            images: imageUrls,
            seller,
        });

        await newProduct.save();
        res.status(201).json({ message: 'Product created successfully', product: newProduct });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
