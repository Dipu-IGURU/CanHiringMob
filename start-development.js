#!/usr/bin/env node

// Development startup script for CanHiring Mobile App
const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting CanHiring Mobile Development Environment...');
console.log('='.repeat(60));

// Function to run command with better error handling
function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
      ...options
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with code ${code}`));
      }
    });

    child.on('error', (error) => {
      reject(error);
    });
  });
}

// Main startup function
async function startDevelopment() {
  try {
    console.log('📦 Installing dependencies...');
    
    // Install root dependencies
    console.log('Installing root dependencies...');
    await runCommand('npm', ['install']);
    
    // Install server dependencies
    console.log('Installing server dependencies...');
    await runCommand('npm', ['install'], { cwd: './server' });
    
    console.log('✅ Dependencies installed successfully!');
    console.log('');
    console.log('🔧 Starting services...');
    console.log('');
    console.log('📱 To start the React Native app:');
    console.log('   npm start');
    console.log('');
    console.log('🖥️  To start the backend server:');
    console.log('   cd server && npm start');
    console.log('');
    console.log('🌐 Server will be available at: http://localhost:5001');
    console.log('📱 App will be available at: http://localhost:19006');
    console.log('');
    console.log('🔧 API Fixes Applied:');
    console.log('   ✅ Rate limiting for RapidAPI');
    console.log('   ✅ Fallback data for API failures');
    console.log('   ✅ Better error handling');
    console.log('   ✅ Server CORS configuration');
    console.log('');
    console.log('📋 Next Steps:');
    console.log('   1. Start the server: cd server && npm start');
    console.log('   2. Start the app: npm start');
    console.log('   3. Open the app in Expo Go or web browser');
    console.log('');
    
  } catch (error) {
    console.error('❌ Error during setup:', error.message);
    process.exit(1);
  }
}

startDevelopment();
