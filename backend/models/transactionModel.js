const db = require('./db');

exports.insertTransaction = (userId, amount, type, callback) => {
  db.query('INSERT INTO accounts (user_id, amount, type) VALUES (?, ?, ?)', [userId, amount, type], callback);
};

exports.getUserTransactions = (userId, callback) => {
  db.query('SELECT * FROM accounts WHERE user_id = ?', [userId], callback);
};

exports.getUserBalance = (userId, callback) => {
  db.query(
    'SELECT SUM(CASE WHEN type = "deposit" THEN amount ELSE -amount END) AS balance FROM accounts WHERE user_id = ?',
    [userId], callback
  );
};
