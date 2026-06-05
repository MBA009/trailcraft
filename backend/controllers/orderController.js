const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const Promo = require('../models/Promo');

const VALID_STATUSES = ['pending', 'processing', 'in_transit', 'out_for_delivery', 'delivered', 'cancelled'];

exports.createOrder = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Please log in to place an order' });
    if (req.user.role === 'customer') {
      const u = await User.findById(req.user.id).lean().catch(() => null);
      if (u && u.banned) return res.status(403).json({ message: 'Your account has been banned' });
    }
    const { items, shipping, promoCode } = req.body;
    if (!items || !items.length) return res.status(400).json({ message: 'No items to order' });

    // Calculate total from DB prices
    let subtotal = 0;
    for (const item of items) {
      const product = await Product.findById(item.productId).lean().catch(() => null);
      if (product) subtotal += product.price * item.qty;
    }

    // Apply promo discount if provided
    let discount = 0;
    let appliedPromo = null;
    if (promoCode) {
      const promo = await Promo.findOne({ code: promoCode.toUpperCase(), active: true }).lean();
      if (promo) {
        discount = Math.round(subtotal * (promo.discount / 100) * 100) / 100;
        appliedPromo = promo.code;
      }
    }
    const total = Math.round((subtotal - discount) * 100) / 100;

    const order = await Order.create({ items, total, shipping, customerId: req.user.id, promoCode: appliedPromo, discount });

    // Decrement stock
    for (const item of items) {
      await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.qty } }).catch(() => {});
    }

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
    if (!VALID_STATUSES.includes(status)) return res.status(400).json({ message: 'Invalid status' });
    const order = await Order.findByIdAndUpdate(id, { status }, { new: true }).lean();
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getVendorOrders = async (req, res) => {
  try {
    const myProducts = await Product.find({ owner: req.user.id }).select('_id name price').lean();
    const myProductIds = myProducts.map(p => p._id.toString());
    if (!myProductIds.length) return res.json({ orders: [], totalRevenue: 0, totalOrders: 0 });

    const orders = await Order.find({ 'items.productId': { $in: myProductIds } })
      .sort({ createdAt: -1 }).lean();

    const vendorOrders = orders.map(order => {
      const vendorItems = order.items.filter(item => myProductIds.includes(item.productId));
      const vendorRevenue = vendorItems.reduce((sum, item) => sum + item.price * item.qty, 0);
      return { ...order, vendorItems, vendorRevenue: Math.round(vendorRevenue * 100) / 100 };
    });

    const totalRevenue = Math.round(vendorOrders.reduce((sum, o) => sum + o.vendorRevenue, 0) * 100) / 100;
    res.json({ orders: vendorOrders, totalRevenue, totalOrders: vendorOrders.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
