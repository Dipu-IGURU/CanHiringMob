#!/usr/bin/env node

/**
 * MongoDB Mobile Setup Script
 * This script helps you set up MongoDB Atlas for mobile APK deployment
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 CanHiring MongoDB Mobile Setup');
console.log('================================\n');

// Check if .env file exists
const envPath = path.join(__dirname, 'server', '.env');
const envExists = fs.existsSync(envPath);

if (!envExists) {
  console.log('📝 Creating .env file template...');
  
  const envTemplate = `# MongoDB Configuration for Mobile APK
# Replace with your actual MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/canhiring?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random_${Math.random().toString(36).substring(2, 15)}

# Server Configuration
PORT=5001
NODE_ENV=production

# Admin Configuration
ADMIN_TOKEN=admin_token_${Math.random().toString(36).substring(2, 15)}

# Payment Configuration (optional)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
CLIENT_URL=https://can-hiring.onrender.com

# JSearch API Configuration
VITE_RAPIDAPI_KEY=3fe89ef3cfmsha78975fefe8bf57p1579b2jsnb1b2ec2377d9
VITE_RAPIDAPI_HOST=jsearch.p.rapidapi.com`;

  fs.writeFileSync(envPath, envTemplate);
  console.log('✅ Created server/.env file');
} else {
  console.log('✅ .env file already exists');
}

console.log('\n📋 Next Steps:');
console.log('1. Set up MongoDB Atlas account at https://www.mongodb.com/atlas');
console.log('2. Create a new cluster (free tier available)');
console.log('3. Get your connection string from Atlas dashboard');
console.log('4. Update MONGODB_URI in server/.env with your connection string');
console.log('5. Deploy your server to Render with the new environment variables');
console.log('6. Build new APK with: npx expo build:android --type apk');
console.log('\n📖 For detailed instructions, see MONGODB_MOBILE_FIX.md');

console.log('\n🔧 Current Configuration:');
console.log('- Mobile APK will use: https://can-hiring.onrender.com');
console.log('- Server will use MongoDB Atlas for production');
console.log('- Fallback to local MongoDB for development');

console.log('\n✨ Setup complete! Follow the next steps to get your mobile APK working.');
