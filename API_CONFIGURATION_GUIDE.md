# API Configuration Guide

## 🔧 **Problem Solved: APK API Connection**

### **Issue:**
When you stop your PC server, the APK can't connect to the API because it was trying to use `localhost:5001`.

### **Solution:**
Updated the API configuration to automatically use the production server for APK builds.

## 📱 **How It Works Now:**

### **Development (Expo Go):**
- Uses `http://localhost:5001` (your PC server)
- Only works when your PC server is running

### **APK Builds:**
- Uses `https://can-hiring.onrender.com` (production server)
- Works independently of your PC server
- Always available online

## 🛠️ **Configuration Details:**

### **1. API Service (`src/services/apiService.js`):**
```javascript
const getApiBaseUrl = () => {
  // If environment variable is set, use it
  if (process.env.EXPO_PUBLIC_API_BASE_URL) {
    return process.env.EXPO_PUBLIC_API_BASE_URL;
  }
  
  // For development (Expo Go), use localhost
  if (__DEV__) {
    return 'http://localhost:5001';
  }
  
  // For production builds (APK), always use production server
  return 'https://can-hiring.onrender.com';
};
```

### **2. EAS Build Configuration (`eas.json`):**
```json
{
  "production": {
    "env": {
      "EXPO_PUBLIC_API_BASE_URL": "https://can-hiring.onrender.com"
    }
  }
}
```

## 🚀 **How to Build APK:**

### **For Production APK:**
```bash
eas build --platform android --profile production
```

### **For Preview APK:**
```bash
eas build --platform android --profile preview
```

## ✅ **Benefits:**

1. **APK works offline** - doesn't need your PC server
2. **Automatic switching** - development vs production
3. **No configuration needed** - works out of the box
4. **Debug logging** - shows which URL is being used

## 🔍 **Debug Information:**

The app will log which API URL it's using:
```
🌐 API Configuration:
   __DEV__: false
   EXPO_PUBLIC_API_BASE_URL: https://can-hiring.onrender.com
   Final API_BASE_URL: https://can-hiring.onrender.com
```

## 📝 **Summary:**

- **Development**: Uses localhost (needs PC server running)
- **APK**: Uses production server (works independently)
- **No more connection issues** when PC server is stopped!
