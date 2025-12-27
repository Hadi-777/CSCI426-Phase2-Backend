const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// ========== MIDDLEWARE ==========
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:5173"],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log("[" + timestamp + "] " + req.method + " " + req.url);
  if (req.method === 'POST' && req.body) console.log('Request Body:', req.body);
  next();
});

// ========== ROUTES ==========
const authRoutes = require('./routes/authRoutes');
const discussionRoutes = require('./routes/discussionRoutes');
const studyRoutes = require('./routes/studyRoutes');
const commentRoutes = require('./routes/commentRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/discussions', discussionRoutes);
app.use('/api/studies', studyRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/users', userRoutes);

// Home
app.get('/', (req, res) => {
  res.json({
    message: "🏥 Dr. Online Backend API",
    version: "1.0.0",
    status: "Running",
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: "✅ OK",
    service: "Dr. Online Backend",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: "Test endpoint working!",
    data: { test: "Backend is functioning properly" }
  });
});

// 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Endpoint not found",
    requested_url: req.url,
    method: req.method
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('🔥 Server Error:', err);
  res.status(500).json({
    success: false,
    error: "Internal server error",
    message: err.message || "Something went wrong"
  });
});

app.listen(PORT, () => {
  console.log("✅ Server running on http://localhost:" + PORT);
});
