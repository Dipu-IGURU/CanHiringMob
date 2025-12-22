// Job Search API Service using OpenWeb Ninja JSearch
import { API_CONFIG } from '../config/apiConfig.js';

const OPENWEBNINJA_API_KEY = API_CONFIG.OPENWEBNINJA_API_KEY;
const JSEARCH_BASE_URL = API_CONFIG.JSEARCH_BASE_URL;

// Rate limiting variables
let requestCount = 0;
let lastResetTime = Date.now();
const MAX_REQUESTS_PER_MINUTE = 2; // Very conservative limit to avoid 429 errors
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
let isRequestInProgress = false; // Prevent multiple simultaneous requests

// Request delay for rate limiting
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Check and enforce rate limiting
const checkRateLimit = async () => {
  const now = Date.now();
  
  // Reset counter if window has passed
  if (now - lastResetTime >= RATE_LIMIT_WINDOW) {
    requestCount = 0;
    lastResetTime = now;
  }
  
  // If we've hit the limit, wait
  if (requestCount >= MAX_REQUESTS_PER_MINUTE) {
    const waitTime = RATE_LIMIT_WINDOW - (now - lastResetTime);
    console.log(`⏳ Rate limit reached. Waiting ${Math.ceil(waitTime / 1000)} seconds...`);
    await delay(waitTime + 1000); // Add extra second for safety
    requestCount = 0;
    lastResetTime = Date.now();
  }
  
  requestCount++;
};

if (!OPENWEBNINJA_API_KEY || OPENWEBNINJA_API_KEY === 'your_secret_api_key') {
  console.warn('⚠️ OPENWEBNINJA_API_KEY not configured. Fallback data will be used.');
}


export const searchJobsFromAPI = async (params) => {
  try {
    if (!OPENWEBNINJA_API_KEY || OPENWEBNINJA_API_KEY === 'your_secret_api_key') {
      console.log('❌ OPENWEBNINJA_API_KEY not configured - returning empty results');
      return {
        success: true,
        jobs: [],
        total: 0,
        page: 1
      };
    }

    // Prevent multiple simultaneous requests
    if (isRequestInProgress) {
      console.log('⏳ Request already in progress, waiting...');
      await delay(2000); // Wait 2 seconds
    }
    
    isRequestInProgress = true;

    // Apply rate limiting
    await checkRateLimit();

    const {
      query = '',
      page = 1,
      num_pages = 1, // Reduced to 1 page to avoid rate limits
      country = 'US', // Changed to US for better results
      date_posted = 'week', // Only fetch jobs posted in the last week
      job_type = 'fulltime',
      remote_jobs_only = false,
      employment_types = '',
      job_requirements = ''
    } = params;

    const url = new URL(`${JSEARCH_BASE_URL}/search`);
    url.searchParams.append('query', query);
    url.searchParams.append('page', page.toString());
    url.searchParams.append('num_pages', num_pages.toString());
    url.searchParams.append('country', country);
    url.searchParams.append('date_posted', date_posted);
    url.searchParams.append('job_type', job_type);
    url.searchParams.append('remote_jobs_only', remote_jobs_only.toString());
    
    if (employment_types) {
      url.searchParams.append('employment_types', employment_types);
    }
    if (job_requirements) {
      url.searchParams.append('job_requirements', job_requirements);
    }

    console.log('🔍 Making JSearch API request to:', url.toString());
    console.log('🔍 Using API key:', OPENWEBNINJA_API_KEY.substring(0, 10) + '...');
    
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'x-api-key': OPENWEBNINJA_API_KEY,
      },
    });
    
    console.log('🔍 JSearch API response status:', response.status);

    if (!response.ok) {
      if (response.status === 403) {
        console.log('❌ API key invalid or expired. Returning empty results.');
        return {
          success: true,
          jobs: [],
          total: 0,
          page: 1
        };
      }
      if (response.status === 429) {
        console.log('❌ Rate limit exceeded. Waiting 30 seconds before next request...');
        await delay(30000); // Wait 30 seconds for rate limit reset
        return {
          success: true,
          jobs: [],
          total: 0,
          page: 1
        };
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('🔍 JSearch API response:', { 
      status: data.status, 
      dataLength: data.data?.length, 
      totalJobs: data.total_jobs,
      jobsPerPage: data.jobs_per_page,
      page: data.page,
      data: data.data?.slice(0, 2) // Show only first 2 jobs for debugging
    });
    
    if (data.status === 'OK' && data.data) {
      // Add delay after successful request to prevent rate limiting
      await delay(2000);
      
      return {
        success: true,
        jobs: data.data.map(job => ({
          _id: job.job_id || Math.random().toString(),
          title: job.job_title || 'No Title',
          company: job.employer_name || 'No Company',
          location: job.job_city && job.job_state ? 
            `${job.job_city}, ${job.job_state}` : 
            job.job_location || 'Location not specified',
          type: job.job_employment_type || 'Full-time',
          salary: job.job_salary ? 
            `${job.job_salary.min || 'N/A'} - ${job.job_salary.max || 'N/A'}` : 
            'Salary not specified',
          description: job.job_description || 'No description available',
          postedDate: job.job_posted_at_datetime_utc || new Date().toISOString(),
          category: job.job_title?.split(' ')[0] || 'General',
          applyUrl: job.job_apply_link,
          companyLogo: job.employer_logo,
          remote: job.job_is_remote || false
        })),
        total: data.data.length,
        page: page
      };
    } else {
      console.log('❌ JSearch API failed:', data.message || 'Unknown error');
      console.log('❌ Returning empty results');
      return {
        success: true,
        jobs: [],
        total: 0,
        page: 1
      };
    }
  } catch (error) {
    console.error('❌ Error fetching jobs from API:', error);
    console.log('❌ Returning empty results due to error');
    return {
      success: true,
      jobs: [],
      total: 0,
      page: 1
    };
  } finally {
    isRequestInProgress = false; // Reset the flag
  }
};

export const getJobDetails = async (jobId) => {
  try {
    if (!OPENWEBNINJA_API_KEY || OPENWEBNINJA_API_KEY === 'your_secret_api_key') {
      console.log('❌ OPENWEBNINJA_API_KEY not configured - returning empty job details');
      return {
        success: false,
        message: 'API key not configured'
      };
    }

    await checkRateLimit();

    const response = await fetch(`${JSEARCH_BASE_URL}/job-details?job_id=${jobId}`, {
      method: 'GET',
      headers: {
        'x-api-key': OPENWEBNINJA_API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.status === 'OK' && data.data && data.data.length > 0) {
      const job = data.data[0];
      return {
        success: true,
        job: {
          _id: job.job_id,
          title: job.job_title,
          company: job.employer_name,
          location: job.job_city && job.job_state ? 
            `${job.job_city}, ${job.job_state}` : 
            job.job_location,
          type: job.job_employment_type,
          salary: job.job_salary ? 
            `${job.job_salary.min || 'N/A'} - ${job.job_salary.max || 'N/A'}` : 
            'Salary not specified',
          description: job.job_description,
          postedDate: job.job_posted_at_datetime_utc,
          category: job.job_title?.split(' ')[0] || 'General',
          applyUrl: job.job_apply_link,
          companyLogo: job.employer_logo,
          remote: job.job_is_remote || false,
          requirements: job.job_required_skills,
          benefits: job.job_benefits
        }
      };
    } else {
      throw new Error('Job not found');
    }
  } catch (error) {
    console.error('Error fetching job details:', error);
    return {
      success: false,
      message: error.message
    };
  }
};

export const getJobSearchSuggestions = async (query) => {
  try {
    if (!OPENWEBNINJA_API_KEY || OPENWEBNINJA_API_KEY === 'your_secret_api_key') {
      console.log('❌ OPENWEBNINJA_API_KEY not configured - returning empty suggestions');
      return {
        success: true,
        suggestions: []
      };
    }

    await checkRateLimit();

    const response = await fetch(`${JSEARCH_BASE_URL}/search-filters?query=${encodeURIComponent(query)}`, {
      method: 'GET',
      headers: {
        'x-api-key': OPENWEBNINJA_API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.status === 'OK' && data.data) {
      return {
        success: true,
        suggestions: data.data
      };
    } else {
      throw new Error('Failed to fetch suggestions');
    }
  } catch (error) {
    console.error('Error fetching job search suggestions:', error);
    return {
      success: true,
      suggestions: []
    };
  }
};
