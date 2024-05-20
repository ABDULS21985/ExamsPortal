const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const secretKey = process.env.JWT_SECRET;
const errorHandler = require('./middleware/errorHandler'); 
const userRoutes = require('./routes/users');
const questionRoutes = require('./routes/questions');
const trueFalseQuestionRoutes = require('./routes/trueFalseQuestionRoutes');
const multipleChoiceQuestionRoutes = require('./routes/multipleChoiceQuestionRoutes');
const essayQuestionRoutes = require('./routes/essayQuestionRoutes');
const { connectToDatabase } = require('./db'); 
const extractUserId = require('./middleware/extractUserId');


dotenv.config();
const app = express();


// Middleware for logging requests

const corsOptions = {
  origin: 'https://localhost:3000', // Replace with my frontend domain
  optionsSuccessStatus: 200, // Some legacy browsers choke on 204 for preflight requests
  methods: 'GET, POST, PUT, DELETE', // Allowed request methods
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'] // Allowed headers
};

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });

// Other Middleware
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to the database
connectToDatabase(); // Call the connectToDatabase function

// Applying my error handling middleware
app.use(errorHandler);

// Custom Validation Middleware
function validateRequest(req, res, next) {
  
  //Check if required fields are present in the request body
  if (!req.body.content || !req.body.type) {
    return res.status(400).json({ error: 'Content and type are required' });
  }
  // If validation passes, proceed to the next middleware/route handler
  next();
}

// Routes
// Applying validation middleware to the question routes
app.use('/api/questions', validateRequest, questionRoutes);

// Using True/False question routes
app.use('/api/true-false-questions', trueFalseQuestionRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/users', userRoutes); // Mount user routes

// Using Multiple Choice question routes
app.use('/api/multiple-choice-questions', multipleChoiceQuestionRoutes);

// Using Essay question routes
app.use('/api/essay-questions', essayQuestionRoutes);


// Middleware for logging errors
app.use((err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] Error: ${err.message}`);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Here i am Applying the middleware before the route handler
app.get('/api/users/profile', extractUserId, async (req, res) => {
  try {
      const userId = req.userId;

      // Fetch user profile from PostgreSQL
      const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);

      if (result.rows.length === 0) {
          return res.status(404).json({ message: 'User profile not found' });
      }

      // Return user profile as JSON response
      res.json(result.rows[0]);
  } catch (error) {
      console.error('Error fetching user profile:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});


// Starting my Portal Backend server
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Online Exam Portal Server is running on port ${PORT}`);
});
