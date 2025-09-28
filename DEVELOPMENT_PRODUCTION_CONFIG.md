# 🔧 Development vs Production Configuration

## 🎯 Configuration Strategy

### **Development Mode** (Local Testing)
- **Backend**: `http://localhost:5001` (Local server)
- **CORS**: Configured for `http://localhost:8081`
- **Environment**: `__DEV__ = true`
- **Priority**: Local backend always used (ignores environment variables)

### **Production Mode** (APK Build)
- **Backend**: `https://us-central1-canhiring-ca.cloudfunctions.net/api` (Firebase Cloud Functions)
- **CORS**: Configured for mobile apps
- **Environment**: `__DEV__ = false`
- **Priority**: Uses environment variables from EAS build

## 🛠️ Technical Implementation

### **API Configuration Logic**
```javascript
const getApiBaseUrl = () => {
  // For development, always use local backend (ignore environment variable)
  if (__DEV__) {
    return 'http://localhost:5001';
  }
  
  // For production builds (APK), use environment variable or Firebase
  if (process.env.EXPO_PUBLIC_API_BASE_URL) {
    return process.env.EXPO_PUBLIC_API_BASE_URL;
  }
  
  // Fallback to Firebase Cloud Functions for production
  return 'https://us-central1-canhiring-ca.cloudfunctions.net/api';
};
```

### **Retry Logic**
```javascript
const baseUrls = [
  __DEV__ ? 'http://localhost:5001' : (process.env.EXPO_PUBLIC_API_BASE_URL || 'https://us-central1-canhiring-ca.cloudfunctions.net/api'),
  __DEV__ ? 'http://192.168.1.28:5001' : 'https://us-central1-canhiring-ca.cloudfunctions.net/api',
  __DEV__ ? 'https://us-central1-canhiring-ca.cloudfunctions.net/api' : 'http://localhost:5001'
];
```

## 📱 EAS Build Configuration

### **Preview Profile** (APK Build)
```json
{
  "preview": {
    "env": {
      "EXPO_PUBLIC_API_BASE_URL": "https://us-central1-canhiring-ca.cloudfunctions.net/api",
      "NODE_ENV": "production"
    }
  }
}
```

### **Development Profile**
```json
{
  "development": {
    "env": {
      "EXPO_PUBLIC_API_BASE_URL": "http://192.168.1.28:5001",
      "NODE_ENV": "development"
    }
  }
}
```

## 🔧 CORS Configuration

### **Local Backend** (Development)
```javascript
// server/server.js
const allowedOrigins = [
  'http://localhost:8081',  // Expo web dev server
  'http://localhost:19006', // Expo default dev server
  'http://localhost:19000', // Expo web dev server
  'http://localhost:3000',  // React Native web
  'http://localhost:5001',  // Local API server
  // ... all localhost variants
];
```

### **Firebase Backend** (Production)
- CORS configured for mobile apps
- No web browser restrictions
- Production-ready configuration

## 🚀 How It Works

### **Development Testing**
1. **Start Local Backend**: `cd server && node server.js`
2. **Start Expo**: `npx expo start --web`
3. **Open**: `http://localhost:8081`
4. **Result**: Uses `http://localhost:5001` (local backend)

### **APK Production**
1. **Build APK**: `npx eas build --platform android --profile preview`
2. **Environment**: `NODE_ENV=production`
3. **Result**: Uses `https://us-central1-canhiring-ca.cloudfunctions.net/api` (Firebase)

## 📊 Expected Behavior

### **Development Mode**
- ✅ **API Calls**: Go to `http://localhost:5001`
- ✅ **CORS**: Works with `http://localhost:8081`
- ✅ **Login**: Works with local backend
- ✅ **All Features**: Work with local data

### **Production Mode (APK)**
- ✅ **API Calls**: Go to `https://us-central1-canhiring-ca.cloudfunctions.net/api`
- ✅ **CORS**: Works with mobile apps
- ✅ **Login**: Works with Firebase backend
- ✅ **All Features**: Work with production data

## 🎯 Key Benefits

### **1. Development**
- **Fast Testing**: Local backend for quick development
- **No CORS Issues**: Properly configured for web development
- **Easy Debugging**: Local server logs and debugging
- **Offline Development**: Works without internet

### **2. Production**
- **Scalable**: Firebase Cloud Functions
- **Reliable**: Production-grade infrastructure
- **Global**: Accessible from anywhere
- **Secure**: Production security measures

## ✅ Result

**Perfect separation of development and production environments!** 🎉

- ✅ **Development**: Uses local backend with proper CORS
- ✅ **Production**: Uses Firebase backend for APK
- ✅ **No Conflicts**: Each environment uses appropriate backend
- ✅ **Easy Testing**: Local development works perfectly
- ✅ **Production Ready**: APK uses hosted backend

**Now you can test locally with the local backend, and the APK will use the Firebase backend!** 🚀
