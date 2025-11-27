import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = 'http://localhost:5001';

function App() {
  const [currentView, setCurrentView] = useState('login'); 
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [showPassword, setShowPassword] = useState({
    loginPassword: false,
    signupPassword: false
  });

  // Form data states
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ name: '', email: '', password: '' });

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
      setCurrentView('dashboard');
    }
  }, []);

  // Handle form input changes
  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSignupChange = (e) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };

  // Toggle password visibility
  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  // Show message
  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  // Handle signup
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
        body: JSON.stringify(signupData)
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        setCurrentView('dashboard');
        showMessage(data.message, 'success');
      } else {
        showMessage(data.message, 'error');
      }
    } catch (error) {
      showMessage('Network error. Backend may be offline.', 'error');
      console.error('Signup error:', error);
    }
  };

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        setCurrentView('dashboard');
        showMessage(data.message, 'success');
      } else {
        showMessage(data.message, 'error');
      }
    } catch (error) {
      showMessage('Network error. Backend may be offline.', 'error');
      console.error('Login error:', error);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setCurrentView('login');
    setLoginData({ email: '', password: '' });
    showMessage('Logged out successfully!', 'success');
  };

  // Render login form
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
            type={showPassword.loginPassword ? "text" : "password"}
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

  // Render signup form
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
            type={showPassword.signupPassword ? "text" : "password"}
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

  // Render dashboard
  const renderDashboard = () => (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h2>Welcome to Fresh Basket!</h2>
          <p className="dashboard-subtitle">An end-to-end fresh produce marketplace built with the MERN stack.</p>
        </div>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>

      <div className="user-info">
        <p><strong>Name:</strong> {user?.name}</p>
        <p><strong>Email:</strong> {user?.email}</p>
      </div>

      <div className="project-grid">
        <section className="project-section">
          <h3>Project Title</h3>
          <p><strong>Fresh Basket</strong> – An online fruit & vegetable market shop that connects consumers with trusted local vendors for high-quality produce.</p>
        </section>

        <section className="project-section">
          <h3>Problem Statement</h3>
          <p>Consumers struggle to find consistently fresh produce at fair prices due to transparency issues and limited access to reliable suppliers. Fresh Basket streamlines discovery, ordering, and delivery directly from verified vendors.</p>
        </section>

        <section className="project-section">
          <h3>System Architecture</h3>
          <ul className="architecture-list">
            <li><strong>Frontend →</strong> React SPA (React Router + Tailwind UI)</li>
            <li><strong>Backend →</strong> Node.js + Express REST API</li>
            <li><strong>Database →</strong> MongoDB Atlas</li>
            <li><strong>Authentication →</strong> JWT-based sessions (Firebase Auth planned for OTP / social logins)</li>
            <li><strong>Hosting →</strong> React on Vercel, API on Render, MongoDB Atlas cluster</li>
          </ul>
        </section>
      </div>

      <section className="project-section full-width">
        <h3>Key Features</h3>
        <div className="feature-grid">
          <article className="feature-card">
            <h4>Authentication & Authorization</h4>
            <ul>
              <li>Secure signup/login with JWT</li>
              <li>Role-based dashboards for admin, vendor, customer</li>
              <li>Session persistence with refresh tokens</li>
            </ul>
          </article>
          <article className="feature-card">
            <h4>CRUD Operations</h4>
            <ul>
              <li>Product catalog management</li>
              <li>Vendor profiles & approvals</li>
              <li>Order lifecycle tracking</li>
            </ul>
          </article>
          <article className="feature-card">
            <h4>Frontend Routing</h4>
            <ul>
              <li>Pages: Home, Login, Shop, Product Details, Cart</li>
              <li>Checkout, Profile, Admin Dashboard</li>
              <li>Protected routes gated by auth middleware</li>
            </ul>
          </article>
          <article className="feature-card">
            <h4>User Experience</h4>
            <ul>
              <li>Search, sorting & filtering by category/vendor</li>
              <li>Pagination for product listing</li>
              <li>Real-time cart updates & order status</li>
            </ul>
          </article>
          <article className="feature-card">
            <h4>Hosting & DevOps</h4>
            <ul>
              <li>CI-ready deployment through Vercel/Render</li>
              <li>Environment-configured connections</li>
              <li>Monitoring hooks for uptime visibility</li>
            </ul>
          </article>
        </div>
      </section>

      <section className="project-section full-width">
        <h3>Tech Stack</h3>
        <div className="stack-grid">
          <div>
            <strong>Frontend:</strong> React.js, React Router, Tailwind CSS, Axios
          </div>
          <div>
            <strong>Backend:</strong> Node.js, Express.js, JWT, bcrypt
          </div>
          <div>
            <strong>Database:</strong> MongoDB Atlas with Mongoose ODM
          </div>
          <div>
            <strong>Authentication:</strong> Firebase Auth + JWT tokens
          </div>
          <div>
            <strong>Hosting:</strong> Vercel (frontend), Render (backend), MongoDB Atlas (DB)
          </div>
        </div>
      </section>
    </div>
  );

  return (
    <div className={`container ${currentView === 'dashboard' ? 'dashboard-view' : ''}`}>
      <div className="header">
        <h1>Fresh Basket</h1>
        <p>Your Fresh Fruits & Vegetables Store</p>
      </div>

      {currentView === 'login' && renderLoginForm()}
      {currentView === 'signup' && renderSignupForm()}
      {currentView === 'dashboard' && renderDashboard()}

      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}
    </div>
  );
}

export default App;
