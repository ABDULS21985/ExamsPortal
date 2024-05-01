// controllers/trueFalseQuestionController.js
const { pool } = require('../db');

async function createTrueFalseQuestion(req, res) {
  const { content, correctAnswer } = req.body;

  try {
    const client = await pool.connect();

    await client.query('BEGIN');

    // Insert the question into the questions table
    const questionInsertResult = await client.query('INSERT INTO questions (content, type) VALUES ($1, $2) RETURNING id', [content, 'true_false']);
    const questionId = questionInsertResult.rows[0].id;

    // Insert the correct answer into the true_false_questions table
    await client.query('INSERT INTO true_false_questions (question_id, correct_answer) VALUES ($1, $2)', [questionId, correctAnswer]);

    await client.query('COMMIT');
    client.release();

    res.status(201).json({ message: 'True/false question created successfully', questionId });
  } catch (error) {
    console.error('Error creating true/false question:', error);
    res.status(500).json({ error: 'An error occurred while creating true/false question' });
  }
}

async function getTrueFalseQuestion(req, res) {
  const questionId = req.params.id;

  try {
    const client = await pool.connect();

    const result = await client.query('SELECT q.content, t.correct_answer FROM questions q INNER JOIN true_false_questions t ON q.id = t.question_id WHERE q.id = $1', [questionId]);

    client.release();

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'True/false question not found' });
    }

    const question = result.rows[0];
    res.json(question);
  } catch (error) {
    console.error('Error retrieving true/false question:', error);
    res.status(500).json({ error: 'An error occurred while retrieving true/false question' });
  }
}

async function updateTrueFalseQuestion(req, res) {
  const { id } = req.params;
  const { content, correctAnswer } = req.body;

  try {
    const client = await pool.connect();

    await client.query('BEGIN');

    // Update the question content in the questions table
    await client.query('UPDATE questions SET content = $1 WHERE id = $2', [content, id]);

    // Update the correct answer in the true_false_questions table
    await client.query('UPDATE true_false_questions SET correct_answer = $1 WHERE question_id = $2', [correctAnswer, id]);

    await client.query('COMMIT');
    client.release();

    res.json({ message: 'True/false question updated successfully' });
  } catch (error) {
    console.error('Error updating true/false question:', error);
    res.status(500).json({ error: 'An error occurred while updating true/false question' });
  }
}

async function deleteTrueFalseQuestion(req, res) {
  const { id } = req.params;

  try {
    const client = await pool.connect();

    await client.query('BEGIN');

    // Delete the question from the questions table
    await client.query('DELETE FROM questions WHERE id = $1', [id]);

    // Delete the corresponding entry from the true_false_questions table
    await client.query('DELETE FROM true_false_questions WHERE question_id = $1', [id]);

    await client.query('COMMIT');
    client.release();

    res.json({ message: 'True/false question deleted successfully' });
  } catch (error) {
    console.error('Error deleting true/false question:', error);
    res.status(500).json({ error: 'An error occurred while deleting true/false question' });
  }
}

module.exports = { createTrueFalseQuestion, getTrueFalseQuestion, updateTrueFalseQuestion, deleteTrueFalseQuestion };
