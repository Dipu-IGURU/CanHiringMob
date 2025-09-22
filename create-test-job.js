const mongoose = require('mongoose');
require('dotenv').config();

// Job Schema (simplified)
const jobSchema = new mongoose.Schema({
  title: String,
  company: String,
  location: String,
  description: String,
  requirements: String,
  salaryRange: String,
  type: String,
  category: String,
  isActive: { type: Boolean, default: true },
  totalApplications: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const Job = mongoose.model('Job', jobSchema);

async function createTestJob() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/canhiring');
    console.log('Connected to MongoDB');

    // Create a test job
    const testJob = new Job({
      title: 'Software Developer',
      company: 'Test Company',
      location: 'New York, NY',
      description: 'We are looking for a skilled software developer to join our team.',
      requirements: 'Bachelor\'s degree in Computer Science or related field',
      salaryRange: '$60,000 - $80,000',
      type: 'Full-time',
      category: 'Technology',
      isActive: true
    });

    const savedJob = await testJob.save();
    console.log('Test job created:', savedJob._id);
    console.log('Job title:', savedJob.title);
    console.log('Company:', savedJob.company);

    process.exit(0);
  } catch (error) {
    console.error('Error creating test job:', error);
    process.exit(1);
  }
}

createTestJob();
