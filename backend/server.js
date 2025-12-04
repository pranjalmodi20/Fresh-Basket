const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import Routes
const cartRoutes = require('./src/routes/cartRoutes');
const authRoutes = require('./src/routes/authRoutes');
const productRoutes = require('./src/routes/productRoutes');
const wishlistRoutes = require('./src/routes/wishlistRoutes');

const app = express();

// -------------------- Middleware --------------------
app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://fresh-basket-tan.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

// -------------------- Env Validation --------------------
if (!process.env.MONGODB_URI) {
  console.error("❌ ERROR: MONGODB_URI missing in .env");
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error("❌ ERROR: JWT_SECRET missing in .env");
  process.exit(1);
}

// -------------------- Database Connection --------------------
(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB - Fresh Basket Database");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
})();

// -------------------- Health Check Route --------------------
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Fresh Basket API!",
    status: "Server is running",
  });
});

// -------------------- API Routes --------------------
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);

// -------------------- Start Server --------------------
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Fresh Basket Server running on port ${PORT}`);
});
