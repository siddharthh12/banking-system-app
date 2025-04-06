const express = require('express');
const cors = require('cors');
const app = express();

const customerRoutes = require('./routes/customerRoutes');
const bankerRoutes = require('./routes/bankerRoutes');
const authRoutes = require('./routes/authRoutes');

// ✅ Configure CORS to allow localhost frontend
app.use(cors({
  origin: 'http://localhost:5173', // your frontend URL
  credentials: true,               // allows cookies if you use them
}));

app.use(express.json());

// Health Check Route
app.get('/', (req, res) => {
  res.send('Backend API running locally 🚀');
});

// Routes
app.use('/api', authRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/banker', bankerRoutes);

module.exports = app;
