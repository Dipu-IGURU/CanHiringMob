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
import { useAuth } from '../contexts/AuthContext';
import { 
  getUserApplications, 
  getApplicationStats, 
  getInterviewStats, 
  getApplicationDetails,
  getProfileStats,
  getRecentActivities,
  getOffersStats,
  getAppliedJobs
} from '../services/apiService';

const UserDashboardScreen = ({ navigation }) => {
  const { user: authUser, token, refreshUserData } = useAuth();
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
  const [offersStats, setOffersStats] = useState({
    totalOffers: 0,
    lastMonthOffers: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [applicationsLoading, setApplicationsLoading] = useState(false);

  // Function to get greeting emoji based on time of day
  const getGreetingEmoji = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '🌅'; // Morning
    if (hour < 17) return '☀️'; // Afternoon
    if (hour < 20) return '🌆'; // Evening
    return '🌙'; // Night
  };

  // Alternative emoji options for variety
  const getPersonalizedEmoji = () => {
    const emojis = ['👋', '🎯', '💼', '🚀', '⭐', '💪', '🎉', '🔥'];
    const userIndex = user ? user.firstName.charCodeAt(0) % emojis.length : 0;
    return emojis[userIndex];
  };

  // Function to get welcome message based on time of day
  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    const messages = {
      morning: ['Good Morning', 'Rise and Shine', 'Morning Sunshine', 'Start Your Day'],
      afternoon: ['Good Afternoon', 'Afternoon Vibes', 'Keep Going', 'Stay Productive'],
      evening: ['Good Evening', 'Evening Time', 'Wind Down', 'Relax Mode'],
      night: ['Good Night', 'Late Night', 'Night Owl', 'Still Working']
    };
    
    let timeCategory, messageList;
    if (hour < 12) {
      timeCategory = 'morning';
      messageList = messages.morning;
    } else if (hour < 17) {
      timeCategory = 'afternoon';
      messageList = messages.afternoon;
    } else if (hour < 20) {
      timeCategory = 'evening';
      messageList = messages.evening;
    } else {
      timeCategory = 'night';
      messageList = messages.night;
    }
    
    // Use user's name to pick a consistent message
    const userIndex = user ? user.firstName.charCodeAt(0) % messageList.length : 0;
    return messageList[userIndex];
  };

  // Modal state
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [selectedApplicationId, setSelectedApplicationId] = useState(null);

  useEffect(() => {
    checkAuthAndFetchData();
  }, []);

  const checkAuthAndFetchData = async () => {
    try {
      if (authUser) {
        setUser(authUser);
        await fetchAllData();
      } else {
        Alert.alert('Error', 'Please log in to view your dashboard');
        navigation.navigate('LoginScreen');
      }
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
        fetchProfileStats(),
        fetchOffersStats(),
        fetchRecentActivities()
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const fetchAppliedJobs = async () => {
    try {
      if (!token) {
        console.log('No token available for fetching applied jobs');
        return;
      }
      
      console.log('Fetching applied jobs with token:', token.substring(0, 20) + '...');
      setApplicationsLoading(true);
      const response = await getAppliedJobs(token);
      console.log('Applied jobs response:', JSON.stringify(response, null, 2));
      
      if (response.success && response.jobs && response.jobs.length > 0) {
        const jobs = response.jobs.map(item => {
          console.log('Processing job item:', JSON.stringify(item, null, 2));
          return {
            id: item._id || item.id,
            title: item.title || 'No Title',
            company: item.company || 'No Company',
            location: item.location || 'Location not specified',
            type: item.type || 'Full-time',
            status: item.status || 'applied',
            date: item.appliedAt || new Date().toISOString(),
            applicationId: item._id || item.id,
            jobId: item.jobId
          };
        });
        console.log('Mapped applied jobs:', jobs);
        setAppliedJobs(jobs);
      } else {
        console.log('No applied jobs found or API error:', response.message);
        // Try fallback to getUserApplications
        console.log('Trying fallback to getUserApplications...');
        try {
          const fallbackResponse = await getUserApplications(token, 1, 10);
          console.log('Fallback response:', JSON.stringify(fallbackResponse, null, 2));
          
          if (fallbackResponse.success && fallbackResponse.data && fallbackResponse.data.length > 0) {
            const fallbackJobs = fallbackResponse.data.map(item => ({
              id: item._id,
              title: item.jobId?.title || 'No Title',
              company: item.jobId?.company || 'No Company',
              location: item.jobId?.location || 'Location not specified',
              type: item.jobId?.type || 'Full-time',
              status: item.status || 'applied',
              date: item.appliedAt || new Date().toISOString(),
              applicationId: item._id,
              jobId: item.jobId?._id
            }));
            console.log('Fallback mapped jobs:', fallbackJobs);
            setAppliedJobs(fallbackJobs);
          } else {
            setAppliedJobs([]);
          }
        } catch (fallbackError) {
          console.error('Fallback also failed:', fallbackError);
          setAppliedJobs([]);
        }
      }
    } catch (error) {
      console.error('Error fetching applied jobs:', error);
      setAppliedJobs([]);
    } finally {
      setApplicationsLoading(false);
    }
  };

  const fetchApplicationStats = async () => {
    try {
      if (!token) return;
      
      const response = await getApplicationStats(token);
      if (response.success) {
        setAppStats({
          total: response.stats.total,
          changeFromLastWeek: response.stats.changeFromLastWeek
        });
      }
    } catch (error) {
      console.error('Error fetching application stats:', error);
    }
  };

  const fetchInterviewStats = async () => {
    try {
      if (!token) return;
      
      const response = await getInterviewStats(token);
      if (response.success) {
        setInterviewStats({
          total: response.stats.totalInterviews,
          thisWeek: response.stats.interviewsThisWeek
        });
      }
    } catch (error) {
      console.error('Error fetching interview stats:', error);
    }
  };

  const fetchProfileStats = async () => {
    try {
      if (!token) return;
      
      const response = await getProfileStats(token);
      if (response.success) {
        setProfileStats({
          totalViews: response.stats.totalViews,
          percentageChange: response.stats.percentageChange
        });
      }
    } catch (error) {
      console.error('Error fetching profile stats:', error);
    }
  };

  const fetchOffersStats = async () => {
    try {
      if (!token) return;
      
      const response = await getOffersStats(token);
      if (response.success) {
        setOffersStats({
          totalOffers: response.stats.totalOffers,
          lastMonthOffers: response.stats.lastMonthOffers
        });
      }
    } catch (error) {
      console.error('Error fetching offers stats:', error);
    }
  };

  const fetchRecentActivities = async () => {
    try {
      if (!token) return;
      
      const response = await getRecentActivities(token, 5);
      if (response.success) {
        setRecentActivities(response.activities);
      }
    } catch (error) {
      console.error('Error fetching recent activities:', error);
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
        return { color: '#6B7280', bgColor: '#F3F4F6', text: 'Applied' };
      case 'interview':
        return { color: '#8B5CF6', bgColor: '#F3F4F6', text: 'Interview' };
      case 'reviewed':
        return { color: '#10B981', bgColor: '#ECFDF5', text: 'Reviewed' };
      case 'rejected':
        return { color: '#EF4444', bgColor: '#FEF2F2', text: 'Rejected' };
      default:
        return { color: '#6B7280', bgColor: '#F3F4F6', text: 'Applied' };
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

  const JobApplicationCard = ({ job, isLast = false }) => {
    const statusBadge = getStatusBadge(job.status);
    
    // Calculate time ago
    const appliedDate = new Date(job.date);
    const timeDiff = Date.now() - appliedDate.getTime();
    const hoursAgo = Math.floor(timeDiff / (1000 * 60 * 60));
    const daysAgo = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    
    let timeText = '';
    if (hoursAgo < 24) {
      timeText = `${hoursAgo} ${hoursAgo === 1 ? 'hour' : 'hours'} ago`;
    } else {
      timeText = `${daysAgo} ${daysAgo === 1 ? 'day' : 'days'} ago`;
    }
    
    return (
      <TouchableOpacity 
        style={[styles.jobCard, isLast && styles.jobCardLast]}
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
            </View>
          </View>
          <View style={styles.jobActions}>
            <View style={[styles.statusBadge, { backgroundColor: statusBadge.bgColor }]}>
              <Text style={[styles.statusText, { color: statusBadge.color }]}>
                {statusBadge.text}
              </Text>
            </View>
            <View style={styles.timeContainer}>
              <Ionicons name="time" size={12} color="#6B7280" />
              <Text style={styles.timeText}>{timeText}</Text>
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
      <AppHeader 
        title={user ? `${getPersonalizedEmoji()} ${getWelcomeMessage()}, ${user.firstName}!` : `${getPersonalizedEmoji()} ${getWelcomeMessage()}, User!`} 
        showBackButton={false} 
      />
      
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
            title="Job Offers"
            value={offersStats.totalOffers}
            subtitle={offersStats.lastMonthOffers > 0 ? `${offersStats.lastMonthOffers} this month` : null}
            icon="trophy"
            color="#F59E0B"
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
          <JobApplicationProgress refreshTrigger={refreshing} />
        </View>

        {/* Recent Applications */}
        <View style={styles.applicationsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Applications</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Jobs')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          {applicationsLoading ? (
            <View style={styles.loadingState}>
              <ActivityIndicator size="small" color="#3B82F6" />
              <Text style={styles.loadingText}>Loading applications...</Text>
            </View>
          ) : appliedJobs.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="document-outline" size={48} color="#9CA3AF" />
              <Text style={styles.emptyText}>No applications yet</Text>
              <Text style={styles.emptySubtext}>Start applying to jobs to see them here</Text>
              <TouchableOpacity 
                style={styles.applyButton}
                onPress={() => navigation.navigate('Jobs')}
              >
                <Text style={styles.applyButtonText}>Browse Jobs</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.jobsList}>
              {appliedJobs.slice(0, 5).map((job, index) => (
                <JobApplicationCard 
                  key={job.id} 
                  job={job} 
                  isLast={index === Math.min(appliedJobs.length - 1, 4)}
                />
              ))}
              {appliedJobs.length > 5 && (
                <TouchableOpacity 
                  style={styles.viewMoreButton}
                  onPress={() => navigation.navigate('Jobs')}
                >
                  <Text style={styles.viewMoreText}>
                    View {appliedJobs.length - 5} more applications
                  </Text>
                  <Ionicons name="arrow-forward" size={16} color="#3B82F6" />
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        {/* Recent Activities */}
        <View style={styles.recommendedSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          {recentActivities.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="time-outline" size={48} color="#9CA3AF" />
              <Text style={styles.emptyText}>No recent activity</Text>
              <Text style={styles.emptySubtext}>Your recent job applications will appear here</Text>
            </View>
          ) : (
            <View style={styles.activitiesList}>
              {recentActivities.map((activity) => (
                <View key={activity.id} style={styles.activityItem}>
                  <View style={[styles.activityIcon, { backgroundColor: activity.color + '20' }]}>
                    <Ionicons name={activity.icon} size={20} color={activity.color} />
                  </View>
                  <View style={styles.activityContent}>
                    <Text style={styles.activityTitle}>{activity.title}</Text>
                    <Text style={styles.activityTime}>
                      {new Date(activity.time).toLocaleDateString()} at {new Date(activity.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
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
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
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
    width: '48%',
    marginBottom: 12,
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
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  jobCard: {
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  jobCardLast: {
    borderBottomWidth: 0,
  },
  jobCardContent: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'flex-start',
  },
  jobIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  jobInfo: {
    flex: 1,
    marginRight: 12,
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
    minWidth: 100,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-end',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-end',
  },
  timeText: {
    fontSize: 12,
    color: '#6B7280',
  },
  viewDetailsButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-end',
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
  activitiesList: {
    gap: 1,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  activityIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#94A3B8',
  },
  applyButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 16,
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  viewMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 0,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    gap: 8,
  },
  viewMoreText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
  },
  loadingState: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    gap: 8,
  },
});

export default UserDashboardScreen;
