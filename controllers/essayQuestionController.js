// controllers/essayQuestionController.js
const { pool } = require('../db');

async function createEssayQuestion(req, res) {
  const { content, answer } = req.body;

  try {
    const client = await pool.connect();

    await client.query('BEGIN');

    // Insert the question into the questions table
    const questionInsertResult = await client.query('INSERT INTO questions (content, type) VALUES ($1, $2) RETURNING id', [content, 'essay']);
    const questionId = questionInsertResult.rows[0].id;

    // Insert the answer into the essay_questions table
    await client.query('INSERT INTO essay_questions (question_id, answer) VALUES ($1, $2)', [questionId, answer]);

    await client.query('COMMIT');
    client.release();

    res.status(201).json({ message: 'Essay question created successfully', questionId });
  } catch (error) {
    console.error('Error creating essay question:', error);
    res.status(500).json({ error: 'An error occurred while creating essay question' });
  }
}

async function getEssayQuestion(req, res) {
  const questionId = req.params.id;

  try {
    const client = await pool.connect();

    const result = await client.query('SELECT q.content, e.answer FROM questions q INNER JOIN essay_questions e ON q.id = e.question_id WHERE q.id = $1', [questionId]);

    client.release();

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Essay question not found' });
    }

    const question = result.rows[0];
    res.json(question);
  } catch (error) {
    console.error('Error retrieving essay question:', error);
    res.status(500).json({ error: 'An error occurred while retrieving essay question' });
  }
}

async function updateEssayQuestion(req, res) {
  const { id } = req.params;
  const { content, answer } = req.body;

  try {
    const client = await pool.connect();

    await client.query('BEGIN');

    // Update the question content in the questions table
    await client.query('UPDATE questions SET content = $1 WHERE id = $2', [content, id]);

    // Update the answer in the essay_questions table
    await client.query('UPDATE essay_questions SET answer = $1 WHERE question_id = $2', [answer, id]);

    await client.query('COMMIT');
    client.release();

    res.json({ message: 'Essay question updated successfully' });
  } catch (error) {
    console.error('Error updating essay question:', error);
    res.status(500).json({ error: 'An error occurred while updating essay question' });
  }
}

async function deleteEssayQuestion(req, res) {
  const { id } = req.params;

  try {
    const client = await pool.connect();

    await client.query('BEGIN');

    // Delete the question from the questions table
    await client.query('DELETE FROM questions WHERE id = $1', [id]);

    // Delete corresponding entry from the essay_questions table
    await client.query('DELETE FROM essay_questions WHERE question_id = $1', [id]);

    await client.query('COMMIT');
    client.release();

    res.json({ message: 'Essay question deleted successfully' });
  } catch (error) {
    console.error('Error deleting essay question:', error);
    res.status(500).json({ error: 'An error occurred while deleting essay question' });
  }
}

module.exports = { createEssayQuestion, getEssayQuestion, updateEssayQuestion, deleteEssayQuestion };
