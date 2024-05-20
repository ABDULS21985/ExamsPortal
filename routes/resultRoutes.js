// routes/resultRoutes.js
const express = require('express');
const router = express.Router();
const resultController = require('../controllers/resultController');

// Route to create a result
router.post('/', resultController.createResult);

// Route to get results by user ID
router.get('/user/:userId', resultController.getResultsByUserId);

// Route to get results by exam ID
router.get('/exam/:examId', resultController.getResultsByExamId);

// Route to get results by user ID and exam ID
router.get('/user/:userId/exam/:examId', resultController.getResultsByUserIdAndExamId);

module.exports = router;
