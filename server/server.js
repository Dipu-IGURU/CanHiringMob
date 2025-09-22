const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/jobs');
const applicationRoutes = require('./routes/applications');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow all origins in development
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    
    // In production, only allow specific origins
    const allowedOrigins = [
      'http://localhost:19006', // Expo default dev server
      'http://localhost:19000', // Expo web dev server
      'http://localhost:3000',  // React Native web
      'http://localhost:5001',  // Local API server
      'http://192.168.1.14:19006', // Expo dev server on local IP
      'http://192.168.1.14:19000', // Expo web dev server on local IP
      'http://192.168.1.14:5001',  // Local API server on local IP
      'https://can-hiring.vercel.app',
      'https://www.can-hiring.vercel.app',
      'https://can-hiring.onrender.com',
      'https://www.can-hiring.onrender.com'
    ];
    
    // Log the origin for debugging
    console.log('Request origin:', origin);
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      console.log('Blocked origin:', origin);
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Admin-Token']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Enable preflight for all routes

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);

// Root route for base URL
app.get('/', (req, res) => {
  res.send('CanHiring Mobile Backend is running. For API status, visit /api/health');
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'CanHiring Mobile API is running!',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Database connection with retry logic
const connectWithRetry = () => {
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/canhiring';

  mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  })
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    console.log('🔁 Retrying MongoDB connection in 5 seconds...');
    setTimeout(connectWithRetry, 5000);
  });
};

// Start the app
connectWithRetry();

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 CanHiring Mobile Server is running on port ${PORT}`);
  console.log(`📱 API Base URL: http://localhost:${PORT}/api`);
  console.log(`📱 Mobile API URL: http://192.168.1.14:${PORT}/api`);
  console.log(`🔗 Health Check: http://localhost:${PORT}/api/health`);
});
