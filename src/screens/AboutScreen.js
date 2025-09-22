import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '../components/AppHeader';
import LogoImage from '../components/LogoImage';

const { width, height } = Dimensions.get('window');

const AboutScreen = ({ navigation }) => {
  const handleLinkPress = (url) => {
    Linking.openURL(url);
  };

  const appInfo = {
    version: '1.0.0',
    build: '2024.01.15',
    lastUpdated: 'January 15, 2024',
  };

  const teamMembers = [
    {
      name: 'John Smith',
      role: 'CEO & Founder',
      email: 'john@canhiring.com',
    },
    {
      name: 'Sarah Johnson',
      role: 'CTO',
      email: 'sarah@canhiring.com',
    },
    {
      name: 'Mike Chen',
      role: 'Lead Developer',
      email: 'mike@canhiring.com',
    },
  ];

  const socialLinks = [
    {
      name: 'Website',
      url: 'https://canhiring.com',
      icon: 'globe-outline',
      color: '#3B82F6',
    },
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com/company/canhiring',
      icon: 'logo-linkedin',
      color: '#0077B5',
    },
    {
      name: 'Twitter',
      url: 'https://twitter.com/canhiring',
      icon: 'logo-twitter',
      color: '#1DA1F2',
    },
    {
      name: 'GitHub',
      url: 'https://github.com/canhiring',
      icon: 'logo-github',
      color: '#333333',
    },
  ];

  const renderSocialLink = (link) => (
    <TouchableOpacity
      key={link.name}
      style={styles.socialLink}
      onPress={() => handleLinkPress(link.url)}
      activeOpacity={0.7}
    >
      <View style={[styles.socialIcon, { backgroundColor: link.color + '20' }]}>
        <Ionicons name={link.icon} size={20} color={link.color} />
      </View>
      <Text style={styles.socialText}>{link.name}</Text>
      <Ionicons name="open-outline" size={16} color="#9CA3AF" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#F6F8FF', '#E8F2FF', '#D6E8FF']}
        style={styles.gradient}
      >
        <AppHeader 
          title="About" 
          showBackButton={true}
          onBackPress={() => navigation.goBack()}
        />
        
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            {/* App Logo and Info */}
            <View style={styles.appInfoCard}>
              <LogoImage size="large" />
              <Text style={styles.appName}>CanHiring Solutions</Text>
              <Text style={styles.appDescription}>
                Your gateway to finding the perfect job or the perfect candidate
              </Text>
              <View style={styles.versionInfo}>
                <Text style={styles.versionText}>Version {appInfo.version}</Text>
                <Text style={styles.buildText}>Build {appInfo.build}</Text>
              </View>
            </View>

            {/* App Description */}
            <View style={styles.descriptionCard}>
              <Text style={styles.descriptionTitle}>About CanHiring</Text>
              <Text style={styles.descriptionText}>
                CanHiring Solutions is a comprehensive job platform that connects talented professionals 
                with top companies worldwide. Our mission is to make the hiring process more efficient, 
                transparent, and successful for both job seekers and employers.
              </Text>
              <Text style={styles.descriptionText}>
                With advanced matching algorithms, personalized job recommendations, and a user-friendly 
                interface, we help you find your dream job or the perfect candidate for your organization.
              </Text>
            </View>

            {/* Features */}
            <View style={styles.featuresCard}>
              <Text style={styles.sectionTitle}>Key Features</Text>
              <View style={styles.featuresList}>
                <View style={styles.featureItem}>
                  <Ionicons name="search" size={20} color="#3B82F6" />
                  <Text style={styles.featureText}>Smart Job Search</Text>
                </View>
                <View style={styles.featureItem}>
                  <Ionicons name="people" size={20} color="#10B981" />
                  <Text style={styles.featureText}>Talent Matching</Text>
                </View>
                <View style={styles.featureItem}>
                  <Ionicons name="notifications" size={20} color="#F59E0B" />
                  <Text style={styles.featureText}>Job Alerts</Text>
                </View>
                <View style={styles.featureItem}>
                  <Ionicons name="analytics" size={20} color="#8B5CF6" />
                  <Text style={styles.featureText}>Career Analytics</Text>
                </View>
                <View style={styles.featureItem}>
                  <Ionicons name="shield-checkmark" size={20} color="#EF4444" />
                  <Text style={styles.featureText}>Secure Platform</Text>
                </View>
                <View style={styles.featureItem}>
                  <Ionicons name="chatbubbles" size={20} color="#06B6D4" />
                  <Text style={styles.featureText}>Direct Messaging</Text>
                </View>
              </View>
            </View>

            {/* Team */}
            <View style={styles.teamCard}>
              <Text style={styles.sectionTitle}>Our Team</Text>
              {teamMembers.map((member, index) => (
                <View key={index} style={styles.teamMember}>
                  <View style={styles.memberInfo}>
                    <Text style={styles.memberName}>{member.name}</Text>
                    <Text style={styles.memberRole}>{member.role}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.emailButton}
                    onPress={() => handleLinkPress(`mailto:${member.email}`)}
                  >
                    <Ionicons name="mail-outline" size={16} color="#3B82F6" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            {/* Social Links */}
            <View style={styles.socialCard}>
              <Text style={styles.sectionTitle}>Connect With Us</Text>
              {socialLinks.map(renderSocialLink)}
            </View>

            {/* Legal */}
            <View style={styles.legalCard}>
              <Text style={styles.sectionTitle}>Legal</Text>
              <TouchableOpacity
                style={styles.legalLink}
                onPress={() => console.log('Privacy Policy')}
              >
                <Text style={styles.legalText}>Privacy Policy</Text>
                <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.legalLink}
                onPress={() => console.log('Terms of Service')}
              >
                <Text style={styles.legalText}>Terms of Service</Text>
                <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.legalLink}
                onPress={() => console.log('Cookie Policy')}
              >
                <Text style={styles.legalText}>Cookie Policy</Text>
                <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            {/* Copyright */}
            <View style={styles.copyrightCard}>
              <Text style={styles.copyrightText}>
                © 2024 CanHiring Solutions. All rights reserved.
              </Text>
              <Text style={styles.copyrightText}>
                Made with ❤️ for job seekers and employers worldwide.
              </Text>
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
  appInfoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
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
  appName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  appDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  versionInfo: {
    flexDirection: 'row',
    gap: 16,
  },
  versionText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  buildText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  descriptionCard: {
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
  descriptionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  featuresCard: {
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
  featuresList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
  },
  featureText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 8,
  },
  teamCard: {
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
  teamMember: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 2,
  },
  memberRole: {
    fontSize: 12,
    color: '#6B7280',
  },
  emailButton: {
    padding: 8,
  },
  socialCard: {
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
  socialLink: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  socialIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  socialText: {
    fontSize: 16,
    color: '#374151',
    flex: 1,
  },
  legalCard: {
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
  legalLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  legalText: {
    fontSize: 16,
    color: '#374151',
  },
  copyrightCard: {
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
  copyrightText: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 4,
  },
});

export default AboutScreen;
