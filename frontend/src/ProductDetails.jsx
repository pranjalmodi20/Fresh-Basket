import React from 'react';
import './ProductDetails.css';

const ProductDetails = ({ product, onAddToCart, onBack }) => {
  if (!product) {
    return (
      <div className="product-details-page">
        <button className="back-btn" onClick={onBack}>
          ← Back to Shop
        </button>
        <p>Product not found.</p>
      </div>
    );
  }

  return (
    <div className="product-details-page">
      <button className="back-btn" onClick={onBack}>
        ← Back to Shop
      </button>

      <div className="product-details-content">
        <div className="product-details-left">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="product-details-main-img"
          />
        </div>

        <div className="product-details-right">
          <p className="breadcrumbs">Home / Shop / {product.name}</p>
          <h1 className="pd-title">{product.name}</h1>
          <p className="pd-category">{product.category}</p>
          <p className="pd-price">₹{product.price}</p>

          <button
            className="shop-btn shop-btn-primary"
            onClick={() => onAddToCart(product)}
          >
            <i className="fas fa-shopping-cart" /> Add to cart
          </button>

          {/* Optional extra info */}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
