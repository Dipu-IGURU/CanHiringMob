import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '../components/AppHeader';
import CompanyLogo from '../components/CompanyLogo';
import { getJobDetails } from '../services/jobSearchService';
import { trackApiJobApplication, checkApplicationLimits } from '../services/apiJobTrackingService';
import { useAuth } from '../contexts/AuthContext';

const JobDetailsScreen = ({ navigation, route }) => {
  const { jobData } = route.params || {};
  const [job, setJob] = useState(jobData);
  const [loading, setLoading] = useState(!jobData);
  const [applying, setApplying] = useState(false);
  const { user, token } = useAuth();

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
    // Check if we have an apply URL or if this is an API job that can be tracked
    const hasApplyUrl = job?.applyUrl || job?.apply_url || job?.job_apply_link;
    
    if (!hasApplyUrl) {
      Alert.alert('Error', 'No application URL available for this job');
      return;
    }

    // Check if user is logged in
    if (!user || !token) {
      Alert.alert('Login Required', 'Please login to apply for jobs');
      return;
    }

    try {
      setApplying(true);
      
      // Check application limits first
      console.log('🔍 Checking application limits...');
      const limitsResponse = await checkApplicationLimits(token);
      
      if (limitsResponse.success && limitsResponse.data.isLimitReached) {
        console.log('❌ Application limit reached, showing upgrade popup');
        Alert.alert(
          'Application Limit Reached',
          'You have reached the 5 job application limit. Please visit our website to upgrade your plan for unlimited applications.',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Visit Website', 
              onPress: () => {
                // Open the CanHiring website for plan upgrade
                Linking.openURL('https://www.canhiring.com/');
              }
            }
          ]
        );
        return;
      }
      
      // Get the actual apply URL
      const actualApplyUrl = job.applyUrl || job.apply_url || job.job_apply_link;
      
      // Check if the URL can be opened
      const canOpen = await Linking.canOpenURL(actualApplyUrl);
      
      if (canOpen) {
        Alert.alert(
          'Apply for Job',
          `You are about to leave the app to apply for "${job.title}" at ${job.company}. This will be tracked in your applications. Continue?`,
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Apply Now',
              onPress: async () => {
                try {
                  // Track the API job application
                  console.log('🔍 Tracking API job application...');
                  const trackResponse = await trackApiJobApplication(token, job);
                  
                  if (trackResponse.success) {
                    console.log('✅ API job application tracked successfully');
                    Alert.alert(
                      'Application Tracked!',
                      'Your application has been tracked. You can view it in your dashboard.',
                      [
                        {
                          text: 'OK',
                          onPress: () => {
                            // Open the external application URL
                            Linking.openURL(actualApplyUrl);
                          }
                        }
                      ]
                    );
                  } else {
                    console.log('⚠️ Failed to track application, but proceeding with external link');
                    // Still open the external URL even if tracking fails
                    await Linking.openURL(actualApplyUrl);
                  }
                } catch (error) {
                  console.error('Error tracking application:', error);
                  // Still open the external URL even if tracking fails
                  await Linking.openURL(actualApplyUrl);
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
          title="Job Details"
          showBackButton={true}
          onBackPress={() => navigation.goBack()}
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
          title="Job Details"
          showBackButton={true}
          onBackPress={() => navigation.goBack()}
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
        title="Job Details"
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
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
                <CompanyLogo 
                  companyName={job.company || 'Company'}
                  size={60}
                  fontSize={24}
                  style={{ borderRadius: 12 }}
                />
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
          {(job.salary || job.salaryRange) && (job.salary !== 'Salary not specified') && (
            <View style={styles.detailSection}>
              <View style={styles.sectionHeader}>
                <Ionicons name="cash-outline" size={20} color="#3B82F6" />
                <Text style={styles.sectionTitle}>Salary</Text>
              </View>
              <Text style={styles.salaryText}>{job.salary || job.salaryRange}</Text>
            </View>
          )}

          {/* Posted Date */}
          <View style={styles.detailSection}>
            <View style={styles.sectionHeader}>
              <Ionicons name="calendar-outline" size={20} color="#3B82F6" />
              <Text style={styles.sectionTitle}>Posted</Text>
            </View>
            <Text style={styles.postedText}>{formatPostedDate(job.postedDate || job.createdAt)}</Text>
          </View>

          {/* Experience Required */}
          {job.experience && (
            <View style={styles.detailSection}>
              <View style={styles.sectionHeader}>
                <Ionicons name="briefcase-outline" size={20} color="#3B82F6" />
                <Text style={styles.sectionTitle}>Experience Required</Text>
              </View>
              <Text style={styles.experienceText}>{job.experience}</Text>
            </View>
          )}

          {/* Education */}
          {job.education && (
            <View style={styles.detailSection}>
              <View style={styles.sectionHeader}>
                <Ionicons name="school-outline" size={20} color="#3B82F6" />
                <Text style={styles.sectionTitle}>Education</Text>
              </View>
              <Text style={styles.educationText}>{job.education}</Text>
            </View>
          )}

          {/* Work Mode */}
          {job.workMode && (
            <View style={styles.detailSection}>
              <View style={styles.sectionHeader}>
                <Ionicons name="location-outline" size={20} color="#3B82F6" />
                <Text style={styles.sectionTitle}>Work Mode</Text>
              </View>
              <Text style={styles.workModeText}>{job.workMode}</Text>
            </View>
          )}

          {/* Company Size */}
          {job.companySize && (
            <View style={styles.detailSection}>
              <View style={styles.sectionHeader}>
                <Ionicons name="people-outline" size={20} color="#3B82F6" />
                <Text style={styles.sectionTitle}>Company Size</Text>
              </View>
              <Text style={styles.companySizeText}>{job.companySize}</Text>
            </View>
          )}

          {/* Industry */}
          {job.industry && (
            <View style={styles.detailSection}>
              <View style={styles.sectionHeader}>
                <Ionicons name="business-outline" size={20} color="#3B82F6" />
                <Text style={styles.sectionTitle}>Industry</Text>
              </View>
              <Text style={styles.industryText}>{job.industry}</Text>
            </View>
          )}

          {/* Job Description */}
          <View style={styles.detailSection}>
            <View style={styles.sectionHeader}>
              <Ionicons name="document-text-outline" size={20} color="#3B82F6" />
              <Text style={styles.sectionTitle}>Job Description</Text>
            </View>
            <Text style={styles.descriptionText}>{job.description}</Text>
          </View>

          {/* Responsibilities */}
          {job.responsibilities && (
            <View style={styles.detailSection}>
              <View style={styles.sectionHeader}>
                <Ionicons name="list-outline" size={20} color="#3B82F6" />
                <Text style={styles.sectionTitle}>Responsibilities</Text>
              </View>
              <Text style={styles.responsibilitiesText}>{job.responsibilities}</Text>
            </View>
          )}

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

          {/* Skills */}
          {job.skills && job.skills.length > 0 && (
            <View style={styles.detailSection}>
              <View style={styles.sectionHeader}>
                <Ionicons name="code-outline" size={20} color="#3B82F6" />
                <Text style={styles.sectionTitle}>Required Skills</Text>
              </View>
              <View style={styles.skillsContainer}>
                {job.skills.map((skill, index) => (
                  <View key={index} style={styles.skillTag}>
                    <Text style={styles.skillText}>{skill}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Benefits */}
          {job.benefits && job.benefits.length > 0 && (
            <View style={styles.detailSection}>
              <View style={styles.sectionHeader}>
                <Ionicons name="gift-outline" size={20} color="#3B82F6" />
                <Text style={styles.sectionTitle}>Benefits</Text>
              </View>
              <View style={styles.benefitsList}>
                {job.benefits.map((benefit, index) => (
                  <View key={index} style={styles.benefitItem}>
                    <Ionicons name="checkmark" size={16} color="#059669" />
                    <Text style={styles.benefitText}>{benefit}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Application Deadline */}
          {job.applicationDeadline && (
            <View style={styles.detailSection}>
              <View style={styles.sectionHeader}>
                <Ionicons name="time-outline" size={20} color="#3B82F6" />
                <Text style={styles.sectionTitle}>Application Deadline</Text>
              </View>
              <Text style={styles.deadlineText}>
                {new Date(job.applicationDeadline).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </Text>
            </View>
          )}

          {/* Job Statistics */}
          <View style={styles.detailSection}>
            <View style={styles.sectionHeader}>
              <Ionicons name="stats-chart-outline" size={20} color="#3B82F6" />
              <Text style={styles.sectionTitle}>Job Statistics</Text>
            </View>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{job.totalApplications || 0}</Text>
                <Text style={styles.statLabel}>Applications</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{job.views || 0}</Text>
                <Text style={styles.statLabel}>Views</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Apply Button */}
        <View style={styles.applySection}>
          <TouchableOpacity
            style={[styles.applyButton, applying && styles.applyButtonDisabled]}
            onPress={handleApply}
            disabled={applying || !(job?.applyUrl || job?.apply_url || job?.job_apply_link)}
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
          
          {!(job?.applyUrl || job?.apply_url || job?.job_apply_link) && (
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
  responsibilitiesText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
  experienceText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
  educationText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
  workModeText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
  companySizeText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
  industryText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
  deadlineText: {
    fontSize: 16,
    color: '#EF4444',
    fontWeight: '600',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillTag: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  skillText: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '500',
  },
  benefitsList: {
    gap: 8,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  benefitText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 24,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  statLabel: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
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
