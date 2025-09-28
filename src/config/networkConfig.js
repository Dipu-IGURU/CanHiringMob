// Network configuration for APK builds
import { Platform } from 'react-native';

// Network configuration for different platforms
export const NETWORK_CONFIG = {
  // Timeout settings
  timeout: 30000, // 30 seconds
  
  // Retry configuration
  retryAttempts: 3,
  retryDelay: 1000, // 1 second
  
  // Platform-specific settings
  android: {
    // Android-specific network settings
    userAgent: 'CanHiringMob/1.0.0 (Android)',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'User-Agent': 'CanHiringMob/1.0.0 (Android)',
    }
  },
  
  web: {
    // Web-specific network settings
    userAgent: 'CanHiringMob/1.0.0 (Web)',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'User-Agent': 'CanHiringMob/1.0.0 (Web)',
    }
  }
};

// Get platform-specific configuration
export const getNetworkConfig = () => {
  const platform = Platform.OS;
  return {
    ...NETWORK_CONFIG,
    ...NETWORK_CONFIG[platform],
    platform
  };
};

// Enhanced fetch function with retry logic and better error handling
export const enhancedFetch = async (url, options = {}) => {
  const config = getNetworkConfig();
  const { retryAttempts, retryDelay, timeout } = config;
  
  // Merge headers
  const headers = {
    ...config.headers,
    ...options.headers
  };
  
  // Create fetch options with timeout
  const fetchOptions = {
    ...options,
    headers,
    timeout
  };
  
  let lastError;
  
  for (let attempt = 1; attempt <= retryAttempts; attempt++) {
    try {
      console.log(`🌐 Network request attempt ${attempt}/${retryAttempts}:`, url);
      
      const response = await fetch(url, fetchOptions);
      
      console.log(`🌐 Network response (attempt ${attempt}):`, {
        status: response.status,
        ok: response.ok,
        url: url
      });
      
      return response;
    } catch (error) {
      lastError = error;
      console.error(`❌ Network request failed (attempt ${attempt}/${retryAttempts}):`, {
        error: error.message,
        url: url
      });
      
      // Don't retry on the last attempt
      if (attempt < retryAttempts) {
        console.log(`⏳ Retrying in ${retryDelay}ms...`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }
    }
  }
  
  // If all retries failed, throw the last error
  throw lastError;
};

// Network status checker
export const checkNetworkStatus = async () => {
  try {
    const response = await fetch('https://www.google.com', {
      method: 'HEAD',
      timeout: 5000
    });
    return response.ok;
  } catch (error) {
    console.error('❌ Network status check failed:', error);
    return false;
  }
};

export default {
  NETWORK_CONFIG,
  getNetworkConfig,
  enhancedFetch,
  checkNetworkStatus
};

