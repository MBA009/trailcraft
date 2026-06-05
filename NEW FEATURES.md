## New Features

---

### 1. RAG AI Shoe Recommender (RAG-powered)

I've worked on RAG before so just combined that with this project. Since there are fewer items, backend just fetches all items from the mongodb and converts them into structured text blocks and using my api key, the LLM (claude in this case) returns text recommendation.


### 2. Stock / Inventory Tracking

Each product has a `stock` count. When a customer places an order, stock is decremented automatically for each item purchased. Product cards show badges when stock is low or gone. Vendors set the stock count when adding or editing a product.


### 3. Vendor Sales Dashboard

Vendors see a **Dashboard** button in the header. It shows:
- Total revenue earned from their products
- Total number of orders containing their products
- Per-order breakdown with items sold and revenue contributed

