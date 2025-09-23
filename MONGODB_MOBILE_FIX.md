# MongoDB Mobile APK Fix Guide

## Problem
When you extract and install the APK on mobile devices, MongoDB connection fails because the app tries to connect to `localhost:27017` which doesn't exist on mobile devices.

## Root Cause
- Mobile APK uses production API URL (`https://can-hiring.onrender.com`)
- But the server is still trying to connect to local MongoDB instead of cloud MongoDB
- No proper environment configuration for production deployment

## Solution Steps

### 1. Set Up MongoDB Atlas (Cloud Database)

1. **Create MongoDB Atlas Account**:
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Sign up for free account
   - Create a new cluster (free tier available)

2. **Get Connection String**:
   - In Atlas dashboard, click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your actual password
   - Replace `<dbname>` with `canhiring`

3. **Example Connection String**:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/canhiring?retryWrites=true&w=majority
   ```

### 2. Update Server Configuration

The server has been updated to automatically use MongoDB Atlas for production builds. However, you need to:

1. **Create `.env` file in server folder**:
   ```bash
   # In server/.env
   MONGODB_URI=mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net/canhiring?retryWrites=true&w=majority
   JWT_SECRET=your_super_secret_jwt_key_here
   NODE_ENV=production
   PORT=5001
   ```

2. **Or set environment variables on Render**:
   - Go to your Render dashboard
   - Select your service
   - Go to Environment tab
   - Add these variables:
     - `MONGODB_URI`: Your MongoDB Atlas connection string
     - `JWT_SECRET`: A random secret key
     - `NODE_ENV`: production

### 3. Deploy Updated Server

1. **Commit and push changes**:
   ```bash
   git add .
   git commit -m "Fix MongoDB connection for mobile APK"
   git push
   ```

2. **Redeploy on Render**:
   - Render will automatically redeploy when you push changes
   - Check logs to ensure MongoDB connection is successful

### 4. Test Mobile APK

1. **Build new APK**:
   ```bash
   npx expo build:android --type apk
   ```

2. **Install and test**:
   - Install APK on mobile device
   - Test login/signup functionality
   - Check if data loads properly

## Verification

### Check Server Logs
Look for these messages in Render logs:
```
✅ MongoDB connected successfully
📊 Database: canhiring
```

### Test API Endpoints
Test these URLs in browser:
- `https://can-hiring.onrender.com/api/health`
- `https://can-hiring.onrender.com/api/jobs`

## Alternative: Use Fallback Database

If you don't want to set up MongoDB Atlas immediately, the server now has a fallback that will work for basic functionality, but you should set up Atlas for full functionality.

## Security Notes

1. **Never commit `.env` files** to git
2. **Use strong JWT secrets** (32+ characters)
3. **Restrict MongoDB Atlas access** to your Render IP only
4. **Use environment variables** for all sensitive data

## Troubleshooting

### If MongoDB still fails:
1. Check Atlas cluster is running
2. Verify connection string is correct
3. Check network access rules in Atlas
4. Verify database user permissions

### If APK still doesn't work:
1. Clear app data and reinstall
2. Check network connectivity
3. Verify API endpoints are accessible
4. Check server logs for errors

## Next Steps

1. Set up MongoDB Atlas
2. Update environment variables
3. Redeploy server
4. Build and test new APK
5. Verify all functionality works

The mobile APK should now connect to the cloud database successfully!
