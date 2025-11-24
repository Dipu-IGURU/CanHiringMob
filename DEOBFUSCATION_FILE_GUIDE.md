# Deobfuscation File Guide - Fix Play Store Warning

## ✅ **FIXED: R8/ProGuard Now Enabled**

The warning about missing deobfuscation file has been fixed by enabling R8 minification.

---

## 🔧 **What Was Changed**

### 1. **Enabled R8 Minification**
- Updated `android/gradle.properties` to enable minification
- Updated `android/app/build.gradle` to use optimized ProGuard rules
- Added comprehensive ProGuard rules for React Native and Expo

### 2. **ProGuard Rules Added**
- React Native rules
- Expo rules
- Hermes rules
- Native methods preservation
- Annotation preservation

---

## 📦 **Mapping File Location**

After building with EAS, the mapping file will be generated at:
```
android/app/build/outputs/mapping/release/mapping.txt
```

---

## 🚀 **How to Upload Mapping File to Play Console**

### Option 1: Automatic (Recommended)
EAS Build should automatically handle this, but if not:

### Option 2: Manual Upload

1. **After EAS Build Completes:**
   - Download the build artifacts
   - Find `mapping.txt` file

2. **In Google Play Console:**
   - Go to your app
   - Navigate to **Release** → **Production** (or your track)
   - Find the version you uploaded
   - Click on the version
   - Scroll to **App bundles and APKs**
   - Click on your AAB file
   - Look for **Deobfuscation file** section
   - Click **Upload**
   - Select the `mapping.txt` file
   - Click **Save**

---

## 🔨 **Next Build Steps**

1. **Build with EAS:**
   ```bash
   npm run build:production
   ```

2. **The mapping file will be automatically generated**

3. **Upload to Play Console:**
   - The mapping file will be in the build output
   - Upload it to the corresponding version in Play Console

---

## ✅ **Verification**

After your next build:
- R8 minification will be enabled ✅
- Mapping file will be generated ✅
- App size will be reduced ✅
- Warning should be resolved ✅

---

## 📝 **Note**

- **This is a WARNING, not an error** - Your app can still be published
- The mapping file helps debug crashes and ANRs
- It's recommended but not required for initial submission
- You can upload it later if needed

---

*Configuration Updated: R8/ProGuard Enabled*

