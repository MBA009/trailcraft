const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

async function run() {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/shoestore';
  await mongoose.connect(uri);
  console.log('Connected to', uri);
  await Product.deleteMany({});
  const created = await Product.insertMany(Product.SAMPLE_PRODUCTS);
  console.log('Inserted', created.length, 'products');
  process.exit(0);
}

run().catch(err=>{ console.error(err); process.exit(1); });
