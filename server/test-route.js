const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(express.json());

// Job Schema
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

// Application Schema
const applicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  applicantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'shortlisted', 'interview', 'rejected', 'hired'],
    default: 'pending'
  },
  appliedAt: {
    type: Date,
    default: Date.now
  },
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  currentLocation: {
    type: String,
    required: true,
    trim: true
  },
  experience: {
    type: String,
    required: true,
    trim: true
  },
  education: {
    type: String,
    required: true,
    trim: true
  },
  coverLetter: {
    type: String,
    required: true,
    trim: true
  }
});

const Application = mongoose.model('Application', applicationSchema);

// Test route
app.post('/test-application', async (req, res) => {
  try {
    console.log('Test route called with data:', req.body);
    
    const { jobId, ...applicationData } = req.body;
    console.log('Job ID:', jobId);
    console.log('Application data:', applicationData);

    // Check if job exists
    const job = await Job.findById(jobId);
    console.log('Found job:', job);
    
    if (!job || !job.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Job not found or no longer available'
      });
    }

    // Create application
    const application = new Application({
      jobId,
      applicantId: null,
      ...applicationData
    });

    await application.save();
    console.log('Application saved successfully');

    res.json({
      success: true,
      message: 'Application submitted successfully',
      data: application
    });

  } catch (error) {
    console.error('Error in test route:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Server error while submitting application',
      error: error.message
    });
  }
});

// Connect to database and start server
async function startServer() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/canhiring');
    console.log('Connected to MongoDB');
    
    app.listen(5002, () => {
      console.log('Test server running on port 5002');
    });
  } catch (error) {
    console.error('Error starting server:', error);
  }
}

startServer();
