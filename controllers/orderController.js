// controllers/orderController.js
const Order = require('../models/orderModel');
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');

// @desc    Create a new order
// @route   POST /api/orders/create
// @access  Private
const createOrder = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId');

    if (!cart || cart.items.length === 0) {
      res.status(400);
      throw new Error('Your cart is empty');
    }

    let totalAmount = 0;
    const orderItems = [];

    // Use a transaction to ensure atomicity
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Check stock and calculate total
        for (const item of cart.items) {
          const product = item.productId;
          if (product.stock < item.quantity) {
            throw new Error(`Not enough stock for ${product.name}`);
          }
          totalAmount += item.quantity * product.price;
          orderItems.push({
            productId: product._id,
            name: product.name,
            price: product.price,
            quantity: item.quantity,
          });
        }

        const order = new Order({
          userId: req.user._id,
          items: orderItems,
          totalAmount,
        });

        const createdOrder = await order.save({ session });
        
        // Decrease product stock
        for (const item of createdOrder.items) {
            await Product.findByIdAndUpdate(item.productId, {
                $inc: { stock: -item.quantity },
            }, { session });
        }

        // Clear user's cart
        await Cart.findOneAndDelete({ userId: req.user._id }, { session });
        
        await session.commitTransaction();
        session.endSession();

        res.status(201).json(createdOrder);

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(400); // Bad request for stock issues
        next(error);
    }

  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user's orders
// @route   GET /api/orders
// @access  Private
const getUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders
// @route   GET /api/orders/all
// @access  Private/Admin
const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({}).populate('userId', 'id name email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('userId', 'name email');

    if (order) {
      // Check if user is admin or the owner of the order
      if (req.user.role === 'admin' || order.userId._id.equals(req.user._id)) {
        res.json(order);
      } else {
        res.status(403);
        throw new Error('Not authorized to view this order');
      }
    } else {
      res.status(404);
      throw new Error('Order not found');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { createOrder, getUserOrders, getAllOrders, getOrderById };
