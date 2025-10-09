// Firebase configuration for React Native/Expo
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAqP5mkjmgHpyzmVppKRk_8Ny7h3iND0vE",
  authDomain: "canhiring-ca.firebaseapp.com",
  projectId: "canhiring-ca",
  storageBucket: "canhiring-ca.firebasestorage.app",
  messagingSenderId: "1056852421529",
  appId: "1:1056852421529:web:a7350914277647e684c108",
  measurementId: "G-WJGZBY30Z1"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Initialize Firebase Auth
export const auth = firebase.auth();

// COMMENTED OUT: Google Auth Provider
// Initialize Google Auth Provider
// export const googleProvider = new firebase.auth.GoogleAuthProvider();

// Configure Google Auth Provider
// googleProvider.setCustomParameters({
//   prompt: 'select_account'
// });

// Placeholder export to prevent import errors
export const googleProvider = null;

export default firebase;
