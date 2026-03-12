const express = require('express');
const router = express.Router();
const { createOrder, getOrder, getOrders, updateOrderStatus } = require('../controllers/orderController');
const { auth, optionalAuth, requireRole } = require('../middleware/auth');

router.get('/', optionalAuth, getOrders);
router.post('/', auth, createOrder);
router.get('/:id', getOrder);
router.patch('/:id/status', auth, requireRole('admin'), updateOrderStatus);

module.exports = router;
