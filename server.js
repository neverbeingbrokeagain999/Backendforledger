require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initializeDatabase } = require('./db');
const ledgerRoutes = require('./routes/ledgerRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize database
initializeDatabase()
  .then(success => {
    if (!success) {
      console.error('Failed to initialize database. Server will continue, but database operations may fail.');
    }
  })
  .catch(err => {
    console.error('Error during database initialization:', err);
  });

// Test route
app.get('/api/test', (req, res) => {
  console.log('Test endpoint hit');
  res.json({ message: 'API is working!' });
});

// Routes
app.use('/api/ledger', ledgerRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Ledger Master API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
