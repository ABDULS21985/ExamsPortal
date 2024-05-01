// routes/trueFalseQuestionRoutes.js
const express = require('express');
const router = express.Router();
const trueFalseQuestionController = require('../controllers/trueFalseQuestionController');

// Route to create a True/False question
router.post('/', trueFalseQuestionController.createTrueFalseQuestion);

// Route to get a True/False question by ID
router.get('/:id', trueFalseQuestionController.getTrueFalseQuestion);

// Route to update a True/False question by ID
router.put('/:id', trueFalseQuestionController.updateTrueFalseQuestion);

// Route to delete a True/False question by ID
router.delete('/:id', trueFalseQuestionController.deleteTrueFalseQuestion);

module.exports = router;
