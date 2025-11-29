const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, trim: true }, // e.g. "fruits","vegetables"
    imageUrl: { type: String, trim: true },
    inStock: { type: Boolean, default: true },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // vendor user
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
