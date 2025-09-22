import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '../components/AppHeader';

const { width, height } = Dimensions.get('window');

const JobAlertsScreen = ({ navigation }) => {
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      title: 'React Developer Jobs',
      keywords: 'React, JavaScript, Frontend',
      location: 'San Francisco, CA',
      frequency: 'Daily',
      isEnabled: true,
      lastSent: '2024-01-15',
    },
    {
      id: 2,
      title: 'Data Science Positions',
      keywords: 'Python, Machine Learning, AI',
      location: 'Remote',
      frequency: 'Weekly',
      isEnabled: true,
      lastSent: '2024-01-12',
    },
    {
      id: 3,
      title: 'Full Stack Engineer',
      keywords: 'Node.js, React, MongoDB',
      location: 'New York, NY',
      frequency: 'Daily',
      isEnabled: false,
      lastSent: '2024-01-10',
    },
  ]);

  const toggleAlert = (id) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, isEnabled: !alert.isEnabled } : alert
    ));
  };

  const createNewAlert = () => {
    console.log('Create new alert');
    // Handle create new alert logic here
  };

  const renderAlert = (alert) => (
    <View key={alert.id} style={styles.alertCard}>
      <View style={styles.alertHeader}>
        <View style={styles.alertInfo}>
          <Text style={styles.alertTitle}>{alert.title}</Text>
          <Text style={styles.alertKeywords}>{alert.keywords}</Text>
          <View style={styles.alertMeta}>
            <View style={styles.metaItem}>
              <Ionicons name="location-outline" size={14} color="#6B7280" />
              <Text style={styles.metaText}>{alert.location}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={14} color="#6B7280" />
              <Text style={styles.metaText}>{alert.frequency}</Text>
            </View>
          </View>
        </View>
        <Switch
          value={alert.isEnabled}
          onValueChange={() => toggleAlert(alert.id)}
          trackColor={{ false: '#E5E7EB', true: '#3B82F6' }}
          thumbColor={alert.isEnabled ? '#FFFFFF' : '#9CA3AF'}
        />
      </View>
      
      <View style={styles.alertFooter}>
        <Text style={styles.lastSentText}>
          Last sent: {alert.lastSent}
        </Text>
        <TouchableOpacity style={styles.editButton}>
          <Ionicons name="create-outline" size={16} color="#6B7280" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#F6F8FF', '#E8F2FF', '#D6E8FF']}
        style={styles.gradient}
      >
        <AppHeader 
          title="Job Alerts" 
          showBackButton={true}
          onBackPress={() => navigation.goBack()}
        />
        
        <View style={styles.content}>
          {/* Stats Section */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{alerts.length}</Text>
              <Text style={styles.statLabel}>Total Alerts</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {alerts.filter(alert => alert.isEnabled).length}
              </Text>
              <Text style={styles.statLabel}>Active</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {alerts.filter(alert => !alert.isEnabled).length}
              </Text>
              <Text style={styles.statLabel}>Inactive</Text>
            </View>
          </View>

          {/* Create New Alert Button */}
          <TouchableOpacity style={styles.createButton} onPress={createNewAlert}>
            <LinearGradient
              colors={['#3B82F6', '#1D4ED8']}
              style={styles.createButtonGradient}
            >
              <Ionicons name="add" size={20} color="#FFFFFF" />
              <Text style={styles.createButtonText}>Create New Alert</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Alerts List */}
          <View style={styles.alertsContainer}>
            <Text style={styles.sectionTitle}>Your Job Alerts</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {alerts.map(renderAlert)}
            </ScrollView>
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
  createButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: '#3B82F6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  createButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  alertsContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  alertCard: {
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
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  alertInfo: {
    flex: 1,
    marginRight: 12,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  alertKeywords: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  alertMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  alertFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastSentText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  editButton: {
    padding: 4,
  },
});

export default JobAlertsScreen;
