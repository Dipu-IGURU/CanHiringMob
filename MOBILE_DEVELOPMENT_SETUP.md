# Mobile Development Setup Guide

## 🔧 **Database Connection Issue - SOLVED!**

### **The Problem:**
When running your React Native app on a mobile device through Expo, it couldn't connect to the database because mobile devices can't access `localhost:5001`.

### **The Solution:**
Use your computer's IP address instead of `localhost`.

## 📱 **Step-by-Step Setup:**

### **1. Find Your Computer's IP Address**
```bash
# Windows
ipconfig

# Mac/Linux
ifconfig
```

**Your IP Address:** `192.168.1.14` (already configured)

### **2. Update API Configuration**
✅ **Already Done!** - Updated `src/services/apiService.js` to use `http://192.168.1.14:5001`

### **3. Start Your Backend Server**
```bash
cd server
npm start
```

### **4. Start Your React Native App**
```bash
# In the main project directory
npm start
# or
expo start
```

### **5. Connect Your Mobile Device**
- Make sure your phone and computer are on the **same WiFi network**
- Scan the QR code with Expo Go app
- The app should now connect to your database!

## 🔍 **Troubleshooting:**

### **If Still Not Working:**

1. **Check Firewall Settings:**
   - Windows: Allow Node.js through Windows Firewall
   - Mac: Allow incoming connections for Node.js

2. **Verify Network Connection:**
   - Both devices must be on the same WiFi
   - Try pinging your computer from your phone

3. **Check Server Status:**
   - Visit `http://192.168.1.14:5001/api/health` in your browser
   - Should show: "CanHiring Mobile API is running!"

4. **Alternative IP Addresses:**
   - If `192.168.1.14` doesn't work, try:
     - `http://10.0.0.x:5001` (if on different network)
     - `http://172.16.x.x:5001` (corporate networks)

## 🚀 **Quick Test:**

1. **Start Server:** `cd server && npm start`
2. **Start App:** `npm start`
3. **Open on Phone:** Scan QR code with Expo Go
4. **Test Connection:** Try logging in or viewing jobs

## 📝 **Environment Variables:**

Create a `.env` file in your project root:
```env
EXPO_PUBLIC_API_BASE_URL=http://192.168.1.14:5001
EXPO_PUBLIC_RAPIDAPI_KEY=your_rapidapi_key_here
EXPO_PUBLIC_RAPIDAPI_HOST=jsearch.p.rapidapi.com
EXPO_PUBLIC_JSEARCH_BASE_URL=https://jsearch.p.rapidapi.com
```

## ✅ **Success Indicators:**

- ✅ Server shows: "MongoDB connected successfully"
- ✅ Server shows: "CanHiring Mobile Server is running on port 5001"
- ✅ Mobile app can load jobs and login works
- ✅ No "Network error" messages in the app

## 🔄 **If IP Changes:**

If your computer gets a new IP address:
1. Run `ipconfig` again
2. Update the IP in `src/services/apiService.js`
3. Restart both server and app

Your database connection issue should now be resolved! 🎉
