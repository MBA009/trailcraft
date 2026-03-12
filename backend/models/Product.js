const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String },
  price: { type: Number, required: true },
  image: { type: String },
  description: { type: String },
  sizes: [{ type: String }],
  category: { type: String, enum: ['men', 'women', 'children'], default: 'men' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

Product.SAMPLE_PRODUCTS = [
  {
    name: 'Air Lite Runner',
    brand: 'StrideX',
    price: 129.99,
    image: '/images/OG_Carbon_Left_dark.png',
    description: 'Lightweight running shoe with breathable mesh.',
    sizes: ['7', '8', '9', '10', '11'],
    category: 'men'
  },
  {
    name: 'Court Classic',
    brand: 'Baseline',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?auto=format&fit=crop&w=1200&q=80',
    description: 'Comfortable court shoe for everyday wear.',
    sizes: ['6', '7', '8', '9', '10', '12'],
    category: 'women'
  },
  {
    name: 'Trailblazer Mid',
    brand: 'PeakRun',
    price: 149.99,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80',
    description: 'Durable trail shoe with excellent traction.',
    sizes: ['8', '9', '10', '11', '12'],
    category: 'men'
  }
];

module.exports = Product;
