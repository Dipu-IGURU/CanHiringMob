const mongoose = require('mongoose');
const Application = require('./models/Application');

// Test application submission
async function testApplicationSubmission() {
  try {
    console.log('🔗 Testing application submission...');
    
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/canhiring', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Database connected successfully!');
    
    // Create test application data
    const testApplicationData = {
      jobId: 'test_job_123',
      jobTitle: 'Test Software Engineer',
      companyName: 'Test Company',
      fullName: 'Test User',
      email: 'test@example.com',
      phone: '1234567890',
      currentLocation: 'Test City',
      experience: '2 years',
      education: 'Bachelor\'s Degree',
      currentCompany: 'Current Company',
      currentPosition: 'Software Developer',
      expectedSalary: '$80,000',
      noticePeriod: '2 weeks',
      linkedinProfile: 'https://linkedin.com/in/testuser',
      portfolio: 'https://testuser.dev',
      resume: 'test_resume.pdf',
      coverLetter: 'This is a test cover letter for the application.',
      status: 'pending',
      appliedAt: new Date(),
      isExternalApplication: true
    };
    
    // Create and save application
    const application = new Application(testApplicationData);
    await application.save();
    
    console.log('✅ Application saved successfully!');
    console.log('📄 Application ID:', application._id);
    console.log('📄 Job Title:', application.jobTitle);
    console.log('📄 Company:', application.companyName);
    console.log('📄 Applicant:', application.fullName);
    
    // Verify the application was saved by querying it
    const savedApplication = await Application.findById(application._id);
    if (savedApplication) {
      console.log('✅ Application verified in database!');
      console.log('📄 Status:', savedApplication.status);
      console.log('📄 Applied At:', savedApplication.appliedAt);
    } else {
      console.log('❌ Application not found in database!');
    }
    
    // Clean up - delete the test application
    await Application.deleteOne({ _id: application._id });
    console.log('✅ Test application cleaned up!');
    
    await mongoose.disconnect();
    console.log('✅ Database disconnected successfully!');
    
  } catch (error) {
    console.error('❌ Application submission test failed:', error.message);
    console.error('❌ Error details:', error);
    process.exit(1);
  }
}

testApplicationSubmission();


