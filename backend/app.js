const express = require('express');
const cors = require('cors');
const app = express();

const customerRoutes = require('./routes/customerRoutes');
const bankerRoutes = require('./routes/bankerRoutes');
const authRoutes = require('./routes/authRoutes');

// ✅ Allow both local and deployed frontend URLs
const allowedOrigins = [
  'http://localhost:5173',
  'https://banking-system-app.netlify.app'
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(express.json());

// Health Check Route
app.get('/', (req, res) => {
  res.send('Backend API running 🚀');
});

// Routes
app.use('/api', authRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/banker', bankerRoutes);

module.exports = app;
