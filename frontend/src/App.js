import React, { useState, useEffect } from 'react';
import './App.css';
import Shop from './Shop';
import Navbar from './Navbar';
import Footer from './Footer';
import AdminPanel from './AdminPanel';
import ProductDetails from './ProductDetails';
import { setCartQuantity } from './cartApi';

const API_URL = 'http://localhost:5001/api/auth';
const PRODUCTS_API = 'http://localhost:5001/api/products';

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
      setCurrentView(parsed.role === 'admin' ? 'dashboard' : 'shop');
      fetchProducts();
    }
  }, []);

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
      setProducts(Array.isArray(data) ? data : []);
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

        if (data.user.role === 'admin') {
          setCurrentView('dashboard');
        } else {
          setCurrentView('shop');
        }

        fetchProducts();
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

        if (data.user.role === 'admin') {
          setCurrentView('dashboard');
        } else {
          setCurrentView('shop');
        }

        fetchProducts();
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

      setCartItems((prev) => {
        const existing = prev.find(
          (item) => item.product._id === product._id
        );
        if (!existing && quantity === 0) return prev;

        if (!existing) {
          return [...prev, { product, quantity }];
        }

        if (quantity === 0) {
          return prev.filter(
            (item) => item.product._id !== product._id
          );
        }

        return prev.map((item) =>
          item.product._id === product._id
            ? { ...item, quantity }
            : item
        );
      });
    } catch (err) {
      console.error(err);
      showMessage('Could not update cart', 'error');
    }
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
    console.log('currentView:', currentView, 'user role:', user?.role);

    return (
      <>
        <Navbar
          currentView={currentView}
          onNavigate={setCurrentView}
          onLogout={handleLogout}
          user={user}
        />

        <div className="dashboard">
          {/* Admin-only dashboard hero */}
          {currentView === 'dashboard' && user?.role === 'admin' && (
            <section className="dash-hero">
              <div className="dash-hero-left">
                <h2 className="dash-hero-title">
                  Fresh food, delivered fast.
                </h2>
                <p className="dash-hero-text">
                  Browse organic fruits and vegetables from trusted
                  local vendors and get them delivered to your
                  doorstep.
                </p>
              </div>
              <div className="dash-hero-right">
                <img
                  src="/dashboard-hero.jpg"
                  alt="Fresh Basket dashboard"
                  className="dash-hero-image"
                />
              </div>
            </section>
          )}

          {currentView === 'shop' && (
            <Shop
              products={products}
              loadingProducts={loadingProducts}
              cartItems={cartItems}
              onSetCartQuantity={handleSetCartQuantity}
              onAddToWishlist={(p) =>
                setWishlistItems((prev) => [...prev, p])
              }
              onOpenProduct={(p) => {
                setSelectedProduct(p);
                setCurrentView('productDetails');
              }}
            />
          )}

          {currentView === 'cart' && (
            <div>
              <h2>Cart</h2>
              {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
              ) : (
                <ul>
                  {cartItems.map((item, idx) => (
                    <li key={idx}>
                      {item.product.name} – {item.quantity} × ₹
                      {item.product.price}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {currentView === 'wishlist' && (
            <div>
              <h2>Wishlist</h2>
              {wishlistItems.length === 0 ? (
                <p>No items in wishlist.</p>
              ) : (
                <ul>
                  {wishlistItems.map((item, idx) => (
                    <li key={idx}>
                      {item.name} – ₹{item.price}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {currentView === 'profile' && (
            <div>
              <h2>Profile</h2>
              {user && (
                <>
                  <p>
                    <strong>Name:</strong> {user.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {user.email}
                  </p>
                </>
              )}
            </div>
          )}

          {currentView === 'admin' && user?.role === 'admin' && (
            <AdminPanel products={products} onRefresh={fetchProducts} />
          )}

          {currentView === 'productDetails' && selectedProduct && (
            <ProductDetails
              product={selectedProduct}
              onAddToCart={(p) => handleSetCartQuantity(p, 1)}
              onBack={() => setCurrentView('shop')}
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
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}
    </div>
  );
}

export default App;
