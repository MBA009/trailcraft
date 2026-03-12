const mongoose = require('mongoose');

const options = { discriminatorKey: 'role', collection: 'users', timestamps: { createdAt: 'createdAt' } };

const UserSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  banned: { type: Boolean, default: false }
}, options);

const User = mongoose.models.User || mongoose.model('User', UserSchema);

module.exports = User;
