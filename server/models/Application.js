const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.Mixed, // Allow both ObjectId and String for API jobs
    ref: 'Job',
    required: true
  },
  applicantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Made optional for public applications
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
  updatedAt: {
    type: Date,
    default: Date.now
  },
  // Application form data
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
  currentCompany: {
    type: String,
    trim: true
  },
  currentPosition: {
    type: String,
    trim: true
  },
  expectedSalary: {
    type: String,
    trim: true
  },
  noticePeriod: {
    type: String,
    trim: true
  },
  portfolio: {
    type: String,
    trim: true
  },
  linkedinProfile: {
    type: String,
    trim: true
  },
  resume: {
    type: String,
    trim: true
  },
  coverLetter: {
    type: String,
    trim: true
  },
  // Additional fields for recruiter notes
  notes: [{
    content: {
      type: String,
      required: true
    },
    addedBy: {
      type: String,
      required: true
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  // Interview scheduling
  interviewScheduled: {
    type: Boolean,
    default: false
  },
  interviewDate: {
    type: Date
  },
  interviewType: {
    type: String,
    enum: ['phone', 'video', 'in-person', 'technical'],
    default: 'phone'
  },
  interviewNotes: {
    type: String
  },
  // Rejection reason
  rejectionReason: {
    type: String
  },
  // Hiring details
  offerDetails: {
    salary: String,
    startDate: Date,
    benefits: [String],
    notes: String
  },
  // API job specific fields
  isApiJob: {
    type: Boolean,
    default: false
  },
  apiJobTitle: String,
  apiCompany: String,
  apiLocation: String,
  apiJobType: String,
  apiApplyUrl: String,
  source: {
    type: String,
    enum: ['internal', 'api'],
    default: 'internal'
  }
});

// Update the updatedAt field before saving
applicationSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Index for better query performance
applicationSchema.index({ jobId: 1, applicantId: 1 });
applicationSchema.index({ applicantId: 1 });
applicationSchema.index({ status: 1 });
applicationSchema.index({ appliedAt: -1 });

// Simple index for better query performance (duplicates handled in application logic)
applicationSchema.index({ jobId: 1, applicantId: 1 });

module.exports = mongoose.model('Application', applicationSchema);
