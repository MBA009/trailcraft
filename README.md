# TrailCraft — Shoe Store

A full-stack shoe store built with the MERN stack (MongoDB, Express, React, Node.js) and Vite + Tailwind CSS. Side note: the backend is deployed on render (free tier) so it takes around 30s to a minute for the server to be up and running.  

**Frontend:** https://trailcraft-eight.vercel.app
**Backend:** https://trailcraft.onrender.com

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
| Customer | `bilal@gmail.com` | `bilalali` |

The admin account's harcoded and shouldn't be deleted.

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
