const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Application = require('../models/Application');
const Job = require('../models/Job');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Get current user profile
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });

  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user profile'
    });
  }
});

// Update user profile
router.put('/', auth, [
  body('firstName').optional().trim().isLength({ min: 1 }).withMessage('First name must not be empty'),
  body('lastName').optional().trim().isLength({ min: 1 }).withMessage('Last name must not be empty'),
  body('email').optional().isEmail().withMessage('Invalid email format'),
  body('phone').optional().trim().isLength({ min: 10 }).withMessage('Phone number must be at least 10 characters'),
  body('location').optional().trim().isLength({ min: 1 }).withMessage('Location must not be empty'),
  body('bio').optional().trim().isLength({ max: 500 }).withMessage('Bio must not exceed 500 characters'),
  body('skills').optional().isArray().withMessage('Skills must be an array'),
  body('experience').optional().trim().isLength({ min: 1 }).withMessage('Experience must not be empty'),
  body('education').optional().trim().isLength({ min: 1 }).withMessage('Education must not be empty')
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

    const allowedUpdates = [
      'firstName', 'lastName', 'email', 'phone', 'location', 
      'bio', 'skills', 'experience', 'education', 'resume', 
      'linkedin', 'github', 'portfolio', 'profilePicture'
    ];

    const updates = {};
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { ...updates, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });

  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating user profile'
    });
  }
});

// Get user's applied jobs
router.get('/applied-jobs', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const applications = await Application.find({ 
      $or: [
        { userId: req.user._id },
        { applicantId: req.user._id }
      ]
    })
      .sort({ appliedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Application.countDocuments({ 
      $or: [
        { userId: req.user._id },
        { applicantId: req.user._id }
      ]
    });

    // Transform to match expected format
    const appliedJobs = applications.map(app => {
      // Handle API jobs (isApiJob: true) vs internal jobs
      if (app.isApiJob) {
        return {
          id: app._id,
          _id: app._id,
          jobId: app.jobId, // This is a string for API jobs
          title: app.apiJobTitle || 'Job Title Not Available',
          company: app.apiCompany || 'Company Not Available',
          location: app.apiLocation || 'Location Not Available',
          type: app.apiJobType || 'Full-time',
          category: 'API Job',
          status: app.status || 'pending',
          appliedAt: app.appliedAt || app.createdAt,
          jobPostedAt: app.appliedAt, // For API jobs, use applied date
          salary: 'Salary Not Specified',
          isApiJob: true,
          applyUrl: app.apiApplyUrl,
          source: app.source || 'api'
        };
      } else {
        // Handle internal jobs - need to populate jobId
        return {
          id: app._id,
          _id: app._id,
          jobId: app.jobId,
          title: 'Job Title Not Available', // Will be populated separately
          company: 'Company Not Available',
          location: 'Location Not Available',
          type: 'Full-time',
          category: 'Internal Job',
          status: app.status || 'pending',
          appliedAt: app.appliedAt || app.createdAt,
          jobPostedAt: app.appliedAt,
          salary: 'Salary Not Specified',
          isApiJob: false,
          source: app.source || 'internal'
        };
      }
    });

    // For internal jobs, we need to populate the jobId field separately
    const internalJobIds = appliedJobs
      .filter(job => !job.isApiJob && job.jobId)
      .map(job => job.jobId);

    if (internalJobIds.length > 0) {
      const internalJobs = await Job.find({ _id: { $in: internalJobIds } })
        .select('title company location type category createdAt salaryRange')
        .lean();

      // Update internal jobs with actual job data
      appliedJobs.forEach(job => {
        if (!job.isApiJob && job.jobId) {
          const jobData = internalJobs.find(j => j._id.toString() === job.jobId.toString());
          if (jobData) {
            job.title = jobData.title || 'Job Title Not Available';
            job.company = jobData.company || 'Company Not Available';
            job.location = jobData.location || 'Location Not Available';
            job.type = jobData.type || 'Full-time';
            job.category = jobData.category || 'General';
            job.jobPostedAt = jobData.createdAt;
            job.salary = jobData.salaryRange || 'Salary Not Specified';
          }
        }
      });
    }

    res.json({
      success: true,
      jobs: appliedJobs,
      data: appliedJobs, // For backward compatibility
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total
      }
    });

  } catch (error) {
    console.error('Error fetching applied jobs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch applied jobs',
      jobs: [],
      data: []
    });
  }
});

// Get application statistics
router.get('/applied-jobs/stats', auth, async (req, res) => {
  try {
    const userId = req.user._id;

    const stats = await Application.aggregate([
      { 
        $match: { 
          $or: [
            { userId: userId },
            { applicantId: userId }
          ]
        } 
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Transform stats to expected format
    const statsObj = {
      total: 0,
      pending: 0,
      reviewed: 0,
      rejected: 0,
      accepted: 0
    };

    stats.forEach(stat => {
      statsObj.total += stat.count;
      statsObj[stat._id] = stat.count;
    });

    res.json({
      success: true,
      stats: statsObj
    });

  } catch (error) {
    console.error('Error fetching application stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch application stats',
      stats: {
        total: 0,
        pending: 0,
        reviewed: 0,
        rejected: 0,
        accepted: 0
      }
    });
  }
});

// Get interview statistics
router.get('/interview-stats', auth, async (req, res) => {
  try {
    const userId = req.user._id;

    // For now, return mock data since we don't have interview tracking yet
    const stats = {
      totalInterviews: 0,
      upcomingInterviews: 0,
      completedInterviews: 0,
      scheduledInterviews: 0
    };

    // You can implement actual interview tracking here when needed
    // const interviews = await Interview.find({ userId: userId });
    // Process interview data...

    res.json({
      success: true,
      stats: stats
    });

  } catch (error) {
    console.error('Error fetching interview stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch interview stats',
      stats: {
        totalInterviews: 0,
        upcomingInterviews: 0,
        completedInterviews: 0,
        scheduledInterviews: 0
      }
    });
  }
});

// Get profile view statistics
router.get('/view-stats', auth, async (req, res) => {
  try {
    const userId = req.user._id;

    // For now, return mock data since we don't have profile view tracking yet
    const stats = {
      totalViews: 0,
      lastMonthViews: 0,
      percentageChange: 0,
      recentViews: []
    };

    // You can implement actual profile view tracking here when needed
    // const views = await ProfileView.find({ viewedUserId: userId });
    // Process view data...

    res.json({
      success: true,
      stats: stats
    });

  } catch (error) {
    console.error('Error fetching profile stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile stats',
      stats: {
        totalViews: 0,
        lastMonthViews: 0,
        percentageChange: 0,
        recentViews: []
      }
    });
  }
});

// Track profile view
router.post('/:viewedUserId/view', auth, async (req, res) => {
  try {
    const { viewedUserId } = req.params;
    const viewerId = req.user._id;

    // Don't track self-views
    if (viewedUserId === viewerId.toString()) {
      return res.json({
        success: true,
        message: 'Self-view not tracked'
      });
    }

    // For now, just return success since we don't have profile view tracking implemented
    // You can implement actual profile view tracking here when needed
    // const profileView = new ProfileView({
    //   viewedUserId: viewedUserId,
    //   viewerId: viewerId,
    //   viewedAt: new Date()
    // });
    // await profileView.save();

    res.json({
      success: true,
      message: 'Profile view tracked successfully'
    });

  } catch (error) {
    console.error('Error tracking profile view:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to track profile view'
    });
  }
});

// Get recent activities
router.get('/recent-activities', auth, async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const userId = req.user._id;

    const recentApplications = await Application.find({ 
      $or: [
        { userId: userId },
        { applicantId: userId }
      ]
    })
      .populate('jobId', 'title company')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .lean();

    const activities = recentApplications.map(app => ({
      id: app._id,
      type: 'application',
      title: `Applied to ${app.jobId?.title || 'Job'}`,
      description: `Applied to ${app.jobId?.company || 'Company'}`,
      status: app.status,
      createdAt: app.createdAt,
      jobId: app.jobId?._id
    }));

    res.json({
      success: true,
      activities: activities
    });

  } catch (error) {
    console.error('Error fetching recent activities:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recent activities',
      activities: []
    });
  }
});

module.exports = router;
