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
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'An error occurred while registering user' });
  }
}

// Login user
async function login(req, res) {
  const { email, password } = req.body;

  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    client.release();

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ error: 'An error occurred while logging in user' });
  }
}

// Get user profile
async function getUserProfile(req, res) {
  const userId = req.userId;

  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM users WHERE id = $1', [userId]);
    const user = result.rows[0];
    client.release();

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Remove sensitive data (e.g., password) before sending the response
    const userProfile = {
      id: user.id,
      username: user.username,
      email: user.email,
      // You can include additional user profile data here
    };

    res.json({ userProfile });
  } catch (error) {
    console.error('Error retrieving user profile:', error);
    res.status(500).json({ error: 'An error occurred while retrieving user profile' });
  }
}

module.exports = { register, login, getUserProfile };
