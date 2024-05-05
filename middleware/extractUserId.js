const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET;

function extractUserId(req, res, next) {
    // Get the JWT token from the request headers
    const token = req.headers.authorization;

    // Check if token exists
    if (!token) {
        return res.status(401).json({ message: 'Authorization token is missing' });
    }

    try {
        // Verify and decode the JWT token to extract the user ID
        const decoded = jwt.verify(token, secretKey);

        // Add the user ID to the request object
        req.userId = decoded.userId;

        // Call the next middleware/route handler
        next();
    } catch (error) {
        console.error('Error extracting user ID from token:', error);
        return res.status(401).json({ message: 'Invalid authorization token' });
    }
}

module.exports = extractUserId;
