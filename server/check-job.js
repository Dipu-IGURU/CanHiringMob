const mongoose = require('mongoose');
require('dotenv').config();

// Job Schema (same as in Job.js)
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

async function checkJob() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/canhiring');
    console.log('Connected to MongoDB');

    // Check the test job
    const jobId = "68d0e23db1ecf7d693aa7d99";
    console.log('Looking for job with ID:', jobId);
    
    const job = await Job.findById(jobId);
    console.log('Found job:', job);
    
    if (job) {
      console.log('Job details:');
      console.log('- Title:', job.title);
      console.log('- Company:', job.company);
      console.log('- isActive:', job.isActive);
      console.log('- createdAt:', job.createdAt);
    } else {
      console.log('Job not found!');
    }

    // List all jobs
    const allJobs = await Job.find({});
    console.log('Total jobs in database:', allJobs.length);
    allJobs.forEach((job, index) => {
      console.log(`Job ${index + 1}:`, {
        id: job._id,
        title: job.title,
        company: job.company,
        isActive: job.isActive
      });
    });

    process.exit(0);
  } catch (error) {
    console.error('Error checking job:', error);
    process.exit(1);
  }
}

checkJob();
