# Google OAuth Setup Guide

## The Problem
You're getting a 404 error with Google OAuth because the current configuration is using a Firebase client ID instead of a proper OAuth client ID, and the redirect URIs are not properly configured.

## Solution Steps

### 1. Create Google OAuth Credentials

1. **Go to Google Cloud Console**: https://console.developers.google.com/
2. **Create or Select Project**: 
   - Create a new project or select your existing "canhiring-ca" project
3. **Enable APIs**:
   - Go to "APIs & Services" > "Library"
   - Search for "Google OAuth2 API" and enable it
   - Search for "Google Identity API" and enable it
   - Search for "Google People API" and enable it (optional, for profile data)
   
   **Note**: Do NOT use "Google+ API" - it's deprecated and will cause 404 errors!
4. **Create OAuth 2.0 Credentials**:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Web application" for the application type
   - Add these authorized redirect URIs:
     ```
     http://localhost:19006
     canhiring://auth
     https://yourdomain.com/auth (if you have a web version)
     ```

### 2. Update Environment Variables

Create a `.env` file in your project root with:

```env
# Google OAuth Configuration (from new project CanHiringMob Ca)
EXPO_PUBLIC_GOOGLE_CLIENT_ID=645343269585-3ahuroc07mb32kelnqvfd0vhma6stkav.apps.googleusercontent.com

# Backend API URL
EXPO_PUBLIC_API_BASE_URL=https://canhiringmob.onrender.com
```

### 3. Update app.json

Make sure your `app.json` has the correct scheme:

```json
{
  "expo": {
    "scheme": "canhiring",
    "plugins": [
      "expo-font",
      "@react-native-google-signin/google-signin"
    ]
  }
}
```

### 4. Test the Configuration

1. **Get your OAuth Client ID** from Google Console
2. **Update the .env file** with your actual client ID
3. **Restart your Expo development server**
4. **Test the Google Sign-In button**

## Current Issues Fixed

1. ✅ **Removed Firebase Auth dependency** from Google OAuth service
2. ✅ **Updated to use proper OAuth flow** with Expo AuthSession
3. ✅ **Added environment variable support** for client ID
4. ✅ **Simplified authentication flow** to avoid conflicts

## Important Notes

- **Don't use Firebase client IDs** for OAuth - they're different
- **Make sure redirect URIs match exactly** what you configure in Google Console
- **The scheme in app.json must match** the redirect URI scheme
- **Restart Expo server** after changing environment variables

## Testing

After setup, test by:
1. Clicking the Google Sign-In button
2. You should be redirected to Google's OAuth page
3. After authorization, you should be redirected back to your app
4. Check console logs for any remaining errors

## Troubleshooting

If you still get 404 errors:
1. Verify the client ID is correct
2. Check that redirect URIs are exactly matching
3. Ensure the Google+ API is enabled
4. Try clearing browser cache and restarting Expo
