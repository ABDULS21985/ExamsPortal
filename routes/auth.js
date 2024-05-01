// routes/auth.js

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');

const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user into the database
    await pool.query('INSERT INTO users (username, password, email) VALUES ($1, $2, $3)', [username, hashedPassword, email]);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'An error occurred while registering user' });
  }
});

// User login
router.post('/login', async (req, res) => {
    try {
      const { username, password } = req.body;
  
      // Retrieve user from database
      const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
      if (user.rows.length === 0) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }
  
      // Compare passwords
      const isPasswordValid = await bcrypt.compare(password, user.rows[0].password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }
  
      // Generate JWT token
      const token = jwt.sign({ userId: user.rows[0].id }, 'your_secret_key', { expiresIn: '1h' });
  
      res.json({ token });
    } catch (error) {
      console.error('Error logging in user:', error);
      res.status(500).json({ error: 'An error occurred while logging in user' });
    }
  });
  

module.exports = router;
