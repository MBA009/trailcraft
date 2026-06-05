const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const { auth, requireRole } = require('../middleware/auth');

// GET /api/reviews/:productId — public
router.get('/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId }).sort({ createdAt: -1 }).lean();
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/reviews — customer only
router.post('/', auth, requireRole('customer'), async (req, res) => {
  const { productId, rating, comment } = req.body;
  if (!productId || !rating) return res.status(400).json({ message: 'productId and rating required' });
  try {
    const review = await Review.create({
      productId,
      customerId: req.user.id,
      customerName: req.user.email,
      rating: Math.min(5, Math.max(1, Math.round(rating))),
      comment
    });
    res.status(201).json(review);
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: 'You already reviewed this product' });
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/reviews/:id — admin or original customer
router.delete('/:id', auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Not found' });
    if (req.user.role !== 'admin' && review.customerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    await review.deleteOne();
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
