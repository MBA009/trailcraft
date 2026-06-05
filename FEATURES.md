# TrailCraft — Feature Documentation

## New Features

---

### 1. AI Shoe Finder (RAG-powered)

**How it works:**
Click the ⚡ **AI Finder** button in the header. Describe what you're looking for in plain English — the backend fetches all products from the database, passes them as context to the Claude API (claude-sonnet-4-6), and Claude returns the best matching products with a reason for each recommendation.

**Who can use it:** Everyone (logged in or not)

**Example queries:**
- "Running shoes for wide feet under $120"
- "Comfortable women's shoes for everyday wear"
- "Trail shoes with good grip for hiking"

**Setup required:**
Add `ANTHROPIC_API_KEY` to your Render environment variables. Get a key from [console.anthropic.com](https://console.anthropic.com).

**Files:**
- `backend/routes/recommendRoutes.js` — POST `/api/recommend`
- `frontend/src/components/AIRecommender.jsx`

---

### 2. Product Reviews & Ratings

**How it works:**
Customers can leave a star rating (1–5) and optional comment on any product. Reviews are shown inside the product detail modal. Each customer can only leave one review per product.

**Who can use it:**
- **Customers** — can submit one review per product, can delete their own reviews
- **Admins** — can delete any review
- **Everyone** — can read reviews

**Files:**
- `backend/models/Review.js`
- `backend/routes/reviewRoutes.js` — GET `/api/reviews/:productId`, POST `/api/reviews`, DELETE `/api/reviews/:id`
- `frontend/src/components/Reviews.jsx`

---

### 3. Discount / Promo Codes

**How it works:**
Admins create promo codes (e.g. `SAVE20` = 20% off) from the **Promos** panel in the header. Customers enter a code in the cart at checkout — the discount is applied live, showing the original price struck through and the new total.

**Who can use it:**
- **Admins** — create and delete promo codes (header → Promos)
- **Customers** — apply codes at checkout in the cart

**Files:**
- `backend/models/Promo.js`
- `backend/routes/promoRoutes.js` — GET `/api/promos`, POST `/api/promos`, DELETE `/api/promos/:id`, GET `/api/promos/validate/:code`
- `frontend/src/components/PromoManager.jsx` — admin UI
- `frontend/src/components/Cart.jsx` — promo input in checkout

---

### 4. Stock / Inventory Tracking

**How it works:**
Each product has a `stock` count. When a customer places an order, stock is decremented automatically for each item purchased. Product cards show badges when stock is low or gone:
- 🔴 **"Out of Stock"** — stock is 0
- 🟠 **"Only N left"** — stock is 1–5
- The product detail modal shows the full stock count

**Who manages it:**
Vendors set the stock count when adding or editing a product.

**Files:**
- `backend/models/Product.js` — added `stock` field
- `backend/controllers/orderController.js` — decrements stock on order creation
- `frontend/src/components/ProductCard.jsx` — stock badges
- `frontend/src/components/ProductDetail.jsx` — stock indicator

---

### 5. Vendor Sales Dashboard

**How it works:**
Vendors see a **Dashboard** button in the header. It shows:
- Total revenue earned from their products
- Total number of orders containing their products
- Per-order breakdown with items sold and revenue contributed

**Who can use it:** Vendors only

**Files:**
- `backend/controllers/orderController.js` — `getVendorOrders` function
- `backend/routes/orderRoutes.js` — GET `/api/orders/vendor`
- `frontend/src/components/VendorDashboard.jsx`

---

## All Roles Summary

| Feature | Customer | Vendor | Admin |
|---|---|---|---|
| Browse products | ✅ | ✅ | ✅ |
| AI Shoe Finder | ✅ | ✅ | ✅ |
| Add to cart & order | ✅ | ❌ | ❌ |
| Apply promo codes | ✅ | ❌ | ❌ |
| View order status | ✅ (own orders) | ❌ | ✅ (all) |
| Leave reviews | ✅ | ❌ | ❌ |
| Add / edit products | ❌ | ✅ (own) | ✅ |
| View sales dashboard | ❌ | ✅ | ❌ |
| Manage users (ban/unban) | ❌ | ❌ | ✅ |
| Update order status | ❌ | ❌ | ✅ |
| Create promo codes | ❌ | ❌ | ✅ |

---

## Environment Variables Required

| Variable | Where to set | Purpose |
|---|---|---|
| `MONGO_URI` | Render backend | MongoDB Atlas connection string |
| `JWT_SECRET` | Render backend | Signs authentication tokens |
| `ANTHROPIC_API_KEY` | Render backend | Powers the AI Shoe Finder |
| `CLOUDINARY_CLOUD_NAME` | Render backend | Persistent image storage |
| `CLOUDINARY_API_KEY` | Render backend | Persistent image storage |
| `CLOUDINARY_API_SECRET` | Render backend | Persistent image storage |
| `VITE_API_URL` | Vercel frontend | Points frontend to backend URL |
