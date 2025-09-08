import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { getApplicationLimits } from '../services/apiService';

const JobApplicationProgress = ({ className, style, refreshTrigger }) => {
  const { token } = useAuth();
  const [progressData, setProgressData] = useState({ 
    current: 0, 
    max: 5, 
    percentage: 0 
  });
  const [remaining, setRemaining] = useState(5);
  const [subscription, setSubscription] = useState({ plan: 'free' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchProgressData();
    }
  }, [token, refreshTrigger]);

  const fetchProgressData = async () => {
    try {
      setLoading(true);
      const response = await getApplicationLimits(token);
      
      if (response.success) {
        const data = response.data;
        setProgressData({
          current: data.current,
          max: data.max,
          percentage: data.percentage
        });
        setRemaining(data.remaining);
        setSubscription({
          plan: data.plan,
          name: data.planName
        });
      } else {
        console.error('Failed to fetch application limits:', response.message);
        // Set default values on error
        setProgressData({
          current: 0,
          max: 5,
          percentage: 0
        });
        setRemaining(5);
        setSubscription({
          plan: 'free',
          name: 'Free Plan'
        });
      }
    } catch (error) {
      console.error('Error fetching progress data:', error);
      // Set default values on error
      setProgressData({
        current: 0,
        max: 5,
        percentage: 0
      });
      setRemaining(5);
      setSubscription({
        plan: 'free',
        name: 'Free Plan'
      });
    } finally {
      setLoading(false);
    }
  };

  // Expose refresh function for external use
  const refresh = () => {
    fetchProgressData();
  };

  const { current: currentApplications, max: maxApplications, percentage: progressPercentage } = progressData;
  const isLimitReached = currentApplications >= maxApplications;
  const remainingApplications = remaining;

  const handleUpgradeClick = () => {
    Alert.alert(
      'Upgrade Required',
      'You need to upgrade your plan to apply for more jobs.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'View Packages', onPress: () => console.log('Navigate to packages') }
      ]
    );
  };

  const handleViewPackages = () => {
    console.log('Navigate to packages page');
  };

  if (loading) {
    return (
      <View style={[styles.container, style]}>
        <View style={styles.header}>
          <Text style={styles.title}>Job Application Progress</Text>
        </View>
        <View style={styles.content}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </View>
    );
  }

  if (!subscription) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <Text style={styles.title}>Job Application Progress</Text>
        <View style={styles.headerRight}>
          <Text style={styles.countText}>
            {currentApplications} / {maxApplications}
          </Text>
          {subscription.plan === 'free' && (
            <Ionicons name="star" size={16} color="#F59E0B" />
          )}
        </View>
      </View>

      <View style={styles.content}>
        {/* Progress Bar */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Applications used</Text>
            <Text style={styles.remainingText}>
              {remainingApplications > 0 ? `${remainingApplications} remaining` : 'Limit reached'}
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${progressPercentage}%`,
                  backgroundColor: isLimitReached ? '#EF4444' : '#3B82F6'
                }
              ]} 
            />
          </View>
        </View>

        {/* Current Plan Info */}
        <View style={styles.planInfo}>
          <View style={styles.planContent}>
            <Text style={styles.planTitle}>
              Current Plan: {subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1)}
            </Text>
            <Text style={styles.planDescription}>
              {subscription.plan === 'free' 
                ? `Limited to ${maxApplications} job applications per month`
                : `Up to ${maxApplications} job applications per month`
              }
            </Text>
          </View>
          {subscription.plan === 'free' && (
            <TouchableOpacity 
              style={styles.upgradeButton}
              onPress={handleUpgradeClick}
            >
              <Text style={styles.upgradeButtonText}>Upgrade</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Limit Reached Alert */}
        {isLimitReached && (
          <View style={styles.alertContainer}>
            <Ionicons name="warning" size={16} color="#F59E0B" />
            <Text style={styles.alertText}>
              You've reached your job application limit for this period.
              {subscription.plan === 'free' && ' Upgrade your plan to apply for more jobs!'}
            </Text>
          </View>
        )}

        {/* Upgrade CTA */}
        {subscription.plan === 'free' && (
          <View style={styles.upgradeCTA}>
            <View style={styles.upgradeContent}>
              <Text style={styles.upgradeTitle}>Need more job applications?</Text>
              <Text style={styles.upgradeDescription}>
                Upgrade to Professional ($49/month) for 50 applications or Business ($79/3 months) for 100 applications.
              </Text>
            </View>
            <TouchableOpacity 
              style={styles.viewPackagesButton}
              onPress={handleViewPackages}
            >
              <Text style={styles.viewPackagesText}>View Packages</Text>
              <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  countText: {
    fontSize: 14,
    color: '#6B7280',
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 16,
  },
  progressSection: {
    gap: 8,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  remainingText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  planInfo: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  planContent: {
    flex: 1,
  },
  planTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 2,
  },
  planDescription: {
    fontSize: 12,
    color: '#6B7280',
  },
  upgradeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  upgradeButtonText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  alertContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    gap: 8,
  },
  alertText: {
    flex: 1,
    fontSize: 14,
    color: '#92400E',
  },
  upgradeCTA: {
    backgroundColor: '#EFF6FF',
    borderColor: '#3B82F6',
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    gap: 12,
  },
  upgradeContent: {
    gap: 4,
  },
  upgradeTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1E40AF',
  },
  upgradeDescription: {
    fontSize: 14,
    color: '#1D4ED8',
    lineHeight: 20,
  },
  viewPackagesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 8,
  },
  viewPackagesText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  loadingText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    paddingVertical: 20,
  },
});

export default JobApplicationProgress;
