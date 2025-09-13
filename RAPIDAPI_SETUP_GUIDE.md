# RapidAPI Setup Guide - Fix 403/429 Errors

## 🚨 Current Issues
- **403 Forbidden**: Your RapidAPI key is invalid or expired
- **429 Too Many Requests**: You're hitting the rate limit

## ✅ Solutions Applied

### 1. **Improved Rate Limiting**
- Reduced from 10 to **2 requests per minute**
- Added 2-second delay between requests
- Added 30-second wait on rate limit errors
- Prevented multiple simultaneous requests

### 2. **Reduced API Load**
- Changed from 3 pages to **1 page per request**
- Added request queuing to prevent overlapping calls

## 🔑 Get a Valid RapidAPI Key

### Step 1: Go to RapidAPI
1. Visit: https://rapidapi.com/
2. Sign up or log in to your account

### Step 2: Subscribe to JSearch API
1. Go to: https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch/
2. Click "Subscribe to Test"
3. Choose the **Basic Plan** (Free tier: 100 requests/month)

### Step 3: Get Your API Key
1. After subscribing, go to your dashboard
2. Find "JSearch" in your subscribed APIs
3. Copy your API key (starts with something like `abc123...`)

### Step 4: Update Your App
1. Open `src/config/apiConfig.js`
2. Replace the current key:
```javascript
export const API_CONFIG = {
  RAPIDAPI_KEY: 'YOUR_NEW_API_KEY_HERE', // Replace this
  RAPIDAPI_HOST: 'jsearch.p.rapidapi.com',
  JSEARCH_BASE_URL: 'https://jsearch.p.rapidapi.com'
};
```

## 🎯 Expected Results

### ✅ **With Valid API Key:**
- Real job listings will appear
- Categories will show related jobs
- No more 403/429 errors
- Smooth user experience

### ⚠️ **Without API Key:**
- Empty job lists (no dummy data)
- "No jobs found" messages
- App still works but shows empty states

## 📊 Rate Limits (Free Tier)
- **100 requests per month**
- **2 requests per minute** (our current setting)
- **1 page per request** (our current setting)

## 🔧 Current Settings
```javascript
// Rate limiting
MAX_REQUESTS_PER_MINUTE = 2
RATE_LIMIT_WINDOW = 60 seconds
REQUEST_DELAY = 2 seconds

// API calls
num_pages = 1 (reduced from 3)
```

## 🚀 Next Steps
1. Get your RapidAPI key
2. Update the config file
3. Restart the app: `npx expo start --clear`
4. Test the job listings

---

**Status**: ✅ Rate limiting fixed - just need a valid API key!
