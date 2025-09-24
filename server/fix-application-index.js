// Script to fix the application index issue
const mongoose = require('mongoose');
require('dotenv').config();

async function fixApplicationIndex() {
  try {
    console.log('🔧 Connecting to database...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to database');

    const db = mongoose.connection.db;
    const collection = db.collection('applications');

    console.log('🔍 Checking existing indexes...');
    const indexes = await collection.indexes();
    console.log('Current indexes:', indexes.map(idx => idx.name));

    // Drop the problematic index if it exists
    try {
      await collection.dropIndex('jobId_1_applicantId_1');
      console.log('✅ Dropped existing jobId_1_applicantId_1 index');
    } catch (err) {
      console.log('ℹ️ Index jobId_1_applicantId_1 not found or already dropped');
    }

    // Create the new partial index
    console.log('🔧 Creating new partial index...');
    await collection.createIndex(
      { jobId: 1, applicantId: 1 }, 
      { 
        unique: true, 
        partialFilterExpression: { applicantId: { $ne: null } },
        name: 'jobId_1_applicantId_1_partial'
      }
    );
    console.log('✅ Created new partial index');

    // Verify the new index
    const newIndexes = await collection.indexes();
    console.log('Updated indexes:', newIndexes.map(idx => idx.name));

    console.log('🎉 Application index fix completed successfully!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error fixing application index:', error);
    process.exit(1);
  }
}

fixApplicationIndex();
