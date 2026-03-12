const Product = require('../models/Product');
const User = require('../models/User');

exports.getProducts = async (req, res) => {
  try {
    // Find banned vendor IDs to exclude their products
    const bannedVendors = await User.find({ role: 'vendor', banned: true }).select('_id').lean();
    const bannedIds = bannedVendors.map(v => v._id);
    const filter = bannedIds.length ? { owner: { $nin: bannedIds } } : {};
    const products = await Product.find(filter).limit(50).lean();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const p = await Product.findById(req.params.id).lean();
    if (!p) return res.status(404).json({ message: 'Not found' });
    res.json(p);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const payload = req.body;
    if (req.user && req.user.id) payload.owner = req.user.id;
    const created = await Product.create(payload);
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const p = await Product.findById(id).exec();
    if (!p) return res.status(404).json({ message: 'Not found' });
    const uid = req.user && req.user.id;
    if (req.user.role !== 'admin' && (!p.owner || p.owner.toString() !== uid)) {
      return res.status(403).json({ message: 'Not allowed' });
    }
    const { name, brand, price, image, description, sizes, category } = req.body;
    if (name !== undefined) p.name = name;
    if (brand !== undefined) p.brand = brand;
    if (price !== undefined) p.price = price;
    if (image !== undefined) p.image = image;
    if (description !== undefined) p.description = description;
    if (sizes !== undefined) p.sizes = sizes;
    if (category !== undefined) p.category = category;
    await p.save();
    res.json(p);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const p = await Product.findById(id).exec();
    if (!p) return res.status(404).json({ message: 'Not found' });
    const uid = req.user && req.user.id;
    if (req.user.role !== 'admin' && (!p.owner || p.owner.toString() !== uid)) {
      return res.status(403).json({ message: 'Not allowed' });
    }
    await p.remove();
    res.json({ deleted: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.seedProducts = async (req, res) => {
  try {
    const exists = await Product.countDocuments().catch(() => 0);
    if (exists) return res.json({ seeded: false, message: 'Products already exist' });
    const ownerId = req.user && req.user.id;
    const created = await Product.insertMany(
      Product.SAMPLE_PRODUCTS.map(p => ({ ...p, owner: ownerId || undefined }))
    );
    res.json({ seeded: true, count: created.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
