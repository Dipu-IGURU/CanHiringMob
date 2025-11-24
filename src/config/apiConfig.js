// API Configuration for React Native
// Note: In production builds, API key should be set via environment variables in EAS build config
// For development, a fallback key is provided (only works in __DEV__ mode)
const getRapidApiKey = () => {
  // First, try environment variable (highest priority)
  if (process.env.EXPO_PUBLIC_RAPIDAPI_KEY && process.env.EXPO_PUBLIC_RAPIDAPI_KEY !== 'your_rapidapi_key_here') {
    return process.env.EXPO_PUBLIC_RAPIDAPI_KEY;
  }
  
  // For development only, use fallback key
  // In production builds, this will be empty and should be set via EAS env vars
  if (__DEV__) {
    // Development fallback - replace with your actual key or set via .env file
    return '3fe89ef3cfmsha78975fefe8bf57p1579b2jsnb1b2ec2377d9';
  }
  
  // Production: return empty if not set (will show error)
  return '';
};

export const API_CONFIG = {
  RAPIDAPI_KEY: getRapidApiKey(),
  RAPIDAPI_HOST: process.env.EXPO_PUBLIC_RAPIDAPI_HOST || 'jsearch.p.rapidapi.com',
  JSEARCH_BASE_URL: process.env.EXPO_PUBLIC_JSEARCH_BASE_URL || 'https://jsearch.p.rapidapi.com'
};

// Warn if API key is missing in production
if (!__DEV__ && !API_CONFIG.RAPIDAPI_KEY) {
  console.warn('⚠️ RAPIDAPI_KEY not set in production build. Set it via EAS build environment variables.');
}

export default API_CONFIG;
