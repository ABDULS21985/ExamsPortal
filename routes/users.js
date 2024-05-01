// src/routes/users.js
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const { authenticate } = require('../middleware/authMiddleware');

// Routes
router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.get('/profile', authenticate, UserController.getUserProfile);

module.exports = router;
