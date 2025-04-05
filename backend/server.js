const app = require('./app');
const dotenv = require('dotenv');
dotenv.config();
const db = require('./models/db'); // ✅ only this

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
