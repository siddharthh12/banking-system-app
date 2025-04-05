// controllers/authController.js
const bcrypt = require('bcryptjs');
const db = require('../models/db');

exports.registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const sql = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';
  db.query(sql, [name, email, hashedPassword, role], (err, result) => {
    if (err) {
      console.error('Error inserting user:', err);
      return res.status(500).json({ message: 'Server error.' });
    }
    res.status(201).json({ message: 'User registered successfully.' });
  });
};
