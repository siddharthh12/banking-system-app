const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

exports.register = (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 8);

  userModel.createUser(name, email, hashedPassword, (err) => {
    if (err) return res.status(500).json({ error: 'Registration failed' });
    res.json({ message: 'User registered successfully' });
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  userModel.findUserByEmail(email, (err, results) => {
    if (err || results.length === 0) return res.status(400).json({ error: 'User not found' });

    const user = results[0];
    const isValid = bcrypt.compareSync(password, user.password);

    if (!isValid) return res.status(401).json({ error: 'Invalid password' });

    const token = jwt.sign({ id: user.id }, 'secretkey', { expiresIn: '1d' });
    res.json({ token, user: { id: user.id, name: user.name } });
  });
};

exports.bankerLogin = (req, res) => {
  const { username, password } = req.body;

  // Hardcoded banker login
  if (username === 'banker' && password === 'admin123') {
    const token = jwt.sign({ role: 'banker' }, 'secretkey', { expiresIn: '1d' });
    return res.json({ token });
  }

  res.status(401).json({ error: 'Invalid banker credentials' });
};

