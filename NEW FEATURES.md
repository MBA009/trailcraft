## New Features

---

### 1. RAG AI Shoe Recommender (RAG-powered)

I've worked on RAG before so just combined that with this project. Since there are fewer items, backend just fetches all items from the mongodb and converts them into structured text blocks and using my api key, the LLM (claude in this case) returns text recommendation.

### 2. Product Reviews & Ratings

Customers can leave a star rating (1–5) and optional comment on any product. Reviews are shown inside the product detail modal. Each customer can only leave one review per product.

- **Customers** — can submit one review per product, can delete their own reviews
- **Admins** — can delete any review
- **Everyone** — can read reviews

### 3. Discount / Promo Codes

Admins create promo codes (e.g. `SAVE20` = 20% off) from the **Promos** panel in the header. Customers enter a code in the cart at checkout ajd then the discount is applied live, showing the original price struck through and the new total.

- **Admins** — create and delete promo codes (header → Promos)
- **Customers** — apply codes at checkout in the cart

### 4. Stock / Inventory Tracking

Each product has a `stock` count. When a customer places an order, stock is decremented automatically for each item purchased. Product cards show badges when stock is low or gone. Vendors set the stock count when adding or editing a product.


### 5. Vendor Sales Dashboard

Vendors see a **Dashboard** button in the header. It shows:
- Total revenue earned from their products
- Total number of orders containing their products
- Per-order breakdown with items sold and revenue contributed

