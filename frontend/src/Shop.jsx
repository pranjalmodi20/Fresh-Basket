import React, { useState, useMemo } from 'react';
import './Shop.css';

const PAGE_SIZE = 20;

const Shop = ({ products, loadingProducts, onAddToCart, onAddToWishlist }) => {
  const [activeCategory, setActiveCategory] = useState('all'); // 'all' | 'vegetables' | 'fruits'
  const [page, setPage] = useState(1);

  const categories = [
    { key: 'vegetables', label: 'Vegetables', img: '/veg.jpg' },
    { key: 'fruits', label: 'Fruits', img: '/fruits.jpg' },
  ];

  // Filter by category
  const filteredProducts = useMemo(() => {
    if (activeCategory === 'all') return products;
    return products.filter(
      (p) => p.category?.toLowerCase() === activeCategory
    );
  }, [products, activeCategory]);

  // Pagination data
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const startIdx = (currentPage - 1) * PAGE_SIZE;
  const pageItems = filteredProducts.slice(startIdx, startIdx + PAGE_SIZE);

  const handleCategoryClick = (key) => {
    setActiveCategory(key);
    setPage(1); // reset to first page when switching category
  };

  const title =
    activeCategory === 'vegetables'
      ? 'Vegetables'
      : activeCategory === 'fruits'
      ? 'Fruits'
      : 'Shop';

  return (
    <div className="shop-page">
      {/* Hero banner */}
      <section className="shop-hero">
        <div className="shop-hero-overlay" />
        <div className="shop-hero-content">
          <p className="shop-hero-kicker">
            Home / {activeCategory === 'all' ? 'Shop' : title}
          </p>
          <h1 className="shop-hero-title">{title}</h1>
        </div>
      </section>

      {/* Intro */}
      <section className="shop-intro">
        <p className="shop-intro-subtitle">When health is organic</p>
        <h2 className="shop-intro-title">Shop Our Organic Products</h2>
      </section>

      {/* Category “pages” */}
      <section className="shop-categories">
        {categories.map((cat) => (
          <button
            key={cat.key}
            className={`shop-category-pill ${
              activeCategory === cat.key ? 'active' : ''
            }`}
            onClick={() => handleCategoryClick(cat.key)}
          >
            <div className="shop-category-circle">
              <img
                src={cat.img}
                alt={cat.label}
                className="shop-category-img"
              />
            </div>
            <span className="shop-category-text">{cat.label}</span>
          </button>
        ))}
      </section>

      {/* Toolbar */}
      <section className="shop-toolbar">
        <p className="shop-toolbar-count">
          Showing {pageItems.length} of {filteredProducts.length} items
        </p>
        <div className="shop-toolbar-right">
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
        ) : pageItems.length === 0 ? (
          <p>No products available in this category.</p>
        ) : (
          pageItems.map((p) => (
            <article key={p._id} className="shop-product-card">
              <div className="shop-product-image">
                <img
                  src={p.imageUrl}
                  alt={p.name}
                  className="shop-product-img"
                />
              </div>
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
      {filteredProducts.length > PAGE_SIZE && (
        <section className="shop-pagination">
          <button
            className="page-btn"
            disabled={currentPage === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            ‹
          </button>
          {Array.from({ length: totalPages }).map((_, idx) => {
            const pageNum = idx + 1;
            return (
              <button
                key={pageNum}
                className={`page-btn ${
                  currentPage === pageNum ? 'active' : ''
                }`}
                onClick={() => setPage(pageNum)}
              >
                {pageNum}
              </button>
            );
          })}
          <button
            className="page-btn"
            disabled={currentPage === totalPages}
            onClick={() =>
              setPage((p) => Math.min(totalPages, p + 1))
            }
          >
            ›
          </button>
        </section>
      )}
    </div>
  );
};

export default Shop;
