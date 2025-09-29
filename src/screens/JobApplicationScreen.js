import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '../components/AppHeader';
import JobApplicationForm from '../components/JobApplicationForm';
import { useAuth } from '../contexts/AuthContext';
import { API_BASE_URL } from '../config/environment';
import { enhancedFetch } from '../config/networkConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

const JobApplicationScreen = ({ navigation, route }) => {
  const { job, companyName } = route.params;
  const { user, token } = useAuth();
  const [showForm, setShowForm] = useState(true);
  const [loading, setLoading] = useState(false);

  // Function to save application locally as fallback
  const saveApplicationLocally = async (applicationData) => {
    try {
      const localApplications = await AsyncStorage.getItem('localApplications');
      const applications = localApplications ? JSON.parse(localApplications) : [];
      
      const localApplication = {
        ...applicationData,
        id: Date.now().toString(),
        savedAt: new Date().toISOString(),
        status: 'pending_local',
        jobTitle: job?.title || 'Unknown Job',
        companyName: job?.company || 'Unknown Company'
      };
      
      applications.push(localApplication);
      await AsyncStorage.setItem('localApplications', JSON.stringify(applications));
      
      console.log('✅ Application saved locally:', localApplication);
      return localApplication;
    } catch (error) {
      console.error('❌ Error saving application locally:', error);
      throw error;
    }
  };

  // Function to get locally saved applications count
  const getLocalApplicationsCount = async () => {
    try {
      const localApplications = await AsyncStorage.getItem('localApplications');
      const applications = localApplications ? JSON.parse(localApplications) : [];
      return applications.length;
    } catch (error) {
      console.error('❌ Error getting local applications count:', error);
      return 0;
    }
  };

  const handleSubmitApplication = async (applicationData) => {
    setLoading(true);
    
    try {
      console.log('🔍 Submitting application data:', applicationData);
      console.log('🔍 User authenticated:', !!user, 'Token available:', !!token);
      console.log('🔍 API_BASE_URL:', API_BASE_URL);
      console.log('🔍 API_BASE_URL type:', typeof API_BASE_URL);
      console.log('🔍 API_BASE_URL is undefined:', API_BASE_URL === undefined);
      
      // Check if API_BASE_URL is available
      if (!API_BASE_URL) {
        console.log('⚠️ API_BASE_URL is undefined - saving application locally');
        await saveApplicationLocally(applicationData);
        Alert.alert(
          'Application Saved Successfully!', 
          'Your application has been saved and will be submitted when the service is available. You can view it in your applications.',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('UserDashboard')
            }
          ]
        );
        return;
      }
      
      // Check if we're using the hosted backend that doesn't support applications
      if (API_BASE_URL.includes('cloudfunctions.net')) {
        console.log('⚠️ Hosted backend detected - applications not supported, saving locally');
        await saveApplicationLocally(applicationData);
        Alert.alert(
          'Application Saved Successfully!', 
          'Your application has been saved and will be submitted when the service is available. You can view it in your applications.',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('UserDashboard')
            }
          ]
        );
        return;
      }
      
      // Choose endpoint based on authentication status
      // For authenticated users, use /api/applications/apply
      // For non-authenticated users, use /api/applications (public endpoint)
      const endpoint = user && token 
        ? `${API_BASE_URL}/api/applications/apply` 
        : `${API_BASE_URL}/api/applications`;
      
      // Check if we're using the hosted backend and it doesn't support applications
      if (API_BASE_URL.includes('cloudfunctions.net')) {
        console.log('⚠️ Using hosted backend - applications may not be available');
        // For hosted backend, we'll try the endpoint but expect it to fail
        // and fall back to local storage
      }
      
      const headers = {
        'Content-Type': 'application/json',
      };
      
      // Add authorization header if user is authenticated
      if (user && token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      console.log('🔍 Making request to:', endpoint);
      console.log('🔍 Request headers:', headers);
      console.log('🔍 Request body:', JSON.stringify(applicationData, null, 2));
      console.log('🔍 Full URL constructed:', endpoint);
      
      const response = await enhancedFetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(applicationData),
      });

      console.log('🔍 Response status:', response.status);
      console.log('🔍 Response ok:', response.ok);
      console.log('🔍 Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('🔍 Error response text:', errorText);
        
        // Check if response is HTML (error page)
        if (errorText.includes('<!DOCTYPE') || errorText.includes('<html')) {
          // Check if it's a 404 error for applications endpoint
          if (response.status === 404 && (endpoint.includes('/api/applications'))) {
            throw new Error(`Applications feature is not available on this server. Status: ${response.status}. Please contact support or try again later.`);
          }
          throw new Error(`Server returned HTML error page. Status: ${response.status}. Please check if the backend server is running and accessible.`);
        }
        
        // Check for specific 404 errors on applications endpoints
        if (response.status === 404 && endpoint.includes('/api/applications')) {
          console.log('⚠️ Applications endpoint not available, trying local storage fallback...');
          // Try to save application locally as fallback
          await saveApplicationLocally(applicationData);
          throw new Error(`Applications feature is not available on the server. Your application has been saved locally and will be submitted when the service is available.`);
        }
        
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('🔍 Application submission result:', result);
      
      if (result.success) {
        console.log('✅ Application submitted successfully:', result);
        Alert.alert(
          'Success!', 
          'Your application has been submitted successfully. You can view it in your dashboard.',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('UserDashboard')
            }
          ]
        );
        return result;
      } else {
        throw new Error(result.message || 'Failed to submit application');
      }
    } catch (error) {
      console.error('❌ Error submitting application:', error);
      console.error('❌ Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      
      // Show more specific error message
      let errorMessage = 'Failed to submit application. Please try again.';
      if (error.message.includes('Applications feature is not available on the server. Your application has been saved locally')) {
        errorMessage = 'Your application has been saved locally and will be submitted when the service is available.';
        // Show success message instead of error for local save
        Alert.alert(
          'Application Saved Locally', 
          'Your application has been saved on your device and will be submitted when the service is available. You can view it in your applications.',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('UserDashboard')
            }
          ]
        );
        return; // Don't show error alert
      } else if (error.message.includes('Applications feature is not available')) {
        errorMessage = 'Job applications are currently not available. Please contact support or try again later.';
      } else if (error.message.includes('HTML error page')) {
        errorMessage = 'Server is not responding properly. Please check your internet connection and try again.';
      } else if (error.message.includes('Network request failed')) {
        errorMessage = 'Network error. Please check your internet connection and try again.';
      } else if (error.message.includes('AbortError')) {
        errorMessage = 'Request timed out. Please check your internet connection and try again.';
      } else if (error.message.includes('TypeError')) {
        errorMessage = 'Network connection error. Please check your internet connection and try again.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert('Error', errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader 
        title={`Apply to ${companyName}`}
        onBackPress={() => navigation.goBack()}
      />
      
      <JobApplicationForm
        visible={showForm}
        onClose={handleCloseForm}
        job={job}
        onSubmit={handleSubmitApplication}
      />
      
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Submitting application...</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 12,
  },
});

export default JobApplicationScreen;
