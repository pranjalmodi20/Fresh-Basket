import React from 'react';
import './Shop.css';

const Shop = ({ products, loadingProducts, onAddToCart, onAddToWishlist }) => {
  return (
    <div className="shop-page">
      {/* Hero banner */}
      <section className="shop-hero">
        <div className="shop-hero-overlay" />
        <div className="shop-hero-content">
          <p className="shop-hero-kicker">Home / Shop</p>
          <h1 className="shop-hero-title">Shop</h1>
        </div>
      </section>

      {/* Intro */}
      <section className="shop-intro">
        <p className="shop-intro-subtitle">When health is organic</p>
        <h2 className="shop-intro-title">Shop Our Organic Products</h2>
      </section>

      {/* Category row */}
      <section className="shop-categories">
        {['Vegetables', 'Fruits', 'Fresh Nuts', 'Juices', 'Eggs', 'Healthy'].map(
          (label) => (
            <button key={label} className="shop-category-pill">
              <div className="shop-category-circle" />
              <span className="shop-category-text">{label}</span>
            </button>
          )
        )}
      </section>

      {/* Toolbar */}
      <section className="shop-toolbar">
        <p className="shop-toolbar-count">
          Showing 1–{Math.min(products.length, 10)} of {products.length} items
        </p>
        <div className="shop-toolbar-right">
          <div className="shop-view-toggle">
            <button className="shop-view-btn active">
              <i className="fas fa-th" />
            </button>
            <button className="shop-view-btn">
              <i className="fas fa-list" />
            </button>
          </div>
          <select className="shop-sort-select" defaultValue="default">
            <option value="default">Default Sorting</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </section>

      {/* Products */}
      <section className="shop-products">
        {loadingProducts ? (
          <p>Loading products...</p>
        ) : products.length === 0 ? (
          <p>No products available.</p>
        ) : (
          products.map((p) => (
            <article key={p._id} className="shop-product-card">
              <div className="shop-product-image" />
              <div className="shop-product-body">
                <span className="shop-product-weight">1kg</span>
                <p className="shop-product-category">{p.category}</p>
                <h3 className="shop-product-name">{p.name}</h3>
                <p className="shop-product-price">
                  Actual Price: <span>₹{p.price}</span>
                </p>
                <div className="shop-product-actions">
                  <button
                    className="shop-btn shop-btn-primary"
                    onClick={() => onAddToCart(p)}
                  >
                    <i className="fas fa-shopping-cart" /> Add to Cart
                  </button>
                  <button
                    className="shop-btn shop-btn-ghost"
                    onClick={() => onAddToWishlist(p)}
                  >
                    <i className="fas fa-heart" /> Wishlist
                  </button>
                </div>
              </div>
            </article>
          ))
        )}
      </section>

      {/* Pagination */}
      <section className="shop-pagination">
        <button className="page-btn active">1</button>
        <button className="page-btn">2</button>
        <button className="page-btn">3</button>
        <span className="page-dots">…</span>
        <button className="page-btn">25</button>
      </section>
    </div>
  );
};

export default Shop;
