const express = require('express');
const router = express.Router();
const Promo = require('../models/Promo');
const { auth, requireRole } = require('../middleware/auth');

// GET /api/promos/validate/:code — public
router.get('/validate/:code', async (req, res) => {
  try {
    const promo = await Promo.findOne({ code: req.params.code.toUpperCase(), active: true }).lean();
    if (!promo) return res.status(404).json({ message: 'Invalid or expired code' });
    res.json({ discount: promo.discount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/promos — admin only
router.get('/', auth, requireRole('admin'), async (req, res) => {
  try {
    const promos = await Promo.find().sort({ createdAt: -1 }).lean();
    res.json(promos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/promos — admin only
router.post('/', auth, requireRole('admin'), async (req, res) => {
  const { code, discount } = req.body;
  if (!code || !discount) return res.status(400).json({ message: 'code and discount required' });
  try {
    const promo = await Promo.create({ code: code.toUpperCase(), discount: Number(discount) });
    res.status(201).json(promo);
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: 'Code already exists' });
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/promos/:id — admin only
router.delete('/:id', auth, requireRole('admin'), async (req, res) => {
  try {
    await Promo.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
