// routes/multipleChoiceQuestionRoutes.js
const express = require('express');
const router = express.Router();
const multipleChoiceQuestionController = require('../controllers/multipleChoiceQuestionController');

// Route to create a Multiple Choice question
router.post('/', multipleChoiceQuestionController.createMultipleChoiceQuestion);

// Route to get a Multiple Choice question by ID
router.get('/:id', multipleChoiceQuestionController.getMultipleChoiceQuestion);

// Route to update a Multiple Choice question by ID
router.put('/:id', multipleChoiceQuestionController.updateMultipleChoiceQuestion);

// Route to delete a Multiple Choice question by ID
router.delete('/:id', multipleChoiceQuestionController.deleteMultipleChoiceQuestion);

module.exports = router;
