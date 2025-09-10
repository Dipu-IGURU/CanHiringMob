import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '../components/AppHeader';

const { width, height } = Dimensions.get('window');

const MyApplicationsScreen = ({ navigation }) => {
  const [applications] = useState([
    {
      id: 1,
      jobTitle: 'Senior React Developer',
      company: 'TechCorp Solutions',
      appliedDate: '2024-01-15',
      status: 'Under Review',
      statusColor: '#F59E0B',
      location: 'San Francisco, CA',
      salary: '$120,000 - $150,000',
    },
    {
      id: 2,
      jobTitle: 'Full Stack Engineer',
      company: 'InnovateLab',
      appliedDate: '2024-01-12',
      status: 'Interview Scheduled',
      statusColor: '#10B981',
      location: 'New York, NY',
      salary: '$100,000 - $130,000',
    },
    {
      id: 3,
      jobTitle: 'Data Scientist',
      company: 'DataFlow Inc',
      appliedDate: '2024-01-10',
      status: 'Rejected',
      statusColor: '#EF4444',
      location: 'Seattle, WA',
      salary: '$110,000 - $140,000',
    },
    {
      id: 4,
      jobTitle: 'Cloud Architect',
      company: 'CloudTech',
      appliedDate: '2024-01-08',
      status: 'Under Review',
      statusColor: '#F59E0B',
      location: 'Austin, TX',
      salary: '$130,000 - $160,000',
    },
  ]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Under Review':
        return 'time-outline';
      case 'Interview Scheduled':
        return 'calendar-outline';
      case 'Rejected':
        return 'close-circle-outline';
      case 'Accepted':
        return 'checkmark-circle-outline';
      default:
        return 'help-circle-outline';
    }
  };

  const renderApplication = ({ item }) => (
    <TouchableOpacity style={styles.applicationCard} activeOpacity={0.7}>
      <View style={styles.applicationHeader}>
        <View style={styles.jobInfo}>
          <Text style={styles.jobTitle}>{item.jobTitle}</Text>
          <Text style={styles.companyName}>{item.company}</Text>
          <Text style={styles.location}>{item.location}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: item.statusColor + '20' }]}>
          <Ionicons 
            name={getStatusIcon(item.status)} 
            size={16} 
            color={item.statusColor} 
          />
          <Text style={[styles.statusText, { color: item.statusColor }]}>
            {item.status}
          </Text>
        </View>
      </View>
      
      <View style={styles.applicationDetails}>
        <Text style={styles.salary}>{item.salary}</Text>
        <Text style={styles.appliedDate}>Applied on {item.appliedDate}</Text>
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
            <FlatList
              data={applications}
              renderItem={renderApplication}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.applicationsList}
            />
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
});

export default MyApplicationsScreen;
