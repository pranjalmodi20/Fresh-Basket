const jwt = require('jsonwebtoken');
const User = require('./src/models/User');

exports.protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res
        .status(401)
        .json({ message: 'Not authorized, no token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id || decoded.userId;

    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res
        .status(401)
        .json({ message: 'Not authorized, user not found' });
    }

    // helpful debug
    console.log(
      'AUTH USER:',
      user._id.toString(),
      user.email,
      user.role
    );

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({
      message: 'Not authorized, token failed or expired',
    });
  }
};
