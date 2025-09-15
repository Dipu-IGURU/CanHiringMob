import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { AuthProvider } from './src/contexts/AuthContext';

// Import screens
import WelcomeScreen from './src/screens/WelcomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import HomeScreen from './src/screens/HomeScreen';
import JobsScreen from './src/screens/JobsScreen';
import UserDashboardScreen from './src/screens/UserDashboardScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import UserOnboarding from './src/screens/UserOnboarding';
import RecruiterOnboarding from './src/screens/RecruiterOnboarding';
import AdminOnboarding from './src/screens/AdminOnboarding';
import UserTypeSelection from './src/screens/UserTypeSelection';
import AccountScreen from './src/screens/AccountScreen';
import EditProfileScreen from './src/screens/EditProfileScreen';
import MyApplicationsScreen from './src/screens/MyApplicationsScreen';
import SavedJobsScreen from './src/screens/SavedJobsScreen';
import JobAlertsScreen from './src/screens/JobAlertsScreen';
import PrivacySettingsScreen from './src/screens/PrivacySettingsScreen';
import HelpSupportScreen from './src/screens/HelpSupportScreen';
import AboutScreen from './src/screens/AboutScreen';
import JobDetailsScreen from './src/screens/JobDetailsScreen';
import CompanyJobsScreen from './src/screens/CompanyJobsScreen';
import JobApplicationScreen from './src/screens/JobApplicationScreen';
import MessagesScreen from './src/screens/MessagesScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Main Tab Navigator
function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Jobs') {
            iconName = focused ? 'briefcase' : 'briefcase-outline';
          } else if (route.name === 'Dashboard') {
            iconName = focused ? 'analytics' : 'analytics-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: '#64748B',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E2E8F0',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Jobs" component={JobsScreen} />
      <Tab.Screen name="Dashboard" component={UserDashboardScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator 
          initialRouteName="Welcome"
          screenOptions={{
            headerShown: false,
            gestureEnabled: true,
            cardStyleInterpolator: ({ current, layouts }) => {
              return {
                cardStyle: {
                  transform: [
                    {
                      translateX: current.progress.interpolate({
                        inputRange: [0, 1],
                        outputRange: [layouts.screen.width, 0],
                      }),
                    },
                  ],
                },
              };
            },
          }}
        >
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="SignupScreen" component={SignupScreen} />
          <Stack.Screen name="UserTypeSelection" component={UserTypeSelection} />
          <Stack.Screen name="UserOnboarding" component={UserOnboarding} />
          <Stack.Screen name="RecruiterOnboarding" component={RecruiterOnboarding} />
          <Stack.Screen name="AdminOnboarding" component={AdminOnboarding} />
          <Stack.Screen name="MainTabs" component={MainTabNavigator} />
          <Stack.Screen name="AccountScreen" component={AccountScreen} />
          <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
          <Stack.Screen name="MyApplicationsScreen" component={MyApplicationsScreen} />
          <Stack.Screen name="SavedJobsScreen" component={SavedJobsScreen} />
          <Stack.Screen name="JobAlertsScreen" component={JobAlertsScreen} />
          <Stack.Screen name="PrivacySettingsScreen" component={PrivacySettingsScreen} />
          <Stack.Screen name="HelpSupportScreen" component={HelpSupportScreen} />
          <Stack.Screen name="AboutScreen" component={AboutScreen} />
          <Stack.Screen name="JobDetailsScreen" component={JobDetailsScreen} />
          <Stack.Screen name="CompanyJobs" component={CompanyJobsScreen} />
          <Stack.Screen name="JobApplication" component={JobApplicationScreen} />
          <Stack.Screen name="MessagesScreen" component={MessagesScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
