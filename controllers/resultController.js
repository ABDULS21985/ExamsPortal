// controllers/resultController.js
const Result = require('../models/result');

async function createResult(req, res) {
  const { userId, examId, score } = req.body;

  try {
    const resultId = await Result.createResult(userId, examId, score);
    res.status(201).json({ message: 'Result created successfully', resultId });
  } catch (error) {
    console.error('Error creating result:', error);
    res.status(500).json({ error: 'An error occurred while creating result' });
  }
}
async function getResultsByUserId(req, res) {
    const { userId } = req.params;
    try {
      const results = await Result.getResultsByUserId(userId);
      res.json(results);
    } catch (error) {
      console.error('Error getting results by user ID:', error);
      res.status(500).json({ error: 'An error occurred while retrieving results' });
    }
  }
  
  async function getResultsByExamId(req, res) {
    const { examId } = req.params;
    try {
      const results = await Result.getResultsByExamId(examId);
      res.json(results);
    } catch (error) {
      console.error('Error getting results by exam ID:', error);
      res.status(500).json({ error: 'An error occurred while retrieving results' });
    }
  }
  
  async function getResultsByUserIdAndExamId(req, res) {
    const { userId, examId } = req.params;
    try {
      const results = await Result.getResultsByUserIdAndExamId(userId, examId);
      res.json(results);
    } catch (error) {
      console.error('Error getting results by user ID and exam ID:', error);
      res.status(500).json({ error: 'An error occurred while retrieving results' });
    }
  }
  
  module.exports = {
    createResult,
    getResultsByUserId,
    getResultsByExamId,
    getResultsByUserIdAndExamId,
  };