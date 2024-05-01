// routes/essayQuestionRoutes.js
const express = require('express');
const router = express.Router();
const essayQuestionController = require('../controllers/essayQuestionController');

// Route to create an Essay question
router.post('/', essayQuestionController.createEssayQuestion);

// Route to get an Essay question by ID
router.get('/:id', essayQuestionController.getEssayQuestion);

// Route to update an Essay question by ID
router.put('/:id', essayQuestionController.updateEssayQuestion);

// Route to delete an Essay question by ID
router.delete('/:id', essayQuestionController.deleteEssayQuestion);

module.exports = router;
