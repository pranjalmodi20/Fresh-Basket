import React from 'react';
import './ProductDetails.css';

const ProductDetails = ({
  product,
  cartItems,
  onSetCartQuantity,
  wishlistItems = [],
  onAddToWishlist,
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

  const isWished = wishlistItems.some((item) => item._id === product._id);

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

          {/* small icon row: cart + wishlist */}
          <div className="pd-icon-row">
            <button
              className="pd-icon-btn"
              onClick={() => onSetCartQuantity(product, qty === 0 ? 1 : qty + 1)}
              title="Add to Cart"
            >
              <i className="fas fa-shopping-cart" />
            </button>

            <button
              className={`pd-icon-btn wishlist-icon ${
                isWished ? 'active' : ''
              }`}
              onClick={() => onAddToWishlist(product)}
              title="Toggle Wishlist"
            >
              <i className="fas fa-heart" />
            </button>
          </div>

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
