import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import Shop from './Shop';
import Navbar from './Navbar';
import Footer from './Footer';
import AdminPanel from './AdminPanel';

const API_URL = 'http://localhost:5001/api/auth';
const PRODUCTS_API = 'http://localhost:5001/api/products';

function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

function App() {
  const navigate = useNavigate();

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

  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);

  // Restore session
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      const parsed = JSON.parse(userData);
      setUser(parsed);
      setCurrentView(parsed.role === 'admin' ? 'dashboard' : 'shop');
      fetchProducts();
      navigate('/'); // go to main shop on reload
    }
  }, [navigate]);

  // Safety: if somehow on dashboard but not admin, redirect to shop
  useEffect(() => {
    if (currentView === 'dashboard' && user && user.role !== 'admin') {
      setCurrentView('shop');
      navigate('/');
    }
  }, [currentView, user, navigate]);

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
          navigate('/admin-dashboard');
        } else {
          setCurrentView('shop');
          navigate('/');
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
          navigate('/admin-dashboard');
        } else {
          setCurrentView('shop');
          navigate('/');
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
    navigate('/'); // back to root, but login will be shown
    showMessage('Logged out successfully!', 'success');
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
            onClick={() => togglePasswordVisibility('loginPassword')}
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
            onClick={() => togglePasswordVisibility('signupPassword')}
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

  // Simple pages for cart / wishlist / profile
  const CartPage = () => (
    <div className="page-container">
      <h2>Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul>
          {cartItems.map((item, idx) => (
            <li key={idx}>
              {item.name} – ₹{item.price}
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  const WishlistPage = () => (
    <div className="page-container">
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
  );

  const ProfilePage = () => (
    <div className="page-container">
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
  );

  const AdminDashboard = () => (
    <>
      <section className="dash-hero">
        <div className="dash-hero-left">
          <h2 className="dash-hero-title">Fresh food, delivered fast.</h2>
          <p className="dash-hero-text">
            Browse organic fruits and vegetables from trusted local vendors
            and get them delivered to your doorstep.
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

      {user?.role === 'admin' && (
        <AdminPanel products={products} onRefresh={fetchProducts} />
      )}
    </>
  );

  return (
    <div className="container">
      {currentView === 'login' && renderLoginForm()}
      {currentView === 'signup' && renderSignupForm()}

      {currentView !== 'login' && currentView !== 'signup' && (
        <>
          <Navbar
            currentView={currentView}
            onNavigate={(view) => {
              setCurrentView(view);
              if (view === 'shop') navigate('/');
              if (view === 'cart') navigate('/cart');
              if (view === 'wishlist') navigate('/wishlist');
              if (view === 'profile') navigate('/profile');
              if (view === 'dashboard' && user?.role === 'admin') {
                navigate('/admin-dashboard');
              }
            }}
            onLogout={handleLogout}
            user={user}
          />

          <Routes>
            <Route
              path="/"
              element={
                <Shop
                  products={products}
                  loadingProducts={loadingProducts}
                  onAddToCart={(p) =>
                    setCartItems((prev) => [...prev, p])
                  }
                  onAddToWishlist={(p) =>
                    setWishlistItems((prev) => [...prev, p])
                  }
                />
              }
            />
            <Route
              path="/vegetables"
              element={
                <Shop
                  products={products}
                  loadingProducts={loadingProducts}
                  onAddToCart={(p) =>
                    setCartItems((prev) => [...prev, p])
                  }
                  onAddToWishlist={(p) =>
                    setWishlistItems((prev) => [...prev, p])
                  }
                  category="vegetables"
                />
              }
            />
            <Route
              path="/fruits"
              element={
                <Shop
                  products={products}
                  loadingProducts={loadingProducts}
                  onAddToCart={(p) =>
                    setCartItems((prev) => [...prev, p])
                  }
                  onAddToWishlist={(p) =>
                    setWishlistItems((prev) => [...prev, p])
                  }
                  category="fruits"
                />
              }
            />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route
              path="/admin-dashboard"
              element={
                user?.role === 'admin' ? (
                  <AdminDashboard />
                ) : (
                  <Shop
                    products={products}
                    loadingProducts={loadingProducts}
                    onAddToCart={(p) =>
                      setCartItems((prev) => [...prev, p])
                    }
                    onAddToWishlist={(p) =>
                      setWishlistItems((prev) => [...prev, p])
                    }
                  />
                )
              }
            />
          </Routes>

          <Footer />
        </>
      )}

      {message.text && (
        <div className={`message ${message.type}`}>{message.text}</div>
      )}
    </div>
  );
}

export default AppWrapper;
