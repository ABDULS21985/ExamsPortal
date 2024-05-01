const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const userRoutes = require('./routes/users');
const questionRoutes = require('./routes/questions');
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
// Apply validation middleware to the question routes
app.use('/api/questions', validateRequest, questionRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/users', userRoutes); // Mount user routes

// Middleware for logging errors
app.use((err, req, res, next) => {
    console.error(`[${new Date().toISOString()}] Error: ${err.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  });

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
