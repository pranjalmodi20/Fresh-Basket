import React, { useState } from 'react';
import './Navbar.css';

const Navbar = ({ onNavigate, currentView, onLogout, user, products = [], onSearchSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredProducts =
    searchTerm.trim().length === 0
      ? []
      : products.filter((p) =>
          (p.name || '').toLowerCase().includes(searchTerm.toLowerCase())
        );

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowSuggestions(value.trim().length > 0);
  };

  const handleSelectProduct = (product) => {
    if (!product) return;
    setSearchTerm(product.name);
    setShowSuggestions(false);
    if (onSearchSelect) {
      onSearchSelect(product); // yahin se parent ko bol: cart me add + details dikhana
    }
  };

  const handleBlur = () => {
    setTimeout(() => setShowSuggestions(false), 150);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredProducts.length > 0) {
        handleSelectProduct(filteredProducts[0]); // pehla result open
      }
    }
  };

  return (
    <header className="fb-navbar">
      <div className="fb-nav-left">
        <div className="fb-logo" onClick={() => onNavigate('dashboard')}>
          <img
            src="/freshbasketlogo1.png"
            alt="Fresh Basket logo"
            className="fb-logo-img"
          />
          <div className="fb-logo-text">
            <span className="fb-logo-title"></span>
            <span className="fb-logo-sub"></span>
          </div>
        </div>

        <div className="fb-location">
          <label className="fb-location-label">Deliver to</label>
          <input
            className="fb-location-input"
            placeholder="Area / pincode"
          />
        </div>
      </div>

      <div className="fb-nav-center">
        <div className="fb-search-wrapper">
          <input
            className="fb-search-input"
            placeholder="Search for fruits, vegetables, juices..."
            value={searchTerm}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={() =>
              setShowSuggestions(searchTerm.trim().length > 0)
            }
            onBlur={handleBlur}
          />
          {showSuggestions && filteredProducts.length > 0 && (
            <ul className="fb-search-suggestions show">
              {filteredProducts.slice(0, 8).map((product) => (
                <li
                  key={product._id || product.id}
                  className="fb-search-suggestion-item"
                  onMouseDown={() => handleSelectProduct(product)}
                >
                  {product.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="fb-nav-right">
        {/* baaki sab jaisa ka taisa */}
        <button
          className={`fb-nav-link ${
            currentView === 'shop' ? 'active' : ''
          }`}
          onClick={() => onNavigate('shop')}
        >
          <i className="fas fa-store fb-nav-icon" /> Shop
        </button>
        <button
          className={`fb-nav-link ${
            currentView === 'cart' ? 'active' : ''
          }`}
          onClick={() => onNavigate('cart')}
        >
          <i className="fas fa-shopping-cart fb-nav-icon" /> Cart
        </button>
        <button
          className={`fb-nav-link ${
            currentView === 'wishlist' ? 'active' : ''
          }`}
          onClick={() => onNavigate('wishlist')}
        >
          <i className="fas fa-heart fb-nav-icon" /> Wishlist
        </button>
        <button
          className={`fb-nav-link ${
            currentView === 'profile' ? 'active' : ''
          }`}
          onClick={() => onNavigate('profile')}
        >
          <i className="fas fa-user fb-nav-icon" /> {user?.name || 'Profile'}
        </button>
        {user?.role === 'admin' && (
          <button
            className={`fb-nav-link ${
              currentView === 'admin' ? 'active' : ''
            }`}
            onClick={() => onNavigate('admin')}
          >
            <i className="fas fa-tools fb-nav-icon" /> Admin
          </button>
        )}
        <button className="fb-logout-btn" onClick={onLogout}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
