// Script to add sample jobs to the database for testing Featured Companies
const mongoose = require('mongoose');
require('dotenv').config();

// Import the Job model
const Job = require('./models/Job');
const User = require('./models/User');

const sampleJobs = [
  {
    title: 'Senior React Developer',
    company: 'TechCorp',
    location: 'Toronto, ON',
    type: 'Full-time',
    category: 'Information Technology',
    description: 'We are looking for an experienced React developer to join our team.',
    requirements: '5+ years React experience, TypeScript knowledge',
    experience: '5+ years',
    education: 'Bachelor\'s degree in Computer Science',
    skills: ['React', 'TypeScript', 'Node.js', 'MongoDB'],
    benefits: ['Health Insurance', 'Remote Work', 'Flexible Hours'],
    salaryRange: '$80,000 - $120,000',
    isActive: true,
    isFeatured: true
  },
  {
    title: 'Frontend Developer',
    company: 'TechCorp',
    location: 'Vancouver, BC',
    type: 'Full-time',
    category: 'Information Technology',
    description: 'Join our frontend team to build amazing user experiences.',
    requirements: '3+ years frontend development experience',
    experience: '3+ years',
    education: 'Bachelor\'s degree or equivalent experience',
    skills: ['JavaScript', 'React', 'CSS', 'HTML'],
    benefits: ['Health Insurance', 'Dental', 'Vision'],
    salaryRange: '$70,000 - $100,000',
    isActive: true,
    isFeatured: false
  },
  {
    title: 'Full Stack Developer',
    company: 'DevSolutions',
    location: 'Montreal, QC',
    type: 'Full-time',
    category: 'Information Technology',
    description: 'We need a full stack developer to work on our platform.',
    requirements: '4+ years full stack development',
    experience: '4+ years',
    education: 'Bachelor\'s degree in Computer Science',
    skills: ['Node.js', 'React', 'MongoDB', 'AWS'],
    benefits: ['Health Insurance', 'Stock Options', 'Learning Budget'],
    salaryRange: '$85,000 - $130,000',
    isActive: true,
    isFeatured: true
  },
  {
    title: 'Backend Developer',
    company: 'DevSolutions',
    location: 'Calgary, AB',
    type: 'Full-time',
    category: 'Information Technology',
    description: 'Join our backend team to build scalable APIs.',
    requirements: '3+ years backend development experience',
    experience: '3+ years',
    education: 'Bachelor\'s degree in Computer Science',
    skills: ['Node.js', 'Python', 'PostgreSQL', 'Docker'],
    benefits: ['Health Insurance', 'Remote Work', 'Learning Budget'],
    salaryRange: '$75,000 - $110,000',
    isActive: true,
    isFeatured: false
  },
  {
    title: 'Data Scientist',
    company: 'DataFlow Inc',
    location: 'Calgary, AB',
    type: 'Full-time',
    category: 'Information Technology',
    description: 'Join our data science team to analyze large datasets.',
    requirements: 'PhD in Data Science or related field',
    experience: '2+ years',
    education: 'PhD in Data Science',
    skills: ['Python', 'Machine Learning', 'SQL', 'Statistics'],
    benefits: ['Health Insurance', 'Research Budget', 'Conference Attendance'],
    salaryRange: '$90,000 - $140,000',
    isActive: true,
    isFeatured: false
  },
  {
    title: 'Machine Learning Engineer',
    company: 'DataFlow Inc',
    location: 'Toronto, ON',
    type: 'Full-time',
    category: 'Information Technology',
    description: 'Build and deploy machine learning models.',
    requirements: '3+ years ML engineering experience',
    experience: '3+ years',
    education: 'Master\'s degree in Computer Science',
    skills: ['Python', 'TensorFlow', 'PyTorch', 'AWS'],
    benefits: ['Health Insurance', 'Research Budget', 'Stock Options'],
    salaryRange: '$95,000 - $145,000',
    isActive: true,
    isFeatured: true
  },
  {
    title: 'DevOps Engineer',
    company: 'CloudTech',
    location: 'Ottawa, ON',
    type: 'Full-time',
    category: 'Information Technology',
    description: 'Help us scale our infrastructure and deployment processes.',
    requirements: '3+ years DevOps experience',
    experience: '3+ years',
    education: 'Bachelor\'s degree in Computer Science',
    skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD'],
    benefits: ['Health Insurance', 'Remote Work', 'Equipment Budget'],
    salaryRange: '$75,000 - $115,000',
    isActive: true,
    isFeatured: true
  },
  {
    title: 'Cloud Architect',
    company: 'CloudTech',
    location: 'Vancouver, BC',
    type: 'Full-time',
    category: 'Information Technology',
    description: 'Design and implement cloud solutions.',
    requirements: '5+ years cloud architecture experience',
    experience: '5+ years',
    education: 'Bachelor\'s degree in Computer Science',
    skills: ['AWS', 'Azure', 'Terraform', 'Kubernetes'],
    benefits: ['Health Insurance', 'Remote Work', 'Certification Budget'],
    salaryRange: '$100,000 - $150,000',
    isActive: true,
    isFeatured: false
  },
  {
    title: 'UI/UX Designer',
    company: 'StartupHub',
    location: 'Toronto, ON',
    type: 'Full-time',
    category: 'Design',
    description: 'Design beautiful and intuitive user interfaces.',
    requirements: '3+ years UI/UX design experience',
    experience: '3+ years',
    education: 'Bachelor\'s degree in Design or related field',
    skills: ['Figma', 'Adobe Creative Suite', 'User Research', 'Prototyping'],
    benefits: ['Health Insurance', 'Design Tools', 'Creative Freedom'],
    salaryRange: '$60,000 - $90,000',
    isActive: true,
    isFeatured: false
  },
  {
    title: 'Product Manager',
    company: 'StartupHub',
    location: 'Montreal, QC',
    type: 'Full-time',
    category: 'Management',
    description: 'Lead product development and strategy.',
    requirements: '4+ years product management experience',
    experience: '4+ years',
    education: 'Bachelor\'s degree in Business or related field',
    skills: ['Product Strategy', 'Agile', 'Analytics', 'User Research'],
    benefits: ['Health Insurance', 'Stock Options', 'Learning Budget'],
    salaryRange: '$85,000 - $125,000',
    isActive: true,
    isFeatured: true
  }
];

async function addSampleJobs() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/canhiring');
    console.log('✅ Connected to MongoDB');

    // Check if we have any users to assign jobs to
    const users = await User.find({ role: 'recruiter' });
    if (users.length === 0) {
      console.log('⚠️  No recruiter users found. Creating a sample recruiter...');
      
      const sampleRecruiter = new User({
        firstName: 'John',
        lastName: 'Recruiter',
        email: 'recruiter@example.com',
        password: 'password123', // In real app, this would be hashed
        role: 'recruiter',
        company: 'TechCorp'
      });
      
      await sampleRecruiter.save();
      console.log('✅ Created sample recruiter user');
      users.push(sampleRecruiter);
    }

    // Check if jobs already exist
    const existingJobs = await Job.countDocuments();
    if (existingJobs > 0) {
      console.log(`📊 Found ${existingJobs} existing jobs in database`);
      console.log('✅ Sample jobs not needed - database already has data');
      return;
    }

    console.log('📝 Adding sample jobs...');
    
    // Add postedBy field to each job
    const jobsWithUser = sampleJobs.map(job => ({
      ...job,
      postedBy: users[0]._id // Assign to first recruiter user
    }));

    const createdJobs = await Job.insertMany(jobsWithUser);
    console.log(`✅ Successfully added ${createdJobs.length} sample jobs`);

    // Show summary
    console.log('\n📊 Sample Jobs Added:');
    createdJobs.forEach((job, index) => {
      console.log(`${index + 1}. ${job.title} at ${job.company}`);
    });

    console.log('\n🎉 Sample jobs added successfully!');
    console.log('💡 You can now test the Featured Companies section');

  } catch (error) {
    console.error('❌ Error adding sample jobs:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the script
addSampleJobs();
