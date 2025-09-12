// Fallback Job Service with sample data when API is not available

// Generate more sample jobs programmatically
const generateSampleJobs = () => {
  const baseJobs = [
    {
      _id: '1',
      title: 'Senior Software Developer',
      company: 'TechCorp Inc.',
      location: 'New York, NY',
      type: 'Full-time',
      salary: '$80,000 - $120,000',
      description: 'We are looking for an experienced software developer to join our growing team. You will work on cutting-edge projects and collaborate with talented engineers.',
      postedDate: '2024-01-15T10:00:00.000Z',
      category: 'Information Technology',
      applyUrl: 'https://example.com/apply/1',
      remote: false
    },
    {
      _id: '2',
      title: 'Frontend Developer',
      company: 'WebSolutions Ltd.',
      location: 'San Francisco, CA',
      type: 'Full-time',
      salary: '$70,000 - $100,000',
      description: 'Join our frontend team to build beautiful and responsive web applications using React, Vue.js, and modern CSS frameworks.',
      postedDate: '2024-01-14T14:30:00.000Z',
      category: 'Information Technology',
      applyUrl: 'https://example.com/apply/2',
      remote: true
    },
    {
      _id: '3',
      title: 'Registered Nurse',
      company: 'City General Hospital',
      location: 'Chicago, IL',
      type: 'Full-time',
      salary: '$60,000 - $85,000',
      description: 'Provide compassionate patient care in our busy medical unit. Experience in medical-surgical nursing preferred.',
      postedDate: '2024-01-13T09:15:00.000Z',
      category: 'Healthcare & Medical',
      applyUrl: 'https://example.com/apply/3',
      remote: false
    },
    {
      _id: '4',
      title: 'Financial Analyst',
      company: 'Global Finance Group',
      location: 'Boston, MA',
      type: 'Full-time',
      salary: '$65,000 - $90,000',
      description: 'Analyze financial data and market trends to support investment decisions. Strong Excel and analytical skills required.',
      postedDate: '2024-01-12T16:45:00.000Z',
      category: 'Finance & Banking',
      applyUrl: 'https://example.com/apply/4',
      remote: false
    },
    {
      _id: '5',
      title: 'UX Designer',
      company: 'Design Studio Pro',
      location: 'Austin, TX',
      type: 'Full-time',
      salary: '$75,000 - $110,000',
      description: 'Create intuitive user experiences for our mobile and web applications. Portfolio required.',
      postedDate: '2024-01-11T11:20:00.000Z',
      category: 'Design',
      applyUrl: 'https://example.com/apply/5',
      remote: true
    },
    {
      _id: '6',
      title: 'Marketing Manager',
      company: 'Growth Marketing Co.',
      location: 'Seattle, WA',
      type: 'Full-time',
      salary: '$70,000 - $95,000',
      description: 'Lead digital marketing campaigns and manage a team of marketing specialists. Experience with social media and PPC required.',
      postedDate: '2024-01-10T13:10:00.000Z',
      category: 'Sales & Marketing',
      applyUrl: 'https://example.com/apply/6',
      remote: false
    },
    {
      _id: '7',
      title: 'Mechanical Engineer',
      company: 'Innovation Industries',
      location: 'Detroit, MI',
      type: 'Full-time',
      salary: '$75,000 - $105,000',
      description: 'Design and develop mechanical systems for automotive applications. CAD experience required.',
      postedDate: '2024-01-09T08:30:00.000Z',
      category: 'Engineering',
      applyUrl: 'https://example.com/apply/7',
      remote: false
    },
    {
      _id: '8',
      title: 'Customer Service Representative',
      company: 'Service Excellence Inc.',
      location: 'Phoenix, AZ',
      type: 'Full-time',
      salary: '$35,000 - $45,000',
      description: 'Provide excellent customer support via phone, email, and chat. Bilingual preferred.',
      postedDate: '2024-01-08T15:45:00.000Z',
      category: 'Customer Service',
      applyUrl: 'https://example.com/apply/8',
      remote: true
    },
    {
      _id: '9',
      title: 'HR Specialist',
      company: 'People First Corp.',
      location: 'Denver, CO',
      type: 'Full-time',
      salary: '$50,000 - $70,000',
      description: 'Handle recruitment, employee relations, and HR policies. HR certification preferred.',
      postedDate: '2024-01-07T12:00:00.000Z',
      category: 'Human Resources',
      applyUrl: 'https://example.com/apply/9',
      remote: false
    },
    {
      _id: '10',
      title: 'Data Scientist',
      company: 'Analytics Pro',
      location: 'Los Angeles, CA',
      type: 'Full-time',
      salary: '$90,000 - $130,000',
      description: 'Analyze large datasets and build machine learning models. Python and R experience required.',
      postedDate: '2024-01-06T10:15:00.000Z',
      category: 'Information Technology',
      applyUrl: 'https://example.com/apply/10',
      remote: true
    },
    {
      _id: '11',
      title: 'Project Manager',
      company: 'Strategic Solutions',
      location: 'Miami, FL',
      type: 'Full-time',
      salary: '$80,000 - $110,000',
      description: 'Lead cross-functional teams and manage project timelines. PMP certification preferred.',
      postedDate: '2024-01-05T14:20:00.000Z',
      category: 'Administrative',
      applyUrl: 'https://example.com/apply/11',
      remote: false
    },
    {
      _id: '12',
      title: 'Construction Supervisor',
      company: 'BuildRight Construction',
      location: 'Houston, TX',
      type: 'Full-time',
      salary: '$60,000 - $80,000',
      description: 'Oversee construction projects and manage construction teams. Safety certification required.',
      postedDate: '2024-01-04T07:30:00.000Z',
      category: 'Construction',
      applyUrl: 'https://example.com/apply/12',
      remote: false
    },
    {
      _id: '13',
      title: 'Quality Control Inspector',
      company: 'Manufacturing Plus',
      location: 'Cleveland, OH',
      type: 'Full-time',
      salary: '$45,000 - $60,000',
      description: 'Inspect products and ensure quality standards. Manufacturing experience preferred.',
      postedDate: '2024-01-03T11:45:00.000Z',
      category: 'Manufacturing',
      applyUrl: 'https://example.com/apply/13',
      remote: false
    },
    {
      _id: '14',
      title: 'Store Manager',
      company: 'Retail Excellence',
      location: 'Atlanta, GA',
      type: 'Full-time',
      salary: '$40,000 - $55,000',
      description: 'Manage daily store operations and lead retail team. Retail management experience required.',
      postedDate: '2024-01-02T16:10:00.000Z',
      category: 'Retail',
      applyUrl: 'https://example.com/apply/14',
      remote: false
    },
    {
      _id: '15',
      title: 'DevOps Engineer',
      company: 'CloudTech Solutions',
      location: 'Portland, OR',
      type: 'Full-time',
      salary: '$85,000 - $120,000',
      description: 'Manage cloud infrastructure and CI/CD pipelines. AWS and Docker experience required.',
      postedDate: '2024-01-01T09:00:00.000Z',
      category: 'Information Technology',
      applyUrl: 'https://example.com/apply/15',
      remote: true
    },
    {
      _id: '16',
      title: 'React Developer',
      company: 'Digital Innovations',
      location: 'Austin, TX',
      type: 'Full-time',
      salary: '$75,000 - $110,000',
      description: 'Build modern React applications with TypeScript and Next.js. Experience with state management required.',
      postedDate: '2024-01-16T11:00:00.000Z',
      category: 'Information Technology',
      applyUrl: 'https://example.com/apply/16',
      remote: true
    },
    {
      _id: '17',
      title: 'Python Developer',
      company: 'DataFlow Systems',
      location: 'Seattle, WA',
      type: 'Full-time',
      salary: '$80,000 - $115,000',
      description: 'Develop backend services using Python, Django, and PostgreSQL. API development experience preferred.',
      postedDate: '2024-01-17T14:30:00.000Z',
      category: 'Information Technology',
      applyUrl: 'https://example.com/apply/17',
      remote: false
    },
    {
      _id: '18',
      title: 'Mobile App Developer',
      company: 'AppCraft Studios',
      location: 'Miami, FL',
      type: 'Full-time',
      salary: '$70,000 - $105,000',
      description: 'Develop iOS and Android apps using React Native. Experience with app store deployment required.',
      postedDate: '2024-01-18T09:15:00.000Z',
      category: 'Information Technology',
      applyUrl: 'https://example.com/apply/18',
      remote: true
    },
    {
      _id: '19',
      title: 'Full Stack Developer',
      company: 'WebCraft Solutions',
      location: 'Denver, CO',
      type: 'Full-time',
      salary: '$85,000 - $125,000',
      description: 'Work on both frontend and backend development. Node.js, React, and MongoDB experience required.',
      postedDate: '2024-01-19T16:45:00.000Z',
      category: 'Information Technology',
      applyUrl: 'https://example.com/apply/19',
      remote: false
    },
    {
      _id: '20',
      title: 'Software Engineer',
      company: 'TechStart Inc.',
      location: 'San Diego, CA',
      type: 'Full-time',
      salary: '$90,000 - $130,000',
      description: 'Join our fast-growing startup. Work on scalable web applications and microservices architecture.',
      postedDate: '2024-01-20T08:30:00.000Z',
      category: 'Information Technology',
      applyUrl: 'https://example.com/apply/20',
      remote: true
    },
    {
      _id: '21',
      title: 'Senior Nurse',
      company: 'Metro Health Center',
      location: 'Phoenix, AZ',
      type: 'Full-time',
      salary: '$65,000 - $90,000',
      description: 'Provide patient care in our busy emergency department. BSN required, 3+ years experience preferred.',
      postedDate: '2024-01-21T12:00:00.000Z',
      category: 'Healthcare & Medical',
      applyUrl: 'https://example.com/apply/21',
      remote: false
    },
    {
      _id: '22',
      title: 'Physical Therapist',
      company: 'RehabCare Center',
      location: 'Orlando, FL',
      type: 'Full-time',
      salary: '$70,000 - $95,000',
      description: 'Help patients recover from injuries and surgeries. DPT degree and state license required.',
      postedDate: '2024-01-22T10:30:00.000Z',
      category: 'Healthcare & Medical',
      applyUrl: 'https://example.com/apply/22',
      remote: false
    },
    {
      _id: '23',
      title: 'Investment Analyst',
      company: 'Capital Partners',
      location: 'Chicago, IL',
      type: 'Full-time',
      salary: '$75,000 - $100,000',
      description: 'Analyze investment opportunities and market trends. CFA certification preferred.',
      postedDate: '2024-01-23T15:20:00.000Z',
      category: 'Finance & Banking',
      applyUrl: 'https://example.com/apply/23',
      remote: false
    },
    {
      _id: '24',
      title: 'High School Teacher',
      company: 'Metro School District',
      location: 'Dallas, TX',
      type: 'Full-time',
      salary: '$50,000 - $70,000',
      description: 'Teach mathematics to high school students. Teaching certification and bachelor degree required.',
      postedDate: '2024-01-24T13:45:00.000Z',
      category: 'Education & Training',
      applyUrl: 'https://example.com/apply/24',
      remote: false
    },
    {
      _id: '25',
      title: 'Digital Marketing Specialist',
      company: 'Growth Marketing Co.',
      location: 'Nashville, TN',
      type: 'Full-time',
      salary: '$55,000 - $80,000',
      description: 'Manage social media campaigns and digital advertising. Google Ads and Facebook Ads experience required.',
      postedDate: '2024-01-25T11:15:00.000Z',
      category: 'Sales & Marketing',
      applyUrl: 'https://example.com/apply/25',
      remote: true
    }
  ];

  // Generate additional jobs to reach 1000+
  const additionalJobs = [];
  const companies = [
    'TechCorp Inc.', 'WebSolutions Ltd.', 'City General Hospital', 'Global Finance Group',
    'Design Studio Pro', 'Growth Marketing Co.', 'Innovation Industries', 'Service Excellence Inc.',
    'People First Corp.', 'Analytics Pro', 'Strategic Solutions', 'BuildRight Construction',
    'Manufacturing Plus', 'Retail Excellence', 'CloudTech Solutions', 'Digital Innovations',
    'DataFlow Systems', 'AppCraft Studios', 'WebCraft Solutions', 'TechStart Inc.',
    'Metro Health Center', 'RehabCare Center', 'Capital Partners', 'Metro School District',
    'Growth Marketing Co.', 'Alpha Tech', 'Beta Solutions', 'Gamma Corp', 'Delta Systems',
    'Epsilon Labs', 'Zeta Industries', 'Eta Technologies', 'Theta Solutions', 'Iota Corp'
  ];
  
  const locations = [
    'New York, NY', 'San Francisco, CA', 'Chicago, IL', 'Boston, MA', 'Austin, TX',
    'Seattle, WA', 'Detroit, MI', 'Phoenix, AZ', 'Denver, CO', 'Los Angeles, CA',
    'Miami, FL', 'Houston, TX', 'Cleveland, OH', 'Atlanta, GA', 'Portland, OR',
    'San Diego, CA', 'Orlando, FL', 'Dallas, TX', 'Nashville, TN', 'Las Vegas, NV',
    'Philadelphia, PA', 'San Antonio, TX', 'San Jose, CA', 'Columbus, OH', 'Charlotte, NC',
    'Indianapolis, IN', 'Washington, DC', 'Jacksonville, FL', 'Memphis, TN', 'Louisville, KY'
  ];

  const jobTitles = [
    'Software Developer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
    'React Developer', 'Python Developer', 'Java Developer', 'Node.js Developer',
    'Mobile App Developer', 'iOS Developer', 'Android Developer', 'DevOps Engineer',
    'Data Scientist', 'Data Analyst', 'Machine Learning Engineer', 'AI Engineer',
    'Cloud Engineer', 'System Administrator', 'Database Administrator', 'Network Engineer',
    'Security Engineer', 'QA Engineer', 'Test Engineer', 'Product Manager',
    'Project Manager', 'Scrum Master', 'Business Analyst', 'UX Designer',
    'UI Designer', 'Graphic Designer', 'Web Designer', 'Product Designer',
    'Marketing Manager', 'Digital Marketing Specialist', 'Content Manager', 'SEO Specialist',
    'Sales Manager', 'Account Manager', 'Business Development Manager', 'Customer Success Manager',
    'HR Manager', 'Recruiter', 'Talent Acquisition Specialist', 'Training Manager',
    'Operations Manager', 'Supply Chain Manager', 'Logistics Coordinator', 'Procurement Manager',
    'Financial Analyst', 'Accountant', 'Investment Analyst', 'Risk Analyst',
    'Registered Nurse', 'Physical Therapist', 'Occupational Therapist', 'Medical Assistant',
    'Doctor', 'Surgeon', 'Pharmacist', 'Dental Hygienist',
    'Teacher', 'Professor', 'Principal', 'Guidance Counselor',
    'Engineer', 'Mechanical Engineer', 'Electrical Engineer', 'Civil Engineer',
    'Construction Manager', 'Architect', 'Surveyor', 'Electrician',
    'Manufacturing Engineer', 'Quality Control Inspector', 'Production Manager', 'Plant Manager',
    'Retail Manager', 'Store Manager', 'Sales Associate', 'Cashier',
    'Customer Service Representative', 'Call Center Agent', 'Support Specialist', 'Help Desk Technician'
  ];

  const categories = [
    'Information Technology', 'Healthcare & Medical', 'Finance & Banking', 'Education & Training',
    'Sales & Marketing', 'Engineering', 'Customer Service', 'Human Resources',
    'Administrative', 'Construction', 'Manufacturing', 'Retail', 'Design',
    'Transportation', 'Hospitality', 'Legal', 'Real Estate', 'Media & Communications',
    'Non-Profit', 'Government'
  ];

  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship'];
  const salaryRanges = [
    '$30,000 - $50,000', '$40,000 - $60,000', '$50,000 - $70,000', '$60,000 - $80,000',
    '$70,000 - $90,000', '$80,000 - $100,000', '$90,000 - $120,000', '$100,000 - $130,000',
    '$120,000 - $150,000', '$150,000+'
  ];

  // Generate 1000 additional jobs with better category distribution
  for (let i = 26; i <= 1000; i++) {
    const randomCompany = companies[Math.floor(Math.random() * companies.length)];
    const randomLocation = locations[Math.floor(Math.random() * locations.length)];
    const randomType = jobTypes[Math.floor(Math.random() * jobTypes.length)];
    const randomSalary = salaryRanges[Math.floor(Math.random() * salaryRanges.length)];
    
    // Ensure better category distribution by cycling through categories
    const categoryIndex = (i - 26) % categories.length;
    const randomCategory = categories[categoryIndex];
    
    // Get appropriate job titles for the category
    let categoryJobTitles = [];
    
    if (randomCategory === 'Information Technology') {
      categoryJobTitles = [
        'Software Developer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
        'Data Scientist', 'Data Analyst', 'DevOps Engineer', 'Cloud Engineer',
        'AI Engineer', 'Machine Learning Engineer', 'Cybersecurity Analyst',
        'System Administrator', 'Database Administrator', 'IT Support Specialist',
        'Product Manager', 'Technical Writer', 'QA Engineer', 'Mobile Developer'
      ];
    } else if (randomCategory === 'Healthcare & Medical') {
      categoryJobTitles = [
        'Registered Nurse', 'Doctor', 'Physical Therapist', 'Medical Assistant',
        'Pharmacist', 'Dentist', 'Surgeon', 'Pediatrician', 'Cardiologist',
        'Radiologist', 'Psychiatrist', 'Psychologist', 'Occupational Therapist',
        'Speech Therapist', 'Nurse Practitioner', 'Physician Assistant', 'Medical Technician'
      ];
    } else if (randomCategory === 'Finance & Banking') {
      categoryJobTitles = [
        'Financial Analyst', 'Investment Banker', 'Accountant', 'Auditor',
        'Financial Advisor', 'Loan Officer', 'Credit Analyst', 'Risk Manager',
        'Treasury Analyst', 'Tax Specialist', 'Insurance Agent', 'Bank Manager',
        'Portfolio Manager', 'Compliance Officer', 'Financial Planner', 'Actuary'
      ];
    } else if (randomCategory === 'Education & Training') {
      categoryJobTitles = [
        'Teacher', 'Professor', 'Principal', 'School Counselor', 'Librarian',
        'Curriculum Coordinator', 'Education Administrator', 'Tutor',
        'Special Education Teacher', 'Math Teacher', 'Science Teacher',
        'English Teacher', 'History Teacher', 'Art Teacher', 'Music Teacher',
        'Physical Education Teacher', 'Academic Advisor', 'Training Coordinator'
      ];
    } else if (randomCategory === 'Sales & Marketing') {
      categoryJobTitles = [
        'Sales Representative', 'Marketing Manager', 'Digital Marketing Specialist',
        'Account Executive', 'Business Development Manager', 'Marketing Coordinator',
        'Sales Manager', 'Brand Manager', 'Content Marketing Specialist',
        'Social Media Manager', 'SEO Specialist', 'Advertising Manager',
        'Market Research Analyst', 'Sales Director', 'Marketing Analyst', 'PR Manager'
      ];
    } else if (randomCategory === 'Engineering') {
      categoryJobTitles = [
        'Civil Engineer', 'Mechanical Engineer', 'Electrical Engineer', 'Chemical Engineer',
        'Aerospace Engineer', 'Biomedical Engineer', 'Environmental Engineer',
        'Industrial Engineer', 'Materials Engineer', 'Nuclear Engineer',
        'Petroleum Engineer', 'Project Engineer', 'Quality Engineer', 'Safety Engineer',
        'Structural Engineer', 'Systems Engineer', 'Manufacturing Engineer'
      ];
    } else if (randomCategory === 'Customer Service') {
      categoryJobTitles = [
        'Customer Service Representative', 'Call Center Agent', 'Customer Support Specialist',
        'Help Desk Technician', 'Client Relations Manager', 'Customer Success Manager',
        'Technical Support Specialist', 'Customer Care Coordinator', 'Service Desk Analyst',
        'Customer Experience Manager', 'Retention Specialist', 'Account Manager',
        'Customer Service Supervisor', 'Support Team Lead', 'Customer Advocate'
      ];
    } else if (randomCategory === 'Human Resources') {
      categoryJobTitles = [
        'HR Manager', 'Recruiter', 'HR Generalist', 'Talent Acquisition Specialist',
        'HR Business Partner', 'Compensation Analyst', 'Benefits Administrator',
        'Training and Development Specialist', 'Employee Relations Specialist',
        'HR Coordinator', 'Talent Manager', 'HR Director', 'Workplace Culture Manager',
        'HR Information Systems Specialist', 'Organizational Development Specialist'
      ];
    } else if (randomCategory === 'Administrative') {
      categoryJobTitles = [
        'Administrative Assistant', 'Executive Assistant', 'Office Manager',
        'Receptionist', 'Data Entry Clerk', 'Administrative Coordinator',
        'Executive Secretary', 'Office Administrator', 'Administrative Specialist',
        'Project Coordinator', 'Operations Assistant', 'Administrative Manager',
        'Clerical Assistant', 'Administrative Support Specialist', 'Office Coordinator'
      ];
    } else if (randomCategory === 'Construction') {
      categoryJobTitles = [
        'Construction Manager', 'Project Manager', 'Site Supervisor', 'Foreman',
        'Carpenter', 'Electrician', 'Plumber', 'HVAC Technician', 'Welder',
        'Heavy Equipment Operator', 'Construction Worker', 'Safety Coordinator',
        'Estimator', 'Architect', 'Civil Engineer', 'Building Inspector',
        'Construction Laborer', 'Crane Operator', 'Concrete Finisher'
      ];
    } else if (randomCategory === 'Manufacturing') {
      categoryJobTitles = [
        'Production Manager', 'Manufacturing Engineer', 'Quality Control Inspector',
        'Machine Operator', 'Assembly Line Worker', 'Production Supervisor',
        'Industrial Engineer', 'Maintenance Technician', 'Process Engineer',
        'Manufacturing Technician', 'Quality Assurance Manager', 'Plant Manager',
        'Production Planner', 'Manufacturing Supervisor', 'Equipment Operator',
        'Packaging Specialist', 'Materials Handler', 'Production Coordinator'
      ];
    } else if (randomCategory === 'Retail') {
      categoryJobTitles = [
        'Retail Sales Associate', 'Store Manager', 'Assistant Manager', 'Cashier',
        'Department Manager', 'Visual Merchandiser', 'Inventory Specialist',
        'Customer Service Representative', 'Retail Buyer', 'Store Supervisor',
        'Loss Prevention Specialist', 'Retail Operations Manager', 'Sales Floor Associate',
        'Retail Coordinator', 'Merchandise Planner', 'Retail Analyst', 'Store Director'
      ];
    } else if (randomCategory === 'Design') {
      categoryJobTitles = [
        'UX Designer', 'UI Designer', 'Graphic Designer', 'Product Designer',
        'Web Designer', 'Interior Designer', 'Fashion Designer', 'Industrial Designer',
        'Motion Graphics Designer', 'Brand Designer', 'Creative Director',
        'Art Director', 'Visual Designer', 'User Experience Designer',
        'Design Manager', 'Design Consultant', 'Design Researcher'
      ];
    } else if (randomCategory === 'Transportation') {
      categoryJobTitles = [
        'Truck Driver', 'Delivery Driver', 'Bus Driver', 'Taxi Driver',
        'Logistics Coordinator', 'Fleet Manager', 'Transportation Manager',
        'Cargo Handler', 'Warehouse Worker', 'Shipping Clerk',
        'Airline Pilot', 'Flight Attendant', 'Ground Crew', 'Air Traffic Controller',
        'Train Conductor', 'Railway Engineer', 'Marine Captain', 'Ship Engineer',
        'Uber Driver', 'Lyft Driver', 'Courier', 'Dispatcher'
      ];
    } else if (randomCategory === 'Hospitality') {
      categoryJobTitles = [
        'Hotel Manager', 'Restaurant Manager', 'Chef', 'Cook', 'Waiter', 'Waitress',
        'Bartender', 'Concierge', 'Front Desk Agent', 'Housekeeping Supervisor',
        'Event Coordinator', 'Catering Manager', 'Food Service Manager',
        'Hotel Receptionist', 'Restaurant Host', 'Kitchen Manager', 'Banquet Manager',
        'Guest Services Manager', 'Resort Manager', 'Tour Guide'
      ];
    } else if (randomCategory === 'Legal') {
      categoryJobTitles = [
        'Lawyer', 'Attorney', 'Paralegal', 'Legal Assistant', 'Judge',
        'Court Reporter', 'Legal Secretary', 'Compliance Officer', 'Legal Counsel',
        'Public Defender', 'Corporate Lawyer', 'Criminal Defense Attorney',
        'Family Lawyer', 'Immigration Lawyer', 'Patent Attorney', 'Legal Researcher',
        'Law Clerk', 'Legal Analyst', 'Mediator'
      ];
    } else if (randomCategory === 'Real Estate') {
      categoryJobTitles = [
        'Real Estate Agent', 'Real Estate Broker', 'Property Manager', 'Real Estate Appraiser',
        'Real Estate Developer', 'Leasing Agent', 'Real Estate Consultant',
        'Property Investment Advisor', 'Real Estate Analyst', 'Commercial Real Estate Agent',
        'Residential Real Estate Agent', 'Real Estate Coordinator', 'Property Investment Manager',
        'Real Estate Marketing Specialist', 'Real Estate Transaction Coordinator'
      ];
    } else if (randomCategory === 'Media & Communications') {
      categoryJobTitles = [
        'Journalist', 'Reporter', 'Editor', 'Content Writer', 'Social Media Manager',
        'Public Relations Specialist', 'Marketing Communications Manager', 'Copywriter',
        'Video Producer', 'Photographer', 'Videographer', 'Broadcast Journalist',
        'Digital Marketing Specialist', 'Communications Manager', 'Content Manager',
        'Media Relations Specialist', 'Press Secretary', 'Communications Coordinator'
      ];
    } else if (randomCategory === 'Non-Profit') {
      categoryJobTitles = [
        'Program Manager', 'Fundraising Coordinator', 'Volunteer Coordinator',
        'Grant Writer', 'Development Director', 'Community Outreach Specialist',
        'Non-Profit Manager', 'Advocacy Coordinator', 'Program Director',
        'Social Worker', 'Case Manager', 'Non-Profit Administrator',
        'Donor Relations Manager', 'Event Coordinator', 'Communications Manager',
        'Policy Analyst', 'Research Coordinator', 'Executive Director'
      ];
    } else if (randomCategory === 'Government') {
      categoryJobTitles = [
        'Government Analyst', 'Policy Advisor', 'Public Administrator', 'City Planner',
        'Social Worker', 'Tax Examiner', 'Government Relations Specialist',
        'Public Affairs Specialist', 'Program Manager', 'Administrative Officer',
        'Government Accountant', 'Compliance Officer', 'Public Health Inspector',
        'Environmental Specialist', 'Government Relations Manager', 'Public Policy Analyst',
        'Government Auditor', 'Regulatory Affairs Specialist'
      ];
    } else {
      // Default fallback for any category not explicitly defined
      categoryJobTitles = jobTitles;
    }
    
    const randomTitle = categoryJobTitles[Math.floor(Math.random() * categoryJobTitles.length)];
    
    // Generate random date within last 30 days
    const randomDate = new Date();
    randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 30));
    
    additionalJobs.push({
      _id: i.toString(),
      title: randomTitle,
      company: randomCompany,
      location: randomLocation,
      type: randomType,
      salary: randomSalary,
      description: `We are looking for a ${randomTitle.toLowerCase()} to join our team. This position offers great opportunities for growth and development in a dynamic work environment.`,
      postedDate: randomDate.toISOString(),
      category: randomCategory,
      applyUrl: `https://example.com/apply/${i}`,
      remote: Math.random() > 0.7 // 30% chance of being remote
    });
  }

  return [...baseJobs, ...additionalJobs];
};

export const getFallbackJobs = (query = '', location = '', limit = 20) => {
  const sampleJobs = generateSampleJobs();

  // Filter jobs based on query and location
  let filteredJobs = sampleJobs;

  if (query && query.trim()) {
    const searchQuery = query.toLowerCase().trim();
    console.log('🔍 Searching for:', searchQuery);
    
    // First try exact matches
    filteredJobs = sampleJobs.filter(job => 
      job.title.toLowerCase().includes(searchQuery) ||
      job.company.toLowerCase().includes(searchQuery) ||
      job.description.toLowerCase().includes(searchQuery) ||
      job.category.toLowerCase().includes(searchQuery)
    );
    
    console.log('🔍 Exact matches found:', filteredJobs.length);
    
    // If no exact matches, try partial word matches
    if (filteredJobs.length === 0) {
      const searchWords = searchQuery.split(' ').filter(word => word.length > 2);
      console.log('🔍 Trying partial matches for words:', searchWords);
      
      filteredJobs = sampleJobs.filter(job => {
        const jobText = `${job.title} ${job.description} ${job.category}`.toLowerCase();
        return searchWords.some(word => jobText.includes(word));
      });
      
      console.log('🔍 Partial matches found:', filteredJobs.length);
    }
    
    // If still no matches, try related job categories
    if (filteredJobs.length === 0) {
      console.log('🔍 Trying related categories...');
      const relatedCategories = getRelatedCategories(searchQuery);
      console.log('🔍 Related categories:', relatedCategories);
      
      filteredJobs = sampleJobs.filter(job => 
        relatedCategories.some(category => 
          job.category.toLowerCase().includes(category.toLowerCase())
        )
      );
      
      console.log('🔍 Related category matches found:', filteredJobs.length);
    }
    
    // If still no matches, try generating jobs for the query
    if (filteredJobs.length === 0) {
      console.log('🔍 Generating jobs for query:', searchQuery);
      filteredJobs = generateJobsForQuery(searchQuery, sampleJobs, limit);
      console.log('🔍 Generated jobs:', filteredJobs.length);
    }
  }

  if (location && location.trim()) {
    const searchLocation = location.toLowerCase();
    filteredJobs = filteredJobs.filter(job => 
      job.location.toLowerCase().includes(searchLocation)
    );
    console.log('🔍 After location filter:', filteredJobs.length);
  }

  // If still no results, return some general jobs
  if (filteredJobs.length === 0) {
    console.log('🔍 No matches found, returning general jobs');
    filteredJobs = sampleJobs.slice(0, Math.min(limit, 20));
  }

  // Limit results
  const result = filteredJobs.slice(0, limit);
  console.log('🔍 Final result:', result.length, 'jobs');
  return result;
};

// Helper function to get related categories based on query
const getRelatedCategories = (query) => {
  const queryLower = query.toLowerCase();
  const categoryMap = {
    'developer': ['Information Technology', 'Engineering'],
    'engineer': ['Engineering', 'Information Technology'],
    'designer': ['Design', 'Information Technology'],
    'manager': ['Administrative', 'Sales & Marketing', 'Human Resources'],
    'analyst': ['Finance & Banking', 'Information Technology'],
    'nurse': ['Healthcare & Medical'],
    'teacher': ['Education & Training'],
    'driver': ['Transportation'],
    'sales': ['Sales & Marketing', 'Retail'],
    'marketing': ['Sales & Marketing'],
    'accountant': ['Finance & Banking'],
    'lawyer': ['Legal'],
    'doctor': ['Healthcare & Medical'],
    'chef': ['Hospitality'],
    'pilot': ['Transportation'],
    'writer': ['Media & Communications'],
    'artist': ['Design', 'Media & Communications'],
    'scientist': ['Information Technology', 'Healthcare & Medical'],
    'technician': ['Manufacturing', 'Information Technology'],
    'coordinator': ['Administrative', 'Human Resources'],
    'specialist': ['Healthcare & Medical', 'Information Technology'],
    'consultant': ['Finance & Banking', 'Information Technology'],
    'director': ['Administrative', 'Media & Communications'],
    'supervisor': ['Manufacturing', 'Retail', 'Construction'],
    'assistant': ['Administrative', 'Healthcare & Medical'],
    'agent': ['Sales & Marketing', 'Real Estate'],
    'officer': ['Finance & Banking', 'Government'],
    'clerk': ['Administrative', 'Retail'],
    'operator': ['Manufacturing', 'Transportation'],
    'worker': ['Manufacturing', 'Construction', 'Retail']
  };
  
  const related = [];
  for (const [keyword, categories] of Object.entries(categoryMap)) {
    if (queryLower.includes(keyword)) {
      related.push(...categories);
    }
  }
  
  return [...new Set(related)]; // Remove duplicates
};

// Helper function to generate jobs for specific queries
const generateJobsForQuery = (query, sampleJobs, limit) => {
  const queryLower = query.toLowerCase();
  const generatedJobs = [];
  
  // Create job variations based on the query
  const jobTitles = [
    `${query} Specialist`,
    `Senior ${query}`,
    `Junior ${query}`,
    `${query} Manager`,
    `${query} Coordinator`,
    `${query} Assistant`,
    `${query} Analyst`,
    `${query} Consultant`,
    `${query} Developer`,
    `${query} Engineer`
  ];
  
  const companies = [
    'TechCorp Inc.', 'Global Solutions', 'Innovation Industries', 'Strategic Partners',
    'Digital Innovations', 'Future Systems', 'Advanced Technologies', 'Creative Solutions'
  ];
  
  const locations = [
    'New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX', 'Phoenix, AZ',
    'Philadelphia, PA', 'San Antonio, TX', 'San Diego, CA', 'Dallas, TX', 'San Jose, CA'
  ];
  
  for (let i = 0; i < Math.min(limit, 10); i++) {
    const randomTitle = jobTitles[Math.floor(Math.random() * jobTitles.length)];
    const randomCompany = companies[Math.floor(Math.random() * companies.length)];
    const randomLocation = locations[Math.floor(Math.random() * locations.length)];
    
    generatedJobs.push({
      _id: `generated_${Date.now()}_${i}`,
      title: randomTitle,
      company: randomCompany,
      location: randomLocation,
      type: 'Full-time',
      salary: '$50,000 - $80,000',
      description: `We are looking for a ${randomTitle.toLowerCase()} to join our team. This position offers great opportunities for growth and development in a dynamic work environment.`,
      postedDate: new Date().toISOString(),
      category: 'General',
      applyUrl: `https://example.com/apply/${Date.now()}_${i}`,
      remote: Math.random() > 0.7
    });
  }
  
  return generatedJobs;
};

export const getFallbackJobsByCategory = (category, limit = 20) => {
  // Get all jobs first to ensure we have enough data for filtering
  const allJobs = generateSampleJobs();
  
  if (category === 'all') {
    return allJobs.slice(0, limit);
  }
  
  const categoryJobs = allJobs.filter(job => 
    job.category.toLowerCase() === category.toLowerCase()
  );
  
  return categoryJobs.slice(0, limit);
};

// Get all job categories without counts
export const getJobCategories = () => {
  return [
    { title: "Information Technology", icon: "laptop", color: "#3B82F6" },
    { title: "Healthcare & Medical", icon: "medical", color: "#10B981" },
    { title: "Finance & Banking", icon: "card", color: "#F59E0B" },
    { title: "Education & Training", icon: "school", color: "#8B5CF6" },
    { title: "Sales & Marketing", icon: "trending-up", color: "#EF4444" },
    { title: "Engineering", icon: "construct", color: "#06B6D4" },
    { title: "Customer Service", icon: "headset", color: "#84CC16" },
    { title: "Human Resources", icon: "people", color: "#F97316" },
    { title: "Administrative", icon: "document-text", color: "#6366F1" },
    { title: "Construction", icon: "hammer", color: "#A78BFA" },
    { title: "Manufacturing", icon: "build", color: "#14B8A6" },
    { title: "Retail", icon: "storefront", color: "#F43F5E" },
    { title: "Design", icon: "color-palette", color: "#EC4899" },
    { title: "Transportation", icon: "car", color: "#0EA5E9" },
    { title: "Hospitality", icon: "restaurant", color: "#22C55E" },
    { title: "Legal", icon: "scale", color: "#6B7280" },
    { title: "Real Estate", icon: "home", color: "#F59E0B" },
    { title: "Media & Communications", icon: "megaphone", color: "#8B5CF6" },
    { title: "Non-Profit", icon: "heart", color: "#EF4444" },
    { title: "Government", icon: "shield", color: "#374151" }
  ];
};
