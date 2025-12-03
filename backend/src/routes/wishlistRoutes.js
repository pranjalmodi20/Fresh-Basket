// src/routes/wishlistRoutes.js
const express = require('express');
const router = express.Router();

const { toggleWishlist, getWishlist } = require(
  '../controllers/WishlistController'
);
const protect = require('../middleware/authMiddleware');

router.get('/', protect, getWishlist);
router.post('/', protect, toggleWishlist);

module.exports = router;
