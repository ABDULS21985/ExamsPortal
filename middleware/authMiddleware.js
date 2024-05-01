// src/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const { pool } = require('../db');

async function authenticate(req, res, next) {
  // Get the token from the request headers
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId; // Attach the decoded userId to the request object
    next(); // Move to the next middleware or route handler
  } catch (error) {
    console.error('Error authenticating user:', error);
    return res.status(401).json({ error: 'Invalid token' });
  }
}

module.exports = { authenticate };
