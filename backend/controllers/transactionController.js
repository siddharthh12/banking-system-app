// controllers/transactionController.js
const db = require('../models/db');

exports.getTransactions = (req, res) => {
  const userId = req.user.id;
  db.query('SELECT * FROM accounts WHERE user_id = ?', [userId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(results);
  });
};

exports.deposit = (req, res) => {
  const userId = req.user.id;
  const { amount } = req.body;
  const type = 'deposit';
  db.query(
    'INSERT INTO accounts (user_id, amount, type) VALUES (?, ?, ?)',
    [userId, amount, type],
    (err) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.json({ message: 'Deposit successful' });
    }
  );
};

exports.withdraw = (req, res) => {
  const userId = req.user.id;
  const { amount } = req.body;
  const type = 'withdraw';

  db.query(
    'SELECT SUM(CASE WHEN type = "deposit" THEN amount ELSE -amount END) AS balance FROM accounts WHERE user_id = ?',
    [userId],
    (err, results) => {
      if (err) return res.status(500).json({ error: 'Database error' });

      const balance = results[0].balance || 0;
      if (amount > balance) {
        return res.status(400).json({ error: 'Insufficient funds' });
      }

      db.query(
        'INSERT INTO accounts (user_id, amount, type) VALUES (?, ?, ?)',
        [userId, amount, type],
        (err) => {
          if (err) return res.status(500).json({ error: 'Database error' });
          res.json({ message: 'Withdrawal successful' });
        }
      );
    }
  );
};
