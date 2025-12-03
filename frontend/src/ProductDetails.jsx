import React from 'react';
import './ProductDetails.css';

const ProductDetails = ({
  product,
  cartItems,
  onSetCartQuantity,
  wishlistItems = [],
  onBack,

}) => {
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

  const qty =
    cartItems?.find((item) => item.product._id === product._id)?.quantity || 0;

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

          {/* Same add-to-cart behaviour as Shop */}
          {qty === 0 ? (
            <button
              className="shop-btn shop-btn-primary cart-main-btn"
              onClick={() => onSetCartQuantity(product, 1)}
            >
              <i className="fas fa-shopping-cart" />
              <span className="cart-main-text">Add to Cart</span>
            </button>
          ) : (
            <button
              className="shop-btn shop-btn-primary cart-main-btn"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="qty-control">
                <button
                  type="button"
                  className="qty-btn"
                  onClick={() => onSetCartQuantity(product, qty - 1)}
                >
                  −
                </button>
                <span className="qty-value">{qty}</span>
                <button
                  type="button"
                  className="qty-btn"
                  onClick={() => onSetCartQuantity(product, qty + 1)}
                >
                  +
                </button>
              </span>
              <span className="cart-main-text">Add to Cart</span>
            </button>
          )}

          {/* Description block */}
          <div className="pd-description-block">
            <h3 className="pd-desc-title">Description</h3>
            {product.description ? (
              <ul className="pd-desc-list">
                {product.description.split('\n').map((line, idx) => (
                  <li key={idx}>{line}</li>
                ))}
              </ul>
            ) : (
              <p className="pd-desc-empty">
                No description available for this item.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
