// controllers/userController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { pool } = require('../db');

// Register a new user
async function register(req, res) {
  const { username, email, password } = req.body;

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const client = await pool.connect();
    const result = await client.query('INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id', [username, email, hashedPassword]);
    const userId = result.rows[0].id;
    client.release();
    
    // Generate JWT token
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ message: 'User registered successfully', token });
  } catch (error) {
    // Check if the error is due to a duplicate username
    if (error.code === '23505' && error.constraint === 'users_username_key') {
      return res.status(409).json({ error: 'Username already exists. Please choose a different username.' });
    }
    
    if (error.code === '23505' && error.constraint === 'users_email_key') {
      return res.status(409).json({ error: 'Email already exists. Please use a different email address.' });
    }
    

    console.error('Error registering user:', error);
    res.status(500).json({ error: 'An error occurred while registering user' });
  }
}

// Login user
async function login(req, res) {
  // Implementation remains the same
}

// Get user profile
async function getUserProfile(req, res) {
  // Implementation remains the same
}

module.exports = { register, login, getUserProfile };
