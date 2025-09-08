// Simple script to start the server with environment setup
require('dotenv').config();

// Set default environment variables if not provided
if (!process.env.MONGODB_URI) {
  process.env.MONGODB_URI = 'mongodb://localhost:27017/canhiring';
}

if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'your_super_secret_jwt_key_here_make_it_long_and_random_change_this_in_production';
}

if (!process.env.PORT) {
  process.env.PORT = 5001;
}

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development';
}

console.log('🚀 Starting CanHiring Mobile Backend Server...');
console.log('📊 Environment:', process.env.NODE_ENV);
console.log('🔗 MongoDB URI:', process.env.MONGODB_URI);
console.log('🔑 JWT Secret:', process.env.JWT_SECRET ? 'Set' : 'Not Set');
console.log('🌐 Port:', process.env.PORT);

// Start the server
require('./server.js');
