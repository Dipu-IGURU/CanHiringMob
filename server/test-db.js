const mongoose = require('mongoose');

// Test database connection
async function testDatabaseConnection() {
  try {
    console.log('🔗 Testing database connection...');
    
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/canhiring', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Database connected successfully!');
    
    // Test creating a simple document
    const testSchema = new mongoose.Schema({
      name: String,
      timestamp: { type: Date, default: Date.now }
    });
    
    const TestModel = mongoose.model('Test', testSchema);
    
    const testDoc = new TestModel({ name: 'Database Test' });
    await testDoc.save();
    
    console.log('✅ Test document saved successfully!');
    
    // Clean up
    await TestModel.deleteOne({ _id: testDoc._id });
    console.log('✅ Test document cleaned up!');
    
    await mongoose.disconnect();
    console.log('✅ Database disconnected successfully!');
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
}

testDatabaseConnection();
