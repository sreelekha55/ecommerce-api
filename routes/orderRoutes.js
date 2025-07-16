// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  getAllOrders,
  getOrderById,
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

// @route   POST /api/orders/create
// @desc    Create a new order from the cart
// @access  Private
router.post('/create', protect, createOrder);

// @route   GET /api/orders
// @desc    Get orders for the logged-in user
// @access  Private
router.get('/', protect, getUserOrders);

// @route   GET /api/orders/all
// @desc    Get all orders in the system
// @access  Private/Admin
router.get('/all', protect, admin, getAllOrders);

// @route   GET /api/orders/:id
// @desc    Get a specific order by its ID
// @access  Private (user must own order or be an admin)
router.get('/:id', protect, getOrderById);

module.exports = router;
