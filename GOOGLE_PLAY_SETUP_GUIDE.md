# Google Play Console - App Access Declaration Setup Guide

## Step-by-Step Instructions

### Step 1: Access App Access Declaration
1. Go to [Google Play Console](https://play.google.com/console)
2. Select your app (CanHiring)
3. In the left menu, go to **Policy** → **App content**
4. Scroll down to **App access** section
5. Click on **App access** or **Manage**

### Step 2: Select Access Type
1. You'll see a question: "Does your app require users to sign in or create an account to access any features?"
2. Select: **"Yes, some features require users to sign in or create an account"**

### Step 3: Add Access Instructions
1. You'll see a section: **"How can we review your app?"**
2. Select: **"No login required"** or **"Provide login credentials"**

#### Option A: No Login Required (Recommended - Guest Mode Available!)
Since the app now supports Guest Mode, you can select:
- **"No login required"** 
- Add this instruction: "Tap 'Continue as Guest' button on Welcome screen to access the app without login"

#### Option B: Provide Test Credentials (Optional)
If you want to provide test account:
```
Email/Username: reviewer@canhiring.com
Password: Test@1234
```

### Step 4: Add Instructions (Recommended)
In the "Additional instructions" field, paste:

```
HOW TO ACCESS THE APP (EASIEST WAY):

1. Open the CanHiring app
2. On the Welcome screen, tap "Continue as Guest" button
3. You will be taken directly to the main app
4. No login or registration required!

ALTERNATIVE - WITH ACCOUNT:
1. Tap "Get Started" on Welcome screen
2. Select "Job Seeker" role
3. On Login screen, enter test credentials OR tap "Continue as Guest"
4. Access the app

FEATURES AVAILABLE:
- Browse and search jobs (Guest mode supported)
- View job details (Guest mode supported)
- Save jobs/bookmark (Guest mode supported)
- Apply for jobs (may require login)
- View profile and dashboard

NOTE: App requires internet connection. Backend server must be running.
Guest mode allows full browsing without any login credentials.
```

### Step 5: Save and Submit
1. Click **"Save"** button
2. Go back to **Publishing overview**
3. Click **"Send for review"** or **"Submit update"**

## Important Notes

✅ **Before submitting:**
- Ensure test account exists in your database
- Test the credentials yourself to verify they work
- Make sure backend server is accessible
- Test the login flow end-to-end

❌ **Common Mistakes to Avoid:**
- Don't use your personal account credentials
- Don't forget to save the changes
- Don't use weak passwords that might expire
- Don't provide credentials that require 2FA

## Creating Test Account in Database

If you need to create a test account, you can:

1. **Via Sign Up in App:**
   - Use the app's signup feature
   - Create account with email: reviewer@canhiring.com
   - Set password: Test@1234

2. **Via Database Directly:**
   - Connect to your MongoDB database
   - Insert a test user with the credentials above

3. **Via API/Backend:**
   - Use your registration endpoint to create test account

## Verification Checklist

Before submitting to Google Play:
- [ ] Test account created and active
- [ ] Login credentials tested and working
- [ ] App access declaration filled in Play Console
- [ ] Instructions added for reviewers
- [ ] Changes saved in Play Console
- [ ] Ready to submit for review

---

**Need Help?**
If you encounter issues, check:
- Google Play Console Help: https://support.google.com/googleplay/android-developer
- App Access Declaration Guide: https://support.google.com/googleplay/android-developer/answer/9888170

