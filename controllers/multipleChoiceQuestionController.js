const { pool } = require('../db');

// Create Multiple-Choice Question
async function createMultipleChoiceQuestion(req, res) {
  const { content, options, correctAnswers } = req.body;

  // Basic validation
  if (!content || !Array.isArray(options) || !Array.isArray(correctAnswers)) {
    return res.status(400).json({ error: 'Invalid data format' });
  }

  console.log('Received options:', options);
  console.log('Received correct answers:', correctAnswers);

  try {
    const client = await pool.connect();
    await client.query('BEGIN');

    // Insert the question into the questions table
    const questionInsertResult = await client.query('INSERT INTO questions (content, type) VALUES ($1, $2) RETURNING id', [content, 'multiple_choice']);
    const questionId = questionInsertResult.rows[0].id;

    // Insert options and correct answers into the multiple_choice_questions table
    await client.query('INSERT INTO multiple_choice_questions (question_id, options, correct_answers) VALUES ($1, $2, $3)', [questionId, JSON.stringify(options), JSON.stringify(correctAnswers)]);

    await client.query('COMMIT');
    client.release();

    res.status(201).json({ message: 'Multiple-choice question created successfully', questionId });
  } catch (error) {
    console.error('Error creating multiple-choice question:', error);
    res.status(500).json({ error: 'An error occurred while creating multiple-choice question' });
  }
}

// Get Multiple-Choice Question
async function getMultipleChoiceQuestion(req, res) {
  const questionId = req.params.id;

  try {
    const client = await pool.connect();
    const result = await client.query('SELECT q.content, m.options, m.correct_answers FROM questions q INNER JOIN multiple_choice_questions m ON q.id = m.question_id WHERE q.id = $1', [questionId]);

    client.release();

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Multiple-choice question not found' });
    }

    const question = result.rows[0];
    // Parse options and correct_answers back to arrays
    question.options = JSON.parse(question.options);
    question.correct_answers = JSON.parse(question.correct_answers);

    res.json(question);
  } catch (error) {
    console.error('Error retrieving multiple-choice question:', error);
    res.status(500).json({ error: 'An error occurred while retrieving multiple-choice question' });
  }
}

// Update Multiple-Choice Question
async function updateMultipleChoiceQuestion(req, res) {
  const { id } = req.params;
  const { content, options, correctAnswers } = req.body;

  // Basic validation
  if (!content || !Array.isArray(options) || !Array.isArray(correctAnswers)) {
    return res.status(400).json({ error: 'Invalid data format' });
  }

  try {
    const client = await pool.connect();
    await client.query('BEGIN');

    // Update the question content in the questions table
    await client.query('UPDATE questions SET content = $1 WHERE id = $2', [content, id]);

    // Update options and correct answers in the multiple_choice_questions table
    await client.query('UPDATE multiple_choice_questions SET options = $1, correct_answers = $2 WHERE question_id = $3', [JSON.stringify(options), JSON.stringify(correctAnswers), id]);

    await client.query('COMMIT');
    client.release();

    res.json({ message: 'Multiple-choice question updated successfully' });
  } catch (error) {
    console.error('Error updating multiple-choice question:', error);
    res.status(500).json({ error: 'An error occurred while updating multiple-choice question' });
  }
}

// Delete Multiple-Choice Question
async function deleteMultipleChoiceQuestion(req, res) {
  const { id } = req.params;

  try {
    const client = await pool.connect();
    await client.query('BEGIN');

    // Delete the question from the questions table
    await client.query('DELETE FROM questions WHERE id = $1', [id]);

    // Delete corresponding entry from the multiple_choice_questions table
    await client.query('DELETE FROM multiple_choice_questions WHERE question_id = $1', [id]);

    await client.query('COMMIT');
    client.release();

    res.json({ message: 'Multiple-choice question deleted successfully' });
  } catch (error) {
    console.error('Error deleting multiple-choice question:', error);
    res.status(500).json({ error: 'An error occurred while deleting multiple-choice question' });
  }
}

module.exports = { createMultipleChoiceQuestion, getMultipleChoiceQuestion, updateMultipleChoiceQuestion, deleteMultipleChoiceQuestion };
