import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '../components/AppHeader';
import { getUserApplications } from '../services/apiService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const MyApplicationsScreen = ({ navigation }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load applications data
  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get user token from storage
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        setError('Please login to view your applications');
        return;
      }

      console.log('🔍 Loading user applications...');
      const response = await getUserApplications(token, 1, 20);
      
      if (response.success && response.data) {
        // Transform the data to match the expected format
        const transformedApplications = response.data.map(app => ({
          id: app._id,
          _id: app._id,
          jobTitle: app.jobId?.title || 'Job Title Not Available',
          company: app.jobId?.company || 'Company Not Available',
          location: app.jobId?.location || 'Location Not Specified',
          salary: app.jobId?.salaryRange || 'Salary Not Specified',
          status: app.status || 'pending',
          statusColor: getStatusColor(app.status || 'pending'),
          appliedDate: formatDate(app.appliedAt || app.createdAt),
          jobId: app.jobId?._id
        }));
        
        setApplications(transformedApplications);
        console.log('✅ Loaded', transformedApplications.length, 'applications');
      } else {
        console.log('⚠️ No applications found or API error');
        setApplications([]);
      }
    } catch (err) {
      console.error('❌ Error loading applications:', err);
      setError('Failed to load applications');
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Recently applied';
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return 'Today';
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
      return date.toLocaleDateString();
    } catch (error) {
      return 'Recently applied';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#F59E0B';
      case 'reviewed':
        return '#3B82F6';
      case 'shortlisted':
        return '#10B981';
      case 'interview':
        return '#8B5CF6';
      case 'rejected':
        return '#EF4444';
      case 'hired':
        return '#059669';
      default:
        return '#6B7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return 'time-outline';
      case 'reviewed':
        return 'eye-outline';
      case 'shortlisted':
        return 'star-outline';
      case 'interview':
        return 'calendar-outline';
      case 'rejected':
        return 'close-circle-outline';
      case 'hired':
        return 'checkmark-circle-outline';
      default:
        return 'help-circle-outline';
    }
  };

  const renderApplication = ({ item }) => (
    <TouchableOpacity 
      style={styles.applicationCard} 
      activeOpacity={0.7}
      onPress={() => {
        // Navigate to job details or application details
        if (item.jobId) {
          navigation.navigate('JobDetails', { jobId: item.jobId });
        }
      }}
    >
      <View style={styles.applicationHeader}>
        <View style={styles.jobInfo}>
          <Text style={styles.jobTitle}>{item.jobTitle}</Text>
          <Text style={styles.companyName}>{item.company}</Text>
          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={12} color="#9CA3AF" />
            <Text style={styles.location}>{item.location}</Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: item.statusColor + '20' }]}>
          <Ionicons 
            name={getStatusIcon(item.status)} 
            size={16} 
            color={item.statusColor} 
          />
          <Text style={[styles.statusText, { color: item.statusColor }]}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
      </View>
      
      <View style={styles.applicationDetails}>
        <Text style={styles.salary}>{item.salary}</Text>
        <View style={styles.timeContainer}>
          <Ionicons name="time-outline" size={12} color="#9CA3AF" />
          <Text style={styles.appliedDate}>{item.appliedDate}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#F6F8FF', '#E8F2FF', '#D6E8FF']}
        style={styles.gradient}
      >
        <AppHeader 
          title="My Applications" 
          showBackButton={true}
          onBackPress={() => navigation.goBack()}
        />
        
        <View style={styles.content}>
          {/* Stats Section */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{applications.length}</Text>
              <Text style={styles.statLabel}>Total Applications</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {applications.filter(app => app.status === 'Under Review').length}
              </Text>
              <Text style={styles.statLabel}>Under Review</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {applications.filter(app => app.status === 'Interview Scheduled').length}
              </Text>
              <Text style={styles.statLabel}>Interviews</Text>
            </View>
          </View>

          {/* Applications List */}
          <View style={styles.applicationsContainer}>
            <Text style={styles.sectionTitle}>Recent Applications</Text>
            
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3B82F6" />
                <Text style={styles.loadingText}>Loading applications...</Text>
              </View>
            ) : error ? (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
                <Text style={styles.errorTitle}>Error Loading Applications</Text>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={loadApplications}>
                  <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
              </View>
            ) : applications.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="document-outline" size={64} color="#CBD5E1" />
                <Text style={styles.emptyTitle}>No Applications Yet</Text>
                <Text style={styles.emptyText}>
                  You haven't applied to any jobs yet. Start browsing and apply to jobs that interest you!
                </Text>
                <TouchableOpacity 
                  style={styles.browseButton}
                  onPress={() => navigation.navigate('Jobs')}
                >
                  <Text style={styles.browseButtonText}>Browse Jobs</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <FlatList
                data={applications || []}
                renderItem={renderApplication}
                keyExtractor={(item) => item?.id?.toString() || item?._id?.toString() || Math.random().toString()}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.applicationsList}
              />
            )}
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#3B82F6',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  applicationsContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  applicationsList: {
    paddingBottom: 20,
  },
  applicationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  applicationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
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
  companyName: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  location: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  applicationDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  salary: {
    fontSize: 14,
    fontWeight: '500',
    color: '#10B981',
  },
  appliedDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#6B7280',
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  browseButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  browseButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MyApplicationsScreen;
