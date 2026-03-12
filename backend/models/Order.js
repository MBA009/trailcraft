const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [{
    productId: String,
    name: String,
    price: Number,
    qty: Number,
    size: String
  }],
  total: Number,
  shipping: {
    name: String,
    address: String,
    city: String,
    postalCode: String,
    country: String,
    email: String
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'in_transit', 'out_for_delivery', 'delivered', 'cancelled'],
    default: 'pending'
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Order || mongoose.model('Order', OrderSchema);
