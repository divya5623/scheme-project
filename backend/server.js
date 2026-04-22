'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');

const schemesRouter = require('./routes/schemes');
const analyzeRouter = require('./routes/analyze');

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// --- Routes ---
app.use('/api/schemes', schemesRouter);
app.use('/api/analyze', analyzeRouter);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'Scheme Eligibility API is running', timestamp: new Date().toISOString() });
});

// 404 handler for unknown routes
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global error handler
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err.message || err);
  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    success: false,
    message: status === 500 ? 'Internal server error' : err.message,
  });
});

// --- Start server ---
app.listen(PORT, () => {
  console.log(`\n🚀 Scheme Eligibility API server running on port ${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/api/health`);
  console.log(`   Schemes:      http://localhost:${PORT}/api/schemes`);
  console.log(`   Analyze:      POST http://localhost:${PORT}/api/analyze`);
  console.log(`   OpenAI:       ${process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here' ? '✅ Configured' : '⚠️  Not configured (using fallback analysis)'}\n`);
});

module.exports = app;
