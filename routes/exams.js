// routes/exams.js - In this file, i've defined routes for creating, updating, deleting, 
//and retrieving exams.
//These routes are protected by the authenticate middleware to ensure that only 
//authenticated users can access them.
const express = require('express');
const router = express.Router();
const ExamController = require('../controllers/examController');
const { authenticate } = require('../middleware/authMiddleware');

// Routes for exam management
router.post('/', authenticate, ExamController.createExam);
router.get('/:id', authenticate, ExamController.getExamById);
router.put('/:id', authenticate, ExamController.updateExam);
router.delete('/:id', authenticate, ExamController.deleteExam);

module.exports = router;
