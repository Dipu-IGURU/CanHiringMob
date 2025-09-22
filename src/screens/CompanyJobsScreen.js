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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '../components/AppHeader';
import { API_BASE_URL } from '../services/apiService';

const { width, height } = Dimensions.get('window');

const CompanyJobsScreen = ({ navigation, route }) => {
  const { companyName } = route.params || { companyName: 'Unknown Company' };
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  console.log('CompanyJobsScreen mounted with companyName:', companyName);

  useEffect(() => {
    fetchCompanyJobs();
  }, [companyName]);

  const fetchCompanyJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching jobs for company:', companyName);
      console.log('API URL:', `${API_BASE_URL}/api/jobs?company=${encodeURIComponent(companyName)}&limit=50`);
      
      const response = await fetch(`${API_BASE_URL}/api/jobs?company=${encodeURIComponent(companyName)}&limit=50`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('API Response:', data);
      
      if (data.success && data.data) {
        setJobs(data.data);
        console.log('Jobs set:', data.data.length);
      } else {
        setJobs([]);
        console.log('No jobs found');
      }
    } catch (err) {
      console.error('Error fetching company jobs:', err);
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

  const renderJob = ({ item }) => {
    try {
      console.log('Rendering job:', item);
      console.log('Job benefits type:', typeof item?.benefits, 'isArray:', Array.isArray(item?.benefits));
      console.log('Job skills type:', typeof item?.skills, 'isArray:', Array.isArray(item?.skills));
      if (!item) {
        console.log('Job item is null or undefined');
        return null;
      }
      
      return (
    <View style={styles.jobCard}>
      {/* Premium Job Header */}
      <LinearGradient
        colors={['#F8FAFC', '#F1F5F9']}
        style={styles.jobHeaderGradient}
      >
        <View style={styles.jobHeader}>
          <View style={styles.jobTitleContainer}>
            <Text style={styles.jobTitle}>{item.title}</Text>
            <View style={styles.jobType}>
              <Text style={styles.jobTypeText}>{item.type}</Text>
            </View>
          </View>
          <View style={styles.jobStatus}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Active</Text>
          </View>
        </View>
        
        {/* Quick Info Row */}
        <View style={styles.quickInfoRow}>
          <View style={styles.quickInfoItem}>
            <Ionicons name="location" size={16} color="#3B82F6" />
            <Text style={styles.quickInfoText}>{item.location}</Text>
          </View>
          
          <View style={styles.quickInfoItem}>
            <Ionicons name="briefcase" size={16} color="#3B82F6" />
            <Text style={styles.quickInfoText}>{item.category}</Text>
          </View>
          
          {item.salaryRange && (
            <View style={styles.quickInfoItem}>
              <Ionicons name="cash" size={16} color="#3B82F6" />
              <Text style={styles.quickInfoText}>{item.salaryRange}</Text>
            </View>
          )}
        </View>
      </LinearGradient>
      
      <View style={styles.jobCardContent}>
        {/* Job Details Grid */}
        <View style={styles.jobDetailsGrid}>
          <View style={styles.jobDetailCard}>
            <Ionicons name="calendar" size={20} color="#10B981" />
            <Text style={styles.jobDetailLabel}>Posted</Text>
            <Text style={styles.jobDetailValue}>{formatPostedDate(item.createdAt)}</Text>
          </View>
          
          <View style={styles.jobDetailCard}>
            <Ionicons name="people" size={20} color="#8B5CF6" />
            <Text style={styles.jobDetailLabel}>Applications</Text>
            <Text style={styles.jobDetailValue}>{item.totalApplications || 0}</Text>
          </View>
          
          <View style={styles.jobDetailCard}>
            <Ionicons name="eye" size={20} color="#F59E0B" />
            <Text style={styles.jobDetailLabel}>Views</Text>
            <Text style={styles.jobDetailValue}>{item.views || 0}</Text>
          </View>
        </View>

        {/* Experience and Education */}
        {(item.experience || item.education) && (
          <View style={styles.requirementsSection}>
            {item.experience && (
              <View style={styles.requirementItem}>
                <Ionicons name="briefcase-outline" size={16} color="#3B82F6" />
                <Text style={styles.requirementLabel}>Experience: </Text>
                <Text style={styles.requirementText}>{item.experience}</Text>
              </View>
            )}
            {item.education && (
              <View style={styles.requirementItem}>
                <Ionicons name="school-outline" size={16} color="#3B82F6" />
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
                <Ionicons name="location-outline" size={16} color="#3B82F6" />
                <Text style={styles.infoLabel}>Work Mode: </Text>
                <Text style={styles.infoText}>{item.workMode}</Text>
              </View>
            )}
            {item.companySize && (
              <View style={styles.infoItem}>
                <Ionicons name="people-outline" size={16} color="#3B82F6" />
                <Text style={styles.infoLabel}>Company Size: </Text>
                <Text style={styles.infoText}>{item.companySize}</Text>
              </View>
            )}
            {item.industry && (
              <View style={styles.infoItem}>
                <Ionicons name="business-outline" size={16} color="#3B82F6" />
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
                    <Ionicons name="checkmark" size={16} color="#059669" />
                    <Text style={styles.benefitText}>{benefit}</Text>
                  </View>
                ))
              ) : (
                <View style={styles.benefitItem}>
                  <Ionicons name="checkmark" size={16} color="#059669" />
                  <Text style={styles.benefitText}>{item.benefits}</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Application Deadline */}
        {item.applicationDeadline && (
          <View style={styles.deadlineSection}>
            <Ionicons name="time-outline" size={16} color="#EF4444" />
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
      
      {/* Premium Apply Section */}
      <LinearGradient
        colors={['#3B82F6', '#1D4ED8']}
        style={styles.applySection}
      >
        <View style={styles.applyButtonContainer}>
          <TouchableOpacity 
            style={styles.applyButton}
            onPress={() => handleApply(item)}
          >
            <Ionicons name="send" size={20} color="#FFFFFF" />
            <Text style={styles.applyButtonText}>Apply Now</Text>
            <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.saveButton}>
            <Ionicons name="bookmark-outline" size={20} color="#3B82F6" />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
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
          <ActivityIndicator size="large" color="#3B82F6" />
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
          <Ionicons name="alert-circle" size={48} color="#EF4444" />
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
    <SafeAreaView style={styles.container}>
      {/* Premium Header with Gradient */}
      <LinearGradient
        colors={['#3B82F6', '#1D4ED8', '#1E40AF']}
        style={styles.premiumHeader}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          
          <View style={styles.headerInfo}>
            <View style={styles.companyLogo}>
              <Text style={styles.companyLogoText}>
                {companyName.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle}>{companyName}</Text>
              <Text style={styles.headerSubtitle}>
                {jobs.length} {jobs.length === 1 ? 'job' : 'jobs'} available
              </Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.shareButton}>
            <Ionicons name="share-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        
        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="briefcase" size={20} color="#FFFFFF" />
            <Text style={styles.statNumber}>{jobs.length}</Text>
            <Text style={styles.statLabel}>Open Positions</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="trending-up" size={20} color="#FFFFFF" />
            <Text style={styles.statNumber}>98%</Text>
            <Text style={styles.statLabel}>Success Rate</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="star" size={20} color="#FFFFFF" />
            <Text style={styles.statNumber}>4.8</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>
      </LinearGradient>

      {jobs.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <Ionicons name="briefcase-outline" size={80} color="#E2E8F0" />
          </View>
          <Text style={styles.emptyTitle}>No Jobs Available</Text>
          <Text style={styles.emptyText}>
            This company doesn't have any active job postings at the moment.
          </Text>
          <TouchableOpacity 
            style={styles.refreshButton}
            onPress={fetchCompanyJobs}
          >
            <Ionicons name="refresh" size={20} color="#3B82F6" />
            <Text style={styles.refreshButtonText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={jobs}
          renderItem={renderJob}
          keyExtractor={(item) => item._id || Math.random().toString()}
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  loadingText: {
    fontSize: 16,
    color: '#64748B',
    marginTop: 12,
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#F8FAFC',
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 20,
    fontWeight: '500',
  },
  retryButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Premium Header Styles
  premiumHeader: {
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
  },
  companyLogo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  companyLogoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Stats Container
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
    textAlign: 'center',
  },
  jobsList: {
    padding: 20,
    paddingBottom: 40,
    flexGrow: 1,
    minHeight: '100%',
  },
  
  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    backgroundColor: '#F8FAFC',
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  refreshButtonText: {
    color: '#3B82F6',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Job Card Styles
  jobCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  jobHeaderGradient: {
    padding: 20,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  jobTitleContainer: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 8,
    lineHeight: 26,
  },
  jobType: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  jobTypeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  jobStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
    marginRight: 4,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  quickInfoRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  quickInfoText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
  },
  jobCardContent: {
    padding: 20,
  },
  jobDetailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 12,
  },
  jobDetailCard: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  jobDetailLabel: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 8,
    marginBottom: 4,
    fontWeight: '500',
  },
  jobDetailValue: {
    fontSize: 16,
    color: '#1E293B',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 8,
  },
  requirementsSection: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  requirementLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
  },
  requirementText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  companyInfoSection: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#F0F9FF',
    borderRadius: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
  },
  infoText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  descriptionSection: {
    marginBottom: 12,
  },
  skillsSection: {
    marginBottom: 12,
  },
  benefitsSection: {
    marginBottom: 12,
  },
  benefitsList: {
    gap: 6,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  benefitText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
    lineHeight: 20,
  },
  deadlineSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },
  deadlineLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#EF4444',
  },
  deadlineText: {
    fontSize: 14,
    color: '#EF4444',
    fontWeight: '600',
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  applySection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    flex: 1,
    marginRight: 12,
  },
  jobType: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  jobTypeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  jobDetails: {
    marginBottom: 12,
  },
  jobDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  jobDetailText: {
    fontSize: 14,
    color: '#64748B',
    marginLeft: 8,
  },
  jobDescription: {
    fontSize: 14,
    color: '#1E293B',
    lineHeight: 20,
    marginBottom: 12,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  skillTag: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 8,
    marginBottom: 4,
  },
  skillText: {
    fontSize: 12,
    color: '#475569',
  },
  moreSkillsText: {
    fontSize: 12,
    color: '#64748B',
    alignSelf: 'center',
  },
  applyButton: {
    backgroundColor: '#3B82F6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  
  // Premium Apply Section
  applySection: {
    padding: 20,
  },
  applyButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  applyButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  applyButtonText: {
    color: '#3B82F6',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton: {
    width: 48,
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
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
});

export default CompanyJobsScreen;
