// routes/bankerRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../models/db');
const { verifyBanker } = require('../middlewares/authMiddleware');
const authenticateBanker = require("../middlewares/authenticateBanker");

// routes/bankerRoutes.js
router.get('/customers',  (req, res) => {
  console.log("🔍 [GET] /api/banker/customers");

  const sql = `
    SELECT 
      u.id AS id,
      u.name, 
      u.email, 
      IFNULL(SUM(t.amount), 0) AS balance
    FROM users u
    LEFT JOIN accounts a ON u.id = a.user_id
    LEFT JOIN transactions t ON a.id = t.account_id
    GROUP BY u.id, u.name, u.email
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ SQL Error:", err);
      return res.status(500).json({ message: "Database error", error: err.message });
    }

    console.log("✅ Customers fetched:", results);
    res.json(results);
  });
});



// ✅ Get all transactions
router.get('/transactions', verifyBanker, (req, res) => {
  const sql = `
    SELECT 
      t.id AS transaction_id,
      t.account_id,
      u.name AS customer_name,
      t.type,
      t.amount,
      t.description,
      DATE_FORMAT(t.timestamp, '%Y-%m-%d %H:%i:%s') AS timestamp
    FROM transactions t
    JOIN accounts a ON t.account_id = a.id
    JOIN users u ON a.user_id = u.id
    ORDER BY t.timestamp DESC
    LIMIT 100
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching transactions:', err);
      return res.status(500).json({ message: 'Failed to retrieve transactions' });
    }
    res.json(results);
  });
});

// GET /api/banker/customer-transactions/:id
router.get("/customer-transactions/:id", authenticateBanker, (req, res) => {
  const customerId = req.params.id;

  const query = `
    SELECT * FROM transactions
    WHERE account_id = ?
    ORDER BY timestamp DESC
  `;

  db.query(query, [customerId], (err, results) => {
    if (err) {
      console.error("Error fetching transactions:", err);
      return res.status(500).json({ error: "Database error" });
    }

    res.json(results);
  });
});



module.exports = router;
