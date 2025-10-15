import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config/environment';

// Track API job application
export const trackApiJobApplication = async (token, jobData) => {
  try {
    console.log('🔍 trackApiJobApplication: Starting request...');
    console.log('🔍 trackApiJobApplication: Job data:', jobData);
    
    // Extract apply URL from various possible fields
    const applyUrl = jobData.apply_url || jobData.job_apply_link || jobData.applyUrl || jobData.job_apply_url;
    console.log('🔍 trackApiJobApplication: Extracted applyUrl:', applyUrl);
    
    const applicationData = {
      jobId: jobData.job_id || jobData.id || `api_${Date.now()}`, // Generate unique ID for API jobs
      jobTitle: jobData.title,
      company: jobData.company,
      location: jobData.location,
      jobType: jobData.type || 'Full-time',
      applyUrl: applyUrl, // Can be null if not available
      source: 'api', // Mark as API job
      appliedAt: new Date().toISOString(),
      status: 'pending'
    };

    const response = await fetch(`${API_BASE_URL}/api/applications/track-api-job`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(applicationData),
      timeout: 30000,
    });

    console.log('🔍 trackApiJobApplication: Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('🔍 trackApiJobApplication: Error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const data = await response.json();
    console.log('🔍 trackApiJobApplication: Success response:', JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error('❌ trackApiJobApplication: Error tracking API job application:', error);
    return {
      success: false,
      message: 'Failed to track API job application: ' + error.message
    };
  }
};

// Check application limits
export const checkApplicationLimits = async (token) => {
  try {
    console.log('🔍 checkApplicationLimits: Starting request...');
    
    const response = await fetch(`${API_BASE_URL}/api/applications/limits`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });

    console.log('🔍 checkApplicationLimits: Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('🔍 checkApplicationLimits: Error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const data = await response.json();
    console.log('🔍 checkApplicationLimits: Success response:', JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error('❌ checkApplicationLimits: Error checking application limits:', error);
    return {
      success: false,
      message: 'Failed to check application limits',
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

// Get application statistics
export const getApplicationStats = async (token) => {
  try {
    console.log('🔍 getApplicationStats: Starting request...');
    
    const response = await fetch(`${API_BASE_URL}/api/profile/applied-jobs/stats`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });

    console.log('🔍 getApplicationStats: Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('🔍 getApplicationStats: Error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const data = await response.json();
    console.log('🔍 getApplicationStats: Success response:', JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error('❌ getApplicationStats: Error fetching application stats:', error);
    return {
      success: false,
      message: 'Failed to fetch application stats',
      stats: {
        total: 0,
        pending: 0,
        reviewed: 0,
        rejected: 0,
        changeFromLastWeek: 0
      }
    };
  }
};

// Get recent activities
export const getRecentActivities = async (token, limit = 10) => {
  try {
    console.log('🔍 getRecentActivities: Starting request...');
    
    const response = await fetch(`${API_BASE_URL}/api/applications/recent-activities?limit=${limit}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });

    console.log('🔍 getRecentActivities: Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('🔍 getRecentActivities: Error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const data = await response.json();
    console.log('🔍 getRecentActivities: Success response:', JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error('❌ getRecentActivities: Error fetching recent activities:', error);
    return {
      success: false,
      message: 'Failed to fetch recent activities',
      activities: []
    };
  }
};

export default {
  trackApiJobApplication,
  checkApplicationLimits,
  getApplicationStats,
  getRecentActivities
};
