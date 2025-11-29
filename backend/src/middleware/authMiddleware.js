const jwt = require('jsonwebtoken');
const User = require('../models/user'); // adjust path: controllers/middleware -> models

exports.protect = async (req, res, next) => {
  try {
    let token;

    // Get token from Authorization header: "Bearer <token>"
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // In generateToken you’re likely using { id: userId } or { userId: userId } – match that key.
    const userId = decoded.id || decoded.userId;

    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'Not authorized, user not found' });
    }
    
    console.log('AUTH USER:', user._id.toString(), user.email, user.role);
    req.user = user;
    return next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ message: 'Not authorized, token failed or expired' });
  }
};
