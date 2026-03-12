const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 5000;

async function start() {
  const mongoUri = process.env.MONGO_URI;
  if (mongoUri) {
    try {
      await mongoose.connect(mongoUri);
      console.log('Connected to MongoDB');
      // ensure hardcoded admin exists and default vendor exists; assign products to vendor
      try {
        const bcrypt = require('bcryptjs');
        const Admin = require('./models/Admin');
        const Vendor = require('./models/Vendor');
        const User = require('./models/User');

        const adminEmail = process.env.ADMIN_EMAIL || 'admin@shoestore.local';
        const adminPass = process.env.ADMIN_PASS || 'AdminPass123';
        let existingAdmin = await Admin.findOne({ email: adminEmail }).exec().catch(()=>null);
        if (!existingAdmin) {
          const hash = await bcrypt.hash(adminPass, 10);
          // create as Admin discriminator and mark as hardcoded
          existingAdmin = await Admin.create({ name: 'Administrator', email: adminEmail, passwordHash: hash, isHardcoded: true });
          console.log('Hardcoded admin created:', adminEmail);
        }

        // create a default vendor and assign existing products to them
        try {
          const vendorEmail = process.env.VENDOR_EMAIL || 'vendor@shoestore.local';
          const vendorPass = process.env.VENDOR_PASS || 'VendorPass123';
          let vendor = await Vendor.findOne({ email: vendorEmail }).exec().catch(()=>null);
          if (!vendor) {
            const vhash = await bcrypt.hash(vendorPass, 10);
            vendor = await Vendor.create({ name: 'Default Vendor', email: vendorEmail, passwordHash: vhash, storeName: 'Default Store' });
            console.log('Default vendor created:', vendorEmail);
          } else if (!vendor.storeName) {
            vendor.storeName = 'Default Store';
            await vendor.save();
            console.log('Patched default vendor with missing storeName');
          }
          // seed sample products if none exist
          const Product = require('./models/Product');
          const productCount = await Product.countDocuments().catch(() => 0);
          if (!productCount) {
            const seeded = await Product.insertMany(
              Product.SAMPLE_PRODUCTS.map(p => ({ ...p, owner: vendor._id }))
            ).catch(() => null);
            if (seeded) console.log('Seeded', seeded.length, 'products with owner', vendor.email);
          }
          // assign existing products without owner to vendor
          const res = await Product.updateMany({ $or: [ { owner: { $exists: false } }, { owner: null } ] }, { $set: { owner: vendor._id } }).exec().catch(()=>null);
          if (res && res.modifiedCount) console.log('Assigned', res.modifiedCount, 'products to default vendor');
          // ensure products have images; set placeholder for missing images
          try {
            const imgRes = await Product.updateMany({ $or: [{ image: { $exists: false } }, { image: null }, { image: '' }] }, { $set: { image: 'https://via.placeholder.com/1200x800?text=No+Image' } }).exec().catch(()=>null);
            if (imgRes && imgRes.modifiedCount) console.log('Updated', imgRes.modifiedCount, 'products with placeholder images');
          } catch (e) { console.error('Image fill error', e.message); }
          // force-update specific sample product images to reliable sources
          try {
            const replacements = [
              { name: 'Air Lite Runner', image: '/images/OG_Carbon_Left_dark.png', category: 'men' },
              { name: 'Court Classic', image: 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?auto=format&fit=crop&w=1200&q=80', category: 'women' },
              { name: 'Trailblazer Mid', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80', category: 'men' }
            ];
            for (const { name, image, category } of replacements) {
              await Product.updateMany({ name }, { $set: { image, category } }).exec().catch(()=>null);
            }
            console.log('Ensured sample product images updated');
          } catch (e) { console.error('Sample image assignment error', e.message); }
        } catch (err) { console.error('Vendor creation/assignment error', err.message); }
      } catch (err) { console.error('Admin/vendor creation error', err.message); }
    } catch (err) {
      console.error('MongoDB connection error:', err.message);
    }
  } else {
    console.log('No MONGO_URI provided — running with in-memory fallback');
  }

  // try to listen, and if the port is in use try the next one up to a limit
  async function tryListen(startPort, attempts = 10) {
    const port = startPort;
    return new Promise((resolve, reject) => {
      const server = app.listen(port, () => {
        console.log(`Server running on port ${port}`);
        resolve(server);
      });

      server.on('error', (err) => {
        if (err && err.code === 'EADDRINUSE') {
          server.close?.();
          if (attempts - 1 > 0) {
            console.warn(`Port ${port} in use — trying port ${port + 1}...`);
            setTimeout(() => {
              tryListen(port + 1, attempts - 1).then(resolve).catch(reject);
            }, 200);
            return;
          }
        }
        reject(err);
      });
    });
  }

  // serve uploads folder
  app.use('/uploads', require('express').static(require('path').join(__dirname, 'uploads')));

  // mount upload route
  app.use('/api/upload', uploadRoutes);

  try {
    const startPort = parseInt(process.env.PORT) || PORT || 5000;
    await tryListen(startPort, 10);
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();
