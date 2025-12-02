const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const ADMIN_EMAIL = 'pranjalmodibkn@gmail.com';      // your single admin email
const ADMIN_NAME  = 'Admin';                  // optional default name

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

const safeUserFromDoc = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,        // "admin" or "customer"
});

// SIGNUP: only ADMIN_EMAIL can ever become admin, everyone else = customer
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: 'Name, email and password are required' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res
        .status(400)
        .json({ message: 'User already exists with this email' });
    }

    const hashed = await bcrypt.hash(password, 10);

    const role = email === ADMIN_EMAIL ? 'admin' : 'customer';

    const user = await User.create({
      name: email === ADMIN_EMAIL ? (name || ADMIN_NAME) : name,
      email,
      password: hashed,
      role,
    });

    const token = generateToken(user._id, user.role);
    const safeUser = safeUserFromDoc(user);

    res.status(201).json({
      message: 'Signup successful',
      user: safeUser,
      token,
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Server error during signup' });
  }
};

// LOGIN: just read stored role; only the ADMIN_EMAIL user will have role "admin"
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user._id, user.role);
    const safeUser = safeUserFromDoc(user);

    res.json({
      message: 'Login successful',
      user: safeUser,
      token,
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
};
