import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '../components/AppHeader';

const { width, height } = Dimensions.get('window');

const HelpSupportScreen = ({ navigation }) => {
  const [expandedFaq, setExpandedFaq] = useState(null);

  const faqItems = [
    {
      id: 1,
      question: 'How do I apply for a job?',
      answer: 'To apply for a job, simply browse the job listings, find a position you\'re interested in, and click the "Apply Now" button. You\'ll be prompted to upload your resume and cover letter.',
    },
    {
      id: 2,
      question: 'How can I track my applications?',
      answer: 'You can track all your applications in the "My Applications" section. Here you\'ll see the status of each application, including whether it\'s under review, if an interview is scheduled, or if you\'ve been accepted or rejected.',
    },
    {
      id: 3,
      question: 'How do I set up job alerts?',
      answer: 'Go to the "Job Alerts" section in your account settings. You can create custom alerts based on job titles, keywords, location, and frequency. You\'ll receive notifications when new matching jobs are posted.',
    },
    {
      id: 4,
      question: 'Can I save jobs for later?',
      answer: 'Yes! You can save any job posting by clicking the bookmark icon. All your saved jobs will appear in the "Saved Jobs" section where you can review and apply to them later.',
    },
    {
      id: 5,
      question: 'How do I update my profile?',
      answer: 'Go to "Account" > "Edit Profile" to update your personal information, work experience, skills, and other details. Make sure to keep your profile up to date for better job matches.',
    },
  ];

  const supportOptions = [
    {
      id: 1,
      title: 'Contact Support',
      description: 'Get help from our support team',
      icon: 'chatbubble-outline',
      color: '#3B82F6',
      action: 'contact',
    },
    {
      id: 2,
      title: 'Live Chat',
      description: 'Chat with a support agent',
      icon: 'chatbox-outline',
      color: '#10B981',
      action: 'chat',
    },
    {
      id: 3,
      title: 'Email Support',
      description: 'Send us an email',
      icon: 'mail-outline',
      color: '#F59E0B',
      action: 'email',
    },
    {
      id: 4,
      title: 'Report a Bug',
      description: 'Report technical issues',
      icon: 'bug-outline',
      color: '#EF4444',
      action: 'bug',
    },
  ];

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  const handleSupportAction = (action) => {
    console.log('Support action:', action);
    // Handle support actions here
  };

  const renderFaqItem = (item) => (
    <View key={item.id} style={styles.faqItem}>
      <TouchableOpacity
        style={styles.faqQuestion}
        onPress={() => toggleFaq(item.id)}
        activeOpacity={0.7}
      >
        <Text style={styles.faqQuestionText}>{item.question}</Text>
        <Ionicons
          name={expandedFaq === item.id ? 'chevron-up' : 'chevron-down'}
          size={20}
          color="#6B7280"
        />
      </TouchableOpacity>
      {expandedFaq === item.id && (
        <View style={styles.faqAnswer}>
          <Text style={styles.faqAnswerText}>{item.answer}</Text>
        </View>
      )}
    </View>
  );

  const renderSupportOption = (option) => (
    <TouchableOpacity
      key={option.id}
      style={styles.supportOption}
      onPress={() => handleSupportAction(option.action)}
      activeOpacity={0.7}
    >
      <View style={styles.supportLeft}>
        <View style={[styles.supportIcon, { backgroundColor: option.color + '20' }]}>
          <Ionicons name={option.icon} size={20} color={option.color} />
        </View>
        <View style={styles.supportInfo}>
          <Text style={styles.supportTitle}>{option.title}</Text>
          <Text style={styles.supportDescription}>{option.description}</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#F6F8FF', '#E8F2FF', '#D6E8FF']}
        style={styles.gradient}
      >
        <AppHeader 
          title="Help & Support" 
          showBackButton={true}
          onBackPress={() => navigation.goBack()}
        />
        
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            {/* Quick Help */}
            <View style={styles.quickHelpCard}>
              <Ionicons name="help-circle" size={32} color="#3B82F6" />
              <Text style={styles.quickHelpTitle}>Need Help?</Text>
              <Text style={styles.quickHelpText}>
                We're here to help you find your dream job. Browse our FAQ or contact our support team.
              </Text>
            </View>

            {/* Support Options */}
            <View style={styles.supportContainer}>
              <Text style={styles.sectionTitle}>Get Support</Text>
              {supportOptions.map(renderSupportOption)}
            </View>

            {/* FAQ Section */}
            <View style={styles.faqContainer}>
              <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
              {faqItems.map(renderFaqItem)}
            </View>

            {/* App Info */}
            <View style={styles.appInfoCard}>
              <Text style={styles.appInfoTitle}>CanHiring Solutions</Text>
              <Text style={styles.appInfoText}>
                Version 1.0.0 • Last updated: January 2024
              </Text>
              <Text style={styles.appInfoDescription}>
                Your gateway to finding the perfect job or the perfect candidate.
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
  quickHelpCard: {
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
  quickHelpTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 12,
    marginBottom: 8,
  },
  quickHelpText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  supportContainer: {
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
  supportOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  supportLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  supportIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  supportInfo: {
    flex: 1,
  },
  supportTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 4,
  },
  supportDescription: {
    fontSize: 12,
    color: '#6B7280',
  },
  faqContainer: {
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
  faqItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  faqQuestion: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  faqQuestionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    flex: 1,
    marginRight: 12,
  },
  faqAnswer: {
    paddingBottom: 16,
  },
  faqAnswerText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  appInfoCard: {
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
  appInfoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  appInfoText: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  appInfoDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default HelpSupportScreen;
