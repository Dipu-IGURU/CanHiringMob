const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/jobs');
const applicationRoutes = require('./routes/applications');
const profileRoutes = require('./routes/profile');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Log the origin for debugging
    console.log('Request origin:', origin);
    
    // Allow all origins in development
    if (process.env.NODE_ENV !== 'production') {
      console.log('✅ Development mode - allowing all origins');
      return callback(null, true);
    }
    
    // In production, allow specific origins and mobile apps
    const allowedOrigins = [
      'https://www.canhiring.com', // Production frontend domain
      'https://canhiring.com', // Production frontend domain (without www)
      'https://canhiringmob.onrender.com', // Render backend URL
      'https://canhiring-frontend.onrender.com', // Render frontend URL (if you deploy frontend too)
      'http://localhost:19006', // Expo default dev server
      'http://localhost:19000', // Expo web dev server
      'http://localhost:3000',  // React Native web
      'http://localhost:5001',  // Local API server
      'http://127.0.0.1:19006', // Expo dev server on localhost
      'http://127.0.0.1:19000', // Expo web dev server on localhost
      'http://127.0.0.1:5001',  // Local API server on localhost
      'http://192.168.1.28:19006', // Expo dev server on local IP
      'http://192.168.1.28:19000', // Expo web dev server on local IP
      'http://192.168.1.28:5001'   // Local API server on local IP
    ];
    
    // Allow requests with no origin (mobile apps, Postman, curl, etc.)
    if (!origin || origin === 'null' || origin === 'undefined') {
      console.log('✅ Allowing request with no origin (mobile app)');
      return callback(null, true);
    }
    
    // Check if origin is in allowed list
    if (allowedOrigins.indexOf(origin) !== -1) {
      console.log('✅ Allowed origin:', origin);
      return callback(null, true);
    }
    
    // Block unknown origins
    console.log('❌ Blocked origin:', origin);
    const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
    return callback(new Error(msg), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Admin-Token'],
  optionsSuccessStatus: 200 // Some legacy browsers choke on 204
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Enable preflight for all routes

// Request logging middleware
app.use((req, res, next) => {
  console.log(`📱 ${req.method} ${req.path} - Origin: ${req.get('Origin') || 'undefined'} - User-Agent: ${req.get('User-Agent') || 'unknown'}`);
  next();
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/profile', profileRoutes);

// Root route for base URL
app.get('/', (req, res) => {
  res.send('CanHiring Mobile Backend is running. For API status, visit /api/health');
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'CanHiring Mobile API is running!',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    status: 'healthy',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Mobile app specific health check
app.get('/api/mobile/health', (req, res) => {
  res.json({
    success: true,
    message: 'Mobile API is ready',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    cors: 'enabled',
    mobile: true
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
  // Use environment variable or fallback to local MongoDB
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/canhiring';

  console.log('🔗 Connecting to MongoDB:', MONGODB_URI.replace(/\/\/.*@/, '//***:***@')); // Hide credentials in logs

  mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    maxPoolSize: 10,
    serverApi: {
      version: '1',
      strict: true,
      deprecationErrors: true,
    }
  })
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    console.log('📊 Database:', mongoose.connection.db.databaseName);
  })
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
  console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📱 API Base URL: http://localhost:${PORT}/api`);
  console.log(`🔗 Health Check: http://localhost:${PORT}/api/health`);
  
  // Log Render-specific information if running on Render
  if (process.env.RENDER) {
    console.log(`🌐 Render Service: ${process.env.RENDER_SERVICE_NAME || 'unknown'}`);
    console.log(`🌐 Render URL: https://${process.env.RENDER_EXTERNAL_HOSTNAME || 'unknown'}`);
  }
});
