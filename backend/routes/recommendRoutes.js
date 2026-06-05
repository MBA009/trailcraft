const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// POST /api/recommend
router.post('/', async (req, res) => {
  const { query } = req.body;
  if (!query || !query.trim()) return res.status(400).json({ message: 'query required' });

  try {
    const products = await Product.find({}).lean();
    if (!products.length) return res.json({ message: "We don't have any products yet!", recommendations: [] });

    const productContext = products.map(p =>
      `ID: ${p._id} | Name: ${p.name} | Brand: ${p.brand} | Price: $${p.price} | Category: ${p.category} | Description: ${p.description} | Sizes: ${(p.sizes || []).join(', ')} | Stock: ${p.stock > 0 ? p.stock + ' available' : 'out of stock'}`
    ).join('\n');

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: `You are a helpful shoe store assistant for TrailCraft. Based on the customer's request, recommend the most suitable shoes from our catalog.

Available products:
${productContext}

Customer request: "${query}"

Reply with raw JSON only (no markdown fences):
{
  "recommendations": [
    { "productId": "<id>", "reason": "<1-2 sentence explanation why this fits the request>" }
  ],
  "message": "<friendly 1-2 sentence response>"
}

Rules:
- Only recommend products that genuinely match the request
- Recommend 1-3 products maximum
- Skip out-of-stock products unless nothing else fits
- If nothing matches, return empty recommendations array with a helpful message`
      }]
    });

    const text = message.content[0].text.trim();
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      const match = text.match(/\{[\s\S]*\}/);
      parsed = match ? JSON.parse(match[0]) : { recommendations: [], message: text };
    }

    const recommendations = (parsed.recommendations || []).map(rec => {
      const product = products.find(p => p._id.toString() === rec.productId);
      return product ? { reason: rec.reason, product } : null;
    }).filter(Boolean);

    res.json({ message: parsed.message, recommendations });
  } catch (err) {
    console.error('Recommend error:', err.message);
    res.status(500).json({ message: 'Recommendation failed. Please try again.', error: err.message });
  }
});

module.exports = router;
