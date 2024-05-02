const express = require('express');
const bodyParser = require('body-parser');
const errorHandler = require('./middleware/errorHandler'); 
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET;
const userRoutes = require('./routes/users');
const questionRoutes = require('./routes/questions');
const trueFalseQuestionRoutes = require('./routes/trueFalseQuestionRoutes');
const multipleChoiceQuestionRoutes = require('./routes/multipleChoiceQuestionRoutes');
const essayQuestionRoutes = require('./routes/essayQuestionRoutes');
const { connectToDatabase } = require('./db'); // Import the connectToDatabase function

dotenv.config();
const app = express();


// Middleware for logging requests
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });
// Other Middleware
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

// Starting my Portal Backend server
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
