import React from 'react';
import './Navbar.css';

const Navbar = ({ onNavigate, currentView, onLogout, user }) => {
  return (
    <header className="fb-navbar">
      <div className="fb-nav-left">
        <div className="fb-logo" onClick={() => onNavigate('dashboard')}>
          <span className="fb-logo-icon">🍎</span>
          <div className="fb-logo-text">
            <span className="fb-logo-title">Fresh Basket</span>
            <span className="fb-logo-sub">Fresh Fruits & Veggies</span>
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
        <input
          className="fb-search-input"
          placeholder="Search for fruits, vegetables, juices..."
        />
      </div>

      <div className="fb-nav-right">
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
