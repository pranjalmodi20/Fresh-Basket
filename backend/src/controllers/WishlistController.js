const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');

const toggleWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.body;

    if (!productId) {
      return res
        .status(400)
        .json({ message: 'productId is required' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      wishlist = new Wishlist({ user: userId, items: [] });
    }

    const idx = wishlist.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (idx !== -1) {
      wishlist.items.splice(idx, 1);
    } else {
      wishlist.items.push({ product: productId });
    }

    await wishlist.save();
    await wishlist.populate('items.product');

    res.json({
      message: idx !== -1 ? 'Removed from wishlist' : 'Added to wishlist',
      items: wishlist.items.map((item) => item.product),
    });
  } catch (err) {
    console.error('toggleWishlist error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getWishlist = async (req, res) => {
  try {
    const userId = req.user._id;

    let wishlist = await Wishlist.findOne({ user: userId }).populate(
      'items.product'
    );

    if (!wishlist) {
      return res.json([]);
    }

    const uniqueProducts = wishlist.items.map((item) => item.product);
    res.json(uniqueProducts);
  } catch (err) {
    console.error('getWishlist error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { toggleWishlist, getWishlist };
