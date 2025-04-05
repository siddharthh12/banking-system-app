const express = require('express');
const router = express.Router();
const db = require('../models/db'); // ✅ MySQL connection

// ✅ Get customer account details by ID
router.get('/account/:id', (req, res) => {
  const userId = req.params.id;

  const sql = `
   SELECT u.id, u.name, u.email, 
       IFNULL(SUM(t.amount), 0) AS balance
FROM users u
LEFT JOIN transactions t ON u.id = t.account_id
WHERE u.id = ?
GROUP BY u.id
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error('SQL Error:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(results[0]);
  });
});

// ✅ Deposit money
router.post('/deposit', (req, res) => {
  const { userId, amount } = req.body;

  if (!userId || !amount || amount <= 0) {
    return res.status(400).json({ message: 'Invalid input' });
  }

  const insertTransactionSql = `
    INSERT INTO transactions (account_id, type, amount, description)
    VALUES (?, 'deposit', ?, ?)
  `;
  const description = `Deposited ₹${amount}`;
  db.query(insertTransactionSql, [userId, amount, description], (err, result) => {
    if (err) {
      console.error('Transaction Insert Error:', err);
      return res.status(500).json({ message: 'Failed to log deposit' });
    }
    return res.json({ message: `₹${amount} deposited successfully.` });
  });
});

// ✅ Withdraw money
router.post('/withdraw', (req, res) => {
  const { userId, amount } = req.body;

  if (!userId || !amount || amount <= 0) {
    return res.status(400).json({ message: 'Invalid input' });
  }

  const getBalanceSql = `
    SELECT IFNULL(SUM(amount), 0) AS balance
    FROM transactions
    WHERE account_id = ?
  `;

  db.query(getBalanceSql, [userId], (err, results) => {
    if (err) {
      console.error('SQL Error:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    const currentBalance = results[0].balance;
    if (currentBalance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    const withdrawTransaction = `
      INSERT INTO transactions (account_id, type, amount, description)
      VALUES (?, 'withdrawal', ?, ?)
    `;
    const description = `Withdrew ₹${amount}`;
    db.query(withdrawTransaction, [userId, -amount, description], (err, result) => {
      if (err) {
        console.error('Transaction Insert Error:', err);
        return res.status(500).json({ message: 'Failed to log withdrawal' });
      }
      return res.json({ message: `₹${amount} withdrawn successfully.` });
    });
  });
});

// ✅ Transfer money
router.post('/transfer', (req, res) => {
  const { fromUserId, toUserId, amount } = req.body;

  if (!fromUserId || !toUserId || !amount || amount <= 0) {
    return res.status(400).json({ message: 'Invalid input' });
  }

  const getBalanceSql = `
    SELECT IFNULL(SUM(amount), 0) AS balance
    FROM transactions
    WHERE account_id = ?
  `;

  db.query(getBalanceSql, [fromUserId], (err, results) => {
    if (err) {
      console.error('SQL Error:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    const currentBalance = results[0].balance;
    if (currentBalance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    const transferSql = `
      INSERT INTO transactions (account_id, type, amount, description)
      VALUES (?, 'transfer', ?, ?), (?, 'transfer', ?, ?)
    `;

    const fromDescription = `Transferred ₹${amount} to user ID ${toUserId}`;
    const toDescription = `Received ₹${amount} from user ID ${fromUserId}`;

    db.query(
      transferSql,
      [fromUserId, -amount, fromDescription, toUserId, amount, toDescription],
      (err, result) => {
        if (err) {
          console.error('Transaction Insert Error:', err);
          return res.status(500).json({ message: 'Failed to log transfer' });
        }
        return res.json({ message: `₹${amount} transferred successfully.` });
      }
    );
  });
});

// ✅ Transaction history
router.get('/transactions/:id', (req, res) => {
  const userId = req.params.id;

  const sql = `
    SELECT * 
    FROM transactions 
    WHERE account_id = ? 
    ORDER BY created_at DESC
  `;
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error('Transaction history error:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    res.json(results);
  });
});

module.exports = router;
