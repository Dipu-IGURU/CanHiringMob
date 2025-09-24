const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/canhiring', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const User = require('./models/User');

async function resetDatabase() {
  try {
    console.log('🗑️ Resetting database...\n');
    
    // Delete all users
    const deleteResult = await User.deleteMany({});
    console.log(`✅ Deleted ${deleteResult.deletedCount} users`);
    
    // Create fresh test user
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
    
    // Verify the users
    const users = await User.find({});
    console.log(`\n📊 Total users in database: ${users.length}`);
    
    users.forEach((user, index) => {
      console.log(`\n${index + 1}. User:`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Name: ${user.firstName} ${user.lastName}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Has Password: ${user.password ? 'Yes' : 'No'}`);
      console.log(`   Password Length: ${user.password ? user.password.length : 0}`);
    });

  } catch (error) {
    console.error('Error resetting database:', error);
  } finally {
    mongoose.connection.close();
  }
}

resetDatabase();
