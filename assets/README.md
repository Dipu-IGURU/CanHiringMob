# Assets Directory

This directory is for storing app assets like icons, splash screens, and images.

## Required Assets (for future use):

- `icon.png` - App icon (1024x1024px)
- `splash.png` - Splash screen image
- `adaptive-icon.png` - Android adaptive icon foreground
- `favicon.png` - Web favicon

## Current Status:
The app is configured to work without these assets for development purposes. You can add them later when you're ready to publish the app.

## Adding Assets:
1. Place your asset files in this directory
2. Update `app.json` to reference the assets
3. Run `npx expo prebuild` to regenerate native code if needed
