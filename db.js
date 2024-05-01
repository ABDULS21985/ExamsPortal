const { Pool } = require('pg');

// Database configuration
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'exam_portal',
    password: 'Secured$321',
    port: 5432,
});

// Function to establish database connection
async function connectToDatabase() {
    try {
        const client = await pool.connect();
        console.log('Successfully connected to the Exams Portal database');
        client.release();
    } catch (error) {
        console.error('Error connecting to the ExamsPortal database:', error);
    }
}

module.exports = { pool, connectToDatabase };
