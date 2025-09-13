import AsyncStorage from '@react-native-async-storage/async-storage';
import { searchJobsFromAPI } from './jobSearchService.js';
import { API_CONFIG } from '../config/apiConfig.js';

const RAPIDAPI_KEY = API_CONFIG.RAPIDAPI_KEY;

// API Configuration
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 
  (process.env.NODE_ENV === 'development' 
    ? 'http://localhost:5001'  // Local development server
    : 'https://can-hiring.onrender.com');  // Production server

// Helper function to get cached data with expiration
const getCachedData = async (key) => {
  try {
    const cached = await AsyncStorage.getItem(key);
    if (!cached) return null;
    
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
const setCachedData = async (key, data) => {
  const cacheData = {
    data,
    timestamp: new Date().getTime()
  };
  try {
    await AsyncStorage.setItem(key, JSON.stringify(cacheData));
  } catch (e) {
    console.error('Error saving to cache:', e);
  }
};

// Fetch job categories using jSearch API
export const fetchJobCategories = async () => {
  try {
    // Check cache first
    const cachedCategories = await getCachedData('jobCategories');
    if (cachedCategories) {
      return cachedCategories;
    }

    // Define common job categories for search with icons and colors
    const categories = [
      { 
        id: 'all', 
        name: 'All Jobs', 
        title: 'All Jobs',
        count: 0, 
        icon: 'briefcase-outline', 
        color: '#3B82F6' 
      },
      { 
        id: 'technology', 
        name: 'Technology', 
        title: 'Technology',
        count: 0, 
        icon: 'laptop-outline', 
        color: '#8B5CF6' 
      },
      { 
        id: 'healthcare', 
        name: 'Healthcare & Medical', 
        title: 'Healthcare',
        count: 0, 
        icon: 'medical-outline', 
        color: '#EF4444' 
      },
      { 
        id: 'finance', 
        name: 'Finance & Banking', 
        title: 'Finance',
        count: 0, 
        icon: 'card-outline', 
        color: '#10B981' 
      },
      { 
        id: 'education', 
        name: 'Education & Training', 
        title: 'Education',
        count: 0, 
        icon: 'school-outline', 
        color: '#F59E0B' 
      },
      { 
        id: 'marketing', 
        name: 'Sales & Marketing', 
        title: 'Marketing',
        count: 0, 
        icon: 'trending-up-outline', 
        color: '#EC4899' 
      },
      { 
        id: 'engineering', 
        name: 'Engineering', 
        title: 'Engineering',
        count: 0, 
        icon: 'construct-outline', 
        color: '#6366F1' 
      },
      { 
        id: 'customer-service', 
        name: 'Customer Service', 
        title: 'Customer Service',
        count: 0, 
        icon: 'headset-outline', 
        color: '#14B8A6' 
      },
      { 
        id: 'human-resources', 
        name: 'Human Resources', 
        title: 'HR',
        count: 0, 
        icon: 'people-outline', 
        color: '#F97316' 
      },
      { 
        id: 'administrative', 
        name: 'Administrative', 
        title: 'Admin',
        count: 0, 
        icon: 'folder-outline', 
        color: '#84CC16' 
      },
      { 
        id: 'construction', 
        name: 'Construction', 
        title: 'Construction',
        count: 0, 
        icon: 'hammer-outline', 
        color: '#F59E0B' 
      },
      { 
        id: 'manufacturing', 
        name: 'Manufacturing', 
        title: 'Manufacturing',
        count: 0, 
        icon: 'settings-outline', 
        color: '#6B7280' 
      },
      { 
        id: 'retail', 
        name: 'Retail', 
        title: 'Retail',
        count: 0, 
        icon: 'storefront-outline', 
        color: '#DC2626' 
      },
      { 
        id: 'design', 
        name: 'Design', 
        title: 'Design',
        count: 0, 
        icon: 'color-palette-outline', 
        color: '#7C3AED' 
      }
    ];
    
    // Cache the results
    await setCachedData('jobCategories', categories);
    
    return categories;
  } catch (error) {
    console.error('Error fetching job categories:', error);
    throw new Error('Failed to fetch job categories');
  }
};

// Fetch jobs by category using JSearch API
export const fetchJobsByCategory = async (category, page = 1, limit = 10) => {
  try {
    console.log('🔍 Fetching jobs by category with JSearch API:', { category, page, limit });
    
    // Map category names to search queries for better JSearch results
    // These must match the queries used in fetchJobCategories for consistency
    const categoryQueries = {
      'all': 'software developer OR programmer OR IT specialist OR engineer OR data scientist',
      'information technology': 'developer',
      'technology': 'software developer OR programmer OR IT specialist OR engineer OR data scientist',
      'healthcare & medical': 'nurse OR doctor OR healthcare worker OR medical assistant OR healthcare professional',
      'healthcare': 'nurse OR doctor OR healthcare worker OR medical assistant OR healthcare professional',
      'finance & banking': 'financial analyst OR banker OR accountant OR financial advisor OR finance manager',
      'finance': 'financial analyst OR banker OR accountant OR financial advisor OR finance manager',
      'education & training': 'teacher OR instructor OR trainer OR education coordinator OR professor',
      'education': 'teacher OR instructor OR trainer OR education coordinator OR professor',
      'sales & marketing': 'sales representative OR marketing specialist OR digital marketing OR social media manager',
      'marketing': 'sales representative OR marketing specialist OR digital marketing OR social media manager',
      'engineering': 'engineer OR engineering technician OR software engineer OR mechanical engineer',
      'customer service': 'customer service representative OR support agent OR call center',
      'human resources': 'HR specialist OR recruiter OR human resources manager OR talent acquisition',
      'administrative': 'administrative assistant OR office manager OR executive assistant OR coordinator',
      'construction': 'construction worker OR contractor OR builder OR project manager OR site supervisor',
      'manufacturing': 'manufacturing worker OR production operator OR quality control OR production manager',
      'retail': 'retail sales OR store manager OR cashier OR sales associate OR retail manager',
      'design': 'UX designer OR UI designer OR graphic designer OR web designer OR product designer'
    };

    const searchQuery = categoryQueries[category.toLowerCase()] || category;
    console.log('🔍 Category mapping:', { category, searchQuery });
    
    // First try JSearch API
    const jsearchParams = {
      query: searchQuery,
      page: page,
      num_pages: 3, // Fetch 3 pages to get 15-25 jobs
      country: 'US', // Changed to US for better results
      date_posted: 'week', // Only fetch jobs posted in the last week
      job_type: 'fulltime',
      remote_jobs_only: false
    };
    
    console.log('🔍 JSearch params:', jsearchParams);

    const jsearchResult = await searchJobsFromAPI(jsearchParams);
    
    if (jsearchResult.success && jsearchResult.jobs && jsearchResult.jobs.length > 0) {
      console.log('✅ JSearch API returned', jsearchResult.jobs.length, 'jobs for category:', category);
      // Ensure we return at least 15 jobs, up to 25
      const minJobs = 15;
      const maxJobs = Math.min(25, limit);
      const jobsToReturn = Math.max(minJobs, Math.min(maxJobs, jsearchResult.jobs.length));
      return jsearchResult.jobs.slice(0, jobsToReturn);
    } else {
      console.log('⚠️ No jobs from JSearch API, result:', jsearchResult);
      return jsearchResult.jobs || [];
    }
  } catch (error) {
    console.error('❌ Error fetching jobs by category:', error);
    // Don't throw error, return empty array to prevent app crash
    console.log('🔄 Returning empty array due to error');
    return [];
  }
};

// Fetch all public jobs using jSearch API
export const fetchAllJobs = async (page = 1, limit = 20) => {
  try {
    console.log('🔍 Fetching all jobs with jSearch API:', { page, limit });
    
    const jsearchParams = {
      query: 'software developer OR programmer OR IT specialist OR engineer OR data scientist OR nurse OR doctor OR teacher OR sales OR marketing',
      page: page,
      num_pages: 3, // Fetch 3 pages to get 15-25 jobs
      country: 'US',
      date_posted: 'week',
      job_type: 'fulltime',
      remote_jobs_only: false
    };
    
    const jsearchResult = await searchJobsFromAPI(jsearchParams);
    
    if (jsearchResult.success && jsearchResult.jobs && jsearchResult.jobs.length > 0) {
      console.log('✅ jSearch API returned', jsearchResult.jobs.length, 'jobs');
      // Ensure we return at least 15 jobs, up to 25
      const minJobs = 15;
      const maxJobs = Math.min(25, limit);
      const jobsToReturn = Math.max(minJobs, Math.min(maxJobs, jsearchResult.jobs.length));
      return jsearchResult.jobs.slice(0, jobsToReturn);
    } else {
      console.log('⚠️ No jobs from jSearch API, returning fallback jobs');
      return jsearchResult.jobs || [];
    }
  } catch (error) {
    console.error('❌ Error fetching all jobs:', error);
    // Don't throw error, return empty array to prevent app crash
    console.log('🔄 Returning empty array due to error');
    return [];
  }
};

// Search jobs using JSearch API
export const searchJobs = async (query, location = '', page = 1, limit = 20) => {
  try {
    console.log('🔍 searchJobs called with:', { query, location, page, limit });
    
    const jsearchParams = {
      query: query,
      page: page,
      num_pages: 3, // Fetch 3 pages to get 15-25 jobs
      country: 'US',
      date_posted: 'week',
      job_type: 'fulltime',
      remote_jobs_only: false
    };

    // Add location to query if provided
    if (location) {
      jsearchParams.query = `${query} ${location}`;
    }

    const jsearchResult = await searchJobsFromAPI(jsearchParams);
    
    if (jsearchResult.success && jsearchResult.jobs && jsearchResult.jobs.length > 0) {
      console.log('✅ JSearch API returned', jsearchResult.jobs.length, 'jobs');
      // Ensure we return at least 15 jobs, up to 25
      const minJobs = 15;
      const maxJobs = Math.min(25, limit);
      const jobsToReturn = Math.max(minJobs, Math.min(maxJobs, jsearchResult.jobs.length));
      return jsearchResult.jobs.slice(0, jobsToReturn);
    } else {
      console.log('⚠️ No jobs from jSearch API, returning available jobs');
      return jsearchResult.jobs || [];
    }
    
  } catch (error) {
    console.error('❌ Error in searchJobs:', error);
    // Don't throw error, return empty array to prevent app crash
    console.log('🔄 Returning empty array due to error');
    return [];
  }
};

// Get total job count using jSearch API
export const getTotalJobCount = async () => {
  try {
    // Check cache first
    const cachedTotal = await getCachedData('totalJobs');
    if (cachedTotal !== null) {
      return cachedTotal;
    }

    // Use jSearch API to get job count
    const jsearchParams = {
      query: 'software developer OR programmer OR IT specialist OR engineer OR data scientist OR nurse OR doctor OR teacher OR sales OR marketing',
      page: 1,
      num_pages: 1,
      country: 'US',
      date_posted: 'week',
      job_type: 'fulltime',
      remote_jobs_only: false
    };
    
    const jsearchResult = await searchJobsFromAPI(jsearchParams);
    
    if (jsearchResult.success && jsearchResult.jobs) {
      // Estimate total based on first page results
      const estimatedTotal = jsearchResult.jobs.length * 10; // Rough estimate
      await setCachedData('totalJobs', estimatedTotal);
      return estimatedTotal;
    } else {
      // Return 0 when no data available
      await setCachedData('totalJobs', 0);
      return 0;
    }
  } catch (error) {
    console.error('Error fetching total job count:', error);
    // Return 0 when there's an error
    await setCachedData('totalJobs', 0);
    return 0;
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
    } else if (companiesResponse.status >= 500) {
      console.log('❌ Server error, returning empty companies');
      return [];
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
      if (jobsResponse.status >= 500) {
        console.log('❌ Server error, returning empty companies');
        return [];
      }
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
    
    // Return empty array when there's an error
    console.log('❌ Returning empty companies due to error');
    return [];
  }
};
