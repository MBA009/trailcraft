const express = require('express');
const router = express.Router();
const { getProducts, getProductById, createProduct, updateProduct, seedProducts, deleteProduct } = require('../controllers/productController');
const { auth, requireRole } = require('../middleware/auth');

router.get('/', getProducts);
router.get('/:id', getProductById);

// Vendor or admin can create
router.post('/', auth, requireRole(['vendor','admin']), createProduct);
// Admin can seed
router.post('/seed', auth, requireRole('admin'), seedProducts);
// Update product (owner vendor or admin)
router.put('/:id', auth, updateProduct);
// Delete product (owner vendor or admin)
router.delete('/:id', auth, deleteProduct);

module.exports = router;
