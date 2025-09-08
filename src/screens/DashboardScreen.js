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

const { width } = Dimensions.get('window');

const DashboardScreen = ({ navigation }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  // Sample dashboard data
  const stats = [
    {
      id: 1,
      title: 'Applications Sent',
      value: '12',
      change: '+3',
      changeType: 'positive',
      icon: 'send',
      color: '#3B82F6',
    },
    {
      id: 2,
      title: 'Interviews Scheduled',
      value: '4',
      change: '+2',
      changeType: 'positive',
      icon: 'calendar',
      color: '#10B981',
    },
    {
      id: 3,
      title: 'Job Offers',
      value: '1',
      change: '+1',
      changeType: 'positive',
      icon: 'trophy',
      color: '#F59E0B',
    },
    {
      id: 4,
      title: 'Profile Views',
      value: '28',
      change: '+12',
      changeType: 'positive',
      icon: 'eye',
      color: '#8B5CF6',
    },
  ];

  const recentActivities = [
    {
      id: 1,
      title: 'Applied to Senior Developer at TechCorp',
      time: '2 hours ago',
      type: 'application',
      icon: 'send',
      color: '#3B82F6',
    },
    {
      id: 2,
      title: 'Interview scheduled with DevSolutions',
      time: '1 day ago',
      type: 'interview',
      icon: 'calendar',
      color: '#10B981',
    },
    {
      id: 3,
      title: 'Profile viewed by InnovateX',
      time: '2 days ago',
      type: 'view',
      icon: 'eye',
      color: '#8B5CF6',
    },
    {
      id: 4,
      title: 'Job alert: React Native Developer',
      time: '3 days ago',
      type: 'alert',
      icon: 'notifications',
      color: '#F59E0B',
    },
  ];

  const quickActions = [
    {
      id: 1,
      title: 'Search Jobs',
      subtitle: 'Find new opportunities',
      icon: 'search',
      color: '#3B82F6',
      onPress: () => navigation.navigate('Jobs'),
    },
    {
      id: 2,
      title: 'Update Profile',
      subtitle: 'Improve your visibility',
      icon: 'person',
      color: '#10B981',
      onPress: () => navigation.navigate('Profile'),
    },
    {
      id: 3,
      title: 'View Applications',
      subtitle: 'Track your progress',
      icon: 'document-text',
      color: '#F59E0B',
      onPress: () => console.log('View Applications'),
    },
    {
      id: 4,
      title: 'Job Alerts',
      subtitle: 'Manage notifications',
      icon: 'notifications',
      color: '#8B5CF6',
      onPress: () => console.log('Job Alerts'),
    },
  ];

  const renderStatCard = ({ item }) => (
    <View style={styles.statCard}>
      <View style={styles.statHeader}>
        <View style={[styles.statIcon, { backgroundColor: item.color + '20' }]}>
          <Ionicons name={item.icon} size={24} color={item.color} />
        </View>
        <View style={[styles.changeBadge, { backgroundColor: item.changeType === 'positive' ? '#10B981' : '#EF4444' }]}>
          <Text style={styles.changeText}>{item.change}</Text>
        </View>
      </View>
      <Text style={styles.statValue}>{item.value}</Text>
      <Text style={styles.statTitle}>{item.title}</Text>
    </View>
  );

  const renderActivityItem = ({ item }) => (
    <View style={styles.activityItem}>
      <View style={[styles.activityIcon, { backgroundColor: item.color + '20' }]}>
        <Ionicons name={item.icon} size={20} color={item.color} />
      </View>
      <View style={styles.activityContent}>
        <Text style={styles.activityTitle}>{item.title}</Text>
        <Text style={styles.activityTime}>{item.time}</Text>
      </View>
    </View>
  );

  const renderQuickAction = ({ item }) => (
    <TouchableOpacity style={styles.quickActionCard} onPress={item.onPress}>
      <View style={[styles.quickActionIcon, { backgroundColor: item.color + '20' }]}>
        <Ionicons name={item.icon} size={24} color={item.color} />
      </View>
      <Text style={styles.quickActionTitle}>{item.title}</Text>
      <Text style={styles.quickActionSubtitle}>{item.subtitle}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <AppHeader 
        title="Dashboard"
        rightActions={[
          { icon: 'notifications-outline', onPress: () => console.log('Notifications') }
        ]}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Welcome Section */}
        <LinearGradient
          colors={['#3B82F6', '#1D4ED8']}
          style={styles.welcomeSection}
        >
          <Text style={styles.welcomeText}>Welcome back!</Text>
          <Text style={styles.welcomeSubtext}>Here's your job search overview</Text>
        </LinearGradient>

        {/* Stats Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Progress</Text>
            <View style={styles.periodSelector}>
              <TouchableOpacity 
                style={[styles.periodButton, selectedPeriod === 'week' && styles.activePeriodButton]}
                onPress={() => setSelectedPeriod('week')}
              >
                <Text style={[styles.periodText, selectedPeriod === 'week' && styles.activePeriodText]}>Week</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.periodButton, selectedPeriod === 'month' && styles.activePeriodButton]}
                onPress={() => setSelectedPeriod('month')}
              >
                <Text style={[styles.periodText, selectedPeriod === 'month' && styles.activePeriodText]}>Month</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <FlatList
            data={stats}
            renderItem={renderStatCard}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            scrollEnabled={false}
            contentContainerStyle={styles.statsGrid}
          />
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <FlatList
            data={quickActions}
            renderItem={renderQuickAction}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            scrollEnabled={false}
            contentContainerStyle={styles.quickActionsGrid}
          />
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={recentActivities}
            renderItem={renderActivityItem}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
            contentContainerStyle={styles.activitiesList}
          />
        </View>

        {/* Tips Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Job Search Tips</Text>
          <View style={styles.tipCard}>
            <View style={styles.tipIcon}>
              <Ionicons name="bulb" size={24} color="#F59E0B" />
            </View>
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Optimize Your Profile</Text>
              <Text style={styles.tipText}>
                Add more skills and update your experience to increase your visibility to recruiters.
              </Text>
            </View>
          </View>
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
  welcomeSection: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  welcomeSubtext: {
    fontSize: 16,
    color: '#E2E8F0',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  seeAllText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    padding: 2,
  },
  periodButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  activePeriodButton: {
    backgroundColor: '#3B82F6',
  },
  periodText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
  },
  activePeriodText: {
    color: '#FFFFFF',
  },
  statsGrid: {
    gap: 15,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 5,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  changeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  changeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 14,
    color: '#64748B',
  },
  quickActionsGrid: {
    gap: 15,
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 5,
    marginBottom: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 4,
  },
  quickActionSubtitle: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
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
    color: '#1E293B',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#94A3B8',
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  tipIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  tipText: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
});

export default DashboardScreen;
