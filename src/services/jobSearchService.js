// Job Search API Service using RapidAPI JSearch
import { API_CONFIG } from '../config/apiConfig.js';

const RAPIDAPI_KEY = API_CONFIG.RAPIDAPI_KEY;
const RAPIDAPI_HOST = API_CONFIG.RAPIDAPI_HOST;

if (!RAPIDAPI_KEY || RAPIDAPI_KEY === 'your_rapidapi_key_here') {
  console.warn('RAPIDAPI_KEY not configured. Job search will use fallback data.');
}

export const searchJobsFromAPI = async (params) => {
  try {
    if (!RAPIDAPI_KEY || RAPIDAPI_KEY === 'your_rapidapi_key_here') {
      throw new Error('RAPIDAPI_KEY not configured');
    }

    const {
      query = '',
      page = 1,
      num_pages = 1,
      country = 'US', // Changed to US for better results
      date_posted = 'all',
      job_type = 'fulltime',
      remote_jobs_only = false,
      employment_types = '',
      job_requirements = ''
    } = params;

    const url = new URL('https://jsearch.p.rapidapi.com/search');
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
    console.log('🔍 Using API key:', RAPIDAPI_KEY.substring(0, 10) + '...');
    
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': RAPIDAPI_HOST,
      },
    });
    
    console.log('🔍 JSearch API response status:', response.status);

    if (!response.ok) {
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
      throw new Error(data.message || 'Failed to fetch jobs from API');
    }
  } catch (error) {
    console.error('❌ Error fetching jobs from API:', error);
    return {
      success: false,
      message: error.message,
      jobs: []
    };
  }
};

export const getJobDetails = async (jobId) => {
  try {
    if (!RAPIDAPI_KEY || RAPIDAPI_KEY === 'your_rapidapi_key_here') {
      throw new Error('RAPIDAPI_KEY not configured');
    }

    const response = await fetch(`https://jsearch.p.rapidapi.com/job-details?job_id=${jobId}`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': RAPIDAPI_HOST,
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
    if (!RAPIDAPI_KEY || RAPIDAPI_KEY === 'your_rapidapi_key_here') {
      throw new Error('RAPIDAPI_KEY not configured');
    }

    const response = await fetch(`https://jsearch.p.rapidapi.com/search-filters?query=${encodeURIComponent(query)}`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': RAPIDAPI_HOST,
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
      success: false,
      message: error.message,
      suggestions: []
    };
  }
};
