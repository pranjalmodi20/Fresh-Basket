// src/routes/productRoutes.js
const express = require('express');
const router = express.Router();

const Product = require('../models/Product');
const protect = require('../middleware/authMiddleware'); // default export

// optional debug
console.log('typeof protect (productRoutes):', typeof protect);

// Example controllers inline, ya alag controller file se import kar sakta hai
// yaha simple version de raha hoon:

// GET all products (public)
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error('get products error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// CREATE product (protected – admin etc. logic aap add kar sakte)
router.post('/', protect, async (req, res) => {
  try {
    const { name, price, category, imageUrl } = req.body;

    const product = new Product({
      name,
      price,
      category,
      imageUrl,
    });

    const saved = await product.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('create product error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// UPDATE product
router.put('/:id', protect, async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(updated);
  } catch (err) {
    console.error('update product error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE product
router.delete('/:id', protect, async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted' });
  } catch (err) {
    console.error('delete product error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
