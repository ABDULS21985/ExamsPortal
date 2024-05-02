// middleware/errorHandler.js

// Error handling middleware
function errorHandler(err, req, res, next) {
    console.error('An error occurred:', err);
  
    // Set a default status code
    let statusCode = 500;
    
    // Customize error response based on the error type
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
      // Handle JSON parsing error
      return res.status(400).json({ error: 'Invalid JSON payload' });
    }
  
    // Return a generic error response
    res.status(statusCode).json({ error: 'Internal Server Error' });
  }
  
  module.exports = errorHandler;
  