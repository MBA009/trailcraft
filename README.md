# TrailCraft — Shoe Store

A full-stack shoe store built with the MERN stack (MongoDB, Express, React, Node.js) and Vite + Tailwind CSS.

**Live demo:** https://trailcraft.vercel.app
**API:** https://trailcraft.onrender.com

---

## Project Structure

```
trailcraft/
├── backend/     Express + Mongoose REST API
└── frontend/    Vite + React + Tailwind CSS
```

---

## Roles & Features

### Customer

| Feature | Description |
|---|---|
| Browse catalog | View all available shoes with images, brand, price, and category filters |
| Product detail | Click any product to see full details, description, available sizes |
| Size guide | View a US / EU / inches / CM conversion chart from any product page |
| Select size | Choose a size before adding to cart |
| Cart | Add/remove items, adjust quantities, cart persists across page refreshes via `localStorage` |
| Checkout | Enter shipping info (name, address, city, postal code, country, email) and place an order |
| Order history | View all past orders via the **My Orders** button in the header or the Profile modal |
| Order status | See live status badges on each order (Pending → Processing → In Transit → Out for Delivery → Delivered / Cancelled) |
| Account | Sign up and log in with email + password |

> Banned customers cannot place orders and cannot log in.

---

### Vendor

| Feature | Description |
|---|---|
| Add product | Upload a product image, set name, brand, price, category, sizes, and description |
| Edit product | Update any field or swap the product image |
| Delete product | Remove a product from the store permanently |
| My products | The catalog only shows products belonging to the logged-in vendor on their dashboard |

> Banned vendors' products are automatically hidden from the public catalog.

---

### Admin

| Feature | Description |
|---|---|
| View all orders | See every order placed on the platform with customer info, items, total, and current status |
| Update order status | Change an order's status through the pipeline: `pending → processing → in_transit → out_for_delivery → delivered` (or `cancelled` at any stage) |
| Manage users | View all users grouped by role (Admins, Vendors, Customers) |
| Ban / Unban users | Toggle a user's banned state; banned users cannot log in or interact with the store |

---

## Default Seeded Accounts

These accounts are created automatically on first server start:

| Role | Email | Password |
|---|---|---|
| Admin | `admin@shoestore.local` | `AdminPass123` |
| Vendor | `vendor@shoestore.local` | `VendorPass123` |

The admin account is marked `isHardcoded: true` in the database and should not be deleted.
The default vendor is assigned ownership of all sample products.

---

## Local Development

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### Backend

```bash
cd backend
npm install
cp .env.example .env      # then fill in MONGO_URI and JWT_SECRET
npm run dev               # starts on http://localhost:5000
```

### Frontend

```bash
cd frontend
npm install
# create frontend/.env.local and add:
# VITE_API_URL=http://localhost:5000
npm run dev               # starts on http://localhost:5173
```

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Example |
|---|---|---|
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/trailcraft` |
| `JWT_SECRET` | Secret key for signing JWTs | any long random string |
| `PORT` | Port to listen on (optional) | `5000` |
| `ADMIN_EMAIL` | Override default admin email | `admin@shoestore.local` |
| `ADMIN_PASS` | Override default admin password | `AdminPass123` |
| `VENDOR_EMAIL` | Override default vendor email | `vendor@shoestore.local` |
| `VENDOR_PASS` | Override default vendor password | `VendorPass123` |

### Frontend (`frontend/.env.local`)

| Variable | Description | Example |
|---|---|---|
| `VITE_API_URL` | Backend API base URL | `https://trailcraft.onrender.com` |

---

## Deployment

### Backend — Render Web Service
1. Connect your GitHub repo
2. Set **Root Directory** to `backend`
3. **Build command:** `npm install`
4. **Start command:** `node server.js`
5. Add all backend environment variables in the Render dashboard

### Frontend — Vercel
1. Import your GitHub repo on Vercel
2. Set **Root Directory** to `frontend`
3. Add env var: `VITE_API_URL` = your Render backend URL
4. Deploy — Vercel auto-detects Vite

> **Note:** The free Render tier spins down after 15 minutes of inactivity. The first request after sleep may take 20–30 seconds to respond.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS |
| Backend | Node.js, Express |
| Database | MongoDB + Mongoose |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| Image upload | Base64 → stored in `backend/uploads/` |
| Deployment | Render (backend) + Vercel (frontend) + MongoDB Atlas |
