const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/canhiring', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const User = require('./server/models/User');

async function createTestUser() {
  try {
    // Check if test user already exists
    const existingUser = await User.findOne({ email: 'test@example.com' });
    if (existingUser) {
      console.log('Test user already exists!');
      console.log('Email: test@example.com');
      console.log('Password: testpassword123');
      process.exit(0);
    }

    // Create test user
    const testUser = new User({
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: 'testpassword123',
      role: 'user',
      isVerified: true
    });

    await testUser.save();
    console.log('✅ Test user created successfully!');
    console.log('Email: test@example.com');
    console.log('Password: testpassword123');
    console.log('Role: Job Seeker');
    
    // Create test recruiter
    const testRecruiter = new User({
      firstName: 'Test',
      lastName: 'Recruiter',
      email: 'recruiter@example.com',
      password: 'testpassword123',
      role: 'recruiter',
      company: 'Test Company Inc.',
      isVerified: true
    });

    await testRecruiter.save();
    console.log('✅ Test recruiter created successfully!');
    console.log('Email: recruiter@example.com');
    console.log('Password: testpassword123');
    console.log('Role: Recruiter');
    console.log('Company: Test Company Inc.');

  } catch (error) {
    console.error('Error creating test user:', error);
  } finally {
    mongoose.connection.close();
  }
}

createTestUser();

