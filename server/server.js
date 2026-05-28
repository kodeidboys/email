require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/database');
const { getConnectionStatus } = require('./config/database');

// Import routes
const authRoutes = require('./routes/authRoutes');
const imageRoutes = require('./routes/imageRoutes');

// Initialize app
const app = express();

// Connect to database (non-blocking)
connectDB();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── TELEGRAM BOT ───────────────────────────────
if (process.env.BOT_TOKEN) {
  try {
    const { webhookHandler } = require('../bot');
    app.use('/bot', express.raw({ type: 'application/json' }), webhookHandler);
    console.log('🤖 KodeID Store Bot attached to /bot');
  } catch (e) {
    console.log('⚠️  Bot not loaded:', e.message);
  }
} else {
  console.log('ℹ️  No BOT_TOKEN set — bot disabled. Set BOT_TOKEN + set webhook to use.');
}

// DB check middleware for API routes
const requireDB = (req, res, next) => {
  if (!getConnectionStatus()) {
    return res.status(503).json({ 
      message: 'Database not connected. Please configure MONGODB_URI.',
      demo: true 
    });
  }
  next();
};

// API Routes (require DB)
app.use('/api/auth', requireDB, authRoutes);
app.use('/api/images', requireDB, imageRoutes);

// Health check (always works)
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'AIPIK Studio API is running',
    database: getConnectionStatus() ? 'connected' : 'not configured',
    bot: process.env.BOT_TOKEN ? '✅ configured' : '❌ not set',
    version: '1.0.0'
  });
});

// Serve frontend static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));

  // SPA fallback - any unmatched route serves index.html
  app.get('{*path}', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
  });
}

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 AIPIK Studio running on port ${PORT}`);
});
