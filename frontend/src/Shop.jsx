import React, { useState, useMemo, useEffect } from 'react';
import './Shop.css';

const PAGE_SIZE = 20;

const Shop = ({
  products,
  loadingProducts,
  cartItems,
  onSetCartQuantity,
  onAddToWishlist,
  onOpenProduct,
}) => {
  const [activeCategory, setActiveCategory] = useState('all'); // 'all' | 'vegetables' | 'fruits'
  const [page, setPage] = useState(1);

  // slider state
  const [currentSlide, setCurrentSlide] = useState(0);

  const categories = [
    { key: 'vegetables', label: 'Vegetables', img: '/veg.jpg' },
    { key: 'fruits', label: 'Fruits', img: '/fruits.jpg' },
  ];

  const sliderImages = [
    { src: '/Fresh.png', alt: 'Promo banner 1' },
    { src: '/banner2.jpg', alt: 'Promo banner 2' },
    { src: '/banner3.jpg', alt: 'Promo banner 3' },
  ];

  // auto‑change slider every 5s
  useEffect(() => {
    const id = setInterval(() => {
      setCurrentSlide((prev) =>
        prev === sliderImages.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(id);
  }, [sliderImages.length]);

  // Filter by selected category
  const filteredProducts = useMemo(() => {
    if (activeCategory === 'all') return products;
    return products.filter(
      (p) => p.category?.toLowerCase() === activeCategory
    );
  }, [products, activeCategory]);

  // Pagination
  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / PAGE_SIZE)
  );
  const currentPage = Math.min(page, totalPages);
  const startIdx = (currentPage - 1) * PAGE_SIZE;
  const pageItems = filteredProducts.slice(startIdx, startIdx + PAGE_SIZE);

  const handleCategoryClick = (key) => {
    setActiveCategory((prev) => (prev === key ? 'all' : key)); // toggle
    setPage(1);
  };

  const title =
    activeCategory === 'vegetables'
      ? 'Vegetables'
      : activeCategory === 'fruits'
      ? 'Fruits'
      : 'Shop';

  return (
    <div className="shop-page">
      {/* Small header instead of big hero */}
      <section className="shop-header">
        <p className="shop-hero-kicker">
          Home / {activeCategory === 'all' ? 'Shop' : title}
        </p>
        <h1 className="shop-hero-title">{title}</h1>
      </section>

      {/* Full-width promo slider */}
      <section className="shop-slider">
        <div className="shop-slider-inner">
          <button
            className="slider-arrow slider-arrow-left"
            onClick={() =>
              setCurrentSlide((prev) =>
                prev === 0 ? sliderImages.length - 1 : prev - 1
              )
            }
          >
            ‹
          </button>

          <div className="slider-image-wrap">
            <img
              src={sliderImages[currentSlide].src}
              alt={sliderImages[currentSlide].alt}
              className="slider-image"
            />
          </div>

          <button
            className="slider-arrow slider-arrow-right"
            onClick={() =>
              setCurrentSlide((prev) =>
                prev === sliderImages.length - 1 ? 0 : prev + 1
              )
            }
          >
            ›
          </button>
        </div>

        <div className="slider-dots">
          {sliderImages.map((_, idx) => (
            <button
              key={idx}
              className={`slider-dot ${
                idx === currentSlide ? 'active' : ''
              }`}
              onClick={() => setCurrentSlide(idx)}
            />
          ))}
        </div>
      </section>

      {/* Intro */}
      <section className="shop-intro">
        <p className="shop-intro-subtitle">When health is organic</p>
        <h2 className="shop-intro-title">Shop Our Organic Products</h2>
      </section>

      {/* Category buttons */}
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

      {/* Products grid */}
      <section className="shop-products">
        {loadingProducts ? (
          <p>Loading products...</p>
        ) : pageItems.length === 0 ? (
          <p>No products available in this category.</p>
        ) : (
          pageItems.map((p) => {
            const qty =
              cartItems?.find(
                (item) => item.product._id === p._id
              )?.quantity || 0;

            return (
              <article
                key={p._id}
                className="shop-product-card"
                onClick={() => onOpenProduct && onOpenProduct(p)}
              >
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
                        className="shop-btn shop-btn-primary cart-main-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (qty === 0) {
                            onSetCartQuantity(p, 1);
                          }
                        }}
                      >
                        {qty === 0 ? (
                          <i className="fas fa-shopping-cart" />
                        ) : (
                          <span
                            className="qty-control"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              type="button"
                              className="qty-btn"
                              onClick={() => onSetCartQuantity(p, qty - 1)}
                            >
                              −
                            </button>
                            <span className="qty-value">{qty}</span>
                            <button
                              type="button"
                              className="qty-btn"
                              onClick={() => onSetCartQuantity(p, qty + 1)}
                            >
                              +
                            </button>
                          </span>
                        )}
                        <span className="cart-main-text">Add to Cart</span>
                      </button>

                      <button
                        className="shop-btn shop-btn-ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToWishlist(p);
                        }}
                      >
                        <i className="fas fa-heart" /> Wishlist
                      </button>
                    </div>
                </div>
              </article>
            );
          })
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
