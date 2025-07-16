// controllers/cartController.js
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id }).populate(
      'items.productId',
      'name price stock'
    );
    if (!cart) {
      // If no cart, return an empty one
      return res.json({ items: [] });
    }
    res.json(cart);
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addItemToCart = async (req, res, next) => {
  const { productId, quantity } = req.body;
  const userId = req.user._id;

  try {
    let cart = await Cart.findOne({ userId });
    const product = await Product.findById(productId);

    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }

    if (cart) {
      // Cart exists for user, check if product already in cart
      const itemIndex = cart.items.findIndex((p) => p.productId.equals(productId));

      if (itemIndex > -1) {
        // Product exists in the cart, update the quantity
        cart.items[itemIndex].quantity += quantity;
      } else {
        // Product does not exist in cart, add new item
        cart.items.push({ productId, quantity });
      }
      cart = await cart.save();
      return res.status(200).send(cart);
    } else {
      // No cart for user, create a new cart
      const newCart = await Cart.create({
        userId,
        items: [{ productId, quantity }],
      });
      return res.status(201).send(newCart);
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:itemId
// @access  Private
const updateCartItem = async (req, res, next) => {
    const { itemId } = req.params;
    const { quantity } = req.body;

    try {
        const cart = await Cart.findOne({ userId: req.user._id });

        if (!cart) {
            res.status(404);
            throw new Error("Cart not found");
        }

        const itemIndex = cart.items.findIndex(item => item._id.equals(itemId));

        if (itemIndex === -1) {
            res.status(404);
            throw new Error("Item not found in cart");
        }

        if (quantity <= 0) {
            // If quantity is 0 or less, remove the item
            cart.items.splice(itemIndex, 1);
        } else {
            cart.items[itemIndex].quantity = quantity;
        }

        const updatedCart = await cart.save();
        res.json(updatedCart);

    } catch (error) {
        next(error);
    }
};


// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private
const removeItemFromCart = async (req, res, next) => {
    const { itemId } = req.params;
    try {
        let cart = await Cart.findOne({ userId: req.user._id });

        if (!cart) {
            res.status(404);
            throw new Error('Cart not found');
        }
        
        const initialLength = cart.items.length;
        cart.items = cart.items.filter(item => !item._id.equals(itemId));
        
        if (cart.items.length === initialLength) {
            res.status(404);
            throw new Error('Item not found in cart');
        }

        await cart.save();
        res.status(200).json({ message: 'Item removed' });
    } catch (error) {
        next(error);
    }
};

module.exports = { getCart, addItemToCart, updateCartItem, removeItemFromCart };
