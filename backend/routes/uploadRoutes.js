const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { auth, requireRole } = require('../middleware/auth');

const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

let multerAvailable = true;
let upload = null;
try {
  const multer = require('multer');
  const storage = multer.diskStorage({
    destination: function (req, file, cb) { cb(null, uploadDir); },
    filename: function (req, file, cb) {
      const ext = path.extname(file.originalname);
      const name = `${Date.now()}-${Math.random().toString(36).slice(2,8)}${ext}`;
      cb(null, name);
    }
  });
  upload = multer({ storage });
} catch (err) {
  multerAvailable = false;
}

// Always provide a base64 upload endpoint at /base64
router.post('/base64', auth, requireRole(['vendor','admin']), (req, res) => {
  const { filename, data } = req.body || {};
  if (!filename || !data) return res.status(400).json({ message: 'filename and data required' });
  const matches = data.match(/^data:(.+);base64,(.+)$/);
  let base64data = data;
  if (matches) base64data = matches[2];
  const ext = path.extname(filename) || '.jpg';
  const name = `${Date.now()}-${Math.random().toString(36).slice(2,8)}${ext}`;
  const filePath = path.join(uploadDir, name);
  try {
    fs.writeFileSync(filePath, Buffer.from(base64data, 'base64'));
    const url = `${req.protocol}://${req.get('host')}/uploads/${name}`;
    res.json({ url });
  } catch (e) {
    res.status(500).json({ message: 'Failed to write file', error: e.message });
  }
});

// If multer is available use multipart/form-data file upload
if (multerAvailable) {
  router.post('/', auth, requireRole(['vendor','admin']), upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'No file' });
    const url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.json({ url });
  });
} else {
  // Fallback: accept JSON with base64 data: { filename, data }
  router.post('/', auth, requireRole(['vendor','admin']), (req, res) => {
    const { filename, data } = req.body || {};
    if (!filename || !data) return res.status(400).json({ message: 'filename and data required' });
    // strip data url prefix if present
    const matches = data.match(/^data:(.+);base64,(.+)$/);
    let base64data = data;
    if (matches) base64data = matches[2];
    const ext = path.extname(filename) || '.jpg';
    const name = `${Date.now()}-${Math.random().toString(36).slice(2,8)}${ext}`;
    const filePath = path.join(uploadDir, name);
    try {
      fs.writeFileSync(filePath, Buffer.from(base64data, 'base64'));
      const url = `${req.protocol}://${req.get('host')}/uploads/${name}`;
      res.json({ url });
    } catch (e) {
      res.status(500).json({ message: 'Failed to write file', error: e.message });
    }
  });
}

module.exports = router;
