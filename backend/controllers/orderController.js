const Order = require('../models/Order');
const User = require('../models/User');

const VALID_STATUSES = ['pending', 'processing', 'in_transit', 'out_for_delivery', 'delivered', 'cancelled'];

exports.createOrder = async (req, res) => {
  try {
    // Require authentication
    if (!req.user) return res.status(401).json({ message: 'Please log in to place an order' });
    // Check if customer is banned (auth middleware already does this, but double-check)
    if (req.user.role === 'customer') {
      const u = await User.findById(req.user.id).lean().catch(() => null);
      if (u && u.banned) return res.status(403).json({ message: 'Your account has been banned' });
    }
    const { items, total, shipping } = req.body;
    if (!items || !items.length) return res.status(400).json({ message: 'No items to order' });
    const order = await Order.create({ items, total, shipping, customerId: req.user.id });
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).lean().catch(() => null);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    let filter = {};
    // Non-admin authenticated users only see their own orders
    if (req.user && req.user.role !== 'admin') {
      filter = { customerId: req.user.id };
    }
    const orders = await Order.find(filter).sort({ createdAt: -1 }).limit(200).lean();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const order = await Order.findByIdAndUpdate(id, { status }, { new: true }).lean();
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
