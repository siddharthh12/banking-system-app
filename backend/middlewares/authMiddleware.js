const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(403).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1]; // Bearer <token>

  jwt.verify(token, process.env.JWT_SECRET || 'secret_key', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }

    req.user = decoded;
    next();
  });
};

// For protecting banker-only routes

const verifyBanker = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("Auth header:", authHeader ? "Present" : "Missing");

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(403).json({ message: 'Access denied: No token provided' });
  }

  const token = authHeader.split(' ')[1];
  console.log("Token extracted from header:", token ? "Present" : "Missing");

  try {
    console.log("JWT Secret:", process.env.JWT_SECRET ? "Present" : "Missing");
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');
    console.log("Decoded token:", decoded);
    console.log("User role:", decoded.role);
    
    if (decoded.role !== 'banker') {
      console.log("Role check failed: Not a banker");
      return res.status(403).json({ message: 'Access denied: Not a banker' });
    }
    
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Token verification error:", err.message);
    return res.status(403).json({ message: 'Access denied: Invalid token' });
  }
};

module.exports = {
  verifyToken,
  verifyBanker,
};
