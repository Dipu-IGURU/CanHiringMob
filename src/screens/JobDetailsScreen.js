import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  Alert,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '../components/AppHeader';
import { getJobDetails } from '../services/jobSearchService';

const JobDetailsScreen = ({ navigation, route }) => {
  const { jobData } = route.params || {};
  const [job, setJob] = useState(jobData);
  const [loading, setLoading] = useState(!jobData);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    if (!jobData && route.params?.jobId) {
      fetchJobDetails();
    }
  }, []);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      const result = await getJobDetails(route.params.jobId);
      if (result.success) {
        setJob(result.job);
      } else {
        Alert.alert('Error', 'Failed to load job details');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error fetching job details:', error);
      Alert.alert('Error', 'Failed to load job details');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!job?.applyUrl) {
      Alert.alert('Error', 'No application URL available for this job');
      return;
    }

    try {
      setApplying(true);
      
      // Check if the URL can be opened
      const canOpen = await Linking.canOpenURL(job.applyUrl);
      
      if (canOpen) {
        Alert.alert(
          'Apply for Job',
          `You are about to leave the app to apply for "${job.title}" at ${job.company}. Continue?`,
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Apply Now',
              onPress: async () => {
                try {
                  await Linking.openURL(job.applyUrl);
                } catch (error) {
                  console.error('Error opening URL:', error);
                  Alert.alert('Error', 'Failed to open application page');
                }
              }
            }
          ]
        );
      } else {
        Alert.alert('Error', 'Cannot open the application URL');
      }
    } catch (error) {
      console.error('Error handling apply:', error);
      Alert.alert('Error', 'Failed to process application');
    } finally {
      setApplying(false);
    }
  };

  const formatPostedDate = (dateString) => {
    if (!dateString) return 'Recently posted';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`;
    return `${Math.ceil(diffDays / 365)} years ago`;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <AppHeader 
          leftActions={[
            { icon: 'arrow-back', onPress: () => navigation.goBack() }
          ]}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Loading job details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!job) {
    return (
      <SafeAreaView style={styles.container}>
        <AppHeader 
          leftActions={[
            { icon: 'arrow-back', onPress: () => navigation.goBack() }
          ]}
        />
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={64} color="#EF4444" />
          <Text style={styles.errorTitle}>Job Not Found</Text>
          <Text style={styles.errorText}>This job is no longer available</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.retryButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader 
        leftActions={[
          { icon: 'arrow-back', onPress: () => navigation.goBack() }
        ]}
        rightActions={[
          { icon: 'bookmark-outline', onPress: () => console.log('Save job') }
        ]}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Job Header */}
        <LinearGradient
          colors={['#3B82F6', '#1D4ED8']}
          style={styles.jobHeader}
        >
          <View style={styles.jobHeaderContent}>
            <View style={styles.companyLogoContainer}>
              {job.companyLogo ? (
                <Image source={{ uri: job.companyLogo }} style={styles.companyLogo} />
              ) : (
                <View style={styles.companyLogoPlaceholder}>
                  <Text style={styles.companyLogoText}>
                    {job.company?.charAt(0) || 'C'}
                  </Text>
                </View>
              )}
            </View>
            
            <View style={styles.jobTitleContainer}>
              <Text style={styles.jobTitle}>{job.title}</Text>
              <Text style={styles.companyName}>{job.company}</Text>
              <View style={styles.jobMeta}>
                <View style={styles.metaItem}>
                  <Ionicons name="location-outline" size={16} color="#E2E8F0" />
                  <Text style={styles.metaText}>{job.location}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons name="time-outline" size={16} color="#E2E8F0" />
                  <Text style={styles.metaText}>{job.type}</Text>
                </View>
                {job.remote && (
                  <View style={styles.metaItem}>
                    <Ionicons name="home-outline" size={16} color="#E2E8F0" />
                    <Text style={styles.metaText}>Remote</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Job Details */}
        <View style={styles.jobDetails}>
          {/* Salary */}
          {job.salary && job.salary !== 'Salary not specified' && (
            <View style={styles.detailSection}>
              <View style={styles.sectionHeader}>
                <Ionicons name="cash-outline" size={20} color="#3B82F6" />
                <Text style={styles.sectionTitle}>Salary</Text>
              </View>
              <Text style={styles.salaryText}>{job.salary}</Text>
            </View>
          )}

          {/* Posted Date */}
          <View style={styles.detailSection}>
            <View style={styles.sectionHeader}>
              <Ionicons name="calendar-outline" size={20} color="#3B82F6" />
              <Text style={styles.sectionTitle}>Posted</Text>
            </View>
            <Text style={styles.postedText}>{formatPostedDate(job.postedDate)}</Text>
          </View>

          {/* Job Description */}
          <View style={styles.detailSection}>
            <View style={styles.sectionHeader}>
              <Ionicons name="document-text-outline" size={20} color="#3B82F6" />
              <Text style={styles.sectionTitle}>Job Description</Text>
            </View>
            <Text style={styles.descriptionText}>{job.description}</Text>
          </View>

          {/* Requirements */}
          {job.requirements && (
            <View style={styles.detailSection}>
              <View style={styles.sectionHeader}>
                <Ionicons name="checkmark-circle-outline" size={20} color="#3B82F6" />
                <Text style={styles.sectionTitle}>Requirements</Text>
              </View>
              <Text style={styles.requirementsText}>{job.requirements}</Text>
            </View>
          )}

          {/* Benefits */}
          {job.benefits && (
            <View style={styles.detailSection}>
              <View style={styles.sectionHeader}>
                <Ionicons name="gift-outline" size={20} color="#3B82F6" />
                <Text style={styles.sectionTitle}>Benefits</Text>
              </View>
              <Text style={styles.benefitsText}>{job.benefits}</Text>
            </View>
          )}
        </View>

        {/* Apply Button */}
        <View style={styles.applySection}>
          <TouchableOpacity
            style={[styles.applyButton, applying && styles.applyButtonDisabled]}
            onPress={handleApply}
            disabled={applying || !job.applyUrl}
          >
            <LinearGradient
              colors={['#3B82F6', '#1D4ED8']}
              style={styles.applyButtonGradient}
            >
              {applying ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Ionicons name="send" size={20} color="#FFFFFF" />
              )}
              <Text style={styles.applyButtonText}>
                {applying ? 'Opening Application...' : 'Apply Now'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
          
          {!job.applyUrl && (
            <Text style={styles.noApplyText}>
              Application URL not available for this job
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#64748B',
    marginTop: 12,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#EF4444',
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  jobHeader: {
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  jobHeaderContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  companyLogoContainer: {
    marginRight: 16,
  },
  companyLogo: {
    width: 60,
    height: 60,
    borderRadius: 12,
  },
  companyLogoPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  companyLogoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  jobTitleContainer: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  companyName: {
    fontSize: 16,
    color: '#E2E8F0',
    marginBottom: 12,
  },
  jobMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 14,
    color: '#E2E8F0',
  },
  jobDetails: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  detailSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  salaryText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#059669',
  },
  postedText: {
    fontSize: 14,
    color: '#64748B',
  },
  descriptionText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
  requirementsText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
  benefitsText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
  applySection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 40,
  },
  applyButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  applyButtonDisabled: {
    opacity: 0.6,
  },
  applyButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  noApplyText: {
    fontSize: 14,
    color: '#EF4444',
    textAlign: 'center',
    marginTop: 12,
  },
});

export default JobDetailsScreen;
