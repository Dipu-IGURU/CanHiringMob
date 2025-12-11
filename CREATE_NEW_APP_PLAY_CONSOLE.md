# Create New App in Google Play Console - Step by Step Guide

## ✅ Configuration Changes Completed

Your app has been updated with a **new package name** to create a fresh app in Google Play Console:

- **Old Package Name:** `com.iguru.canhiringsolutions`
- **New Package Name:** `com.can.canhiring`
- **Version Code:** Reset to `1` (for new app)
- **Version Name:** `1.0.0`

---

## 📱 Step-by-Step: Create New App in Play Console

### Step 1: Access Google Play Console
1. Go to [Google Play Console](https://play.google.com/console)
2. Sign in with your developer account
3. You should see your dashboard

### Step 2: Create New App
1. Click the **"Create app"** button (usually at the top right or center of the dashboard)
2. If you don't see it, click **"All apps"** in the left menu, then click **"Create app"**

### Step 3: Fill App Details

#### App Name
- Enter: **"CanHiring Solutions"** (or your preferred name)
- This is the name users will see in the Play Store

#### Default Language
- Select: **English (United States)** (or your preferred language)

#### App or Game
- Select: **App**

#### Free or Paid
- Select: **Free** (or Paid if you want to charge)

#### Declarations
- Check the boxes:
  - ✅ **"I understand that I need to provide a privacy policy"**
  - ✅ **"I understand that I need to comply with content rating requirements"**
  - ✅ **"I understand that I need to complete the Data safety section"**

### Step 4: Create App
- Click **"Create app"** button
- Wait for the app to be created (this may take a few seconds)

---

## 🔧 Step 4: Configure App Identity

### App Access
1. Go to **Policy** → **App content** → **App access**
2. Select: **"Yes, some features require users to sign in or create an account"**
3. Select: **"No login required"** (since you have Guest Mode)
4. Add instructions:
   ```
   HOW TO ACCESS THE APP:
   
   1. Open the CanHiring app
   2. On the Welcome screen, tap "Continue as Guest" button
   3. You will be taken directly to the main app
   4. No login or registration required!
   
   Guest mode allows full browsing without any login credentials.
   ```
5. Click **"Save"**

### Data Safety
1. Go to **Policy** → **App content** → **Data safety**
2. Fill out the required information about data collection
3. Click **"Save"**

### Content Rating
1. Go to **Policy** → **App content** → **Content rating**
2. Complete the questionnaire
3. Submit for rating

---

## 📦 Step 5: Build and Upload Your App

### Option A: Build with EAS (Recommended)

1. **Build the production bundle:**
   ```bash
   npm run build:production
   ```
   or
   ```bash
   npx eas-cli build --platform android --profile production
   ```

2. **Wait for build to complete** (this may take 10-20 minutes)

3. **Download the AAB file** from EAS build dashboard

4. **Upload to Play Console:**
   - Go to **Release** → **Production** (or **Internal testing** for testing)
   - Click **"Create new release"**
   - Upload the `.aab` file
   - Add release notes
   - Click **"Save"** then **"Review release"**

### Option B: Manual Build (Alternative)

If you prefer to build locally:

1. **Generate keystore** (if you don't have one):
   ```bash
   keytool -genkeypair -v -storetype PKCS12 -keystore canhiring-release.keystore -alias canhiring-key -keyalg RSA -keysize 2048 -validity 10000
   ```

2. **Update build.gradle** with your keystore configuration

3. **Build the AAB:**
   ```bash
   cd android
   ./gradlew bundleRelease
   ```

4. **Find the AAB file:**
   - Location: `android/app/build/outputs/bundle/release/app-release.aab`

5. **Upload to Play Console** (same as Option A, Step 4)

---

## ✅ Step 6: Complete Store Listing

### Store Listing
1. Go to **Store presence** → **Main store listing**
2. Fill in:
   - **App name:** CanHiring Solutions
   - **Short description:** Brief description of your app (80 characters max)
   - **Full description:** Detailed description of your app
   - **App icon:** Upload your app icon (512x512 PNG)
   - **Feature graphic:** Upload feature graphic (1024x500 PNG)
   - **Screenshots:** Upload at least 2 screenshots
   - **App category:** Select appropriate category
   - **Contact details:** Your email and website

### Privacy Policy
1. Go to **Policy** → **App content** → **Privacy policy**
2. Add your privacy policy URL
3. Click **"Save"**

---

## 🚀 Step 7: Submit for Review

1. Go to **Release** → **Production** (or your chosen track)
2. Review all sections:
   - ✅ App access declaration completed
   - ✅ Data safety completed
   - ✅ Content rating completed
   - ✅ Store listing completed
   - ✅ App bundle uploaded
   - ✅ Privacy policy added

3. Click **"Send for review"** or **"Submit for review"**

4. Wait for Google's review (usually 1-7 days)

---

## 📋 Important Notes

### Package Name
- Your new package name is: **`com.can.canhiring`**
- This is different from your old app, so it will be treated as a completely new app
- You can have both apps in the same Play Console account

### Version Code
- Version code is reset to **1** for the new app
- Each update should increment this number

### Keystore
- **IMPORTANT:** Make sure you have a proper release keystore
- The debug keystore in your build.gradle is for development only
- For production, you need a release keystore that you'll keep secure

### Testing
- Consider uploading to **Internal testing** track first
- Test the app thoroughly before moving to Production

---

## 🔍 Verification Checklist

Before submitting, ensure:

- [ ] New package name configured: `com.can.canhiring`
- [ ] Version code is 1
- [ ] App builds successfully
- [ ] AAB file generated
- [ ] Store listing completed
- [ ] App access declaration completed
- [ ] Data safety form completed
- [ ] Content rating completed
- [ ] Privacy policy URL added
- [ ] Screenshots uploaded
- [ ] App icon uploaded
- [ ] All required fields filled

---

## 🆘 Troubleshooting

### "Package name already exists"
- This shouldn't happen with the new package name `com.can.canhiring`
- If it does, try a different package name (e.g., `com.can.canhiringapp`)

### "Upload failed"
- Check that you're uploading an `.aab` file, not `.apk`
- Ensure the AAB is signed with a release keystore
- Check file size limits

### "Version code already used"
- This shouldn't happen with version code 1 for a new app
- If you see this, increment the version code in `app.json` and `build.gradle`

---

## 📞 Need Help?

- Google Play Console Help: https://support.google.com/googleplay/android-developer
- EAS Build Docs: https://docs.expo.dev/build/introduction/
- React Native Android Build: https://reactnative.dev/docs/signed-apk-android

---

**Good luck with your new app! 🎉**

