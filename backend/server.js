// Import required packages
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Import User model
const User = require('./models/User');

// Create Express app
const app = express();

// Middleware - helps process requests
app.use(express.json());  // Read JSON data from requests


// ROUTE: Welcome Page (for testing)
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to Fresh Basket API!',
        status: 'Server is running',
        endpoints: {
            signup: 'POST /signup',
            login: 'POST /login',
            profile: 'GET /profile'
        },
        note: 'Please open frontend/index.html to use the app'
    });
});

// Connect to MongoDB database
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('Connected to MongoDB - Fresh Basket Database'))
.catch((err) => console.log('MongoDB connection error:', err));

// ROUTE 1: SIGNUP (Create new user account)

app.post('/signup', async (req, res) => {
    try {
        // Get data from request
        const { name, email, password } = req.body;

        // Check if all fields are provided
        if (!name || !email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please provide name, email and password' 
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email already registered' 
            });
        }

        // Encrypt the password (hashing)
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });

        // Save user to database
        await newUser.save();

        // Create JWT token (like a digital ID card)
        const token = jwt.sign(
            { userId: newUser._id, email: newUser.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }  // Token valid for 24 hours
        );

        // Send success response
        res.status(201).json({
            success: true,
            message: 'Account created successfully!',
            token,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email
            }
        });

    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error. Please try again.' 
        });
    }
});


// ROUTE 2: LOGIN (User login)
app.post('/login', async (req, res) => {
    try {
        // Get email and password from request
        const { email, password } = req.body;

        // Check if both fields provided
        if (!email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please provide email and password' 
            });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid email or password' 
            });
        }

        // Check if password is correct
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid email or password' 
            });
        }

        // Create JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Send success response
        res.status(200).json({
            success: true,
            message: 'Login successful!',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error. Please try again.' 
        });
    }
});

// ====================
// ROUTE 3: GET USER PROFILE (Protected route)
// ====================
app.get('/profile', async (req, res) => {
    try {
        // Get token from header
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: 'No token provided' 
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user from database
        const user = await User.findById(decoded.userId).select('-password');

        res.status(200).json({
            success: true,
            user
        });

    } catch (error) {
        res.status(401).json({ 
            success: false, 
            message: 'Invalid or expired token' 
        });
    }
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Fresh Basket Server running on port ${PORT}`);
});
