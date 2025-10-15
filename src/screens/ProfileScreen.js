import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Switch,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import LogoImage from '../components/LogoImage';
import AppHeader from '../components/AppHeader';
import { useAuth } from '../contexts/AuthContext';
import { getUserApplications, getApplicationStats, getInterviewStats, getCurrentUserProfile, getProfileStats } from '../services/apiService';

const ProfileScreen = ({ navigation }) => {
  const { user, token, logout } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [stats, setStats] = useState({
    applications: 0,
    savedJobs: 0,
    interviews: 0,
    profileViews: 0
  });
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);


  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    if (!token) {
      console.log('No token available for fetching user data');
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      console.log('🔍 ProfileScreen: Fetching user data with token:', token.substring(0, 20) + '...');
      
      // Fetch complete user profile data
      const profileResponse = await getCurrentUserProfile(token);
      console.log('🔍 ProfileScreen: Profile response:', profileResponse);
      if (profileResponse.success) {
        setUserProfile(profileResponse.data);
        console.log('✅ ProfileScreen: User profile loaded:', profileResponse.data);
      }
      
      // Fetch application stats
      const appStatsResponse = await getApplicationStats(token);
      console.log('🔍 ProfileScreen: Application stats response:', appStatsResponse);
      if (appStatsResponse.success) {
        setStats(prev => ({
          ...prev,
          applications: appStatsResponse.stats.total || 0
        }));
      }

      // Fetch interview stats
      const interviewStatsResponse = await getInterviewStats(token);
      console.log('🔍 ProfileScreen: Interview stats response:', interviewStatsResponse);
      if (interviewStatsResponse.success) {
        setStats(prev => ({
          ...prev,
          interviews: interviewStatsResponse.stats.totalInterviews || 0
        }));
      }

      // Fetch profile view stats
      const profileStatsResponse = await getProfileStats(token);
      console.log('🔍 ProfileScreen: Profile stats response:', profileStatsResponse);
      if (profileStatsResponse.success) {
        setStats(prev => ({
          ...prev,
          profileViews: profileStatsResponse.stats.totalViews || 0
        }));
      }

      // For saved jobs, we'll use a placeholder for now
      setStats(prev => ({
        ...prev,
        savedJobs: 0 // Placeholder - implement saved jobs API
      }));

    } catch (error) {
      console.error('❌ ProfileScreen: Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    performLogout();
  };

  const performLogout = async () => {
    try {
      setLoading(true);
      
      // Call logout function to clear auth data
      const logoutResult = await logout();
      
      // Reset navigation stack to prevent going back
      try {
        navigation.reset({
          index: 0,
          routes: [{ name: 'LoginScreen' }],
        });
      } catch (navError) {
        // Fallback to regular navigate
        navigation.navigate('LoginScreen');
      }
      
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Failed to logout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const profileMenuItems = [
    {
      id: 1,
      title: 'Account Settings',
      icon: 'settings-outline',
      onPress: () => navigation.navigate('AccountScreen'),
    },
    {
      id: 2,
      title: 'My Applications',
      icon: 'document-text-outline',
      onPress: () => navigation.navigate('Dashboard'),
    },
  ];

  const renderMenuItem = (item) => (
    <TouchableOpacity
      key={item.id}
      style={styles.menuItem}
      onPress={item.onPress}
    >
      <View style={styles.menuItemLeft}>
        <View style={styles.menuIconContainer}>
          <Ionicons name={item.icon} size={20} color="#3B82F6" />
        </View>
        <Text style={styles.menuItemText}>{item.title}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <AppHeader 
        showLogo={true}
        rightActions={[
          { icon: 'settings-outline', onPress: () => navigation.navigate('AccountScreen') }
        ]}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <LinearGradient
          colors={['#3B82F6', '#1D4ED8']}
          style={styles.profileHeader}
        >
          <View style={styles.profileInfo}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>
                  {user ? `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}` : 'U'}
                </Text>
              </View>
              <TouchableOpacity style={styles.editAvatarButton}>
                <Ionicons name="camera" size={16} color="#3B82F6" />
              </TouchableOpacity>
            </View>
            <Text style={styles.userName}>
              {userProfile ? `${userProfile.firstName} ${userProfile.lastName}` : (user ? `${user.firstName} ${user.lastName}` : 'User')}
            </Text>
            <Text style={styles.userEmail}>
              {userProfile?.email || user?.email || 'user@example.com'}
            </Text>
            <Text style={styles.userRole}>
              {userProfile?.role === 'recruiter' ? 'Recruiter' : 'Job Seeker'}
              {userProfile?.company && ` at ${userProfile.company}`}
            </Text>
            {userProfile?.profile?.jobTitle && (
              <Text style={styles.userTitle}>
                {userProfile.profile.jobTitle}
              </Text>
            )}
            {userProfile?.profile?.location && (
              <Text style={styles.userLocation}>
                📍 {userProfile.profile.location}
              </Text>
            )}
          </View>
        </LinearGradient>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            {loading ? (
              <ActivityIndicator size="small" color="#3B82F6" />
            ) : (
              <Text style={styles.statNumber}>{stats.applications}</Text>
            )}
            <Text style={styles.statLabel}>Applications</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            {loading ? (
              <ActivityIndicator size="small" color="#3B82F6" />
            ) : (
              <Text style={styles.statNumber}>{stats.interviews}</Text>
            )}
            <Text style={styles.statLabel}>Interviews</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            {loading ? (
              <ActivityIndicator size="small" color="#3B82F6" />
            ) : (
              <Text style={styles.statNumber}>{stats.profileViews}</Text>
            )}
            <Text style={styles.statLabel}>Profile Views</Text>
          </View>
        </View>

        {/* Profile Information */}
        {userProfile && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Profile Information</Text>
            {userProfile.profile?.phone && (
              <View style={styles.infoItem}>
                <Ionicons name="call-outline" size={20} color="#3B82F6" />
                <Text style={styles.infoText}>{userProfile.profile.phone}</Text>
              </View>
            )}
            {userProfile.profile?.bio && (
              <View style={styles.infoItem}>
                <Ionicons name="person-outline" size={20} color="#3B82F6" />
                <Text style={styles.infoText}>{userProfile.profile.bio}</Text>
              </View>
            )}
            {userProfile.profile?.skills && userProfile.profile.skills.length > 0 && (
              <View style={styles.infoItem}>
                <Ionicons name="star-outline" size={20} color="#3B82F6" />
                <Text style={styles.infoText}>
                  Skills: {userProfile.profile.skills.join(', ')}
                </Text>
              </View>
            )}
            {userProfile.profile?.experience && (
              <View style={styles.infoItem}>
                <Ionicons name="briefcase-outline" size={20} color="#3B82F6" />
                <Text style={styles.infoText}>{userProfile.profile.experience}</Text>
              </View>
            )}
            {userProfile.profile?.education && (
              <View style={styles.infoItem}>
                <Ionicons name="school-outline" size={20} color="#3B82F6" />
                <Text style={styles.infoText}>{userProfile.profile.education}</Text>
              </View>
            )}
          </View>
        )}

        {/* Notification Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="notifications-outline" size={20} color="#3B82F6" />
              <Text style={styles.settingText}>Push Notifications</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#E2E8F0', true: '#3B82F6' }}
              thumbColor={notificationsEnabled ? '#FFFFFF' : '#FFFFFF'}
            />
          </View>
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="mail-outline" size={20} color="#3B82F6" />
              <Text style={styles.settingText}>Email Notifications</Text>
            </View>
            <Switch
              value={emailNotifications}
              onValueChange={setEmailNotifications}
              trackColor={{ false: '#E2E8F0', true: '#3B82F6' }}
              thumbColor={emailNotifications ? '#FFFFFF' : '#FFFFFF'}
            />
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          {profileMenuItems.map(renderMenuItem)}
        </View>

        {/* Logout Button */}
        <View style={styles.logoutSection}>
          <TouchableOpacity 
            style={[styles.logoutButton, loading && styles.logoutButtonDisabled]} 
            onPress={handleLogout}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#EF4444" />
            ) : (
              <Ionicons name="log-out-outline" size={20} color="#EF4444" />
            )}
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>CanHiring v1.0.0</Text>
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
  profileHeader: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    alignItems: 'center',
  },
  profileInfo: {
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#3B82F6',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#E2E8F0',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 14,
    color: '#CBD5E1',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  userTitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 8,
    fontWeight: '500',
  },
  userLocation: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: -20,
    borderRadius: 12,
    paddingVertical: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 10,
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    paddingVertical: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuItemText: {
    fontSize: 16,
    color: '#1E293B',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    color: '#1E293B',
    marginLeft: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  infoText: {
    fontSize: 14,
    color: '#64748B',
    marginLeft: 12,
    flex: 1,
  },
  logoutSection: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  logoutButtonDisabled: {
    opacity: 0.6,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
    marginLeft: 8,
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  versionText: {
    fontSize: 12,
    color: '#94A3B8',
  },
});

export default ProfileScreen;
