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

// Public routes
router.get('/', getProducts);          // GET /api/products
router.get('/:id', getProductById);    // GET /api/products/:id

// Protected + role-based routes
router.post('/', protect, requireRole('vendor', 'admin'), createProduct);      // POST /api/products
router.put('/:id', protect, requireRole('vendor', 'admin'), updateProduct);    // PUT /api/products/:id
router.delete('/:id', protect, requireRole('admin'), deleteProduct);           // DELETE /api/products/:id


module.exports = router;
