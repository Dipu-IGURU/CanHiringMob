// API Configuration
export const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:5001'  // Local development server
  : 'https://can-hiring.onrender.com';  // Production server

// Helper function to get cached data with expiration
const getCachedData = (key) => {
  const cached = localStorage.getItem(key);
  if (!cached) return null;
  
  try {
    const { data, timestamp } = JSON.parse(cached);
    const now = new Date().getTime();
    const fifteenMinutes = 15 * 60 * 1000; // 15 minutes in milliseconds
    
    if (now - timestamp < fifteenMinutes) {
      return data;
    }
  } catch (e) {
    console.error('Error parsing cached data:', e);
  }
  return null;
};

// Helper function to set data in cache
const setCachedData = (key, data) => {
  const cacheData = {
    data,
    timestamp: new Date().getTime()
  };
  try {
    localStorage.setItem(key, JSON.stringify(cacheData));
  } catch (e) {
    console.error('Error saving to cache:', e);
  }
};

// Fetch job categories with position counts
export const fetchJobCategories = async () => {
  try {
    // Check cache first
    const cachedCategories = getCachedData('jobCategories');
    if (cachedCategories) {
      return cachedCategories;
    }

    // Define all job categories to fetch with employment type filters
    const categoriesToFetch = [
      { title: "Information Technology", query: "software developer OR programmer OR IT specialist" },
      { title: "Healthcare & Medical", query: "nurse OR doctor OR healthcare worker" },
      { title: "Finance & Banking", query: "financial analyst OR banker OR accountant" },
      { title: "Education & Training", query: "teacher OR instructor OR trainer" },
      { title: "Sales & Marketing", query: "sales representative OR marketing specialist" },
      { title: "Engineering", query: "engineer OR engineering technician" },
      { title: "Customer Service", query: "customer service representative OR support agent" },
      { title: "Human Resources", query: "HR specialist OR recruiter OR human resources" },
      { title: "Administrative", query: "administrative assistant OR office manager" },
      { title: "Construction", query: "construction worker OR contractor OR builder" },
      { title: "Manufacturing", query: "manufacturing worker OR production operator" },
      { title: "Retail", query: "retail sales OR store manager OR cashier" },
    ];

    // Fetch job counts for each category using JSearch API
    const categoryPromises = categoriesToFetch.map(async (category) => {
      try {
        // For now, we'll use mock data since we don't have JSearch API keys in the mobile app
        // In a real implementation, you would make API calls here
        const mockCount = Math.floor(Math.random() * 1000) + 50;
        return {
          title: category.title,
          positions: mockCount
        };
      } catch (error) {
        console.error(`Error fetching count for ${category.title}:`, error);
        return {
          title: category.title,
          positions: 0
        };
      }
    });

    const categories = await Promise.all(categoryPromises);
    
    // Cache the results
    setCachedData('jobCategories', categories);
    
    return categories;
  } catch (error) {
    console.error('Error fetching job categories:', error);
    
    // Return fallback categories if API fails
    return [
      { title: "Information Technology", positions: 1250 },
      { title: "Healthcare & Medical", positions: 890 },
      { title: "Finance & Banking", positions: 650 },
      { title: "Education & Training", positions: 420 },
      { title: "Sales & Marketing", positions: 780 },
      { title: "Engineering", positions: 920 },
      { title: "Customer Service", positions: 340 },
      { title: "Human Resources", positions: 280 },
    ];
  }
};

// Fetch jobs by category
export const fetchJobsByCategory = async (category, page = 1, limit = 10) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/jobs?category=${encodeURIComponent(category)}&page=${page}&limit=${limit}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.success) {
      return data.data || [];
    } else {
      throw new Error(data.message || 'Failed to fetch jobs');
    }
  } catch (error) {
    console.error('Error fetching jobs by category:', error);
    
    // Return mock data if API fails
    return [
      {
        _id: '1',
        title: `Senior ${category} Developer`,
        company: 'TechCorp',
        location: 'Toronto, ON',
        type: 'Full-time',
        salary: '$80,000 - $120,000',
        description: `We are looking for an experienced ${category} professional to join our team...`,
        postedDate: new Date().toISOString(),
        category: category
      },
      {
        _id: '2',
        title: `${category} Specialist`,
        company: 'InnovateX',
        location: 'Vancouver, BC',
        type: 'Full-time',
        salary: '$70,000 - $100,000',
        description: `Join our team as a ${category} specialist and help drive our business forward...`,
        postedDate: new Date().toISOString(),
        category: category
      }
    ];
  }
};

// Fetch all public jobs
export const fetchAllJobs = async (page = 1, limit = 20) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/jobs?page=${page}&limit=${limit}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.success) {
      return data.data || [];
    } else {
      throw new Error(data.message || 'Failed to fetch jobs');
    }
  } catch (error) {
    console.error('Error fetching all jobs:', error);
    return [];
  }
};

// Search jobs
export const searchJobs = async (query, location = '', page = 1, limit = 20) => {
  try {
    const searchParams = new URLSearchParams({
      query: query,
      page: page.toString(),
      limit: limit.toString()
    });
    
    if (location) {
      searchParams.append('location', location);
    }

    const response = await fetch(
      `${API_BASE_URL}/api/jobs/search?${searchParams.toString()}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.success) {
      return data.data || [];
    } else {
      throw new Error(data.message || 'Failed to search jobs');
    }
  } catch (error) {
    console.error('Error searching jobs:', error);
    return [];
  }
};

// Get total job count
export const getTotalJobCount = async () => {
  try {
    // Check cache first
    const cachedTotal = getCachedData('totalJobs');
    if (cachedTotal !== null) {
      return cachedTotal;
    }

    const response = await fetch(`${API_BASE_URL}/api/jobs/count`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.success) {
      const total = data.count || 0;
      setCachedData('totalJobs', total);
      return total;
    } else {
      throw new Error(data.message || 'Failed to fetch job count');
    }
  } catch (error) {
    console.error('Error fetching total job count:', error);
    
    // Return a mock total count
    const mockTotal = 93178;
    setCachedData('totalJobs', mockTotal);
    return mockTotal;
  }
};

// Get application details by ID
export const getApplicationDetails = async (applicationId, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/applications/${applicationId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching application details:', error);
    return {
      success: false,
      message: 'Failed to fetch application details'
    };
  }
};

// Get user applications
export const getUserApplications = async (token, page = 1, limit = 10) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/applications/user?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user applications:', error);
    return {
      success: false,
      message: 'Failed to fetch user applications',
      data: []
    };
  }
};

// Get application statistics
export const getApplicationStats = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/applications/stats`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching application stats:', error);
    return {
      success: false,
      message: 'Failed to fetch application stats',
      stats: {
        total: 0,
        pending: 0,
        reviewed: 0,
        rejected: 0
      }
    };
  }
};

// Get interview statistics
export const getInterviewStats = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/applications/interview-stats`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching interview stats:', error);
    return {
      success: false,
      message: 'Failed to fetch interview stats',
      stats: {
        totalInterviews: 0,
        upcomingInterviews: 0,
        completedInterviews: 0
      }
    };
  }
};

// Get profile view statistics
export const getProfileStats = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/profile/stats`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching profile stats:', error);
    return {
      success: false,
      message: 'Failed to fetch profile stats',
      stats: {
        totalViews: 0,
        lastMonthViews: 0,
        percentageChange: 0
      }
    };
  }
};

// Track profile view
export const trackProfileView = async (token, viewedUserId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/profile/view`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ viewedUserId }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error tracking profile view:', error);
    return {
      success: false,
      message: 'Failed to track profile view'
    };
  }
};

// Get recent activities
export const getRecentActivities = async (token, limit = 10) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/applications/recent-activities?limit=${limit}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching recent activities:', error);
    return {
      success: false,
      message: 'Failed to fetch recent activities',
      activities: []
    };
  }
};

// Get job offers statistics
export const getOffersStats = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/applications/offers-stats`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching offers stats:', error);
    return {
      success: false,
      message: 'Failed to fetch offers stats',
      stats: {
        totalOffers: 0,
        lastMonthOffers: 0
      }
    };
  }
};

// Get application limits and usage
export const getApplicationLimits = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/applications/limits`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching application limits:', error);
    return {
      success: false,
      message: 'Failed to fetch application limits',
      data: {
        current: 0,
        max: 5,
        remaining: 5,
        percentage: 0,
        plan: 'free',
        planName: 'Free Plan',
        isLimitReached: false
      }
    };
  }
};

// Get user's applied jobs (similar to Workly implementation)
export const getAppliedJobs = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/applied-jobs`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching applied jobs:', error);
    return {
      success: false,
      message: 'Failed to fetch applied jobs',
      jobs: []
    };
  }
};

// Fetch featured companies from database (Workly approach)
export const fetchFeaturedCompanies = async (limit = 12) => {
  try {
    // First, try the dedicated companies endpoint
    const companiesResponse = await fetch(`${API_BASE_URL}/api/jobs/companies?limit=${limit}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (companiesResponse.ok) {
      const companiesData = await companiesResponse.json();
      if (companiesData.success && companiesData.companies && companiesData.companies.length > 0) {
        console.log('✅ Using dedicated companies endpoint:', companiesData.companies.length, 'companies');
        return companiesData.companies;
      }
    }

    // Fallback: Fetch jobs and group by company (Workly approach)
    console.log('📊 No companies from dedicated endpoint, fetching jobs to group by company...');
    const jobsResponse = await fetch(`${API_BASE_URL}/api/jobs?limit=100`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!jobsResponse.ok) {
      throw new Error(`HTTP error! status: ${jobsResponse.status}`);
    }

    const jobsData = await jobsResponse.json();
    
    if (jobsData.success && jobsData.data && Array.isArray(jobsData.data)) {
      // Group jobs by company
      const companyMap = {};
      jobsData.data.forEach((job) => {
        const companyName = job.company || 'Unknown Company';
        if (!companyMap[companyName]) {
          companyMap[companyName] = {
            id: Object.keys(companyMap).length + 1,
            name: companyName,
            jobs: 0,
            logo: companyName.substring(0, 2).toUpperCase(),
            locations: [],
            jobTypes: []
          };
        }
        companyMap[companyName].jobs += 1;
        
        // Add unique locations
        if (job.location && !companyMap[companyName].locations.includes(job.location)) {
          companyMap[companyName].locations.push(job.location);
        }
        
        // Add unique job types
        if (job.type && !companyMap[companyName].jobTypes.includes(job.type)) {
          companyMap[companyName].jobTypes.push(job.type);
        }
      });

      // Convert to array and sort by job count
      const companies = Object.values(companyMap)
        .sort((a, b) => b.jobs - a.jobs)
        .slice(0, limit);

      console.log('✅ Grouped companies from jobs:', companies.length, 'companies');
      return companies;
    } else {
      throw new Error('No jobs data available');
    }
  } catch (error) {
    console.error('Error fetching featured companies:', error);
    
    // Return empty array instead of dummy data to show real state
    console.log('⚠️  No real company data available - returning empty array');
    return [];
  }
};
