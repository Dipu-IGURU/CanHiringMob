import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '../components/AppHeader';

const { width, height } = Dimensions.get('window');

const PrivacySettingsScreen = ({ navigation }) => {
  const [settings, setSettings] = useState({
    profileVisibility: true,
    showEmail: false,
    showPhone: false,
    allowMessages: true,
    dataSharing: false,
    marketingEmails: true,
    pushNotifications: true,
    locationTracking: false,
  });

  const toggleSetting = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const settingItems = [
    {
      key: 'profileVisibility',
      title: 'Profile Visibility',
      description: 'Make your profile visible to employers',
      icon: 'eye-outline',
      color: '#3B82F6',
    },
    {
      key: 'showEmail',
      title: 'Show Email Address',
      description: 'Display your email on your profile',
      icon: 'mail-outline',
      color: '#10B981',
    },
    {
      key: 'showPhone',
      title: 'Show Phone Number',
      description: 'Display your phone number on your profile',
      icon: 'call-outline',
      color: '#F59E0B',
    },
    {
      key: 'allowMessages',
      title: 'Allow Messages',
      description: 'Let employers send you direct messages',
      icon: 'chatbubble-outline',
      color: '#8B5CF6',
    },
    {
      key: 'dataSharing',
      title: 'Data Sharing',
      description: 'Share anonymized data for job recommendations',
      icon: 'share-outline',
      color: '#EF4444',
    },
    {
      key: 'marketingEmails',
      title: 'Marketing Emails',
      description: 'Receive promotional emails and updates',
      icon: 'megaphone-outline',
      color: '#06B6D4',
    },
    {
      key: 'pushNotifications',
      title: 'Push Notifications',
      description: 'Receive notifications on your device',
      icon: 'notifications-outline',
      color: '#84CC16',
    },
    {
      key: 'locationTracking',
      title: 'Location Tracking',
      description: 'Allow app to access your location for job recommendations',
      icon: 'location-outline',
      color: '#F97316',
    },
  ];

  const renderSettingItem = (item) => (
    <View key={item.key} style={styles.settingItem}>
      <View style={styles.settingLeft}>
        <View style={[styles.settingIcon, { backgroundColor: item.color + '20' }]}>
          <Ionicons name={item.icon} size={20} color={item.color} />
        </View>
        <View style={styles.settingInfo}>
          <Text style={styles.settingTitle}>{item.title}</Text>
          <Text style={styles.settingDescription}>{item.description}</Text>
        </View>
      </View>
      <Switch
        value={settings[item.key]}
        onValueChange={() => toggleSetting(item.key)}
        trackColor={{ false: '#E5E7EB', true: item.color }}
        thumbColor={settings[item.key] ? '#FFFFFF' : '#9CA3AF'}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#F6F8FF', '#E8F2FF', '#D6E8FF']}
        style={styles.gradient}
      >
        <AppHeader 
          title="Privacy Settings" 
          showBackButton={true}
          onBackPress={() => navigation.goBack()}
        />
        
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            {/* Privacy Info */}
            <View style={styles.infoCard}>
              <Ionicons name="shield-checkmark" size={24} color="#10B981" />
              <Text style={styles.infoTitle}>Your Privacy Matters</Text>
              <Text style={styles.infoText}>
                Control how your information is shared and used. You can change these settings at any time.
              </Text>
            </View>

            {/* Settings List */}
            <View style={styles.settingsContainer}>
              {settingItems.map(renderSettingItem)}
            </View>

            {/* Data Management */}
            <View style={styles.dataManagementContainer}>
              <Text style={styles.sectionTitle}>Data Management</Text>
              
              <TouchableOpacity style={styles.dataButton}>
                <Ionicons name="download-outline" size={20} color="#3B82F6" />
                <Text style={styles.dataButtonText}>Download My Data</Text>
                <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.dataButton}>
                <Ionicons name="trash-outline" size={20} color="#EF4444" />
                <Text style={styles.dataButtonText}>Delete My Account</Text>
                <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 12,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  settingsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
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
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
  },
  dataManagementContainer: {
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  dataButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    marginBottom: 8,
  },
  dataButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginLeft: 12,
    flex: 1,
  },
});

export default PrivacySettingsScreen;
