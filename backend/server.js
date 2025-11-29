const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./src/routes/authRoutes');
const productRoutes = require('./src/routes/productRoutes'); // if you created it

// 1) create app first
const app = express();

// 2) middlewares
app.use(express.json());
app.use(
  cors({
    origin: ['https://fresh-basket-tan.vercel.app', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

// 3) env check + DB connection (same as before)
if (!process.env.MONGODB_URI || !process.env.JWT_SECRET) {
  console.error('Missing MONGODB_URI or JWT_SECRET in .env');
  process.exit(1);
}

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB - Fresh Basket Database'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// 4) basic health route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Fresh Basket API!',
    status: 'Server is running',
    endpoints: {
      signup: 'POST /api/auth/signup',
      login: 'POST /api/auth/login',
      products: 'GET /api/products',
    },
  });
});

// 5) route mounting (AFTER app is created)
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Fresh Basket Server running on port ${PORT}`);
});
