const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { auth, requireRole } = require('../middleware/auth');

// List users (admin)
router.get('/users', auth, requireRole('admin'), async (req, res) => {
  const users = await User.find().select('-passwordHash').lean();
  res.json(users);
});

// Ban/unban user (admin)
router.post('/ban/:id', auth, requireRole('admin'), async (req, res) => {
  const { id } = req.params;
  try {
    const u = await User.findById(id);
    if (!u) return res.status(404).json({ message: 'User not found' });
    // Prevent changing the hardcoded admin
    if (u.role === 'admin' && u.isHardcoded) return res.status(403).json({ message: 'Cannot modify hardcoded admin' });
    u.banned = !!req.body.banned;
    await u.save();
    res.json({ ok: true, banned: u.banned });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
