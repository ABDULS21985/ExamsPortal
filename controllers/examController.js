// controllers/examController.js
// defined controller functions for creating, retrieving, updating, and deleting exams. 
//These functions interact with the database to perform CRUD operations on exams.

const { pool } = require('../db');

// Create a new exam
async function createExam(req, res) {
  // Extract exam data from the request body
  const { name, duration, instructions, questionSet } = req.body;

  try {
    const client = await pool.connect();
    // Insert the new exam into the database
    const result = await client.query('INSERT INTO exams (name, duration, instructions, question_set) VALUES ($1, $2, $3, $4) RETURNING id', [name, duration, instructions, questionSet]);
    const examId = result.rows[0].id;
    client.release();

    res.status(201).json({ message: 'Exam created successfully', examId });
  } catch (error) {
    console.error('Error creating exam:', error);
    res.status(500).json({ error: 'An error occurred while creating exam' });
  }
}

// Get an exam by ID
async function getExamById(req, res) {
  const examId = req.params.id;

  try {
    const client = await pool.connect();
    // Retrieve the exam from the database based on the exam ID
    const result = await client.query('SELECT * FROM exams WHERE id = $1', [examId]);
    const exam = result.rows[0];
    client.release();

    if (!exam) {
      return res.status(404).json({ error: 'Exam not found' });
    }

    res.json({ exam });
  } catch (error) {
    console.error('Error retrieving exam:', error);
    res.status(500).json({ error: 'An error occurred while retrieving exam' });
  }
}

// Update an existing exam
async function updateExam(req, res) {
  const examId = req.params.id;
  // Extract updated exam data from the request body
  const { name, duration, instructions, questionSet } = req.body;

  try {
    const client = await pool.connect();
    // Update the exam in the database
    await client.query('UPDATE exams SET name = $1, duration = $2, instructions = $3, question_set = $4 WHERE id = $5', [name, duration, instructions, questionSet, examId]);
    client.release();

    res.json({ message: 'Exam updated successfully' });
  } catch (error) {
    console.error('Error updating exam:', error);
    res.status(500).json({ error: 'An error occurred while updating exam' });
  }
}

// Delete an existing exam
async function deleteExam(req, res) {
  const examId = req.params.id;

  try {
    const client = await pool.connect();
    // Delete the exam from the database based on the exam ID
    await client.query('DELETE FROM exams WHERE id = $1', [examId]);
    client.release();

    res.json({ message: 'Exam deleted successfully' });
  } catch (error) {
    console.error('Error deleting exam:', error);
    res.status(500).json({ error: 'An error occurred while deleting exam' });
  }
}

module.exports = { createExam, getExamById, updateExam, deleteExam };
