// app.js
const express = require('express');
const cors = require('cors');
const app = express();
const customerRoutes = require('./routes/customerRoutes');
const bankerRoutes = require('./routes/bankerRoutes');

app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.send('Backend API running on Vercel 🚀');
  });

// Routes
const authRoutes = require('./routes/authRoutes');
app.use('/api', authRoutes); // register will be /api/register
app.use('/api/customer', customerRoutes);
app.use('/api/banker', bankerRoutes);
app.use("/api/banker", bankerRoutes);

module.exports = app;
