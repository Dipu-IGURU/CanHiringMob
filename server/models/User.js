const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Schema for tracking profile views
const profileViewSchema = new mongoose.Schema({
  viewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  viewedAt: {
    type: Date,
    default: Date.now
  }
});

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  photoURL: {
    type: String
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    minlength: 8
    // Not required, as Google users won't have a password
  },
  role: {
    type: String,
    enum: ['user', 'recruiter', 'admin'],
    required: true
  },
  company: {
    type: String,
    required: function() {
      return this.role === 'recruiter';
    },
    trim: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  // COMMENTED OUT: Google-related fields
  // provider: {
  //   type: String,
  //   enum: ['local', 'google', 'facebook'],
  //   default: 'local'
  // },
  // googleId: {
  //   type: String,
  //   sparse: true,
  //   unique: true
  // },
  
  // Simplified provider field (Google removed)
  provider: {
    type: String,
    enum: ['local', 'facebook'],
    default: 'local'
  },
  profileViews: [profileViewSchema],
  lastProfileView: {
    type: Date,
    default: null
  },
  profile: {
    // Basic profile info
    avatar: String,
    fullName: String,
    jobTitle: String,
    email: String,
    phone: String,
    website: String,
    currentSalary: String,
    experience: String,
    age: String,
    education: String,
    description: String,
    facebook: String,
    twitter: String,
    linkedin: String,
    github: String,
    instagram: String,
    country: String,
    city: String,
    address: String,
    skills: [String],
    experienceList: [{
      position: String,
      company: String,
      duration: String,
      description: String
    }],
    educationList: [{
      degree: String,
      institution: String,
      year: String
    }],
    currentCompany: String,
    currentPosition: String,
    expectedSalary: String,
    noticePeriod: String,
    portfolio: String,
    linkedinProfile: String,
    coverLetter: String,
    
    // Resume Builder Data
    resumeData: {
      personalInfo: {
        fullName: String,
        title: String,
        email: String,
        phone: String,
        location: String,
        website: String,
        linkedin: String,
        github: String,
        leetcode: String,
        gfg: String,
        code360: String
      },
      summary: String,
      experience: [{
        title: String,
        company: String,
        location: String,
        startDate: String,
        endDate: String,
        description: String,
        responsibilities: [String]
      }],
      education: [{
        degree: String,
        school: String,
        location: String,
        year: String,
        cgpa: String,
        currentSemester: String
      }],
      skills: {
        programmingLanguages: [String],
        webDevelopment: [String],
        toolsPlatforms: [String],
        databases: [String],
        otherSkills: [String]
      },
      projects: [{
        name: String,
        description: String,
        websiteLink: String,
        duration: String,
        role: String,
        technologies: [String],
        achievements: [String]
      }],
      awards: [{
        name: String,
        organization: String,
        location: String,
        date: String,
        link: String
      }],
      personalDevelopment: {
        books: [String],
        additionalInfo: String
      }
    },
    resumeTemplate: {
      type: String,
      default: 'modern'
    },
    resumeColors: {
      name: String,
      primary: String,
      secondary: String
    },
    resumeUpdatedAt: {
      type: Date,
      default: null
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date
  },
  appliedJobs: [{
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
    application: { type: mongoose.Schema.Types.ObjectId, ref: 'Application' },
    status: { type: String, default: 'pending' },
    appliedAt: { type: Date, default: Date.now }
  }]
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Get full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Transform output
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model('User', userSchema);
