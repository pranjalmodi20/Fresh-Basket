const Product = require('../models/product');

// GET /api/products  (public)
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    return res.json(products);
  } catch (error) {
    console.error('Get products error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/products/:id  (public)
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/products  (vendor/admin)
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, category, imageUrl, inStock } = req.body;

    if (!name || price == null || !category) {
      return res
        .status(400)
        .json({ message: 'Name, price and category are required' });
    }

    const product = await Product.create({
      name,
      description,
      price,
      category,
      imageUrl,
      inStock,
      vendor: req.user?._id || null, // set vendor to logged-in user if vendor/admin
    });

    return res.status(201).json(product);
  } catch (error) {
    console.error('Create product error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/products/:id  (vendor/admin)
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Optional: if vendor, only allow updating own products
    if (
      req.user.role === 'vendor' &&
      product.vendor &&
      product.vendor.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: 'Forbidden: cannot edit products of other vendors' });
    }

    const updates = req.body;
    Object.assign(product, updates);

    await product.save();

    return res.json(product);
  } catch (error) {
    console.error('Update product error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// DELETE /api/products/:id  (admin)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await product.deleteOne();

    return res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
