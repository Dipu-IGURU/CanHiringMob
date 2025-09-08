import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';

// Import screens
import WelcomeScreen from './src/screens/WelcomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import UserOnboarding from './src/screens/UserOnboarding';
import RecruiterOnboarding from './src/screens/RecruiterOnboarding';
import AdminOnboarding from './src/screens/AdminOnboarding';
import UserTypeSelection from './src/screens/UserTypeSelection';

const Stack = createStackNavigator();

export default function App() {
  return (
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}
