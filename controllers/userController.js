// controllers/userController.js
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const { pool } = require('../db');
const crypto = require('crypto');
const transporter = require('../nodemailerConfig');
const nodemailer = require('nodemailer');


// Register a new user
async function register(req, res) {
  const { username, email, password } = req.body;

    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

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
  const userId = req.user.userId; // Assuming you have userId stored in the request object

  try {
    const client = await pool.connect();
    const result = await client.query('SELECT id, username, email FROM users WHERE id = $1', [userId]);
    const user = result.rows[0];
    client.release();

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ userProfile: user });
  } catch (error) {
    console.error('Error retrieving user profile:', error);
    res.status(500).json({ error: 'An error occurred while retrieving user profile' });
  }
}

// Password reset request handler
async function resetPasswordRequest(req, res) {
  const { email } = req.body;

  // Generate a unique reset token
  const resetToken = crypto.randomBytes(20).toString('hex');

  try {
    const client = await pool.connect();
    // Store the reset token in the database along with the user's email and an expiration timestamp
    const result = await client.query('INSERT INTO password_reset_tokens (email, token, expires_at) VALUES ($1, $2, NOW() + INTERVAL \'1 hour\')', [email, resetToken]);
    client.release();
    
    // Send reset instructions to the user's email
    async function resetPasswordRequest(req, res) {
      const { email } = req.body;
      const resetToken = crypto.randomBytes(20).toString('hex');
    
      try {
        const client = await pool.connect();
        const result = await client.query('INSERT INTO password_reset_tokens (email, token, expires_at) VALUES ($1, $2, NOW() + INTERVAL \'1 hour\')', [email, resetToken]);
        client.release();
    
        const mailOptions = {
          from: 'your_email@example.com',
          to: email,
          subject: 'Password Reset Instructions',
          text: `Please click on the following link to reset your password: http://example.com/reset-password?token=${resetToken}`,
        };
    
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error('Error sending email:', error);
            res.status(500).json({ error: 'An error occurred while sending password reset instructions' });
          } else {
            console.log('Email sent:', info.response);
            res.status(200).json({ message: 'Password reset instructions sent successfully' });
          }
        });
      } catch (error) {
        console.error('Error sending password reset instructions:', error);
        res.status(500).json({ error: 'An error occurred while sending password reset instructions' });
      }
    }
    
    
    res.status(200).json({ message: 'Password reset instructions sent successfully' });
  } catch (error) {
    console.error('Error sending password reset instructions:', error);
    res.status(500).json({ error: 'An error occurred while sending password reset instructions' });
  }
}

// Password reset request handler
async function resetPasswordRequest(req, res) {
  const { email } = req.body;

  // Generate a unique reset token
  const resetToken = crypto.randomBytes(20).toString('hex');

  try {
    const client = await pool.connect();
    // Get the user ID associated with the provided email
    const userResult = await client.query('SELECT id FROM users WHERE email = $1', [email]);
    const userId = userResult.rows[0].id;
    // Store the reset token in the database along with the user's email and an expiration timestamp
    const result = await client.query('INSERT INTO password_reset_tokens (user_id, email, token, expires_at) VALUES ($1, $2, $3, NOW() + INTERVAL \'1 hour\')', [userId, email, resetToken]);
    client.release();

    // Send reset instructions to the user's email
    sendResetInstructions(email, resetToken);

    res.status(200).json({ message: 'Password reset instructions sent successfully' });
  } catch (error) {
    console.error('Error sending password reset instructions:', error);
    res.status(500).json({ error: 'An error occurred while sending password reset instructions' });
  }
}


// Send reset instructions to the user's email
function sendResetInstructions(email, resetToken) {
  const transporter = nodemailer.createTransport({
    // Configure nodemailer transporter
  });

  const mailOptions = {
    from: 'your_email@example.com',
    to: email,
    subject: 'Password Reset Instructions',
    text: `Please click on the following link to reset your password: http://example.com/reset-password?token=${resetToken}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
}

// Password reset handler
async function resetPassword(req, res) {
  const { email, newPassword, resetToken } = req.body;

  try {
    const client = await pool.connect();
    // Check if the reset token is valid and has not expired
    const result = await client.query('SELECT * FROM password_reset_tokens WHERE email = $1 AND token = $2 AND expires_at > NOW()', [email, resetToken]);
    const tokenValid = result.rows.length > 0;

    if (!tokenValid) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    // Update the user's password in the database
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await client.query('UPDATE users SET password = $1 WHERE email = $2', [hashedPassword, email]);

    // Delete the reset token from the database
    await client.query('DELETE FROM password_reset_tokens WHERE email = $1 AND token = $2', [email, resetToken]);

    client.release();
    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ error: 'An error occurred while resetting password' });
  }
}
module.exports = { register, login, resetPasswordRequest, resetPassword, getUserProfile, };
