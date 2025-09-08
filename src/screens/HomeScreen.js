import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  Image,
  Dimensions,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import LogoImage from '../components/LogoImage';
import AppHeader from '../components/AppHeader';

const { width, height } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');

  // Job Categories Data
  const jobCategories = [
    { id: 1, title: 'Information Technology', icon: 'laptop', color: '#3B82F6', jobs: 1250 },
    { id: 2, title: 'Healthcare & Medical', icon: 'medical', color: '#EF4444', jobs: 890 },
    { id: 3, title: 'Finance & Banking', icon: 'card', color: '#10B981', jobs: 650 },
    { id: 4, title: 'Education & Training', icon: 'school', color: '#F59E0B', jobs: 420 },
    { id: 5, title: 'Sales & Marketing', icon: 'trending-up', color: '#8B5CF6', jobs: 780 },
    { id: 6, title: 'Engineering', icon: 'construct', color: '#06B6D4', jobs: 920 },
    { id: 7, title: 'Customer Service', icon: 'headset', color: '#84CC16', jobs: 340 },
    { id: 8, title: 'Human Resources', icon: 'people', color: '#F97316', jobs: 280 },
  ];

  // Featured Companies Data
  const featuredCompanies = [
    { id: 1, name: 'TechCorp', jobs: 45, logo: 'TC' },
    { id: 2, name: 'DevSolutions', jobs: 32, logo: 'DS' },
    { id: 3, name: 'InnovateX', jobs: 28, logo: 'IX' },
    { id: 4, name: 'DataFlow Inc', jobs: 41, logo: 'DF' },
    { id: 5, name: 'CloudTech', jobs: 36, logo: 'CT' },
    { id: 6, name: 'StartupHub', jobs: 23, logo: 'SH' },
  ];

  // Testimonials Data
  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'CEO at TechCorp',
      content: 'Finding top talent has never been easier. CanHiring connected us with highly skilled developers.',
      avatar: 'SJ'
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Hiring Manager at DevSolutions',
      content: 'The quality of candidates we found through CanHiring was exceptional. We filled our position in just two weeks!',
      avatar: 'MC'
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      role: 'CTO at InnovateX',
      content: 'CanHiring\'s platform streamlined our hiring process and helped us build an amazing tech team.',
      avatar: 'ER'
    }
  ];

  const handleSearch = () => {
    // TODO: Implement search functionality
    console.log('Searching for:', searchQuery, 'in', location);
  };

  const renderJobCategory = ({ item }) => (
    <TouchableOpacity style={styles.categoryCard} onPress={() => console.log('Category pressed:', item.title)}>
      <View style={[styles.categoryIcon, { backgroundColor: item.color + '20' }]}>
        <Ionicons name={item.icon} size={24} color={item.color} />
      </View>
      <Text style={styles.categoryTitle} numberOfLines={2}>{item.title}</Text>
      <Text style={styles.categoryJobs}>{item.jobs} jobs</Text>
    </TouchableOpacity>
  );

  const renderCompany = ({ item }) => (
    <TouchableOpacity style={styles.companyCard} onPress={() => console.log('Company pressed:', item.name)}>
      <View style={styles.companyLogo}>
        <Text style={styles.companyLogoText}>{item.logo}</Text>
      </View>
      <Text style={styles.companyName} numberOfLines={1}>{item.name}</Text>
      <Text style={styles.companyJobs}>{item.jobs} jobs</Text>
    </TouchableOpacity>
  );

  const renderTestimonial = ({ item }) => (
    <View style={styles.testimonialCard}>
      <View style={styles.testimonialHeader}>
        <View style={styles.testimonialAvatar}>
          <Text style={styles.testimonialAvatarText}>{item.avatar}</Text>
        </View>
        <View style={styles.testimonialInfo}>
          <Text style={styles.testimonialName}>{item.name}</Text>
          <Text style={styles.testimonialRole}>{item.role}</Text>
        </View>
      </View>
      <Text style={styles.testimonialContent}>"{item.content}"</Text>
      <View style={styles.testimonialStars}>
        {[...Array(5)].map((_, i) => (
          <Ionicons key={i} name="star" size={16} color="#FCD34D" />
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <AppHeader 
          rightActions={[
            { icon: 'notifications-outline', onPress: () => console.log('Notifications') },
            { icon: 'person-outline', onPress: () => console.log('Profile') }
          ]}
        />

        {/* Hero Section */}
        <LinearGradient
          colors={['#F8FAFC', '#E2E8F0']}
          style={styles.heroSection}
        >
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>
              There Are{' '}
              <Text style={styles.heroHighlight}>93,178</Text>{' '}
              Postings Here{'\n'}For you!
            </Text>
            <Text style={styles.heroSubtitle}>
              Find Jobs, Employment & Career Opportunities Worldwide
            </Text>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
              <View style={styles.searchInputContainer}>
                <Ionicons name="search" size={20} color="#64748B" style={styles.searchIcon} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Job title, keywords..."
                  placeholderTextColor="#94A3B8"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
              <View style={styles.searchInputContainer}>
                <Ionicons name="location" size={20} color="#64748B" style={styles.searchIcon} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="City or postcode"
                  placeholderTextColor="#94A3B8"
                  value={location}
                  onChangeText={setLocation}
                />
              </View>
              <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                <Text style={styles.searchButtonText}>Find Jobs</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Hero Image */}
          <View style={styles.heroImageContainer}>
            <Image
              source={require('../../assets/hero-man.png')}
              style={styles.heroImage}
              resizeMode="contain"
            />
            
            {/* Floating notification */}
            <View style={styles.floatingNotification}>
              <Ionicons name="mail" size={16} color="#3B82F6" />
              <View style={styles.notificationContent}>
                <Text style={styles.notificationTitle}>Work Inquiry From</Text>
                <Text style={styles.notificationSubtitle}>Ali Tufan</Text>
              </View>
            </View>

            {/* Floating stats */}
            <View style={styles.floatingStats}>
              <Text style={styles.statsNumber}>10k+</Text>
              <Text style={styles.statsLabel}>Candidates</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Job Categories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Job Categories</Text>
            <Text style={styles.sectionSubtitle}>jobs live - added today</Text>
          </View>
          
          <FlatList
            data={jobCategories}
            renderItem={renderJobCategory}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            scrollEnabled={false}
            contentContainerStyle={styles.categoriesGrid}
          />
        </View>

        {/* Featured Companies */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Companies</Text>
            <Text style={styles.sectionSubtitle}>Browse top companies hiring from our database</Text>
          </View>
          
          <FlatList
            data={featuredCompanies}
            renderItem={renderCompany}
            keyExtractor={(item) => item.id.toString()}
            numColumns={3}
            scrollEnabled={false}
            contentContainerStyle={styles.companiesGrid}
          />
        </View>

        {/* Testimonials */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>What Our Clients Say</Text>
            <Text style={styles.sectionSubtitle}>Hear from companies that found their perfect match</Text>
          </View>
          
          <FlatList
            data={testimonials}
            renderItem={renderTestimonial}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.testimonialsList}
          />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerContent}>
            <LogoImage size="small" />
            <Text style={styles.footerText}>
              Canada Office: +1 403 671 4469{'\n'}
              US Office: +1 825 365 8805
            </Text>
            <Text style={styles.footerAddress}>
              4656 Westwinds Dr NE #601{'\n'}
              Calgary, AB T3J 0L7, Canada
            </Text>
            
            <View style={styles.footerLinks}>
              <TouchableOpacity style={styles.footerLink}>
                <Text style={styles.footerLinkText}>About Us</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.footerLink}>
                <Text style={styles.footerLinkText}>Contact</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.footerLink}>
                <Text style={styles.footerLinkText}>Terms</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.footerLink}>
                <Text style={styles.footerLinkText}>Privacy</Text>
              </TouchableOpacity>
            </View>
            
            <Text style={styles.footerCopyright}>
              © 2025 Can Hiring. All Rights Reserved.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  heroSection: {
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  heroContent: {
    marginBottom: 30,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E293B',
    lineHeight: 36,
    marginBottom: 15,
  },
  heroHighlight: {
    color: '#3B82F6',
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 25,
    lineHeight: 24,
  },
  searchContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1E293B',
  },
  searchButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  heroImageContainer: {
    alignItems: 'center',
    position: 'relative',
  },
  heroImage: {
    width: width * 0.8,
    height: 200,
  },
  floatingNotification: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  notificationContent: {
    marginLeft: 8,
  },
  notificationTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1E293B',
  },
  notificationSubtitle: {
    fontSize: 12,
    color: '#64748B',
  },
  floatingStats: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  statsLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  sectionHeader: {
    marginBottom: 20,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
  },
  categoriesGrid: {
    gap: 15,
  },
  categoryCard: {
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
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 4,
  },
  categoryJobs: {
    fontSize: 12,
    color: '#64748B',
  },
  companiesGrid: {
    gap: 15,
  },
  companyCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 5,
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
  companyLogo: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  companyLogoText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  companyName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 4,
  },
  companyJobs: {
    fontSize: 12,
    color: '#64748B',
  },
  testimonialsList: {
    paddingHorizontal: 10,
  },
  testimonialCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 5,
    width: width * 0.8,
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
  testimonialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  testimonialAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  testimonialAvatarText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  testimonialInfo: {
    flex: 1,
  },
  testimonialName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  testimonialRole: {
    fontSize: 14,
    color: '#64748B',
  },
  testimonialContent: {
    fontSize: 14,
    color: '#1E293B',
    lineHeight: 20,
    marginBottom: 15,
  },
  testimonialStars: {
    flexDirection: 'row',
    gap: 2,
  },
  footer: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  footerContent: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
    marginVertical: 15,
    lineHeight: 20,
  },
  footerAddress: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 18,
  },
  footerLinks: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 20,
  },
  footerLink: {
    paddingVertical: 5,
  },
  footerLinkText: {
    fontSize: 14,
    color: '#94A3B8',
  },
  footerCopyright: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
  },
});

export default HomeScreen;
