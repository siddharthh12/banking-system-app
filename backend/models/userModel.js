const db = require('./db');

const findUserByEmail = (email, callback) => {
  const query = 'SELECT * FROM Users WHERE email = ?';
  db.query(query, [email], callback);
};

module.exports = {
  findUserByEmail,
};
