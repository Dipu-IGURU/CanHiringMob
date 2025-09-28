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
import { API_BASE_URL } from '../services/apiService';
import { enhancedFetch } from '../config/networkConfig';

const JobApplicationScreen = ({ navigation, route }) => {
  const { job, companyName } = route.params;
  const { user, token } = useAuth();
  const [showForm, setShowForm] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmitApplication = async (applicationData) => {
    setLoading(true);
    
    try {
      console.log('🔍 Submitting application data:', applicationData);
      console.log('🔍 User authenticated:', !!user, 'Token available:', !!token);
      console.log('🔍 API_BASE_URL:', API_BASE_URL);
      
      // Choose endpoint based on authentication status
      const endpoint = user && token 
        ? `${API_BASE_URL}/api/applications/apply` 
        : `${API_BASE_URL}/api/applications`;
      
      const headers = {
        'Content-Type': 'application/json',
      };
      
      // Add authorization header if user is authenticated
      if (user && token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      console.log('🔍 Making request to:', endpoint);
      console.log('🔍 Request headers:', headers);
      
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
          throw new Error(`Server returned HTML error page. Status: ${response.status}. Please check if the backend server is running and accessible.`);
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
      if (error.message.includes('HTML error page')) {
        errorMessage = 'Server is not responding properly. Please check your internet connection and try again.';
      } else if (error.message.includes('Network request failed')) {
        errorMessage = 'Network error. Please check your internet connection and try again.';
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
