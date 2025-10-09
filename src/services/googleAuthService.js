// COMMENTED OUT: Google Authentication Service
// import { auth } from '../config/firebase';
// import { GoogleSignin } from '@react-native-google-signin/google-signin';

// // Configure Google Sign-In
// GoogleSignin.configure({
//   webClientId: '1056852421529-a7350914277647e684c108.apps.googleusercontent.com', // From Firebase config
//   offlineAccess: true,
//   hostedDomain: '',
//   forceCodeForRefreshToken: true,
// });

// export const googleAuthService = {
//   // Sign in with Google
//   signInWithGoogle: async () => {
//     try {
//       console.log('🔐 Google Auth: Starting Google sign-in process...');
      
//       // Check if your device supports Google Play
//       await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      
//       // Get the users ID token
//       const { idToken, user } = await GoogleSignin.signIn();
//       console.log('🔐 Google Auth: Google sign-in successful, user:', user.email);
      
//       // Create a Google credential with the token
//       const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      
//       // Sign-in the user with the credential
//       const result = await auth.signInWithCredential(googleCredential);
//       console.log('🔐 Google Auth: Firebase authentication successful');
      
//       return {
//         success: true,
//         user: {
//           uid: result.user.uid,
//           email: result.user.email,
//           displayName: result.user.displayName,
//           photoURL: result.user.photoURL,
//           emailVerified: result.user.emailVerified,
//           provider: 'google'
//         },
//         token: await result.user.getIdToken()
//       };
//     } catch (error) {
//       console.error('❌ Google Auth Error:', error);
      
//       if (error.code === 'auth/account-exists-with-different-credential') {
//         return {
//           success: false,
//           message: 'An account already exists with this email address using a different sign-in method.'
//         };
//       }
      
//       if (error.code === 'auth/invalid-credential') {
//         return {
//           success: false,
//           message: 'Invalid Google credentials. Please try again.'
//         };
//       }
      
//       return {
//         success: false,
//         message: error.message || 'Google sign-in failed. Please try again.'
//       };
//     }
//   },

//   // Sign out from Google
//   signOut: async () => {
//     try {
//       console.log('🔐 Google Auth: Signing out from Google...');
      
//       // Sign out from Google
//       await GoogleSignin.signOut();
      
//       // Sign out from Firebase
//       await auth.signOut();
      
//       console.log('🔐 Google Auth: Sign out successful');
//       return { success: true };
//     } catch (error) {
//       console.error('❌ Google Auth Sign Out Error:', error);
//       return {
//         success: false,
//         message: error.message || 'Sign out failed. Please try again.'
//       };
//     }
//   },

//   // Check if user is signed in with Google
//   isSignedIn: async () => {
//     try {
//       const isSignedIn = await GoogleSignin.isSignedIn();
//       return isSignedIn;
//     } catch (error) {
//       console.error('❌ Google Auth Check Error:', error);
//       return false;
//     }
//   },

//   // Get current user
//   getCurrentUser: async () => {
//     try {
//       const user = await GoogleSignin.getCurrentUser();
//       return user;
//     } catch (error) {
//       console.error('❌ Google Auth Get User Error:', error);
//       return null;
//     }
//   }
// };

// Placeholder export to prevent import errors
export const googleAuthService = {
  signInWithGoogle: async () => {
    return { success: false, message: 'Google authentication is disabled' };
  },
  signOut: async () => {
    return { success: false, message: 'Google authentication is disabled' };
  },
  isSignedIn: async () => {
    return false;
  },
  getCurrentUser: async () => {
    return null;
  }
};

export default googleAuthService;