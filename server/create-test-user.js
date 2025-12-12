const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/canhiring';

async function createTestUser() {
  try {
    // Connect to MongoDB
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Test user data
    const testUserData = {
      firstName: 'Test',
      lastName: 'Reviewer',
      email: 'reviewer@canhiring.com',
      password: 'Test@1234',
      role: 'user',
      isVerified: true
    };

    // Check if user already exists
    const existingUser = await User.findOne({ email: testUserData.email });
    
    if (existingUser) {
      console.log('⚠️  User already exists with this email');
      console.log('🔄 Updating password...');
      
      // Update password
      const salt = await bcrypt.genSalt(12);
      existingUser.password = await bcrypt.hash(testUserData.password, salt);
      await existingUser.save();
      
      console.log('✅ Password updated successfully');
      console.log('📧 Email:', existingUser.email);
      console.log('👤 Name:', existingUser.firstName, existingUser.lastName);
      console.log('🔑 Password: Test@1234');
    } else {
      // Create new user
      console.log('📝 Creating new test user...');
      
      const user = new User(testUserData);
      await user.save();
      
      console.log('✅ Test user created successfully!');
      console.log('📧 Email:', user.email);
      console.log('👤 Name:', user.firstName, user.lastName);
      console.log('🔑 Password: Test@1234');
      console.log('🆔 User ID:', user._id);
    }

    // Verify the user can login
    console.log('\n🔍 Verifying login...');
    const user = await User.findOne({ email: testUserData.email });
    const isPasswordValid = await user.comparePassword(testUserData.password);
    
    if (isPasswordValid) {
      console.log('✅ Password verification successful!');
    } else {
      console.log('❌ Password verification failed!');
    }

    // Close connection
    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run the script
createTestUser();

