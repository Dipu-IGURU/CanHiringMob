// This is a simplified fix for the applications route
// Replace the existing applications route with this

const express = require('express');
const { body, validationResult } = require('express-validator');
const Application = require('./models/Application');
const Job = require('./models/Job');
const router = express.Router();

// Simplified public job application endpoint
router.post('/', [
  body('jobId').isMongoId().withMessage('Valid job ID is required'),
  body('fullName').trim().notEmpty().withMessage('Full name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('phone').trim().notEmpty().withMessage('Phone number is required'),
  body('currentLocation').trim().notEmpty().withMessage('Current location is required'),
  body('experience').trim().notEmpty().withMessage('Experience is required'),
  body('education').trim().notEmpty().withMessage('Education is required'),
  body('coverLetter').trim().notEmpty().withMessage('Cover letter is required')
], async (req, res) => {
  try {
    console.log('=== APPLICATION SUBMISSION START ===');
    console.log('Request body:', req.body);
    
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { jobId, ...applicationData } = req.body;
    console.log('Job ID:', jobId);
    console.log('Application data:', applicationData);

    // Check if job exists and is active
    console.log('Looking for job...');
    const job = await Job.findById(jobId);
    console.log('Job found:', job ? 'YES' : 'NO');
    
    if (!job) {
      console.log('Job not found');
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }
    
    if (!job.isActive) {
      console.log('Job is not active');
      return res.status(404).json({
        success: false,
        message: 'Job is no longer available'
      });
    }

    console.log('Creating application...');
    // Create application with only required fields
    const application = new Application({
      jobId: jobId,
      applicantId: null, // No user authentication for public applications
      fullName: applicationData.fullName,
      email: applicationData.email,
      phone: applicationData.phone,
      currentLocation: applicationData.currentLocation,
      experience: applicationData.experience,
      education: applicationData.education,
      coverLetter: applicationData.coverLetter,
      status: 'pending',
      appliedAt: new Date()
    });

    console.log('Saving application...');
    await application.save();
    console.log('Application saved successfully');

    // Update job's total applications count
    await Job.findByIdAndUpdate(jobId, { $inc: { totalApplications: 1 } });
    console.log('Job application count updated');

    console.log('=== APPLICATION SUBMISSION SUCCESS ===');
    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: {
        id: application._id,
        jobId: application.jobId,
        fullName: application.fullName,
        email: application.email,
        status: application.status
      }
    });

  } catch (error) {
    console.error('=== APPLICATION SUBMISSION ERROR ===');
    console.error('Error:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    res.status(500).json({
      success: false,
      message: 'Server error while submitting application',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

module.exports = router;
