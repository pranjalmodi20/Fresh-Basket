const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./src/routes/authRoutes');
const productRoutes = require('./src/routes/productRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

// Env validation
if (!process.env.MONGODB_URI || !process.env.JWT_SECRET) {
  console.error('Missing MONGODB_URI or JWT_SECRET in .env');
  process.exit(1);
}

// DB connect
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    console.log('Connected to MongoDB - Fresh Basket Database')
  )
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Health route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Fresh Basket API!',
    status: 'Server is running',
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Fresh Basket Server running on port ${PORT}`);
});
