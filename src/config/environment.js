// Environment configuration for different build types
import { Platform } from 'react-native';

// Environment detection
const isDevelopment = __DEV__;
const isWeb = Platform.OS === 'web';
const isAndroid = Platform.OS === 'android';
const isIOS = Platform.OS === 'ios';

// API Configuration
const API_CONFIG = {
  // Production Firebase backend (for APK builds)
  production: 'https://us-central1-canhiring-ca.cloudfunctions.net/api',
  
  // Development configurations
  development: {
    web: 'http://localhost:5001',
    mobile: 'http://192.168.1.28:5001' // Use actual IP for mobile development
  }
};

// Get the appropriate API base URL
export const getApiBaseUrl = () => {
  // Check if environment variable is set (highest priority)
  if (process.env.EXPO_PUBLIC_API_BASE_URL) {
    console.log('🌐 Using EXPO_PUBLIC_API_BASE_URL:', process.env.EXPO_PUBLIC_API_BASE_URL);
    return process.env.EXPO_PUBLIC_API_BASE_URL;
  }
  
  // For development builds - prioritize local server
  if (isDevelopment) {
    if (isWeb) {
      console.log('🌐 Development Web: Using localhost');
      return API_CONFIG.development.web;
    } else {
      console.log('🌐 Development Mobile: Using local IP');
      return API_CONFIG.development.mobile;
    }
  }
  
  // For production builds (APK) - use Firebase backend
  console.log('🌐 Production: Using Firebase backend');
  return API_CONFIG.production;
};

// Export the API base URL
export const API_BASE_URL = getApiBaseUrl();

// Environment info for debugging
export const ENVIRONMENT_INFO = {
  isDevelopment,
  isWeb,
  isAndroid,
  isIOS,
  apiBaseUrl: API_BASE_URL,
  platform: Platform.OS,
  version: Platform.Version
};

// Log environment info
console.log('🌐 Environment Configuration:', ENVIRONMENT_INFO);

export default {
  API_BASE_URL,
  ENVIRONMENT_INFO,
  getApiBaseUrl
};
