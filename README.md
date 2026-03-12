# Shoe Store (MERN + Vite React + Tailwind)

This repository contains a minimal MERN-stack shoe store prototype.

Structure:

- `backend/` — Express + Mongoose API
- `frontend/` — Vite + React + Tailwind UI

Quick start:

1. Backend

```bash
cd backend
npm install
# copy .env.example to .env and update MONGO_URI if you have MongoDB
npm run dev
```

2. Frontend

```bash
cd frontend
npm install
npm run dev
```

**Use cases / Features**

**Customer**

- Browse product catalog (list and detail retrieval).
- Add items to cart with local persistence (`localStorage`).
- Checkout flow: collect shipping info and place orders (POST `/api/orders`).
- View order details (GET `/api/orders/:id`).

**Vendor**

- Add new products (vendors can create products and upload images).
- Manage vendor products (delete products they own).
- Uploaded images are stored under `/uploads` and are referenced by product `image` URLs.

**Admin**

- View all orders (GET `/api/orders`).
- Manage users (ban/unban) and view admin dashboards in the frontend.
- Seed or create products via `POST /api/products/seed` or `node backend/seed.js`.

**Notes on seeded users**

- A hardcoded Admin user is created on server start (if not present). Default credentials:
  - Email: `admin@shoestore.local`
  - Password: `AdminPass123`
  - This account is marked `isHardcoded: true` in the database and intended to remain unchanged.
- A default Vendor user is created on server start (if not present) and existing products without an owner are assigned to this vendor. Default credentials:
  - Email: `vendor@shoestore.local`
  - Password: `VendorPass123`
  - Store name: `Default Store`

Runs with in-memory sample data if no MongoDB is configured; set `MONGO_URI` in `backend/.env` to enable persistence. Frontend expects the API at `VITE_API_URL` env var or `http://localhost:5000`.

Notes:

- Backend will fall back to sample in-memory products if no MongoDB is configured.
