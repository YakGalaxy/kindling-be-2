const jwt = require("jsonwebtoken");

// Middleware to check if the user is authenticated
const isAuthenticated = (req, res, next) => {
  // Extract token from the Authorization header
  const token = req.headers.authorization?.split(" ")[1]; // "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  // Verify the token
  jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    // Attach the decoded payload to the request object
    req.payload = decoded;

    // Proceed to the next middleware or route handler
    next();
  });
};

module.exports = { isAuthenticated };
