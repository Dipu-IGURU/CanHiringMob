import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  Dimensions,
  FlatList,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import LogoImage from '../components/LogoImage';
import AppHeader from '../components/AppHeader';
import CompanyLogo from '../components/CompanyLogo';
import { fetchJobCategories, getTotalJobCount, fetchFeaturedCompanies } from '../services/apiService';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/colors';

const { width, height } = Dimensions.get('window');

// Helper function for responsive calculations
const getCardWidth = () => width < 400 ? width - 24 : width - 32;
const isSmallScreen = width < 400;

const HomeScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [jobCategories, setJobCategories] = useState([]);
  const [totalJobs, setTotalJobs] = useState(0);
  const [featuredCompanies, setFeaturedCompanies] = useState([]);
  const [companiesLoading, setCompaniesLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const flatListRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;


  // Fetch featured companies from database
  const loadFeaturedCompanies = async () => {
    try {
      setCompaniesLoading(true);
      const companies = await fetchFeaturedCompanies(12);
      // Ensure companies have proper structure
      const safeCompanies = (companies || []).map((company, index) => ({
        id: company?.id || index + 1,
        name: company?.name || 'Unknown Company',
        logo: company?.logo || null,
        jobsCount: company?.jobsCount || company?.jobs || 0,
        location: company?.location || 'Various Locations'
      }));
      setFeaturedCompanies(safeCompanies);
      console.log('📊 Loaded companies:', safeCompanies.length);
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
      content: 'Finding top talent has never been easier. CanHiring connected us with highly skilled developers who perfectly matched our company culture.',
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
      content: 'CanHiring\'s platform streamlined our hiring process and helped us build an amazing tech team. Highly recommended!',
      avatar: 'ER'
    },
    {
      id: 4,
      name: 'David Kim',
      role: 'HR Director at StartupHub',
      content: 'The AI-powered matching system saved us countless hours. We found our ideal candidate within days of posting.',
      avatar: 'DK'
    },
    {
      id: 5,
      name: 'Lisa Thompson',
      role: 'VP Engineering at CloudTech',
      content: 'Outstanding platform! The candidate quality and response time exceeded our expectations. Will definitely use again.',
      avatar: 'LT'
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
        const transformedCategories = (categories || []).map((category, index) => ({
          id: category?.id || (index + 1),
          title: category?.title || category?.name || 'Unknown',
          name: category?.name || 'Unknown',
          icon: category?.icon || 'briefcase-outline',
          color: category?.color || '#3B82F6'
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

  // Auto-slide testimonials every 2 seconds
  useEffect(() => {
    if (testimonials.length === 0 || isUserScrolling) return;

    const interval = setInterval(() => {
      setCurrentTestimonialIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % testimonials.length;
        console.log('Auto-sliding to testimonial:', nextIndex);
        
        // Smooth scroll to next testimonial
        if (flatListRef.current && nextIndex < testimonials.length) {
          try {
            const cardWidth = getCardWidth();
            flatListRef.current.scrollToOffset({
              offset: nextIndex * cardWidth,
              animated: true,
            });
          } catch (error) {
            console.log('Scroll error:', error);
          }
        }
        
        return nextIndex;
      });
    }, 2000); // 2 seconds

    return () => clearInterval(interval);
  }, [testimonials.length, width, isUserScrolling]);

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

  const renderCompany = ({ item }) => {
    const companyName = item.name || 'Unknown Company';
    
    return (
      <TouchableOpacity 
        style={styles.companyCard} 
        onPress={() => {
          console.log('Company pressed:', companyName);
          navigation.navigate('CompanyJobs', { 
            companyName: companyName 
          });
        }}
      >
        <CompanyLogo 
          companyName={companyName}
          size={48}
          fontSize={18}
        />
        <Text style={styles.companyName} numberOfLines={1}>{companyName}</Text>
        <Text style={styles.companyJobs}>{item.jobsCount || item.jobs || 0} jobs</Text>
      </TouchableOpacity>
    );
  };

  const renderTestimonial = ({ item }) => (
    <View style={styles.testimonialCard}>
      {/* Quote Icon */}
      <View style={styles.quoteIcon}>
        <Ionicons name="chatbubble-outline" size={24} color="#3B82F6" />
      </View>
      
      <View style={styles.testimonialHeader}>
        <View style={styles.testimonialAvatar}>
          <Text style={styles.testimonialAvatarText}>{item.avatar}</Text>
        </View>
        <View style={styles.testimonialInfo}>
          <Text style={styles.testimonialName}>{item.name}</Text>
          <Text style={styles.testimonialRole}>{item.role}</Text>
        </View>
      </View>
      
      <Text style={styles.testimonialContent}>{item.content}</Text>
      
      <View style={styles.testimonialStars}>
        {[...Array(5)].map((_, i) => (
          <Ionicons key={i} name="star" size={18} color="#FCD34D" />
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <AppHeader 
          showLogo={true}
          rightActions={[
            { icon: 'notifications-outline', onPress: () => navigation.navigate('JobAlertsScreen') },
            { icon: 'person-outline', onPress: () => navigation.navigate('Profile') }
          ]}
        />

        {/* Hero Section */}
        <LinearGradient
          colors={Colors.gradientSurface}
          style={styles.heroSection}
        >
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>
              Discover{' '}
              <Text style={styles.heroHighlight}>{totalJobs.toLocaleString()}</Text>{' '}
              Career Opportunities{'\n'}Waiting for You
            </Text>
            <Text style={styles.heroSubtitle}>
              Connect with top companies and find your dream job today
            </Text>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
              <View style={styles.searchInputContainer}>
                <Ionicons name="search" size={20} color={Colors.textTertiary} style={styles.searchIcon} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Job title, keywords..."
                  placeholderTextColor={Colors.secondaryLight}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
              <View style={styles.searchInputContainer}>
                <Ionicons name="location" size={20} color={Colors.textTertiary} style={styles.searchIcon} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="City or postcode"
                  placeholderTextColor={Colors.secondaryLight}
                  value={location}
                  onChangeText={setLocation}
                />
              </View>
              <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                <Text style={styles.searchButtonText}>Find Jobs</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Hero Image - Temporarily commented out due to build error */}
          <View style={styles.heroImageContainer}>
            {/* <Image
              source={require('../../assets/hero_man.png')}
              style={styles.heroImage}
              resizeMode="contain"
            /> */}
            
            {/* Floating notification */}
            {/* <View style={styles.floatingNotification}>
              <Ionicons name="mail" size={16} color="#3B82F6" />
              <View style={styles.notificationContent}>
                <Text style={styles.notificationTitle}>Work Inquiry From</Text>
                <Text style={styles.notificationSubtitle}>Ali Tufan</Text>
              </View>
            </View> */}

            {/* Floating stats */}
            {/* <View style={styles.floatingStats}>
              <Text style={styles.statsNumber}>10k+</Text>
              <Text style={styles.statsLabel}>Candidates</Text>
            </View> */}
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
              data={jobCategories || []}
              renderItem={renderJobCategory}
              keyExtractor={(item) => item?.id?.toString() || item?._id?.toString() || Math.random().toString()}
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
              data={featuredCompanies || []}
              renderItem={renderCompany}
              keyExtractor={(item) => item?.id?.toString() || item?._id?.toString() || Math.random().toString()}
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
          
          <View style={styles.testimonialsContainer}>
            <FlatList
              ref={flatListRef}
              data={testimonials || []}
              renderItem={renderTestimonial}
              keyExtractor={(item) => item?.id?.toString() || item?._id?.toString() || Math.random().toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.testimonialsList}
              pagingEnabled
              snapToAlignment="start"
              decelerationRate="fast"
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                { useNativeDriver: false }
              )}
              scrollEventThrottle={16}
              onScrollBeginDrag={() => setIsUserScrolling(true)}
              onScrollEndDrag={() => {
                setTimeout(() => setIsUserScrolling(false), 1000);
              }}
              onMomentumScrollEnd={(event) => {
                const cardWidth = getCardWidth();
                const index = Math.round(event.nativeEvent.contentOffset.x / cardWidth);
                setCurrentTestimonialIndex(index);
                setTimeout(() => setIsUserScrolling(false), 1000);
              }}
              getItemLayout={(data, index) => {
                const cardWidth = getCardWidth();
                return {
                  length: cardWidth,
                  offset: cardWidth * index,
                  index,
                };
              }}
            />
            
            {/* Pagination Dots */}
            <View style={styles.paginationContainer}>
              {testimonials.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.paginationDot,
                    index === currentTestimonialIndex && styles.paginationDotActive
                  ]}
                />
              ))}
            </View>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  heroSection: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing['3xl'],
  },
  heroContent: {
    marginBottom: Spacing['3xl'],
  },
  heroTitle: {
    fontSize: Typography['3xl'],
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    lineHeight: Typography['3xl'] * Typography.tight,
    marginBottom: Spacing.lg,
  },
  heroHighlight: {
    color: Colors.primary,
  },
  heroSubtitle: {
    fontSize: Typography.lg,
    color: Colors.textSecondary,
    marginBottom: Spacing['2xl'],
    lineHeight: Typography.lg * Typography.normal,
  },
  searchContainer: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    ...Shadows.md,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchIcon: {
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: Typography.base,
    color: Colors.textPrimary,
  },
  searchButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
  },
  searchButtonText: {
    color: Colors.textInverse,
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
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
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginHorizontal: Spacing.xs,
    marginBottom: Spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.sm,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  categoryTitle: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  companiesGrid: {
    gap: Spacing.lg,
  },
  companyCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginHorizontal: Spacing.xs,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.sm,
  },
  companyName: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  companyJobs: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
  },
  testimonialsContainer: {
    marginTop: 20,
  },
  testimonialsList: {
    paddingHorizontal: 0,
  },
  testimonialCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: isSmallScreen ? 16 : 20, // Responsive padding for mobile
    marginHorizontal: isSmallScreen ? 12 : 16, // Responsive margins
    width: getCardWidth(), // Responsive width
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
    transform: [{ scale: 1 }],
  },
  quoteIcon: {
    position: 'absolute',
    top: 16,
    right: 16,
    opacity: 0.1,
  },
  testimonialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  testimonialAvatar: {
    width: isSmallScreen ? 40 : 50,
    height: isSmallScreen ? 40 : 50,
    borderRadius: isSmallScreen ? 20 : 25,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: isSmallScreen ? 12 : 16,
    shadowColor: '#3B82F6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  testimonialAvatarText: {
    color: '#FFFFFF',
    fontSize: isSmallScreen ? 16 : 18,
    fontWeight: 'bold',
  },
  testimonialInfo: {
    flex: 1,
  },
  testimonialName: {
    fontSize: isSmallScreen ? 16 : 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  testimonialRole: {
    fontSize: isSmallScreen ? 12 : 14,
    color: '#64748B',
    fontWeight: '500',
  },
  testimonialContent: {
    fontSize: isSmallScreen ? 14 : 16,
    color: '#1E293B',
    lineHeight: isSmallScreen ? 20 : 24,
    marginBottom: 20,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  testimonialStars: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    gap: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E2E8F0',
    transition: 'all 0.3s ease',
  },
  paginationDotActive: {
    width: 24,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3B82F6',
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
