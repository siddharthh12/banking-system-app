const bcrypt = require('bcryptjs');
const express = require('express');
const router = express.Router();
const db = require('../models/db');
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'secret_key'; // Use env variable in production

// ✅ Register a new user (Customer Only)
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  if (role !== 'customer') {
    return res.status(400).json({ message: 'Only customers can register. Bankers must log in with a fixed ID.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, role],
      (err, result) => {
        if (err) {
          console.error("Registration error:", err);
          return res.status(500).json({ message: "Registration failed." });
        }

        const userId = result.insertId;

        db.query(
          "INSERT INTO accounts (user_id, type, amount) VALUES (?, 'Deposit', 0)",
          [userId],
          (err2) => {
            if (err2) {
              console.error("Account creation error:", err2);
              return res.status(500).json({ message: "User created, but account setup failed." });
            }

            return res.status(201).json({ message: "Customer registered successfully." });
          }
        );
      }
    );
  } catch (err) {
    console.error("Hashing error:", err);
    res.status(500).json({ message: "Something went wrong." });
  }
});

// ✅ Login for Customers
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM users WHERE email = ? AND role = ?';
  db.query(query, [email, 'customer'], async (err, results) => {
    if (err) {
      console.error('Error during login:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({ message: 'Login successful', user });
  });
});

// ✅ Banker Login with hardcoded credentials
router.post('/login/banker', (req, res) => {
  const { email, password } = req.body;
  console.log('Received:', { email, password }); // Add this line

  if (email === 'banker@gmail.com' && password === '123456') {
    const token = jwt.sign(
      { id: 1, role: 'banker', email },
      process.env.JWT_SECRET || 'secret_key',
      { expiresIn: '1h' }
    );
    return res.json({ token });
  }
  return res.status(401).json({ message: 'Invalid banker credentials' });
});

module.exports = router;
