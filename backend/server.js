const app = require('./app');
const dotenv = require('dotenv');
dotenv.config();
require('./models/db'); // connects to DB

// ✅ Export the app (no app.listen)
module.exports = app;
