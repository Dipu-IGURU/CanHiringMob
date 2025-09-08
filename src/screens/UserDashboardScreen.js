import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '../components/AppHeader';
import JobApplicationProgress from '../components/JobApplicationProgress';
import ApplicationDetailsModal from '../components/ApplicationDetailsModal';
import { API_BASE_URL } from '../services/apiService';

const UserDashboardScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [appStats, setAppStats] = useState({
    total: 0,
    changeFromLastWeek: 0
  });
  const [interviewStats, setInterviewStats] = useState({
    total: 0,
    thisWeek: 0
  });
  const [profileStats, setProfileStats] = useState({
    totalViews: 0,
    percentageChange: 0
  });

  // Modal state
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [selectedApplicationId, setSelectedApplicationId] = useState(null);

  useEffect(() => {
    checkAuthAndFetchData();
  }, []);

  const checkAuthAndFetchData = async () => {
    try {
      // For now, using mock data - in real app, check localStorage/AsyncStorage for token
      const mockUser = {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        role: 'user',
        title: 'Senior UI/UX Designer',
        location: 'San Francisco, CA',
        avatar: ''
      };
      
      setUser(mockUser);
      await fetchAllData();
    } catch (error) {
      console.error('Error checking auth:', error);
      Alert.alert('Error', 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllData = async () => {
    try {
      await Promise.all([
        fetchAppliedJobs(),
        fetchApplicationStats(),
        fetchInterviewStats(),
        fetchProfileStats()
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const fetchAppliedJobs = async () => {
    try {
      // Mock data for now - replace with actual API call
      const mockJobs = [
        {
          id: '1',
          title: 'Senior Frontend Developer',
          company: 'Tech Corp',
          location: 'San Francisco, CA',
          type: 'Full-time',
          date: '2024-01-15',
          status: 'applied',
          applicationId: 'app1'
        },
        {
          id: '2',
          title: 'UI/UX Designer',
          company: 'Design Studio',
          location: 'New York, NY',
          type: 'Full-time',
          date: '2024-01-10',
          status: 'interview',
          applicationId: 'app2'
        },
        {
          id: '3',
          title: 'Product Manager',
          company: 'Startup Inc',
          location: 'Remote',
          type: 'Full-time',
          date: '2024-01-08',
          status: 'reviewed',
          applicationId: 'app3'
        }
      ];
      setAppliedJobs(mockJobs);
    } catch (error) {
      console.error('Error fetching applied jobs:', error);
    }
  };

  const fetchApplicationStats = async () => {
    try {
      // Mock data - replace with actual API call
      setAppStats({
        total: 12,
        changeFromLastWeek: 3
      });
    } catch (error) {
      console.error('Error fetching application stats:', error);
    }
  };

  const fetchInterviewStats = async () => {
    try {
      // Mock data - replace with actual API call
      setInterviewStats({
        total: 4,
        thisWeek: 2
      });
    } catch (error) {
      console.error('Error fetching interview stats:', error);
    }
  };

  const fetchProfileStats = async () => {
    try {
      // Mock data - replace with actual API call
      setProfileStats({
        totalViews: 45,
        percentageChange: 12
      });
    } catch (error) {
      console.error('Error fetching profile stats:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAllData();
    setRefreshing(false);
  };

  const handleViewDetails = (applicationId) => {
    setSelectedApplicationId(applicationId);
    setIsApplicationModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsApplicationModalOpen(false);
    setSelectedApplicationId(null);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'applied':
        return { color: '#3B82F6', bgColor: '#EFF6FF', text: 'Applied' };
      case 'interview':
        return { color: '#8B5CF6', bgColor: '#F3F4F6', text: 'Interview' };
      case 'reviewed':
        return { color: '#10B981', bgColor: '#ECFDF5', text: 'Reviewed' };
      case 'rejected':
        return { color: '#EF4444', bgColor: '#FEF2F2', text: 'Rejected' };
      default:
        return { color: '#6B7280', bgColor: '#F9FAFB', text: 'Applied' };
    }
  };

  const StatCard = ({ title, value, subtitle, icon, color }) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statContent}>
        <View style={styles.statInfo}>
          <Text style={styles.statTitle}>{title}</Text>
          <Text style={styles.statValue}>{value}</Text>
          {subtitle && (
            <Text style={[styles.statSubtitle, { color: subtitle.includes('+') ? '#10B981' : '#6B7280' }]}>
              {subtitle}
            </Text>
          )}
        </View>
        <View style={[styles.statIcon, { backgroundColor: color + '20' }]}>
          <Ionicons name={icon} size={24} color={color} />
        </View>
      </View>
    </View>
  );

  const JobApplicationCard = ({ job }) => {
    const statusBadge = getStatusBadge(job.status);
    
    return (
      <TouchableOpacity 
        style={styles.jobCard}
        onPress={() => handleViewDetails(job.applicationId)}
      >
        <View style={styles.jobCardContent}>
          <View style={styles.jobIcon}>
            <Ionicons name="briefcase" size={20} color="#6B7280" />
          </View>
          <View style={styles.jobInfo}>
            <Text style={styles.jobTitle}>{job.title}</Text>
            <Text style={styles.jobCompany}>{job.company}</Text>
            <View style={styles.jobMeta}>
              <View style={styles.jobMetaItem}>
                <Ionicons name="location" size={12} color="#6B7280" />
                <Text style={styles.jobMetaText}>{job.location}</Text>
              </View>
              <View style={styles.jobMetaItem}>
                <Ionicons name="time" size={12} color="#6B7280" />
                <Text style={styles.jobMetaText}>
                  {new Date(job.date).toLocaleDateString()}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.jobActions}>
            <View style={[styles.statusBadge, { backgroundColor: statusBadge.bgColor }]}>
              <Text style={[styles.statusText, { color: statusBadge.color }]}>
                {statusBadge.text}
              </Text>
            </View>
            <TouchableOpacity 
              style={styles.viewDetailsButton}
              onPress={() => handleViewDetails(job.applicationId)}
            >
              <Text style={styles.viewDetailsText}>View Details</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <AppHeader title="Dashboard" showBackButton={false} />
        <View style={styles.loadingContent}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Loading your dashboard...</Text>
        </View>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.errorContainer}>
        <AppHeader title="Dashboard" showBackButton={false} />
        <View style={styles.errorContent}>
          <Ionicons name="alert-circle" size={48} color="#EF4444" />
          <Text style={styles.errorText}>No user data available</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader title="Dashboard" showBackButton={false} />
      
      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <StatCard
            title="Applications Sent"
            value={appStats.total}
            subtitle={appStats.changeFromLastWeek > 0 ? `+${appStats.changeFromLastWeek} from last week` : null}
            icon="document-text"
            color="#3B82F6"
          />
          
          <StatCard
            title="Interviews"
            value={interviewStats.total}
            subtitle={interviewStats.thisWeek > 0 ? `${interviewStats.thisWeek} scheduled this week` : null}
            icon="checkmark-circle"
            color="#8B5CF6"
          />
          
          <StatCard
            title="Profile Views"
            value={profileStats.totalViews}
            subtitle={profileStats.percentageChange > 0 ? `+${profileStats.percentageChange}% from last month` : null}
            icon="person"
            color="#10B981"
          />
        </View>

        {/* Job Application Progress */}
        <View style={styles.progressSection}>
          <JobApplicationProgress />
        </View>

        {/* Recent Applications */}
        <View style={styles.applicationsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Applications</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          {appliedJobs.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="document-outline" size={48} color="#9CA3AF" />
              <Text style={styles.emptyText}>No applications yet</Text>
              <Text style={styles.emptySubtext}>Start applying to jobs to see them here</Text>
            </View>
          ) : (
            <View style={styles.jobsList}>
              {appliedJobs.map((job) => (
                <JobApplicationCard key={job.id} job={job} />
              ))}
            </View>
          )}
        </View>

        {/* Recommended Jobs */}
        <View style={styles.recommendedSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recommended Jobs</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.emptyState}>
            <Ionicons name="star-outline" size={48} color="#9CA3AF" />
            <Text style={styles.emptyText}>No recommendations yet</Text>
            <Text style={styles.emptySubtext}>Complete your profile to get personalized job recommendations</Text>
          </View>
        </View>
      </ScrollView>

      {/* Application Details Modal */}
      {selectedApplicationId && (
        <ApplicationDetailsModal
          isOpen={isApplicationModalOpen}
          onClose={handleCloseModal}
          applicationId={selectedApplicationId}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  loadingContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  errorContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  scrollView: {
    flex: 1,
  },
  statsContainer: {
    padding: 16,
    gap: 12,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  statContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statInfo: {
    flex: 1,
  },
  statTitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 2,
  },
  statSubtitle: {
    fontSize: 12,
    fontWeight: '500',
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  applicationsSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  viewAllText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
  },
  jobsList: {
    gap: 12,
  },
  jobCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  jobCardContent: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'flex-start',
  },
  jobIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  jobInfo: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  jobCompany: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  jobMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  jobMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  jobMetaText: {
    fontSize: 12,
    color: '#6B7280',
  },
  jobActions: {
    alignItems: 'flex-end',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  viewDetailsButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  viewDetailsText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  emptyState: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
    marginTop: 12,
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  recommendedSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
});

export default UserDashboardScreen;
