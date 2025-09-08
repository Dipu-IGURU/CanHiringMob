# CanHiring - React Native App

A modern React Native application for job seekers, recruiters, and administrators with beautiful onboarding experiences.

## Features

- **Multi-role Onboarding**: Separate onboarding flows for Job Seekers, Recruiters, and Admins
- **Modern UI/UX**: Beautiful gradient designs and smooth animations
- **Navigation**: Stack navigation with smooth transitions
- **Responsive Design**: Optimized for different screen sizes

## User Types

### 1. Job Seeker (User)
- Find dream jobs
- Apply with ease
- Track application progress
- Personalized recommendations

### 2. Recruiter
- Post job openings
- Find top talent
- Manage applications
- Advanced filtering and AI matching

### 3. Admin
- Platform management
- User management
- Analytics and reports
- System configuration

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- Expo CLI
- React Native development environment

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Run on your preferred platform:
```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

## Project Structure

```
CanHiringMob/
├── App.js                 # Main app component with navigation
├── src/
│   └── screens/
│       ├── WelcomeScreen.js        # Welcome/landing screen
│       ├── UserTypeSelection.js    # Role selection screen
│       ├── UserOnboarding.js       # Job seeker onboarding
│       ├── RecruiterOnboarding.js  # Recruiter onboarding
│       └── AdminOnboarding.js      # Admin onboarding
├── package.json
├── app.json
└── babel.config.js
```

## Technologies Used

- React Native
- Expo
- React Navigation
- Expo Linear Gradient
- Expo Vector Icons
- React Native Gesture Handler

## Customization

You can easily customize the onboarding flows by:
- Modifying the steps array in each onboarding screen
- Changing colors and gradients
- Adding new features to the feature lists
- Updating navigation flow

## Next Steps

After completing onboarding, you can:
1. Create main app screens for each user type
2. Add authentication and user management
3. Implement job posting and application features
4. Add real-time notifications
5. Integrate with backend APIs

## License

This project is licensed under the MIT License.
