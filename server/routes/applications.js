const express = require('express');
const { body, validationResult } = require('express-validator');
const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');
const { auth, recruiterAuth } = require('../middleware/auth');
const router = express.Router();

// Public job application endpoint (no authentication required)
router.post('/', [
  body('jobId').isMongoId().withMessage('Valid job ID is required'),
  body('fullName').trim().notEmpty().withMessage('Full name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('phone').trim().notEmpty().withMessage('Phone number is required'),
  body('currentLocation').trim().notEmpty().withMessage('Current location is required'),
  body('experience').trim().notEmpty().withMessage('Experience is required'),
  body('education').trim().notEmpty().withMessage('Education is required'),
  body('coverLetter').trim().notEmpty().withMessage('Cover letter is required'),
  body('currentCompany').optional().trim(),
  body('currentPosition').optional().trim(),
  body('expectedSalary').optional().trim(),
  body('noticePeriod').optional().trim(),
  body('linkedinProfile').optional().trim(),
  body('portfolio').optional().trim(),
  body('resume').optional().trim()
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { jobId, ...applicationData } = req.body;
    console.log('Received application data:', { jobId, applicationData });

    // Check if job exists and is active
    console.log('Looking for job with ID:', jobId);
    const job = await Job.findById(jobId);
    console.log('Found job:', job);
    
    if (!job || !job.isActive) {
      console.log('Job not found or inactive');
      return res.status(404).json({
        success: false,
        message: 'Job not found or no longer available'
      });
    }

    // Create application without user authentication
    const application = new Application({
      jobId,
      applicantId: null, // No user authentication for public applications
      fullName: applicationData.fullName,
      email: applicationData.email,
      phone: applicationData.phone,
      currentLocation: applicationData.currentLocation,
      experience: applicationData.experience,
      education: applicationData.education,
      currentCompany: applicationData.currentCompany || '',
      currentPosition: applicationData.currentPosition || '',
      expectedSalary: applicationData.expectedSalary || '',
      noticePeriod: applicationData.noticePeriod || '',
      portfolio: applicationData.portfolio || '',
      linkedinProfile: applicationData.linkedinProfile || '',
      resume: applicationData.resume || '',
      coverLetter: applicationData.coverLetter,
      status: 'pending',
      appliedAt: new Date()
    });

    await application.save();

    // Update job's total applications count
    await Job.findByIdAndUpdate(jobId, { $inc: { totalApplications: 1 } });

    // Populate the application data
    await application.populate('jobId', 'title company location');

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: application
    });

  } catch (error) {
    console.error('Error submitting public application:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Server error while submitting application',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Apply for a job
router.post('/apply', auth, [
  body('jobId').isMongoId().withMessage('Valid job ID is required'),
  body('fullName').trim().notEmpty().withMessage('Full name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('phone').trim().notEmpty().withMessage('Phone number is required'),
  body('currentLocation').trim().notEmpty().withMessage('Current location is required'),
  body('experience').trim().notEmpty().withMessage('Experience level is required'),
  body('education').trim().notEmpty().withMessage('Education is required')
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { jobId, ...applicationData } = req.body;

    // Check if job exists and is active
    const job = await Job.findById(jobId);
    if (!job || !job.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Job not found or no longer available'
      });
    }

    // Check if user has already applied for this job
    const existingApplication = await Application.findOne({
      jobId,
      applicantId: req.user._id
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this job'
      });
    }

    // Create application
    const application = new Application({
      jobId,
      applicantId: req.user._id,
      ...applicationData
    });

    await application.save();

    // Update job's total applications count
    await Job.findByIdAndUpdate(jobId, { $inc: { totalApplications: 1 } });

    // Add to user's applied jobs
    console.log('Adding application to user:', req.user._id, 'job:', jobId, 'application:', application._id);
    const userUpdate = await User.findByIdAndUpdate(req.user._id, {
      $push: {
        appliedJobs: {
          job: jobId,
          application: application._id,
          status: 'pending',
          appliedAt: new Date()
        }
      }
    }, { new: true });
    
    console.log('User update result:', userUpdate ? 'Success' : 'Failed');

    // Populate the application data
    await application.populate([
      { path: 'jobId', select: 'title company location' },
      { path: 'applicantId', select: 'firstName lastName email' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: application
    });

  } catch (error) {
    console.error('Error applying for job:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Server error while submitting application',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get user's applications (alternative route for mobile app compatibility)
router.get('/user/:token', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const filter = { 
      $or: [
        { applicantId: req.user._id },
        { userId: req.user._id }
      ]
    };
    if (status) {
      filter.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const applications = await Application.find(filter)
      .populate('jobId', 'title company location type salaryRange')
      .sort({ appliedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Application.countDocuments(filter);

    res.json({
      success: true,
      data: applications,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total
      }
    });

  } catch (error) {
    console.error('Error fetching user applications:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching applications'
    });
  }
});

// Get user's applications
router.get('/my-applications', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const filter = { 
      $or: [
        { applicantId: req.user._id },
        { userId: req.user._id }
      ]
    };
    if (status) {
      filter.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const applications = await Application.find(filter)
      .populate('jobId', 'title company location type salaryRange')
      .sort({ appliedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Application.countDocuments(filter);

    res.json({
      success: true,
      data: applications,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total
      }
    });

  } catch (error) {
    console.error('Error fetching user applications:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching applications'
    });
  }
});

// Get application statistics for user
router.get('/stats', auth, async (req, res) => {
  try {
    const userId = req.user._id;

    // Get total applications
    const totalApplications = await Application.countDocuments({ applicantId: userId });

    // Get applications by status
    const statusCounts = await Application.aggregate([
      { $match: { applicantId: userId } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Get applications from last week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const lastWeekApplications = await Application.countDocuments({
      applicantId: userId,
      appliedAt: { $gte: oneWeekAgo }
    });

    // Get previous week for comparison
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    
    const previousWeekApplications = await Application.countDocuments({
      applicantId: userId,
      appliedAt: { $gte: twoWeeksAgo, $lt: oneWeekAgo }
    });

    const changeFromLastWeek = lastWeekApplications - previousWeekApplications;

    // Format status counts
    const statusStats = {};
    statusCounts.forEach(item => {
      statusStats[item._id] = item.count;
    });

    res.json({
      success: true,
      stats: {
        total: totalApplications,
        changeFromLastWeek,
        statusCounts: statusStats
      }
    });

  } catch (error) {
    console.error('Error fetching application stats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching application statistics'
    });
  }
});

// Get application details for user
router.get('/user/:applicationId', auth, async (req, res) => {
  try {
    const { applicationId } = req.params;

    const application = await Application.findById(applicationId)
      .populate('jobId')
      .populate('applicantId', 'firstName lastName email profile')
      .lean();

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check if user is the applicant or the job poster
    const isApplicant = application.applicantId._id.toString() === req.user._id.toString();
    const isJobPoster = application.jobId.postedBy.toString() === req.user._id.toString();

    if (!isApplicant && !isJobPoster) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this application'
      });
    }

    res.json({
      success: true,
      application
    });

  } catch (error) {
    console.error('Error fetching application details:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching application details'
    });
  }
});

// Get applications for a job (recruiter only)
router.get('/job/:jobId', auth, recruiterAuth, async (req, res) => {
  try {
    const { jobId } = req.params;
    const { page = 1, limit = 10, status } = req.query;

    // Check if user is the owner of the job
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view applications for this job'
      });
    }

    const filter = { jobId };
    if (status) {
      filter.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const applications = await Application.find(filter)
      .populate('applicantId', 'firstName lastName email profile')
      .sort({ appliedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Application.countDocuments(filter);

    res.json({
      success: true,
      data: applications,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total
      }
    });

  } catch (error) {
    console.error('Error fetching job applications:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching job applications'
    });
  }
});

// Update application status (recruiter only)
router.patch('/:applicationId/status', auth, recruiterAuth, [
  body('status').isIn(['pending', 'reviewed', 'shortlisted', 'interview', 'rejected', 'hired']).withMessage('Invalid status'),
  body('notes').optional().trim()
], async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status, notes } = req.body;

    const application = await Application.findById(applicationId)
      .populate('jobId', 'postedBy');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check if user is the owner of the job
    if (application.jobId.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this application'
      });
    }

    // Update application status
    application.status = status;
    if (notes) {
      application.notes.push({
        content: notes,
        addedBy: req.user.firstName + ' ' + req.user.lastName,
        addedAt: new Date()
      });
    }

    await application.save();

    // Update user's applied jobs status
    await User.updateOne(
      { 
        _id: application.applicantId,
        'appliedJobs.application': applicationId
      },
      { 
        $set: { 'appliedJobs.$.status': status }
      }
    );

    res.json({
      success: true,
      message: 'Application status updated successfully',
      data: application
    });

  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating application status'
    });
  }
});

// Get interview statistics
router.get('/interview-stats', auth, async (req, res) => {
  try {
    const userId = req.user._id;

    // Get total interviews
    const totalInterviews = await Application.countDocuments({
      applicantId: userId,
      status: 'interview'
    });

    // Get interviews this week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const interviewsThisWeek = await Application.countDocuments({
      applicantId: userId,
      status: 'interview',
      appliedAt: { $gte: oneWeekAgo }
    });

    res.json({
      success: true,
      stats: {
        totalInterviews,
        interviewsThisWeek
      }
    });

  } catch (error) {
    console.error('Error fetching interview stats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching interview statistics'
    });
  }
});

// Get recent activities for dashboard
router.get('/recent-activities', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const { limit = 10 } = req.query;

    // Get recent applications
    const recentApplications = await Application.find({ applicantId: userId })
      .populate('jobId', 'title company location')
      .sort({ appliedAt: -1 })
      .limit(parseInt(limit))
      .lean();

    // Format activities
    const activities = recentApplications.map(app => ({
      id: app._id,
      type: 'application',
      title: `Applied to ${app.jobId.title} at ${app.jobId.company}`,
      time: app.appliedAt,
      status: app.status,
      icon: 'send',
      color: '#3B82F6'
    }));

    // Sort by time (most recent first)
    activities.sort((a, b) => new Date(b.time) - new Date(a.time));

    res.json({
      success: true,
      activities: activities.slice(0, parseInt(limit))
    });

  } catch (error) {
    console.error('Error fetching recent activities:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching recent activities'
    });
  }
});

// Get job offers statistics
router.get('/offers-stats', auth, async (req, res) => {
  try {
    const userId = req.user._id;

    // Get total job offers (hired status)
    const totalOffers = await Application.countDocuments({
      applicantId: userId,
      status: 'hired'
    });

    // Get offers from last month
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const lastMonthOffers = await Application.countDocuments({
      applicantId: userId,
      status: 'hired',
      appliedAt: { $gte: oneMonthAgo }
    });

    res.json({
      success: true,
      stats: {
        totalOffers,
        lastMonthOffers
      }
    });

  } catch (error) {
    console.error('Error fetching offers stats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching offers statistics'
    });
  }
});

// Get application limits and usage
router.get('/limits', auth, async (req, res) => {
  try {
    const userId = req.user._id;

    // Get current month applications
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const currentMonthApplications = await Application.countDocuments({
      applicantId: userId,
      appliedAt: {
        $gte: startOfMonth,
        $lte: endOfMonth
      }
    });

    // For now, we'll use a simple plan system
    // In a real app, this would come from a subscription service
    const userPlan = {
      plan: 'free', // This should come from user's subscription data
      monthlyLimit: 5,
      name: 'Free Plan'
    };

    const remainingApplications = Math.max(0, userPlan.monthlyLimit - currentMonthApplications);
    const percentage = (currentMonthApplications / userPlan.monthlyLimit) * 100;

    res.json({
      success: true,
      data: {
        current: currentMonthApplications,
        max: userPlan.monthlyLimit,
        remaining: remainingApplications,
        percentage: Math.round(percentage),
        plan: userPlan.plan,
        planName: userPlan.name,
        isLimitReached: currentMonthApplications >= userPlan.monthlyLimit
      }
    });

  } catch (error) {
    console.error('Error fetching application limits:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching application limits'
    });
  }
});

// Get application details by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const application = await Application.findById(id)
      .populate('jobId', 'title company location type salaryRange description experience requirements')
      .populate('applicantId', 'firstName lastName email')
      .lean();

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check if user is the applicant or the job poster
    const isApplicant = application.applicantId._id.toString() === userId.toString();
    const isJobPoster = application.jobId.postedBy && application.jobId.postedBy.toString() === userId.toString();

    if (!isApplicant && !isJobPoster) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this application'
      });
    }

    res.json({
      success: true,
      application
    });

  } catch (error) {
    console.error('Error fetching application details:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching application details'
    });
  }
});

module.exports = router;
