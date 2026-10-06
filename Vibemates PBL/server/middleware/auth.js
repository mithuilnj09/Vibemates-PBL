const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { getMongoStatus } = require('../config/db');
const memoryStore = require('../utils/memoryStore');

const JWT_SECRET = process.env.JWT_SECRET || 'vibemates_super_secret_jwt_key_2026';

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route. Please log in.',
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (getMongoStatus()) {
      req.user = await User.findById(decoded.id).select('-password');
    } else {
      req.user = memoryStore.users.find(
        (u) => String(u._id) === String(decoded.id)
      );
    }

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Student account associated with this token no longer exists.',
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid authentication token. Please log in again.',
    });
  }
};

module.exports = {
  protect,
  JWT_SECRET,
};
