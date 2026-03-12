const mongoose = require('mongoose');
const User = require('./User');

const VendorSchema = new mongoose.Schema({
  storeName: { type: String },
  contact: { type: String }
});

const Vendor = User.discriminators && User.discriminators.vendor ? User.discriminators.vendor : User.discriminator('vendor', VendorSchema);

module.exports = mongoose.models.Vendor || Vendor;
