const express = require('express');
const router = express.Router();

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');

const { protect } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

// Public
router.get('/', getProducts);
router.get('/:id', getProductById);

// Protected + role-based
router.post('/', protect, requireRole('vendor', 'admin'), createProduct);
router.put('/:id', protect, requireRole('vendor', 'admin'), updateProduct);
router.delete('/:id', protect, requireRole('admin'), deleteProduct);

module.exports = router;
