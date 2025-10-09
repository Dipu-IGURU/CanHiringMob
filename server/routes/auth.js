const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Register endpoint
router.post('/register', [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('role').isIn(['user', 'recruiter']).withMessage('Role must be user or recruiter'),
  body('company').custom((value, { req }) => {
    if (req.body.role === 'recruiter' && !value) {
      throw new Error('Company name is required for recruiters');
    }
    return true;
  })
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

    const { firstName, lastName, email, password, role, company } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create new user
    const userData = {
      firstName,
      lastName,
      email,
      password,
      role
    };

    if (role === 'recruiter') {
      userData.company = company;
    }

    const user = new User(userData);
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        company: user.company
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
});

// Login endpoint
router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
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

    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if user has a password (for Google OAuth users)
    if (!user.password) {
      return res.status(401).json({
        success: false,
        message: 'This account was created with Google. Please use Google Sign-In instead.'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        company: user.company
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// Verify token endpoint
router.get('/verify-token', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.json({ valid: false, message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.json({ valid: false, message: 'User not found' });
    }

    res.json({ 
      valid: true,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Token verification error:', error);
    res.json({ valid: false, message: 'Invalid token' });
  }
});

// Get user profile endpoint
router.get('/profile', auth, async (req, res) => {
  try {
    const user = req.user;

    // Prepare user data
    const userData = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      company: user.company,
      ...user.profile
    };

    res.json({
      success: true,
      user: userData
    });

  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Update user profile endpoint
router.put('/profile', auth, [
  body('firstName').optional().trim().notEmpty().withMessage('First name cannot be empty'),
  body('lastName').optional().trim().notEmpty().withMessage('Last name cannot be empty'),
  body('profile.phone').optional().trim(),
  body('profile.location').optional().trim(),
  body('profile.jobTitle').optional().trim(),
  body('profile.description').optional().trim(),
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

    const userId = req.user._id;
    const { firstName, lastName, profile } = req.body;

    // Prepare update data
    const updateData = {};
    
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    
    if (profile) {
      updateData.profile = {
        ...req.user.profile,
        ...profile
      };
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prepare response data
    const userData = {
      id: updatedUser._id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      role: updatedUser.role,
      company: updatedUser.company,
      ...updatedUser.profile
    };

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: userData
    });

  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating profile',
      error: error.message
    });
  }
});

// COMMENTED OUT: Google Login/Register endpoint
// router.post('/google', async (req, res) => {
//   try {
//     const { googleToken, user: googleUser } = req.body;

//     if (!googleToken || !googleUser) {
//       return res.status(400).json({
//         success: false,
//         message: 'Google token and user data are required.'
//       });
//     }

//     const { uid, email, displayName, photoURL, emailVerified, provider } = googleUser;

//     if (!email || !displayName) {
//       return res.status(400).json({
//         success: false,
//         message: 'Email and display name are required for Google Sign-In.'
//       });
//     }

//     // Check if user already exists
//     let user = await User.findOne({ email });

//     if (!user) {
//       // If user doesn't exist, create a new one
//       const nameParts = displayName.split(' ');
//       const firstName = nameParts[0];
//       const lastName = nameParts.slice(1).join(' ') || firstName;

//       const userData = {
//         email,
//         firstName,
//         lastName,
//         photoURL,
//         role: 'user', // Default role for Google users
//         isVerified: emailVerified || true,
//         provider: provider || 'google',
//         googleId: uid
//       };

//       user = new User(userData);
//       // We need to bypass password validation since it's not required for Google users
//       await user.save({ validateBeforeSave: false });
      
//       console.log('✅ New Google user created:', email);
//     } else {
//       // Update existing user with Google info if needed
//       if (!user.googleId) {
//         user.googleId = uid;
//         user.photoURL = photoURL || user.photoURL;
//         user.isVerified = emailVerified || user.isVerified;
//         user.provider = provider || 'google';
//         await user.save();
//       }
      
//       console.log('✅ Existing Google user logged in:', email);
//     }

//     // Update last login
//     user.lastLogin = new Date();
//     await user.save();

//     // Generate token
//     const token = generateToken(user._id);

//     res.json({
//       success: true,
//       message: 'Google authentication successful',
//       token,
//       user: {
//         id: user._id,
//         firstName: user.firstName,
//         lastName: user.lastName,
//         email: user.email,
//         role: user.role,
//         company: user.company,
//         photoURL: user.photoURL,
//         isVerified: user.isVerified,
//         provider: user.provider
//       }
//     });

//   } catch (error) {
//     console.error('Google authentication error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error during Google authentication'
//     });
//   }
// });

// Placeholder endpoint to prevent errors
router.post('/google', async (req, res) => {
  res.status(503).json({
    success: false,
    message: 'Google authentication is currently disabled'
  });
});

// Get current user endpoint (for AuthContext)
router.get('/me', auth, async (req, res) => {
  try {
    const user = req.user;

    res.json({
      success: true,
      data: {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        company: user.company
      }
    });

  } catch (error) {
    console.error('Auth /me error:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error during authentication'
    });
  }
});

// Track profile view
router.post('/profile/view', auth, async (req, res) => {
  try {
    const { viewedUserId } = req.body;
    const viewerId = req.user._id;

    // Don't track self-views
    if (viewedUserId === viewerId.toString()) {
      return res.json({
        success: true,
        message: 'Self-view not tracked'
      });
    }

    // Check if user exists
    const viewedUser = await User.findById(viewedUserId);
    if (!viewedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if this viewer has already viewed this profile today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existingView = await User.findOne({
      _id: viewedUserId,
      'profileViews.viewer': viewerId,
      'profileViews.viewedAt': {
        $gte: today,
        $lt: tomorrow
      }
    });

    if (!existingView) {
      // Add new profile view
      await User.findByIdAndUpdate(viewedUserId, {
        $push: {
          profileViews: {
            viewer: viewerId,
            viewedAt: new Date()
          }
        },
        $set: {
          lastProfileView: new Date()
        }
      });
    }

    res.json({
      success: true,
      message: 'Profile view tracked'
    });

  } catch (error) {
    console.error('Error tracking profile view:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while tracking profile view'
    });
  }
});

// Get profile view statistics
router.get('/profile/stats', auth, async (req, res) => {
  try {
    const userId = req.user._id;

    // Get total profile views
    const totalViews = await User.aggregate([
      { $match: { _id: userId } },
      { $project: { totalViews: { $size: '$profileViews' } } }
    ]);

    // Get views from last month
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const lastMonthViews = await User.aggregate([
      { $match: { _id: userId } },
      { $unwind: '$profileViews' },
      { $match: { 'profileViews.viewedAt': { $gte: oneMonthAgo } } },
      { $count: 'count' }
    ]);

    // Get views from previous month for comparison
    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

    const previousMonthViews = await User.aggregate([
      { $match: { _id: userId } },
      { $unwind: '$profileViews' },
      { $match: { 
        'profileViews.viewedAt': { 
          $gte: twoMonthsAgo, 
          $lt: oneMonthAgo 
        } 
      }},
      { $count: 'count' }
    ]);

    const totalViewsCount = totalViews[0]?.totalViews || 0;
    const lastMonthCount = lastMonthViews[0]?.count || 0;
    const previousMonthCount = previousMonthViews[0]?.count || 0;
    const percentageChange = previousMonthCount > 0 
      ? Math.round(((lastMonthCount - previousMonthCount) / previousMonthCount) * 100)
      : lastMonthCount > 0 ? 100 : 0;

    res.json({
      success: true,
      stats: {
        totalViews: totalViewsCount,
        lastMonthViews: lastMonthCount,
        percentageChange
      }
    });

  } catch (error) {
    console.error('Error fetching profile stats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching profile statistics'
    });
  }
});

// Get current user's applied jobs (similar to Workly implementation)
router.get('/applied-jobs', auth, async (req, res) => {
  try {
    console.log('Fetching applied jobs for user:', req.user._id);
    
    // Populate the appliedJobs array with job details
    const user = await User.findById(req.user._id)
      .populate('appliedJobs.job', 'title company location type salaryRange description')
      .select('appliedJobs');
    
    if (!user) {
      console.log('User not found:', req.user._id);
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    console.log('User appliedJobs:', user.appliedJobs);

    const jobs = user.appliedJobs.map(item => {
      return {
        _id: item._id,
        job: item.job,
        applicationId: item.application, // Include the application ID
        appliedAt: item.appliedAt,
        status: item.status || 'applied'
      };
    });

    console.log('Mapped jobs:', jobs);

    res.json({ 
      success: true, 
      jobs 
    });
  } catch (error) {
    console.error('Error fetching applied jobs:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching applied jobs', 
      error: error.message 
    });
  }
});

module.exports = router;
