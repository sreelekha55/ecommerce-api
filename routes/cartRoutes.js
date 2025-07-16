// routes/cartRoutes.js
const express = require('express');
const router = express.Router();
const {
  getCart,
  addItemToCart,
  updateCartItem,
  removeItemFromCart,
} = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

// All cart routes are protected and require a logged-in user
router.use(protect);

// @route   GET /api/cart
// @desc    Get the user's cart
// @route   POST /api/cart
// @desc    Add an item to the user's cart
router.route('/').get(getCart).post(addItemToCart);

// @route   PUT /api/cart/:itemId
// @desc    Update the quantity of a specific item in the cart
// @route   DELETE /api/cart/:itemId
// @desc    Remove a specific item from the cart
router.route('/:itemId').put(updateCartItem).delete(removeItemFromCart);

module.exports = router;
