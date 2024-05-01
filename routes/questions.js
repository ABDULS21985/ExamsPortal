// routes/questions.js
const express = require('express');
const router = express.Router();
const QuestionController = require('../controllers/questionController');

// Routes for question management
router.post('/', QuestionController.createQuestion);
router.put('/:id', QuestionController.updateQuestion);
router.delete('/:id', QuestionController.deleteQuestion);
router.get('/', QuestionController.getQuestions);

module.exports = router;
