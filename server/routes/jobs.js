const express = require('express');
const { body, validationResult } = require('express-validator');
const Job = require('../models/Job');
const Application = require('../models/Application');
const { auth, recruiterAuth } = require('../middleware/auth');
const router = express.Router();

// Get all jobs with pagination and filtering
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      location,
      type,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = { isActive: true };

    if (category && category !== 'all') {
      filter.category = new RegExp(category, 'i');
    }

    if (location) {
      filter.location = new RegExp(location, 'i');
    }

    if (type) {
      filter.type = type;
    }

    if (search) {
      filter.$text = { $search: search };
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const jobs = await Job.find(filter)
      .populate('postedBy', 'firstName lastName company')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Get total count for pagination
    const total = await Job.countDocuments(filter);

    res.json({
      success: true,
      data: jobs,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total
      }
    });

  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching jobs'
    });
  }
});

// Get job categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await Job.distinct('category');
    
    // Get count for each category
    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const count = await Job.countDocuments({ 
          category: new RegExp(category, 'i'), 
          isActive: true 
        });
        return { name: category, count };
      })
    );

    res.json({
      success: true,
      data: categoriesWithCount
    });

  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching categories'
    });
  }
});

// Get total job count
router.get('/count', async (req, res) => {
  try {
    const total = await Job.countDocuments({ isActive: true });
    
    res.json({
      success: true,
      count: total
    });

  } catch (error) {
    console.error('Error fetching job count:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching job count'
    });
  }
});

// Search jobs
router.get('/search', async (req, res) => {
  try {
    const {
      q: query,
      location,
      category,
      type,
      page = 1,
      limit = 10
    } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    // Build filter object
    const filter = { 
      isActive: true,
      $text: { $search: query }
    };

    if (location) {
      filter.location = new RegExp(location, 'i');
    }

    if (category && category !== 'all') {
      filter.category = new RegExp(category, 'i');
    }

    if (type) {
      filter.type = type;
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute search
    const jobs = await Job.find(filter)
      .populate('postedBy', 'firstName lastName company')
      .sort({ score: { $meta: 'textScore' } })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Get total count
    const total = await Job.countDocuments(filter);

    res.json({
      success: true,
      data: jobs,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total
      }
    });

  } catch (error) {
    console.error('Error searching jobs:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while searching jobs'
    });
  }
});

// Get jobs by category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const filter = { 
      isActive: true,
      category: new RegExp(category, 'i')
    };

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const jobs = await Job.find(filter)
      .populate('postedBy', 'firstName lastName company')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Job.countDocuments(filter);

    res.json({
      success: true,
      data: jobs,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total
      }
    });

  } catch (error) {
    console.error('Error fetching jobs by category:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching jobs by category'
    });
  }
});

// Get single job by ID
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('postedBy', 'firstName lastName company email')
      .lean();

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Increment view count
    await Job.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });

    res.json({
      success: true,
      data: job
    });

  } catch (error) {
    console.error('Error fetching job:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching job'
    });
  }
});

// Create new job (recruiter only)
router.post('/', auth, recruiterAuth, [
  body('title').trim().notEmpty().withMessage('Job title is required'),
  body('company').trim().notEmpty().withMessage('Company name is required'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('type').isIn(['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote']).withMessage('Invalid job type'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('description').trim().notEmpty().withMessage('Job description is required'),
  body('requirements').trim().notEmpty().withMessage('Requirements are required'),
  body('responsibilities').trim().notEmpty().withMessage('Responsibilities are required'),
  body('experience').trim().notEmpty().withMessage('Experience level is required'),
  body('education').trim().notEmpty().withMessage('Education requirement is required')
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

    const jobData = {
      ...req.body,
      postedBy: req.user._id
    };

    const job = new Job(jobData);
    await job.save();

    // Populate the postedBy field
    await job.populate('postedBy', 'firstName lastName company');

    res.status(201).json({
      success: true,
      message: 'Job posted successfully',
      data: job
    });

  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating job'
    });
  }
});

// Update job (recruiter only)
router.put('/:id', auth, recruiterAuth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check if user is the owner of the job
    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this job'
      });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).populate('postedBy', 'firstName lastName company');

    res.json({
      success: true,
      message: 'Job updated successfully',
      data: updatedJob
    });

  } catch (error) {
    console.error('Error updating job:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating job'
    });
  }
});

// Delete job (recruiter only)
router.delete('/:id', auth, recruiterAuth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check if user is the owner of the job
    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this job'
      });
    }

    // Soft delete by setting isActive to false
    await Job.findByIdAndUpdate(req.params.id, { isActive: false });

    res.json({
      success: true,
      message: 'Job deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting job'
    });
  }
});

// Get featured companies from jobs database
router.get('/companies', async (req, res) => {
  try {
    const { limit = 12 } = req.query;

    console.log('🔍 Fetching companies from jobs database...');

    // First, let's check if there are any jobs at all
    const totalJobs = await Job.countDocuments();
    console.log('📊 Total jobs in database:', totalJobs);

    if (totalJobs === 0) {
      console.log('⚠️  No jobs found in database');
      return res.json({
        success: true,
        companies: [],
        total: 0
      });
    }

    // Get a sample job to see the structure
    const sampleJob = await Job.findOne();
    console.log('📊 Sample job structure:', {
      _id: sampleJob._id,
      title: sampleJob.title,
      company: sampleJob.company,
      isActive: sampleJob.isActive,
      hasCompany: !!sampleJob.company
    });

    // Check jobs with company field
    const jobsWithCompany = await Job.countDocuments({ 
      company: { $exists: true, $ne: null, $ne: '' } 
    });
    console.log('📊 Jobs with company field:', jobsWithCompany);

    // Simple aggregation to get companies
    const companies = await Job.aggregate([
      {
        $match: { 
          company: { $exists: true, $ne: null, $ne: '' }
        }
      },
      {
        $group: {
          _id: '$company',
          jobCount: { $sum: 1 }
        }
      },
      {
        $project: {
          name: '$_id',
          jobCount: 1,
          _id: 0
        }
      },
      {
        $sort: { jobCount: -1 }
      },
      {
        $limit: parseInt(limit)
      }
    ]);

    console.log('✅ Raw companies from aggregation:', companies);

    // Transform the data to match the expected format
    const formattedCompanies = companies.map((company, index) => ({
      id: index + 1,
      name: company.name,
      jobs: company.jobCount,
      logo: company.name.substring(0, 2).toUpperCase(),
      locations: [],
      jobTypes: [],
      latestJob: null
    }));

    console.log('✅ Formatted companies:', formattedCompanies);

    res.json({
      success: true,
      companies: formattedCompanies,
      total: formattedCompanies.length
    });

  } catch (error) {
    console.error('❌ Error fetching companies:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching companies'
    });
  }
});

module.exports = router;
