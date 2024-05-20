const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function checkTablesExist() {
  const query = `
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name IN ('questions', 'multiple_choice_questions');
  `;

  try {
    const client = await pool.connect();
    const result = await client.query(query);
    client.release();

    const tables = result.rows.map(row => row.table_name);
    if (tables.includes('questions') && tables.includes('multiple_choice_questions')) {
      console.log('Both tables exist');
    } else {
      console.log('One or both tables do not exist');
    }
  } catch (error) {
    console.error('Error checking tables:', error);
  }
}

checkTablesExist();
