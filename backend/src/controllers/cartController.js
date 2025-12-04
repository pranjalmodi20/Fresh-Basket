// src/controllers/cartController.js
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// GET cart for logged-in user
const getCart = async (req, res) => {
  try {
    const userId = req.user && req.user._id;

    if (!userId) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const cart = await Cart.findOne({ user: userId }).populate('items.product');

    if (!cart) {
      return res.json({ items: [] });
    }

    return res.json(cart);
  } catch (err) {
    console.error('getCart error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

const setCartQuantity = async (req, res) => {
  try {
    // user set by protect middleware
    const userId = req.user && req.user._id;

    if (!userId) {
      return res
        .status(401)
        .json({ message: 'Not authorized (no user in request)' });
    }

    const { productId, quantity } = req.body;

    if (!productId || quantity == null) {
      return res
        .status(400)
        .json({ message: 'productId and quantity are required' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    const idx = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (quantity <= 0) {
      if (idx !== -1) cart.items.splice(idx, 1);
    } else if (idx === -1) {
      cart.items.push({ product: productId, quantity });
    } else {
      cart.items[idx].quantity = quantity;
    }

    const savedCart = await cart.save();
    console.log('Cart saved successfully:', {
      userId,
      productId,
      quantity,
      totalItems: savedCart.items.length
    });

    const updated =
      cart.items.find((i) => i.product.toString() === productId) || null;

    return res.json({
      productId,
      quantity: updated ? updated.quantity : 0,
      cartId: savedCart._id
    });
  } catch (err) {
    console.error('setCartQuantity error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { setCartQuantity, getCart };
