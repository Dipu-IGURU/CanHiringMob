import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '../components/AppHeader';
import { API_BASE_URL } from '../services/apiService';

const CompanyJobsScreen = ({ navigation, route }) => {
  const { companyName } = route.params || { companyName: 'Unknown Company' };
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      <View style={styles.jobCardContent}>
        {/* Job Header */}
        <View style={styles.jobHeader}>
          <Text style={styles.jobTitle}>{item.title}</Text>
          <View style={styles.jobType}>
            <Text style={styles.jobTypeText}>{item.type}</Text>
          </View>
        </View>
        
        {/* Basic Job Details */}
        <View style={styles.jobDetails}>
          <View style={styles.jobDetailRow}>
            <Ionicons name="location-outline" size={16} color="#64748B" />
            <Text style={styles.jobDetailText}>{item.location}</Text>
          </View>
          
          <View style={styles.jobDetailRow}>
            <Ionicons name="briefcase-outline" size={16} color="#64748B" />
            <Text style={styles.jobDetailText}>{item.category}</Text>
          </View>
          
          {item.salaryRange && (
            <View style={styles.jobDetailRow}>
              <Ionicons name="cash-outline" size={16} color="#64748B" />
              <Text style={styles.jobDetailText}>{item.salaryRange}</Text>
            </View>
          )}

          <View style={styles.jobDetailRow}>
            <Ionicons name="calendar-outline" size={16} color="#64748B" />
            <Text style={styles.jobDetailText}>{formatPostedDate(item.createdAt)}</Text>
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
      
      {/* Apply Button */}
      <View style={styles.applySection}>
        <TouchableOpacity 
          style={styles.applyButton}
          onPress={() => handleApply(item)}
        >
          <Text style={styles.applyButtonText}>Apply Now</Text>
          <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
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
      <AppHeader 
        title={`Jobs at ${companyName}`}
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
      />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{companyName}</Text>
        <Text style={styles.headerSubtitle}>
          {jobs.length} {jobs.length === 1 ? 'job' : 'jobs'} available
        </Text>
      </View>

      {jobs.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="briefcase-outline" size={64} color="#94A3B8" />
          <Text style={styles.emptyTitle}>No Jobs Available</Text>
          <Text style={styles.emptyText}>
            This company doesn't have any active job postings at the moment.
          </Text>
        </View>
      ) : (
        <FlatList
          data={jobs}
          renderItem={renderJob}
          keyExtractor={(item) => item._id || Math.random().toString()}
          contentContainerStyle={styles.jobsList}
          showsVerticalScrollIndicator={false}
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
  },
  loadingText: {
    fontSize: 16,
    color: '#64748B',
    marginTop: 12,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
    marginTop: 12,
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
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#64748B',
  },
  jobsList: {
    padding: 20,
  },
  jobCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  jobCardContent: {
    padding: 20,
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
});

export default CompanyJobsScreen;
