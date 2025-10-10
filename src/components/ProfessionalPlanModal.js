import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, BorderRadius } from '../constants/colors';

const ProfessionalPlanModal = ({ visible, onClose, onUpgrade }) => {
  const handleUpgrade = () => {
    Alert.alert(
      'Upgrade to Professional Plan',
      'This feature is coming soon! You will be able to apply to unlimited jobs with our Professional Plan.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Notify Me', onPress: () => {
          Alert.alert('Thank you!', 'We will notify you when the Professional Plan is available.');
          onClose();
        }}
      ]
    );
  };

  const features = [
    {
      icon: 'infinite',
      title: 'Unlimited Job Applications',
      description: 'Apply to as many jobs as you want without any restrictions'
    },
    {
      icon: 'analytics',
      title: 'Advanced Analytics',
      description: 'Track your application success rate and get detailed insights'
    },
    {
      icon: 'star',
      title: 'Priority Support',
      description: 'Get priority customer support and faster response times'
    },
    {
      icon: 'document-text',
      title: 'Resume Builder Pro',
      description: 'Access to premium resume templates and AI-powered suggestions'
    },
    {
      icon: 'notifications',
      title: 'Smart Job Alerts',
      description: 'Get personalized job recommendations based on your profile'
    },
    {
      icon: 'shield-checkmark',
      title: 'Profile Verification',
      description: 'Get verified badge to stand out to employers'
    }
  ];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      transparent={false}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#64748B" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Upgrade to Professional</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Hero Section */}
          <LinearGradient
            colors={['#3B82F6', '#1D4ED8']}
            style={styles.heroSection}
          >
            <View style={styles.heroContent}>
              <View style={styles.iconContainer}>
                <Ionicons name="star" size={40} color="#FFFFFF" />
              </View>
              <Text style={styles.heroTitle}>Professional Plan</Text>
              <Text style={styles.heroSubtitle}>
                Unlock unlimited job applications and premium features
              </Text>
              <View style={styles.priceContainer}>
                <Text style={styles.price}>$9.99</Text>
                <Text style={styles.pricePeriod}>/month</Text>
              </View>
            </View>
          </LinearGradient>

          {/* Current Limit Info */}
          <View style={styles.limitInfo}>
            <View style={styles.limitIcon}>
              <Ionicons name="warning" size={24} color="#F59E0B" />
            </View>
            <View style={styles.limitText}>
              <Text style={styles.limitTitle}>Free Plan Limit Reached</Text>
              <Text style={styles.limitDescription}>
                You've reached the 5 application limit. Upgrade to continue applying to jobs.
              </Text>
            </View>
          </View>

          {/* Features List */}
          <View style={styles.featuresSection}>
            <Text style={styles.sectionTitle}>What's Included</Text>
            {features.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <Ionicons name={feature.icon} size={20} color="#3B82F6" />
                </View>
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDescription}>{feature.description}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Benefits */}
          <View style={styles.benefitsSection}>
            <Text style={styles.sectionTitle}>Why Upgrade?</Text>
            <View style={styles.benefitItem}>
              <Ionicons name="checkmark-circle" size={20} color="#059669" />
              <Text style={styles.benefitText}>
                Apply to unlimited jobs from our extensive database
              </Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="checkmark-circle" size={20} color="#059669" />
              <Text style={styles.benefitText}>
                Get priority access to new job postings
              </Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="checkmark-circle" size={20} color="#059669" />
              <Text style={styles.benefitText}>
                Advanced analytics to track your job search progress
              </Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="checkmark-circle" size={20} color="#059669" />
              <Text style={styles.benefitText}>
                Professional resume builder with AI suggestions
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={onClose}
          >
            <Text style={styles.cancelButtonText}>Maybe Later</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.upgradeButton}
            onPress={handleUpgrade}
          >
            <LinearGradient
              colors={['#3B82F6', '#1D4ED8']}
              style={styles.upgradeButtonGradient}
            >
              <Ionicons name="star" size={20} color="#FFFFFF" />
              <Text style={styles.upgradeButtonText}>Upgrade Now</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  closeButton: {
    padding: Spacing.xs,
  },
  headerTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
  },
  heroSection: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xxl,
    alignItems: 'center',
  },
  heroContent: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: Spacing.sm,
  },
  heroSubtitle: {
    fontSize: Typography.base,
    color: '#E2E8F0',
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  pricePeriod: {
    fontSize: Typography.base,
    color: '#E2E8F0',
    marginLeft: Spacing.xs,
  },
  limitInfo: {
    flexDirection: 'row',
    backgroundColor: '#FEF3C7',
    margin: Spacing.xl,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  limitIcon: {
    marginRight: Spacing.md,
  },
  limitText: {
    flex: 1,
  },
  limitTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: '#92400E',
    marginBottom: Spacing.xs,
  },
  limitDescription: {
    fontSize: Typography.sm,
    color: '#92400E',
    lineHeight: 20,
  },
  featuresSection: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
  },
  featureItem: {
    flexDirection: 'row',
    marginBottom: Spacing.lg,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  featureDescription: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  benefitsSection: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  benefitText: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    marginLeft: Spacing.sm,
    flex: 1,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    padding: Spacing.xl,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    marginRight: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
    fontWeight: Typography.medium,
  },
  upgradeButton: {
    flex: 2,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  upgradeButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  upgradeButtonText: {
    fontSize: Typography.base,
    color: '#FFFFFF',
    fontWeight: Typography.semibold,
  },
});

export default ProfessionalPlanModal;
