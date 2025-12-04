import React, { useState, useEffect } from 'react';
import './App.css';
import Shop from './Shop';
import Navbar from './Navbar';
import Footer from './Footer';
import AdminPanel from './AdminPanel';
import ProductDetails from './ProductDetails';
import { setCartQuantity, getCart } from './cartApi';
import { getWishlist, toggleWishlist } from './wishlistApi';
import CartPage from './CartPage';
import ProfilePage from './ProfilePage';

const API_URL = process.env.REACT_APP_API_URL || 'https://fresh-basket-sno7.onrender.com/api/auth';
const PRODUCTS_API = process.env.REACT_APP_API_URL 
  ? `${process.env.REACT_APP_API_URL}/api/products`
  : 'https://fresh-basket-sno7.onrender.com/api/products';

function App() {
  const [currentView, setCurrentView] = useState('login');
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [showPassword, setShowPassword] = useState({
    loginPassword: false,
    signupPassword: false,
  });

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // cartItems: [{ product, quantity }]
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);

  const [selectedProduct, setSelectedProduct] = useState(null);

  // Restore session
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      const parsed = JSON.parse(userData);
      setUser(parsed);
      setCurrentView('shop');
      fetchProducts();
      loadCart();
      loadWishlist();
    }
  }, []);

  const loadCart = async () => {
    try {
      const cartData = await getCart();
      console.log('Cart loaded from database:', cartData);
      
      // Debug: Check if products are populated
      if (cartData && cartData.items && cartData.items.length > 0) {
        console.log('First cart item:', cartData.items[0]);
        console.log('Product in first item:', cartData.items[0].product);
        console.log('Is product populated?', typeof cartData.items[0].product === 'object' && cartData.items[0].product.name);
      }
      
      // cartData.items is array of { product, quantity }
      if (cartData && cartData.items) {
        setCartItems(cartData.items);
      } else {
        setCartItems([]);
      }
    } catch (err) {
      console.error('Load cart error:', err);
      setCartItems([]);
    }
  };

  const loadWishlist = async () => {
    try {
      const items = await getWishlist();
      // items is already an array of products from backend
      setWishlistItems(items);
    } catch (err) {
      console.error('Load wishlist error:', err);
    }
  };

  // Safety: if somehow on dashboard but not admin, redirect to shop
  useEffect(() => {
    if (currentView === 'dashboard' && user && user.role !== 'admin') {
      setCurrentView('shop');
    }
  }, [currentView, user]);

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSignupChange = (e) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  const fetchProducts = async () => {
  try {
    setLoadingProducts(true);
    const res = await fetch(PRODUCTS_API);
    const data = await res.json();

    const safe = Array.isArray(data)
      ? data.filter(p => p && typeof p === 'object')
      : [];

    setProducts(safe);
  } catch (err) {
    console.error('Fetch products error:', err);
    showMessage('Failed to load products', 'error');
  } finally {
    setLoadingProducts(false);
  }
};


  // SIGNUP
  const handleSignup = async (e) => {
    e.preventDefault();

    if (signupData.password.length < 6) {
      showMessage('Password must be at least 6 characters long!', 'error');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupData),
      });

      const data = await response.json();

      if (response.ok && data.message) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        setCurrentView('shop');
        fetchProducts();
        loadCart();
        loadWishlist();
        showMessage(data.message, 'success');
      } else {
        showMessage(data.message || 'Signup failed', 'error');
      }
    } catch (error) {
      showMessage('Network error. Backend may be offline.', 'error');
      console.error('Signup error:', error);
    }
  };

  // LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (response.ok && data.message) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        setCurrentView('shop');
        fetchProducts();
        loadCart();
        loadWishlist();
        showMessage(data.message, 'success');
      } else {
        showMessage(data.message || 'Login failed', 'error');
      }
    } catch (error) {
      showMessage('Network error. Backend may be offline.', 'error');
      console.error('Login error:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setCurrentView('login');
    setLoginData({ email: '', password: '' });
    showMessage('Logged out successfully!', 'success');
  };

  // Set quantity for a product in cart + sync with backend
  const handleSetCartQuantity = async (product, quantity) => {
    if (quantity < 0) return;

    try {
      await setCartQuantity(product._id, quantity);
      
      // Reload cart from database to get populated product details
      await loadCart();
    } catch (err) {
      console.error(err);
      showMessage('Could not update cart', 'error');
    }
  };

  // Handle wishlist add/remove
  const handleAddToWishlist = async (product) => {
    try {
      await toggleWishlist(product._id);

      setWishlistItems((prev) => {
        const exists = prev.find((item) => item._id === product._id);
        if (exists) {
          return prev.filter((item) => item._id !== product._id);
        } else {
          return [...prev, product];
        }
      });
    } catch (err) {
      console.error(err);
      showMessage('Could not update wishlist', 'error');
    }
  };

  // Search se selected product ko cart me 1 qty add karega
  const handleSearchSelect = (product) => {
    setSelectedProduct(product);
    setCurrentView('productDetails');
    handleSetCartQuantity(product, 1);
  };

  const renderLoginForm = () => (
    <div className="form-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={loginData.email}
          onChange={handleLoginChange}
          required
        />

        <div className="password-field">
          <input
            type={showPassword.loginPassword ? 'text' : 'password'}
            name="password"
            placeholder="Password"
            value={loginData.password}
            onChange={handleLoginChange}
            required
          />
          <span
            className="toggle-password"
            onClick={() =>
              togglePasswordVisibility('loginPassword')
            }
          >
            {showPassword.loginPassword ? 'Hide' : 'Show'}
          </span>
        </div>

        <button type="submit">Login</button>
      </form>

      <p className="toggle-text">
        Don't have an account?{' '}
        <span className="link" onClick={() => setCurrentView('signup')}>
          Sign Up
        </span>
      </p>
    </div>
  );

  const renderSignupForm = () => (
    <div className="form-container">
      <h2>Create Account</h2>
      <form onSubmit={handleSignup}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={signupData.name}
          onChange={handleSignupChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={signupData.email}
          onChange={handleSignupChange}
          required
        />

        <div className="password-field">
          <input
            type={showPassword.signupPassword ? 'text' : 'password'}
            name="password"
            placeholder="Password (min 6 characters)"
            value={signupData.password}
            onChange={handleSignupChange}
            required
            minLength="6"
          />
          <span
            className="toggle-password"
            onClick={() =>
              togglePasswordVisibility('signupPassword')
            }
          >
            {showPassword.signupPassword ? 'Hide' : 'Show'}
          </span>
        </div>

        <button type="submit">Sign Up</button>
      </form>

      <p className="toggle-text">
        Already have an account?{' '}
        <span className="link" onClick={() => setCurrentView('login')}>
          Login
        </span>
      </p>
    </div>
  );

  // Dashboard with navbar and view switching
  const renderDashboard = () => {
    return (
      <>
        <Navbar
          currentView={currentView}
          onNavigate={setCurrentView}
          onLogout={handleLogout}
          user={user}
          products={products}
          onSearchSelect={handleSearchSelect}
        />

        <div className="dashboard">
          {currentView === 'shop' && (
            <Shop
              products={products}
              onSearch={(results) => setSearchedProducts(results)}
              onSelectProduct={(product) => onOpenProduct(product)}
              loadingProducts={loadingProducts}
              cartItems={cartItems}
              wishlistItems={wishlistItems}
              onSetCartQuantity={handleSetCartQuantity}
              onAddToWishlist={handleAddToWishlist}
              onOpenProduct={(p) => {
                setSelectedProduct(p);
                setCurrentView('productDetails');
              }}
            />
          )}

          {currentView === 'cart' && (
            <CartPage
              cartItems={cartItems}
              onSetCartQuantity={handleSetCartQuantity}
              onProceed={() => {
                showMessage('Proceeding to payment...', 'success');
                // TODO: integrate payment gateway
              }}
            />
          )}

          {currentView === 'wishlist' && (
            <div className="wishlist-page">
              <div className="wishlist-header">
                <h1 className="wishlist-title">My Wishlist</h1>
                <p className="wishlist-count">
                  {wishlistItems.length} items
                </p>
              </div>

              {wishlistItems.length === 0 ? (
                <div className="wishlist-empty">
                  <p>No items in your wishlist yet.</p>
                </div>
              ) : (
                <div className="wishlist-grid">
                  {wishlistItems.map((product) => (
                    <article
                      key={product._id}
                      className="wishlist-product-card"
                    >
                      <div className="wishlist-product-image">
                        <img
                          src={product?.imageUrl || '/placeholder.jpg'}
                          alt={product?.name || 'Product'}
                          className="wishlist-product-img"
                        />
                        <button
                          className="wishlist-remove-btn"
                          onClick={() => handleAddToWishlist(product)}
                          title="Remove from Wishlist"
                        >
                          <i className="fas fa-heart"></i>
                        </button>
                      </div>
                      <div className="wishlist-product-body">
                        <span className="wishlist-product-weight">1kg</span>
                        <p className="wishlist-product-category">
                          {product.category}
                        </p>
                        <h3 className="wishlist-product-name">
                          {product.name}
                        </h3>
                        <p className="wishlist-product-price">
                          ₹{product.price}
                        </p>

                        <div className="wishlist-product-actions">
                          <button
                            className="shop-btn shop-btn-primary"
                            onClick={() =>
                              handleSetCartQuantity(product, 1)
                            }
                          >
                            <i className="fas fa-shopping-cart" /> Add to
                            Cart
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          )}

          {currentView === 'profile' && (
            <ProfilePage
              user={user}
              onLogout={handleLogout}
            />
          )}

          {currentView === 'admin' && user?.role === 'admin' && (
            <AdminPanel products={products} onRefresh={fetchProducts} />
          )}

          {currentView === 'productDetails' && selectedProduct && (
            <ProductDetails
              product={selectedProduct}
              cartItems={cartItems}
              onSetCartQuantity={handleSetCartQuantity}
              onBack={() => setCurrentView('shop')}
              wishlistItems={wishlistItems}
              onAddToWishlist={handleAddToWishlist}
            />
          )}
        </div>
      </>
    );
  };

  return (
    <div className="container">
      {currentView === 'login' && renderLoginForm()}
      {currentView === 'signup' && renderSignupForm()}
      {currentView !== 'login' && currentView !== 'signup' && (
        <>
          {renderDashboard()}
          <Footer />
        </>
      )}

      {message.text && (
        <div className={`toast-message toast-${message.type}`}>
        {message.text}
         </div>
      )}
    </div>
  );
}

export default App;
