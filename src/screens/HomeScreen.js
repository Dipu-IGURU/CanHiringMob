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
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import LogoImage from '../components/LogoImage';
import AppHeader from '../components/AppHeader';
import { fetchJobCategories, getTotalJobCount, fetchFeaturedCompanies } from '../services/apiService';

const { width, height } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [jobCategories, setJobCategories] = useState([]);
  const [totalJobs, setTotalJobs] = useState(0);
  const [featuredCompanies, setFeaturedCompanies] = useState([]);
  const [companiesLoading, setCompaniesLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  // Fetch featured companies from database
  const loadFeaturedCompanies = async () => {
    try {
      setCompaniesLoading(true);
      const companies = await fetchFeaturedCompanies(12);
      setFeaturedCompanies(companies);
      console.log('📊 Loaded companies:', companies.length);
    } catch (err) {
      console.error('Error loading featured companies:', err);
      // Set empty array to show real state instead of dummy data
      setFeaturedCompanies([]);
    } finally {
      setCompaniesLoading(false);
    }
  };

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

  // Fetch job categories and total jobs on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch job categories and total jobs in parallel
        const [categories, total] = await Promise.all([
          fetchJobCategories(),
          getTotalJobCount()
        ]);
        
        // Use categories directly as they now have icons and colors
        const transformedCategories = categories.map((category, index) => ({
          id: category.id || (index + 1),
          title: category.title || category.name,
          name: category.name,
          icon: category.icon || 'briefcase-outline',
          color: category.color || '#3B82F6'
        }));
        
        console.log('📊 Loaded categories:', transformedCategories);
        console.log('📊 Total jobs:', total);
        setJobCategories(transformedCategories);
        setTotalJobs(total);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load job data');
        setJobCategories([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
    loadFeaturedCompanies();
  }, []);

  const handleSearch = () => {
    // Navigate to Jobs screen with search parameters
    navigation.navigate('Jobs', { 
      searchQuery: searchQuery,
      location: location 
    });
  };

  const renderJobCategory = ({ item }) => (
    <TouchableOpacity 
      style={styles.categoryCard} 
      onPress={() => {
        console.log('🔍 Category clicked:', item);
        navigation.navigate('Jobs', { 
          searchQuery: item.name || item.title,
          location: '',
          autoSearch: true,
          category: item.id || item.title.toLowerCase()
        });
      }}
    >
      <View style={[styles.categoryIcon, { backgroundColor: item.color + '20' }]}>
        <Ionicons name={item.icon} size={24} color={item.color} />
      </View>
      <Text style={styles.categoryTitle} numberOfLines={2}>{item.title}</Text>
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
              <Text style={styles.heroHighlight}>{totalJobs.toLocaleString()}</Text>{' '}
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
          
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#3B82F6" />
              <Text style={styles.loadingText}>Loading job categories...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={48} color="#EF4444" />
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity 
                style={styles.retryButton}
                onPress={() => {
                  setError(null);
                  setLoading(true);
                  // Retry loading data
                  const loadData = async () => {
                    try {
                      const [categories, total] = await Promise.all([
                        fetchJobCategories(),
                        getTotalJobCount()
                      ]);
                      
                      const transformedCategories = categories.map((category, index) => ({
                        id: index + 1,
                        title: category.title,
                        icon: category.icon,
                        color: category.color
                      }));
                      
                      setJobCategories(transformedCategories);
                      setTotalJobs(total);
                    } catch (err) {
                      setError('Failed to load job data');
                    } finally {
                      setLoading(false);
                    }
                  };
                  loadData();
                }}
              >
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={jobCategories}
              renderItem={renderJobCategory}
              keyExtractor={(item) => item.id.toString()}
              numColumns={2}
              scrollEnabled={false}
              contentContainerStyle={styles.categoriesGrid}
            />
          )}
        </View>

        {/* Featured Companies */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Companies</Text>
            <Text style={styles.sectionSubtitle}>
              {companiesLoading 
                ? 'Loading companies from our database...' 
                : featuredCompanies.length > 0
                  ? `Browse top companies hiring from our database (${featuredCompanies.length} companies)`
                  : 'No companies with active job postings yet'
              }
            </Text>
          </View>
          
          {companiesLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#3B82F6" />
              <Text style={styles.loadingText}>Loading companies...</Text>
            </View>
          ) : featuredCompanies.length > 0 ? (
            <FlatList
              data={featuredCompanies}
              renderItem={renderCompany}
              keyExtractor={(item) => item.id.toString()}
              numColumns={3}
              scrollEnabled={false}
              contentContainerStyle={styles.companiesGrid}
            />
          ) : (
            <View style={styles.emptyStateContainer}>
              <Ionicons name="business-outline" size={48} color="#94A3B8" />
              <Text style={styles.emptyStateTitle}>No Companies Yet</Text>
              <Text style={styles.emptyStateText}>
                Companies will appear here once they start posting jobs on our platform.
              </Text>
              <TouchableOpacity 
                style={styles.emptyStateButton}
                onPress={() => navigation.navigate('Jobs')}
              >
                <Text style={styles.emptyStateButtonText}>Browse Available Jobs</Text>
              </TouchableOpacity>
            </View>
          )}
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
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#64748B',
    marginTop: 12,
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  emptyStateButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomeScreen;
