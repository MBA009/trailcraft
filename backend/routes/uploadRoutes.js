const express = require('express');
const router = express.Router();
const { auth, requireRole } = require('../middleware/auth');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

router.post('/base64', auth, requireRole(['vendor', 'admin']), async (req, res) => {
  const { data } = req.body || {};
  if (!data) return res.status(400).json({ message: 'data required' });
  try {
    const result = await cloudinary.uploader.upload(data, {
      folder: 'trailcraft',
      resource_type: 'image',
    });
    res.json({ url: result.secure_url });
  } catch (e) {
    res.status(500).json({ message: 'Upload failed', error: e.message });
  }
});

router.post('/', auth, requireRole(['vendor', 'admin']), async (req, res) => {
  const { data } = req.body || {};
  if (!data) return res.status(400).json({ message: 'data required' });
  try {
    const result = await cloudinary.uploader.upload(data, {
      folder: 'trailcraft',
      resource_type: 'image',
    });
    res.json({ url: result.secure_url });
  } catch (e) {
    res.status(500).json({ message: 'Upload failed', error: e.message });
  }
});

module.exports = router;
