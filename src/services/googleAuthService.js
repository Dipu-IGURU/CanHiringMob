import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';

// Configure WebBrowser for better UX
WebBrowser.maybeCompleteAuthSession();

// Google OAuth configuration
// You need to create a proper OAuth client ID in Google Console
// Go to: https://console.developers.google.com/
// 1. Create a new project or select existing one
// 2. Enable Google+ API
// 3. Create OAuth 2.0 credentials
// 4. Add authorized redirect URIs:
//    - For development: http://localhost:19006
//    - For Expo: canhiring://auth
//    - For web: https://yourdomain.com/auth
// Use the Android client ID for both development and APK builds
const GOOGLE_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || '645343269585-6up0bko2ib0rl3att1m5q6chhej8sk3h.apps.googleusercontent.com';

// Use a redirect URI that works with Android client IDs
const GOOGLE_REDIRECT_URI = AuthSession.makeRedirectUri({
  useProxy: true,
});

// Debug: Log the redirect URI
console.log('🔐 Google Auth: Redirect URI:', GOOGLE_REDIRECT_URI);
console.log('🔐 Google Auth: Client ID:', GOOGLE_CLIENT_ID);
console.log('🔐 Google Auth: Full redirect URI details:', {
  redirectUri: GOOGLE_REDIRECT_URI,
  clientId: GOOGLE_CLIENT_ID,
  useProxy: true
});

// Google OAuth endpoints
const discovery = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
  revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
};

export const googleAuthService = {
  // Sign in with Google using Expo AuthSession
  signInWithGoogle: async () => {
    try {
      console.log('🔐 Google Auth: Starting Google sign-in process...');
      console.log('🔐 Google Auth: Redirect URI:', GOOGLE_REDIRECT_URI);
      console.log('🔐 Google Auth: Platform:', Platform.OS);
      
      // Create auth request
      const request = new AuthSession.AuthRequest({
        clientId: GOOGLE_CLIENT_ID,
        scopes: ['openid', 'profile', 'email'],
        redirectUri: GOOGLE_REDIRECT_URI,
        responseType: AuthSession.ResponseType.Code,
        extraParams: {},
        additionalParameters: {},
        prompt: AuthSession.Prompt.SelectAccount,
      });

      // Start authentication
      const result = await request.promptAsync(discovery);
      
      if (result.type === 'success') {
        console.log('🔐 Google Auth: Authorization successful, exchanging code for token...');
        
        // Exchange authorization code for access token
        const tokenResult = await AuthSession.exchangeCodeAsync(
          {
            clientId: GOOGLE_CLIENT_ID,
            code: result.params.code,
            redirectUri: GOOGLE_REDIRECT_URI,
            extraParams: {
              code_verifier: request.codeVerifier,
            },
          },
          discovery
        );

        console.log('🔐 Google Auth: Token exchange successful');

        // Get user info from Google
        const userInfoResponse = await fetch(
          `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${tokenResult.accessToken}`
        );
        const userInfo = await userInfoResponse.json();

        console.log('🔐 Google Auth: User info retrieved:', userInfo.email);

        // Return user data directly without Firebase
        return {
          success: true,
          user: {
            uid: userInfo.id,
            email: userInfo.email,
            displayName: userInfo.name,
            photoURL: userInfo.picture,
            emailVerified: userInfo.verified_email,
            provider: 'google'
          },
          token: tokenResult.accessToken,
          idToken: tokenResult.idToken
        };
      } else if (result.type === 'cancel') {
        return {
          success: false,
          message: 'Google sign-in was cancelled by user.'
        };
      } else {
        return {
          success: false,
          message: 'Google sign-in failed. Please try again.'
        };
      }
    } catch (error) {
      console.error('❌ Google Auth Error:', error);
      
      if (error.code === 'auth/account-exists-with-different-credential') {
        return {
          success: false,
          message: 'An account already exists with this email address using a different sign-in method.'
        };
      }
      
      if (error.code === 'auth/invalid-credential') {
        return {
          success: false,
          message: 'Invalid Google credentials. Please try again.'
        };
      }
      
      return {
        success: false,
        message: error.message || 'Google sign-in failed. Please try again.'
      };
    }
  },

  // Sign out from Google
  signOut: async () => {
    try {
      console.log('🔐 Google Auth: Signing out from Google...');
      
      // For OAuth, we just need to clear local tokens
      // The actual sign out happens when the user clears their session
      console.log('🔐 Google Auth: Sign out successful');
      return { success: true };
    } catch (error) {
      console.error('❌ Google Auth Sign Out Error:', error);
      return {
        success: false,
        message: error.message || 'Sign out failed. Please try again.'
      };
    }
  },

  // Check if user is signed in with Google
  isSignedIn: async () => {
    try {
      // For OAuth, we check if we have stored tokens
      // This would typically check AsyncStorage or similar
      return false; // Simplified for now
    } catch (error) {
      console.error('❌ Google Auth Check Error:', error);
      return false;
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      // For OAuth, we would retrieve user from stored data
      return null; // Simplified for now
    } catch (error) {
      console.error('❌ Google Auth Get User Error:', error);
      return null;
    }
  }
};

export default googleAuthService;