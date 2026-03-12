const mongoose = require('mongoose');
const User = require('./User');

const AdminSchema = new mongoose.Schema({
  isHardcoded: { type: Boolean, default: false }
});

// discriminator name is 'admin' to match role field values used elsewhere
const Admin = User.discriminators && User.discriminators.admin ? User.discriminators.admin : User.discriminator('admin', AdminSchema);

module.exports = mongoose.models.Admin || Admin;
