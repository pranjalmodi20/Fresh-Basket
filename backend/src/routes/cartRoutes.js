// src/routes/cartRoutes.js
const express = require('express');
const router = express.Router();

const { setCartQuantity } = require('../controllers/cartController');
const protect = require('../middleware/authMiddleware');
// POST /api/cart
router.post('/', protect, setCartQuantity);

module.exports = router;
