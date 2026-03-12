const mongoose = require('mongoose');
const User = require('./User');

const CustomerSchema = new mongoose.Schema({
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
});

const Customer = User.discriminators && User.discriminators.customer ? User.discriminators.customer : User.discriminator('customer', CustomerSchema);

module.exports = mongoose.models.Customer || Customer;
