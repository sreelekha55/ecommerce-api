# E-commerce API

A RESTful API for an e-commerce platform built with Node.js, Express, and MongoDB.

## Features
- User authentication with JWT (admin & customer roles)
- Product management (CRUD, reviews)
- Cart and order management
- Protected routes for authenticated users and admins
- MongoDB for data storage

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB instance (local or cloud)

### Installation
1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd myapp
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `myapp` directory with the following:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_key
   PORT=5000
   ```
4. Start the server:
   ```bash
   npm run dev
   ```
   The server will run on `http://localhost:5000` by default.

## API Endpoints

### Auth
- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Login and receive a JWT

### Products
- `GET /api/products` — List all products
- `POST /api/products` — Create a product (admin only)
- `GET /api/products/:id` — Get product details
- `PUT /api/products/:id` — Update product (admin only)
- `DELETE /api/products/:id` — Delete product (admin only)

### Cart
- `GET /api/cart` — Get current user's cart
- `POST /api/cart` — Add item to cart
- `PUT /api/cart/:itemId` — Update cart item
- `DELETE /api/cart/:itemId` — Remove item from cart

### Orders
- `POST /api/orders/create` — Create order from cart
- `GET /api/orders/myorders` — Get current user's orders
- `GET /api/orders` — Get all orders (admin only)

## Environment Variables
- `MONGO_URI` — MongoDB connection string
- `JWT_SECRET` — Secret for JWT signing
- `PORT` — Port for the server (default: 5000)

## License
MIT 