const mongoose = require('mongoose');

const PromoSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true },
  discount: { type: Number, required: true, min: 1, max: 100 }, // percentage
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Promo || mongoose.model('Promo', PromoSchema);
