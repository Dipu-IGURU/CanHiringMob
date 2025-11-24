import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Modal,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import LogoImage from '../components/LogoImage';
import { useAuth } from '../contexts/AuthContext';

const { width, height } = Dimensions.get('window');

const WelcomeScreen = ({ navigation }) => {
  const [showLearnMoreModal, setShowLearnMoreModal] = useState(false);
  const { loginAsGuest } = useAuth();

  const handleGuestLogin = async () => {
    const result = await loginAsGuest();
    if (result.success) {
      navigation.navigate('MainTabs');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#F6F8FF', '#E8F2FF', '#D6E8FF']}
        style={styles.gradient}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            {/* Logo at the top */}
            <View style={styles.logoContainer}>
              <LogoImage size="large" />
            </View>

            {/* Welcome Text */}
            <View style={styles.textContainer}>
              <Text style={styles.title}>
                Welcome to{' '}
                <Text style={styles.titleAccent}>CanHiring</Text>
                
              </Text>
              <Text style={styles.subtitle}>
                Your gateway to finding the perfect job or the perfect candidate. 
                Join thousands of professionals who trust us with their career journey.
              </Text>
            </View>

            {/* Stats Section */}
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>10K+</Text>
                <Text style={styles.statLabel}>Active Jobs</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>5K+</Text>
                <Text style={styles.statLabel}>Companies</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>50K+</Text>
                <Text style={styles.statLabel}>Candidates</Text>
              </View>
            </View>

            {/* Features */}
            {/* <View style={styles.featuresContainer}>
              <View style={styles.featureCard}>
                <View style={styles.featureIcon}>
                  <Ionicons name="search" size={28} color="#3B82F6" />
                </View>
                <Text style={styles.featureTitle}>Find Jobs</Text>
                <Text style={styles.featureDescription}>
                  Discover opportunities that match your skills and career goals
                </Text>
              </View>
              
              <View style={styles.featureCard}>
                <View style={styles.featureIcon}>
                  <Ionicons name="business" size={28} color="#10B981" />
                </View>
                <Text style={styles.featureTitle}>Hire Talent</Text>
                <Text style={styles.featureDescription}>
                  Connect with top professionals and build your dream team
                </Text>
              </View>
              
              <View style={styles.featureCard}>
                <View style={styles.featureIcon}>
                  <Ionicons name="trending-up" size={28} color="#8B5CF6" />
                </View>
                <Text style={styles.featureTitle}>Career Growth</Text>
                <Text style={styles.featureDescription}>
                  Access tools and insights to advance your professional journey
                </Text>
              </View>
            </View> */}

            {/* Get Started Button */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.getStartedButton}
                onPress={() => navigation.navigate('UserTypeSelection')}
              >
                <LinearGradient
                  colors={['#3B82F6', '#1D4ED8']}
                  style={styles.buttonGradient}
                >
                  <Text style={styles.buttonText}>Get Started</Text>
                  <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
                </LinearGradient>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.guestButton}
                onPress={handleGuestLogin}
              >
                <Text style={styles.guestButtonText}>Continue as Guest</Text>
                <Ionicons name="person-outline" size={16} color="#64748B" />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.learnMoreButton}
                onPress={() => setShowLearnMoreModal(true)}
              >
                <Text style={styles.learnMoreText}>Learn More</Text>
                <Ionicons name="information-circle-outline" size={16} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>

      {/* Learn More Modal */}
      <Modal
        visible={showLearnMoreModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowLearnMoreModal(false)}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => setShowLearnMoreModal(false)}
        >
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalHeader}>
              <View style={styles.modalLogoContainer}>
                <LogoImage size="medium" />
              </View>
              <Text style={styles.modalTitle}>About CanHiring</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowLearnMoreModal(false)}
              >
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView 
              style={styles.modalBody}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.modalDescription}>
                CanHiring Solutions is your comprehensive job platform that connects talented professionals 
                with top companies worldwide. Our mission is to make the hiring process more efficient, 
                transparent, and successful for both job seekers and employers.
              </Text>

              <View style={styles.featuresSection}>
                <Text style={styles.sectionTitle}>Key Features</Text>
                
                <View style={styles.featureRow}>
                  <View style={styles.featureIconContainer}>
                    <Ionicons name="search" size={20} color="#3B82F6" />
                  </View>
                  <View style={styles.featureTextContainer}>
                    <Text style={styles.featureTitle}>Smart Job Search</Text>
                    <Text style={styles.featureDescription}>
                      Discover opportunities that match your skills and career goals
                    </Text>
                  </View>
                </View>

                <View style={styles.featureRow}>
                  <View style={styles.featureIconContainer}>
                    <Ionicons name="people" size={20} color="#10B981" />
                  </View>
                  <View style={styles.featureTextContainer}>
                    <Text style={styles.featureTitle}>Talent Matching</Text>
                    <Text style={styles.featureDescription}>
                      Connect with top professionals and build your dream team
                    </Text>
                  </View>
                </View>

                <View style={styles.featureRow}>
                  <View style={styles.featureIconContainer}>
                    <Ionicons name="notifications" size={20} color="#F59E0B" />
                  </View>
                  <View style={styles.featureTextContainer}>
                    <Text style={styles.featureTitle}>Job Alerts</Text>
                    <Text style={styles.featureDescription}>
                      Get notified about new opportunities matching your preferences
                    </Text>
                  </View>
                </View>

                <View style={styles.featureRow}>
                  <View style={styles.featureIconContainer}>
                    <Ionicons name="analytics" size={20} color="#8B5CF6" />
                  </View>
                  <View style={styles.featureTextContainer}>
                    <Text style={styles.featureTitle}>Career Analytics</Text>
                    <Text style={styles.featureDescription}>
                      Track your applications and get insights into your job search
                    </Text>
                  </View>
                </View>

                <View style={styles.featureRow}>
                  <View style={styles.featureIconContainer}>
                    <Ionicons name="shield-checkmark" size={20} color="#EF4444" />
                  </View>
                  <View style={styles.featureTextContainer}>
                    <Text style={styles.featureTitle}>Secure Platform</Text>
                    <Text style={styles.featureDescription}>
                      Your data is protected with industry-standard security measures
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.statsSection}>
                <Text style={styles.sectionTitle}>Our Impact</Text>
                <View style={styles.statsGrid}>
                  <View style={styles.statBox}>
                    <Text style={styles.statNumber}>10K+</Text>
                    <Text style={styles.statLabel}>Active Jobs</Text>
                  </View>
                  <View style={styles.statBox}>
                    <Text style={styles.statNumber}>5K+</Text>
                    <Text style={styles.statLabel}>Companies</Text>
                  </View>
                  <View style={styles.statBox}>
                    <Text style={styles.statNumber}>50K+</Text>
                    <Text style={styles.statLabel}>Candidates</Text>
                  </View>
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.getStartedModalButton}
                onPress={() => {
                  setShowLearnMoreModal(false);
                  navigation.navigate('UserTypeSelection');
                }}
              >
                <LinearGradient
                  colors={['#3B82F6', '#1D4ED8']}
                  style={styles.modalButtonGradient}
                >
                  <Text style={styles.modalButtonText}>Get Started</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
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
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
    minHeight: height,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 0,
    marginTop: 20,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 0,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 44,
  },
  titleAccent: {
    color: '#3B82F6',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 320,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  statItem: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 16,
    minWidth: 80,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
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
    fontWeight: '500',
    textAlign: 'center',
  },
  featuresContainer: {
    width: '100%',
    marginBottom: 40,
    gap: 16,
  },
  featureCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  featureIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 280,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 16,
  },
  getStartedButton: {
    width: '100%',
    maxWidth: 320,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#3B82F6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    gap: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  learnMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  learnMoreText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '500',
  },
  guestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  guestButtonText: {
    color: '#64748B',
    fontSize: 16,
    fontWeight: '500',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    width: '100%',
    maxWidth: 400,
    maxHeight: '85%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  modalHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    alignItems: 'center',
    position: 'relative',
  },
  modalLogoContainer: {
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 4,
  },
  modalBody: {
    padding: 20,
    maxHeight: height * 0.5,
  },
  modalDescription: {
    fontSize: 15,
    color: '#6B7280',
    lineHeight: 22,
    marginBottom: 24,
    textAlign: 'center',
  },
  featuresSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  featureRow: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  featureIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  statsSection: {
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  modalFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  getStartedModalButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalButtonGradient: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default WelcomeScreen;
