const Product = require('../models/Product');

// GET /api/products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error('Get products error:', err);
    res
      .status(500)
      .json({ message: 'Server error fetching products' });
  }
};

// GET /api/products/:id
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    console.error('Get product by id error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/products (vendor/admin)
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, category, imageUrl, inStock } =
      req.body;

    if (!name || !price || !category) {
      return res.status(400).json({
        message: 'Name, price and category are required',
      });
    }

    const product = await Product.create({
      name,
      description,
      price,
      category,
      imageUrl,
      inStock,
    });

    res.status(201).json(product);
  } catch (err) {
    console.error('Create product error:', err);
    res
      .status(500)
      .json({ message: 'Server error creating product' });
  }
};

// PUT /api/products/:id (vendor/admin)
exports.updateProduct = async (req, res) => {
  try {
    const updates = req.body;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updates,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!product) {
      return res
        .status(404)
        .json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (err) {
    console.error('Update product error:', err);
    res
      .status(500)
      .json({ message: 'Server error updating product' });
  }
};

// DELETE /api/products/:id (admin only)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res
        .status(404)
        .json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted' });
  } catch (err) {
    console.error('Delete product error:', err);
    res
      .status(500)
      .json({ message: 'Server error deleting product' });
  }
};
