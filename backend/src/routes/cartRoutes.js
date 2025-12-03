// src/routes/cartRoutes.js
const express = require('express');
const router = express.Router();

const { setCartQuantity } = require('../controllers/cartController');
const protect = require('../middleware/authMiddleware');

// debug (optional)
console.log('typeof setCartQuantity (cartRoutes):', typeof setCartQuantity);
console.log('typeof protect (cartRoutes):', typeof protect);

// POST /api/cart
router.post('/', protect, setCartQuantity);

module.exports = router;
