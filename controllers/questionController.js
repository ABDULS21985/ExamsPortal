// controllers/questionController.js
const { pool } = require('../db');

// Create a new question
async function createQuestion(req, res) {
  // Extract question data from the request body
  const { content, type, options, correctAnswers } = req.body;

    // Log the received data
  console.log('Received data:');
  console.log('Content:', content);
  console.log('Type:', type);
  console.log('Options:', options);
  console.log('Correct Answers:', correctAnswers);

  try {
    const client = await pool.connect();
    await client.query('BEGIN');

    // Insert the question into the questions table
    const questionInsertResult = await client.query('INSERT INTO questions (content, type) VALUES ($1, $2) RETURNING id', [content, type]);
    const questionId = questionInsertResult.rows[0].id;

    // Insert question details into the appropriate question type table
    switch (type) {
      case 'multiple_choice':
        const optionsJson = JSON.stringify(options); // Convert options to JSON string
        const correctAnswersJson = JSON.stringify(correctAnswers); // Convert correctAnswers to JSON string
        
        // Insert data into the database
        await client.query('INSERT INTO multiple_choice_questions (question_id, options, correct_answers) VALUES ($1, $2, $3)', [questionId, options, correctAnswers]);
        break;
      // Add cases for other question types if needed

      default:
        await client.query('ROLLBACK');
        return res.status(400).json({ error: 'Invalid question type' });
    }
// Commit the transaction and release the client
    await client.query('COMMIT');
    client.release();
// Send success response to the client
    res.status(201).json({ message: 'Question created successfully', questionId });
  } catch (error) {
    console.error('Error creating question:', error);
    res.status(500).json({ error: 'An error occurred while creating question' });
  }
}

// Update an existing question
async function updateQuestion(req, res) {
  const { id } = req.params;
  const { content, type, options, correctAnswers } = req.body;

  try {
    const client = await pool.connect();
    await client.query('BEGIN');

    // Update the question in the questions table
    await client.query('UPDATE questions SET content = $1, type = $2 WHERE id = $3', [content, type, id]);

    // Update question details in the appropriate question type table
    switch (type) {
      case 'multiple_choice':
        await client.query('UPDATE multiple_choice_questions SET options = $1, correct_answers = $2 WHERE question_id = $3', [options, correctAnswers, id]);
        break;
      // Add cases for other question types if needed

      default:
        await client.query('ROLLBACK');
        return res.status(400).json({ error: 'Invalid question type' });
    }

    await client.query('COMMIT');
    client.release();

    res.json({ message: 'Question updated successfully' });
  } catch (error) {
    console.error('Error updating question:', error);
    res.status(500).json({ error: 'An error occurred while updating question' });
  }
}

// Delete an existing question
async function deleteQuestion(req, res) {
  const { id } = req.params;

  try {
    const client = await pool.connect();
    await client.query('BEGIN');

    // Delete the question from the questions table
    await client.query('DELETE FROM questions WHERE id = $1', [id]);

    // Delete question details from the appropriate question type table (if applicable)

    await client.query('COMMIT');
    client.release();

    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    console.error('Error deleting question:', error);
    res.status(500).json({ error: 'An error occurred while deleting question' });
  }
}

// Retrieve all questions
async function getQuestions(req, res) {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM questions');
    client.release();

    const questions = result.rows;
    res.json(questions);
  } catch (error) {
    console.error('Error retrieving questions:', error);
    res.status(500).json({ error: 'An error occurred while retrieving questions' });
  }
}

module.exports = { createQuestion, updateQuestion, deleteQuestion, getQuestions };
