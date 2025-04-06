const express = require('express');
const dotenv = require('dotenv');
const app = require('./app');
require('./models/db'); // connects to DB

dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
