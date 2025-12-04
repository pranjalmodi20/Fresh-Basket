// src/routes/cartRoutes.js
const express = require('express');
const router = express.Router();

const { setCartQuantity, getCart } = require('../controllers/cartController');
const protect = require('../middleware/authMiddleware');

// GET /api/cart - Get user's cart
router.get('/', protect, getCart);

// POST /api/cart - Set cart quantity
router.post('/', protect, setCartQuantity);

module.exports = router;
