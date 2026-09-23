const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const competitionRoutes = require('./routes/competitionRoutes');
const userRoutes = require('./routes/userRoutes');
const seedDatabase = require('./seedHelper');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/feedants_competition';

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/competitions', competitionRoutes);
app.use('/api/users', userRoutes);

// Root & Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Feedants Competition Service'
  });
});

app.get('/', (req, res) => {
  res.json({
    name: 'Feedants Competition API',
    version: '1.0.0',
    documentation: '/api/competitions/featured'
  });
});

// Connect to MongoDB and start server
mongoose
  .connect(MONGODB_URI)
  .then(async () => {
    console.log(`[MongoDB] Connected successfully to ${MONGODB_URI}`);
    // Auto-seed if needed
    await seedDatabase();
    app.listen(PORT, () => {
      console.log(`[Server] Feedants Competition API running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('[MongoDB] Connection error:', err);
    process.exit(1);
  });
