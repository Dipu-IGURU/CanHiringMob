// API Configuration for React Native
// Note: In production builds, API key should be set via environment variables in EAS build config
// For development, a fallback key is provided (only works in __DEV__ mode)
const getOpenWebNinjaApiKey = () => {
  // Debug: Log environment variable status
  const envKey = process.env.EXPO_PUBLIC_OPENWEBNINJA_API_KEY;
  console.log('🔑 API Key Debug:', {
    exists: !!envKey,
    length: envKey ? envKey.length : 0,
    startsWith: envKey ? envKey.substring(0, 10) + '...' : 'N/A',
    isPlaceholder: envKey === 'your_secret_api_key'
  });
  
  // First, try environment variable (highest priority)
  if (envKey && envKey !== 'your_secret_api_key' && envKey.trim() !== '') {
    console.log('✅ Using OpenWeb Ninja API key from environment variable');
    return envKey;
  }
  
  // For development only, use fallback key
  // In production builds, this will be empty and should be set via EAS env vars
  if (__DEV__) {
    console.warn('⚠️ OPENWEBNINJA_API_KEY not found in environment. Please set EXPO_PUBLIC_OPENWEBNINJA_API_KEY in your .env file');
    return '';
  }
  
  // Production: return empty if not set (will show error)
  return '';
};

export const API_CONFIG = {
  OPENWEBNINJA_API_KEY: getOpenWebNinjaApiKey(),
  JSEARCH_BASE_URL: process.env.EXPO_PUBLIC_JSEARCH_BASE_URL || 'https://api.openwebninja.com/jsearch'
};

// Debug: Log final configuration
console.log('🌐 API Config:', {
  hasApiKey: !!API_CONFIG.OPENWEBNINJA_API_KEY,
  apiKeyLength: API_CONFIG.OPENWEBNINJA_API_KEY ? API_CONFIG.OPENWEBNINJA_API_KEY.length : 0,
  baseUrl: API_CONFIG.JSEARCH_BASE_URL
});

// Warn if API key is missing in production
if (!__DEV__ && !API_CONFIG.OPENWEBNINJA_API_KEY) {
  console.warn('⚠️ OPENWEBNINJA_API_KEY not set in production build. Set it via EAS build environment variables.');
}

export default API_CONFIG;
