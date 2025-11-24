import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Dimensions,
  ScrollView,
  Animated,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppHeader from '../components/AppHeader';
import CompanyLogo from '../components/CompanyLogo';
import { API_BASE_URL, fetchJobsByCompany } from '../services/apiService';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/colors';

const { width, height } = Dimensions.get('window');

const CompanyJobsScreen = ({ navigation, route }) => {
  const { companyName } = route.params || { companyName: 'Unknown Company' };
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [savedJobs, setSavedJobs] = useState(new Set());

  console.log('CompanyJobsScreen mounted with companyName:', companyName);

  useEffect(() => {
    fetchCompanyJobs();
    loadSavedJobs();
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [companyName]);

  // Load saved jobs from AsyncStorage
  const loadSavedJobs = async () => {
    try {
      const saved = await AsyncStorage.getItem('savedJobs');
      if (saved) {
        setSavedJobs(new Set(JSON.parse(saved)));
      }
    } catch (error) {
      console.error('Error loading saved jobs:', error);
    }
  };

  // Handle save/unsave job
  const handleSaveJob = async (job) => {
    try {
      const jobId = job.id || job._id || `${job.title}-${job.company}`;
      const newSavedJobs = new Set(savedJobs);
      
      if (newSavedJobs.has(jobId)) {
        newSavedJobs.delete(jobId);
        Alert.alert('Job Removed', 'Job has been removed from your saved jobs');
      } else {
        newSavedJobs.add(jobId);
        Alert.alert('Job Saved', 'Job has been saved to your saved jobs');
      }
      
      setSavedJobs(newSavedJobs);
      await AsyncStorage.setItem('savedJobs', JSON.stringify(Array.from(newSavedJobs)));
    } catch (error) {
      console.error('Error saving job:', error);
      Alert.alert('Error', 'Failed to save job. Please try again.');
    }
  };

  const fetchCompanyJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Fetching jobs for company:', companyName);
      console.log('🔍 API URL will be:', `${API_BASE_URL}/api/jobs?company=${encodeURIComponent(companyName)}&limit=50`);
      
      const jobsData = await fetchJobsByCompany(companyName, 1, 50);
      setJobs(jobsData);
      console.log('✅ Jobs set:', jobsData.length, 'jobs for company:', companyName);
      
      // Log the actual jobs to verify filtering
      jobsData.forEach((job, index) => {
        console.log(`   ${index + 1}. ${job.title} (${job.company})`);
      });
      
    } catch (err) {
      console.error('❌ Error fetching company jobs:', err);
      setError('Failed to load jobs');
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCompanyJobs();
    setRefreshing(false);
  };

  const getItemLayout = (data, index) => ({
    length: 200, // Approximate height of each job card
    offset: 200 * index,
    index,
  });

  const handleApply = (job) => {
    navigation.navigate('JobApplication', { 
      job: job,
      companyName: companyName 
    });
  };

  const formatPostedDate = (dateString) => {
    if (!dateString) return 'Recently posted';
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) return '1 day ago';
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
      return `${Math.ceil(diffDays / 30)} months ago`;
    } catch (error) {
      return 'Recently posted';
    }
  };

  const renderJob = ({ item, index }) => {
    try {
      console.log('Rendering job:', item);
      console.log('Job benefits type:', typeof item?.benefits, 'isArray:', Array.isArray(item?.benefits));
      console.log('Job skills type:', typeof item?.skills, 'isArray:', Array.isArray(item?.skills));
      if (!item) {
        console.log('Job item is null or undefined');
        return null;
      }
      
      return (
        <Animated.View 
          style={[
            styles.jobCard,
            {
              opacity: fadeAnim,
              transform: [
                { 
                  translateY: slideAnim.interpolate({
                    inputRange: [0, 50],
                    outputRange: [0, 50 + (index * 20)],
                    extrapolate: 'clamp',
                  })
                }
              ]
            }
          ]}
        >
          {/* Job Header */}
          <View style={styles.jobHeader}>
            <View style={styles.jobTitleContainer}>
              <Text style={styles.jobTitle}>{item.title}</Text>
              <View style={styles.jobTypeContainer}>
                <View style={styles.jobType}>
                  <Text style={styles.jobTypeText}>{item.type}</Text>
                </View>
              </View>
            </View>
            <View style={styles.jobStatusContainer}>
              <View style={styles.jobStatus}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>Active</Text>
              </View>
            </View>
          </View>
            
          {/* Quick Info Row */}
          <View style={styles.quickInfoRow}>
            <View style={styles.quickInfoItem}>
              <Ionicons name="location" size={16} color={Colors.primary} />
              <Text style={styles.quickInfoText}>{item.location}</Text>
            </View>
            
            <View style={styles.quickInfoItem}>
              <Ionicons name="briefcase" size={16} color={Colors.primary} />
              <Text style={styles.quickInfoText}>{item.category}</Text>
            </View>
            
            {item.salaryRange && (
              <View style={styles.quickInfoItem}>
                <Ionicons name="cash" size={16} color={Colors.primary} />
                <Text style={styles.quickInfoText}>{item.salaryRange}</Text>
              </View>
            )}
          </View>
      
      <View style={styles.jobCardContent}>
        {/* Job Details Grid */}
        <View style={styles.jobDetailsGrid}>
          <View style={styles.jobDetailCard}>
            <Ionicons name="calendar" size={20} color={Colors.success} />
            <Text style={styles.jobDetailLabel}>Posted</Text>
            <Text style={styles.jobDetailValue}>{formatPostedDate(item.createdAt)}</Text>
          </View>
          
          <View style={styles.jobDetailCard}>
            <Ionicons name="people" size={20} color={Colors.info} />
            <Text style={styles.jobDetailLabel}>Applications</Text>
            <Text style={styles.jobDetailValue}>{item.totalApplications || 0}</Text>
          </View>
          
          <View style={styles.jobDetailCard}>
            <Ionicons name="eye" size={20} color={Colors.warning} />
            <Text style={styles.jobDetailLabel}>Views</Text>
            <Text style={styles.jobDetailValue}>{item.views || 0}</Text>
          </View>
        </View>

        {/* Experience and Education */}
        {(item.experience || item.education) && (
          <View style={styles.requirementsSection}>
            {item.experience && (
              <View style={styles.requirementItem}>
                <Ionicons name="briefcase-outline" size={16} color={Colors.primary} />
                <Text style={styles.requirementLabel}>Experience: </Text>
                <Text style={styles.requirementText}>{item.experience}</Text>
              </View>
            )}
            {item.education && (
              <View style={styles.requirementItem}>
                <Ionicons name="school-outline" size={16} color={Colors.primary} />
                <Text style={styles.requirementLabel}>Education: </Text>
                <Text style={styles.requirementText}>{item.education}</Text>
              </View>
            )}
          </View>
        )}

        {/* Work Mode and Company Info */}
        {(item.workMode || item.companySize || item.industry) && (
          <View style={styles.companyInfoSection}>
            {item.workMode && (
              <View style={styles.infoItem}>
                <Ionicons name="location-outline" size={16} color={Colors.primary} />
                <Text style={styles.infoLabel}>Work Mode: </Text>
                <Text style={styles.infoText}>{item.workMode}</Text>
              </View>
            )}
            {item.companySize && (
              <View style={styles.infoItem}>
                <Ionicons name="people-outline" size={16} color={Colors.primary} />
                <Text style={styles.infoLabel}>Company Size: </Text>
                <Text style={styles.infoText}>{item.companySize}</Text>
              </View>
            )}
            {item.industry && (
              <View style={styles.infoItem}>
                <Ionicons name="business-outline" size={16} color={Colors.primary} />
                <Text style={styles.infoLabel}>Industry: </Text>
                <Text style={styles.infoText}>{item.industry}</Text>
              </View>
            )}
          </View>
        )}
        
        {/* Job Description */}
        <View style={styles.descriptionSection}>
          <Text style={styles.sectionTitle}>Job Description</Text>
          <Text style={styles.jobDescription}>{item.description}</Text>
        </View>

        {/* Responsibilities */}
        {item.responsibilities && (
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>Responsibilities</Text>
            <Text style={styles.jobDescription}>{item.responsibilities}</Text>
          </View>
        )}

        {/* Requirements */}
        {item.requirements && (
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>Requirements</Text>
            <Text style={styles.jobDescription}>{item.requirements}</Text>
          </View>
        )}
        
        {/* Skills */}
        {item.skills && (
          <View style={styles.skillsSection}>
            <Text style={styles.sectionTitle}>Required Skills</Text>
            <View style={styles.skillsContainer}>
              {Array.isArray(item.skills) ? (
                item.skills.map((skill, index) => (
                  <View key={index} style={styles.skillTag}>
                    <Text style={styles.skillText}>{skill}</Text>
                  </View>
                ))
              ) : (
                <View style={styles.skillTag}>
                  <Text style={styles.skillText}>{item.skills}</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Benefits */}
        {item.benefits && (
          <View style={styles.benefitsSection}>
            <Text style={styles.sectionTitle}>Benefits</Text>
            <View style={styles.benefitsList}>
              {Array.isArray(item.benefits) ? (
                item.benefits.map((benefit, index) => (
                  <View key={index} style={styles.benefitItem}>
                    <Ionicons name="checkmark" size={16} color={Colors.success} />
                    <Text style={styles.benefitText}>{benefit}</Text>
                  </View>
                ))
              ) : (
                <View style={styles.benefitItem}>
                  <Ionicons name="checkmark" size={16} color={Colors.success} />
                  <Text style={styles.benefitText}>{item.benefits}</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Application Deadline */}
        {item.applicationDeadline && (
          <View style={styles.deadlineSection}>
            <Ionicons name="time-outline" size={16} color={Colors.error} />
            <Text style={styles.deadlineLabel}>Application Deadline: </Text>
            <Text style={styles.deadlineText}>
              {new Date(item.applicationDeadline).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </Text>
          </View>
        )}

        {/* Job Statistics */}
        <View style={styles.statsSection}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{item.totalApplications || 0}</Text>
            <Text style={styles.statLabel}>Applications</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{item.views || 0}</Text>
            <Text style={styles.statLabel}>Views</Text>
          </View>
        </View>
      </View>
      
      {/* Apply Section */}
      <View style={styles.applySection}>
        <View style={styles.applyButtonContainer}>
          <TouchableOpacity 
            style={styles.applyButton}
            onPress={() => handleApply(item)}
          >
            <Ionicons name="send" size={20} color={Colors.textInverse} />
            <Text style={styles.applyButtonText}>Apply Now</Text>
            <Ionicons name="arrow-forward" size={16} color={Colors.textInverse} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.saveButton}
            onPress={() => handleSaveJob(item)}
            activeOpacity={0.7}
          >
            <Ionicons 
              name={savedJobs.has(item.id || item._id || `${item.title}-${item.company}`) ? "bookmark" : "bookmark-outline"} 
              size={20} 
              color={savedJobs.has(item.id || item._id || `${item.title}-${item.company}`) ? "#F59E0B" : Colors.primary} 
            />
          </TouchableOpacity>
        </View>
          </View>
        </Animated.View>
      );
    } catch (error) {
      console.error('Error rendering job:', error);
      return (
        <View style={styles.jobCard}>
          <View style={styles.jobCardContent}>
            <Text style={styles.jobTitle}>Error loading job</Text>
            <Text style={styles.jobDescription}>There was an error displaying this job.</Text>
          </View>
        </View>
      );
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <AppHeader 
          title={`Jobs at ${companyName}`}
          showBackButton={true}
          onBackPress={() => navigation.goBack()}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading jobs...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <AppHeader 
          title={`Jobs at ${companyName}`}
          showBackButton={true}
          onBackPress={() => navigation.goBack()}
        />
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color={Colors.error} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={fetchCompanyJobs}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  console.log('Rendering CompanyJobsScreen - loading:', loading, 'error:', error, 'jobs count:', jobs.length);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      
      {/* Enhanced Header */}
      <LinearGradient
        colors={['#1E40AF', '#2563EB', '#3B82F6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Animated.View 
          style={[
            styles.headerContent,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          
          <View style={styles.headerInfo}>
            <View style={styles.companyLogoContainer}>
              <CompanyLogo 
                companyName={companyName}
                size={56}
                fontSize={22}
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }}
                textStyle={{ color: '#FFFFFF' }}
              />
            </View>
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle}>{companyName}</Text>
              <Text style={styles.headerSubtitle}>
                {jobs.length} {jobs.length === 1 ? 'job' : 'jobs'} available
              </Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.shareButton} activeOpacity={0.8}>
            <Ionicons name="share-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </Animated.View>
        
        {/* Colorful Stats Cards */}
        <Animated.View 
          style={[
            styles.statsContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={styles.statCard}>
            <LinearGradient
              colors={['#10B981', '#059669']}
              style={styles.statCardContent}
            >
              <Ionicons name="briefcase" size={20} color="#FFFFFF" />
              <Text style={[styles.statNumber, { color: '#FFFFFF' }]}>{jobs.length}</Text>
              <Text style={[styles.statLabel, { color: '#FFFFFF' }]}>Open Positions</Text>
            </LinearGradient>
          </View>
          <View style={styles.statCard}>
            <LinearGradient
              colors={['#F59E0B', '#D97706']}
              style={styles.statCardContent}
            >
              <Ionicons name="trending-up" size={20} color="#FFFFFF" />
              <Text style={[styles.statNumber, { color: '#FFFFFF' }]}>98%</Text>
              <Text style={[styles.statLabel, { color: '#FFFFFF' }]}>Success Rate</Text>
            </LinearGradient>
          </View>
          <View style={styles.statCard}>
            <LinearGradient
              colors={['#8B5CF6', '#7C3AED']}
              style={styles.statCardContent}
            >
              <Ionicons name="star" size={20} color="#FFFFFF" />
              <Text style={[styles.statNumber, { color: '#FFFFFF' }]}>4.8</Text>
              <Text style={[styles.statLabel, { color: '#FFFFFF' }]}>Rating</Text>
            </LinearGradient>
          </View>
        </Animated.View>
      </LinearGradient>

      {jobs.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <Ionicons name="briefcase-outline" size={80} color={Colors.border} />
          </View>
          <Text style={styles.emptyTitle}>No Jobs Available</Text>
          <Text style={styles.emptyText}>
            This company doesn't have any active job postings at the moment.
          </Text>
          <TouchableOpacity 
            style={styles.refreshButton}
            onPress={fetchCompanyJobs}
          >
            <Ionicons name="refresh" size={20} color={Colors.primary} />
            <Text style={styles.refreshButtonText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={jobs || []}
          renderItem={renderJob}
          keyExtractor={(item) => item?._id?.toString() || item?.id?.toString() || Math.random().toString()}
          contentContainerStyle={styles.jobsList}
          showsVerticalScrollIndicator={false}
          scrollEnabled={true}
          bounces={true}
          nestedScrollEnabled={true}
          removeClippedSubviews={false}
          maxToRenderPerBatch={10}
          windowSize={10}
          initialNumToRender={5}
          getItemLayout={getItemLayout}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#3B82F6']}
              tintColor="#3B82F6"
            />
          }
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text>No jobs to display</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  loadingText: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
    fontWeight: Typography.medium,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    backgroundColor: Colors.background,
  },
  errorText: {
    fontSize: Typography.base,
    color: Colors.error,
    textAlign: 'center',
    marginTop: Spacing.md,
    marginBottom: Spacing.xl,
    fontWeight: Typography.medium,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing['2xl'],
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  retryButtonText: {
    color: Colors.textInverse,
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
  },
  
  // Enhanced Header Styles
  header: {
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: '#1E40AF',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
  },
  companyLogoContainer: {
    marginRight: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  headerSubtitle: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  shareButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  // Enhanced Stats Container
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 16,
    overflow: 'hidden',
  },
  statCardContent: {
    padding: 18,
    alignItems: 'center',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 6,
  },
  statLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    marginTop: 4,
    textAlign: 'center',
    fontWeight: '600',
  },
  jobsList: {
    padding: Spacing.xl,
    paddingBottom: Spacing['4xl'],
    flexGrow: 1,
    minHeight: '100%',
  },
  
  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing['4xl'],
    backgroundColor: Colors.background,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing['2xl'],
  },
  emptyTitle: {
    fontSize: Typography['2xl'],
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: Typography.base * Typography.normal,
    marginBottom: Spacing['3xl'],
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing['2xl'],
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.sm,
  },
  refreshButtonText: {
    color: Colors.primary,
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
  },
  
  // Job Card Styles
  jobCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius['2xl'],
    marginBottom: Spacing.xl,
    ...Shadows.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  jobHeader: {
    padding: Spacing.xl,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
  },
  jobTitleContainer: {
    flex: 1,
  },
  jobTitle: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    lineHeight: Typography.xl * Typography.tight,
  },
  jobTypeContainer: {
    alignSelf: 'flex-start',
  },
  jobType: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius['2xl'],
    ...Shadows.sm,
  },
  jobTypeText: {
    color: Colors.textInverse,
    fontSize: Typography.xs,
    fontWeight: Typography.semibold,
  },
  jobStatusContainer: {
    alignSelf: 'flex-start',
  },
  jobStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.success,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius['2xl'],
    ...Shadows.sm,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.textInverse,
    marginRight: Spacing.xs,
  },
  statusText: {
    color: Colors.textInverse,
    fontSize: Typography.xs,
    fontWeight: Typography.semibold,
  },
  quickInfoRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.lg,
  },
  quickInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceLight,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
    gap: Spacing.xs,
  },
  quickInfoText: {
    fontSize: Typography.sm,
    color: Colors.primary,
    fontWeight: Typography.medium,
  },
  jobCardContent: {
    padding: Spacing.xl,
  },
  jobDetailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
    gap: Spacing.md,
  },
  jobDetailCard: {
    flex: 1,
    backgroundColor: Colors.surfaceLight,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  jobDetailLabel: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
    fontWeight: Typography.medium,
  },
  jobDetailValue: {
    fontSize: Typography.base,
    color: Colors.textPrimary,
    fontWeight: Typography.bold,
  },
  sectionTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  requirementsSection: {
    marginBottom: Spacing.md,
    padding: Spacing.md,
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.md,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  requirementLabel: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: Colors.primary,
  },
  requirementText: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    flex: 1,
  },
  companyInfoSection: {
    marginBottom: Spacing.md,
    padding: Spacing.md,
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.md,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  infoLabel: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: Colors.primary,
  },
  infoText: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    flex: 1,
  },
  descriptionSection: {
    marginBottom: Spacing.md,
  },
  skillsSection: {
    marginBottom: Spacing.md,
  },
  benefitsSection: {
    marginBottom: Spacing.md,
  },
  benefitsList: {
    gap: Spacing.xs,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  benefitText: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    flex: 1,
    lineHeight: Typography.sm * Typography.normal,
  },
  deadlineSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    padding: Spacing.md,
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.md,
    borderLeftWidth: 4,
    borderLeftColor: Colors.error,
  },
  deadlineLabel: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: Colors.error,
  },
  deadlineText: {
    fontSize: Typography.sm,
    color: Colors.error,
    fontWeight: Typography.semibold,
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: Spacing.md,
    padding: Spacing.md,
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.md,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.primary,
  },
  statLabel: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  applyButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  applyButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing['2xl'],
    borderRadius: BorderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    ...Shadows.sm,
  },
  applyButtonText: {
    color: Colors.textInverse,
    fontSize: Typography.base,
    fontWeight: Typography.bold,
  },
  saveButton: {
    width: 48,
    height: 48,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.sm,
  },
  jobDescription: {
    fontSize: Typography.sm,
    color: Colors.textPrimary,
    lineHeight: Typography.sm * Typography.normal,
    marginBottom: Spacing.md,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: Spacing.lg,
  },
  skillTag: {
    backgroundColor: Colors.surfaceLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    marginRight: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  skillText: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
  },
});

export default CompanyJobsScreen;
