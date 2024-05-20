// models/result.js
const { pool } = require('../db');

class Result {
  static async createResult(userId, examId, score) {
    try {
      const client = await pool.connect();
      await client.query('BEGIN');

      const resultInsertResult = await client.query(
        'INSERT INTO results (user_id, exam_id, score) VALUES ($1, $2, $3) RETURNING id',
        [userId, examId, score]
      );

      const resultId = resultInsertResult.rows[0].id;

      await client.query('COMMIT');
      client.release();

      return resultId;
    } catch (error) {
      console.error('Error creating result:', error);
      await client.query('ROLLBACK');
      throw error;
    }
  }
    // Method to get results by user ID
    static async getResultsByUserId(userId) {
        try {
          const client = await pool.connect();
          const result = await client.query('SELECT * FROM results WHERE user_id = $1', [userId]);
          client.release();
          return result.rows;
        } catch (error) {
          console.error('Error retrieving results by user ID:', error);
          throw error;
        }
      }
      // Method to get results by exam ID
  static async getResultsByExamId(examId) {
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT * FROM results WHERE exam_id = $1', [examId]);
      client.release();
      return result.rows;
    } catch (error) {
      console.error('Error retrieving results by exam ID:', error);
      throw error;
    }
  }

  // Method to get results by user ID and exam ID
  static async getResultsByUserIdAndExamId(userId, examId) {
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT * FROM results WHERE user_id = $1 AND exam_id = $2', [userId, examId]);
      client.release();
      return result.rows;
    } catch (error) {
      console.error('Error retrieving results by user ID and exam ID:', error);
      throw error;
    }
  }
}

module.exports = Result;
