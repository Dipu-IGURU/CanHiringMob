import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  FlatList,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import LogoImage from '../components/LogoImage';
import AppHeader from '../components/AppHeader';
import JobSearchForm from '../components/JobSearchForm';
import { fetchJobsByCategory, searchJobs } from '../services/apiService';

const { width } = Dimensions.get('window');

const JobsScreen = ({ navigation, route }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSearchMode, setIsSearchMode] = useState(false);

  // Get navigation parameters
  const { category, searchQuery: initialSearchQuery, location: initialLocation } = route.params || {};

  // Initialize search query and filter from navigation params
  useEffect(() => {
    console.log('🔍 JobsScreen useEffect - Navigation params:', { initialSearchQuery, category, initialLocation });
    if (initialSearchQuery) {
      setSearchQuery(initialSearchQuery);
      setIsSearchMode(true);
    }
    if (initialLocation) {
      setSearchLocation(initialLocation);
    }
    if (category) {
      console.log('🔍 Setting selected filter to:', category.toLowerCase());
      setSelectedFilter(category.toLowerCase());
    }
  }, [initialSearchQuery, category, initialLocation]);

  // Load jobs when component mounts
  useEffect(() => {
    loadJobs();
  }, []);

  // Load jobs when filters change (only if not in search mode)
  useEffect(() => {
    if (selectedFilter && !isSearchMode) {
      loadJobs();
    }
  }, [selectedFilter]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Loading jobs with:', { selectedFilter, searchQuery, searchLocation, isSearchMode });
      
      let jobsData = [];
      
      if (isSearchMode && searchQuery.trim()) {
        // Search jobs by query and location
        console.log('Searching jobs with query:', searchQuery, 'location:', searchLocation);
        jobsData = await searchJobs(searchQuery, searchLocation, 1, 20);
      } else if (selectedFilter && selectedFilter !== 'all') {
        // Fetch jobs by category (limit to 20 jobs)
        console.log('🔍 Fetching jobs by category:', selectedFilter);
        jobsData = await fetchJobsByCategory(selectedFilter, 1, 20);
        console.log('🔍 Jobs data received:', jobsData.length, 'jobs');
      } else {
        // Fetch all jobs (limit to 20 jobs)
        console.log('🔍 Fetching all jobs');
        jobsData = await fetchJobsByCategory('all', 1, 20);
        console.log('🔍 All jobs data received:', jobsData.length, 'jobs');
      }
      
      console.log('Jobs loaded:', jobsData.length, 'jobs');
      setJobs(jobsData);
    } catch (err) {
      console.error('Error loading jobs:', err);
      setError('Failed to load jobs');
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (searchParams) => {
    console.log('🔍 Handle search called with:', searchParams);
    setSearchQuery(searchParams.query);
    setSearchLocation(searchParams.location);
    setIsSearchMode(true);
    setSelectedFilter('all'); // Reset filter when searching
    
    // Load jobs with search parameters
    try {
      setLoading(true);
      setError(null);
      
      const jobsData = await searchJobs(searchParams.query, searchParams.location, 1, 20);
      console.log('Search results:', jobsData.length, 'jobs');
      setJobs(jobsData);
    } catch (err) {
      console.error('Error searching jobs:', err);
      setError('Failed to search jobs');
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const filters = [
    { id: 'all', label: 'All Jobs' },
    { id: 'technology', label: 'Technology' },
    { id: 'design', label: 'Design' },
    { id: 'marketing', label: 'Marketing' },
  ];

  const handleFilterChange = (filterId) => {
    setSelectedFilter(filterId);
    setIsSearchMode(false); // Exit search mode when using filters
    setSearchQuery('');
    setSearchLocation('');
  };

  // For search mode, show all jobs. For filter mode, apply category filter
  const filteredJobs = isSearchMode 
    ? jobs 
    : (selectedFilter === 'all' 
        ? jobs 
        : jobs.filter(job => job.category && job.category.toLowerCase() === selectedFilter));

  const renderJobCard = ({ item }) => {
    // Format posted date
    const formatPostedDate = (dateString) => {
      if (!dateString) return 'Recently posted';
      try {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) return '1 day ago';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
        return `${Math.ceil(diffDays / 30)} months ago`;
      } catch (error) {
        return 'Recently posted';
      }
    };

    return (
      <TouchableOpacity style={styles.jobCard} onPress={() => console.log('Job pressed:', item.title)}>
        <View style={styles.jobHeader}>
          <View style={styles.jobInfo}>
            <Text style={styles.jobTitle}>{item.title || 'No Title'}</Text>
            <Text style={styles.companyName}>{item.company || 'No Company'}</Text>
          </View>
          <TouchableOpacity style={styles.saveButton}>
            <Ionicons name="bookmark-outline" size={20} color="#64748B" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.jobDetails}>
          <View style={styles.detailItem}>
            <Ionicons name="location-outline" size={16} color="#64748B" />
            <Text style={styles.detailText}>{item.location || 'Location not specified'}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={16} color="#64748B" />
            <Text style={styles.detailText}>{item.type || 'Full-time'}</Text>
          </View>
          {item.salary && item.salary !== 'Salary not specified' && (
            <View style={styles.detailItem}>
              <Ionicons name="cash-outline" size={16} color="#64748B" />
              <Text style={styles.detailText}>{item.salary}</Text>
            </View>
          )}
        </View>
        
        <Text style={styles.jobDescription} numberOfLines={3}>
          {item.description || 'No description available'}
        </Text>
        
        <View style={styles.jobFooter}>
          <Text style={styles.postedDate}>
            {formatPostedDate(item.postedDate)}
          </Text>
          <TouchableOpacity 
            style={styles.applyButton}
            onPress={() => {
              if (item.applyUrl) {
                // Open external URL
                console.log('Opening apply URL:', item.applyUrl);
              } else {
                console.log('Apply for job:', item.title);
              }
            }}
          >
            <Text style={styles.applyButtonText}>Apply Now</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <AppHeader 
        rightActions={[
          { icon: 'notifications-outline', onPress: () => console.log('Notifications') },
          { icon: 'person-outline', onPress: () => console.log('Profile') }
        ]}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Job Search Form */}
        <JobSearchForm onSearch={handleSearch} loading={loading} />

        {/* Filter Tabs or Clear Search */}
        <View style={styles.filterSection}>
          {isSearchMode ? (
            <View style={styles.searchModeContainer}>
              <TouchableOpacity
                style={styles.clearSearchButton}
                onPress={() => {
                  setIsSearchMode(false);
                  setSearchQuery('');
                  setSearchLocation('');
                  setSelectedFilter('all');
                  loadJobs();
                }}
              >
                <Ionicons name="close-circle" size={16} color="#64748B" />
                <Text style={styles.clearSearchText}>Clear Search</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterContainer}>
              {filters.map((filter) => (
                <TouchableOpacity
                  key={filter.id}
                  style={[
                    styles.filterTab,
                    selectedFilter === filter.id && styles.activeFilterTab
                  ]}
                  onPress={() => handleFilterChange(filter.id)}
                >
                  <Text style={[
                    styles.filterTabText,
                    selectedFilter === filter.id && styles.activeFilterTabText
                  ]}>
                    {filter.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Jobs List */}
        <View style={styles.jobsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {isSearchMode 
                ? `Search Results${searchQuery ? ` for "${searchQuery}"` : ''}${searchLocation ? ` in ${searchLocation}` : ''}`
                : (selectedFilter === 'all' ? 'All Jobs' : `${selectedFilter.charAt(0).toUpperCase() + selectedFilter.slice(1)} Jobs`)
              }
            </Text>
            <Text style={styles.sectionSubtitle}>
              {loading ? 'Loading...' : `${filteredJobs.length} jobs found`}
            </Text>
          </View>
          
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#3B82F6" />
              <Text style={styles.loadingText}>Loading jobs...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={48} color="#EF4444" />
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity 
                style={styles.retryButton}
                onPress={loadJobs}
              >
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : filteredJobs.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="briefcase-outline" size={64} color="#CBD5E1" />
              <Text style={styles.emptyTitle}>No jobs found</Text>
              <Text style={styles.emptySubtitle}>
                Try adjusting your search criteria or check back later
              </Text>
            </View>
          ) : (
            <FlatList
              data={filteredJobs}
              renderItem={renderJobCard}
              keyExtractor={(item) => item?.id?.toString() || item?._id?.toString() || Math.random().toString()}
              scrollEnabled={false}
              contentContainerStyle={styles.jobsList}
            />
          )}
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
  filterSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  filterContainer: {
    paddingHorizontal: 5,
  },
  searchModeContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  clearSearchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  clearSearchText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
    marginLeft: 6,
  },
  filterTab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  activeFilterTab: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
  },
  activeFilterTabText: {
    color: '#FFFFFF',
  },
  jobsSection: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  sectionHeader: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#64748B',
  },
  jobsList: {
    gap: 15,
  },
  jobCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
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
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  jobInfo: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  companyName: {
    fontSize: 14,
    color: '#64748B',
  },
  saveButton: {
    padding: 8,
  },
  jobDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
    gap: 15,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 14,
    color: '#64748B',
  },
  jobDescription: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 15,
    minHeight: 60, // Ensure consistent height for job cards
  },
  jobFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  postedDate: {
    fontSize: 12,
    color: '#94A3B8',
  },
  applyButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
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
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#64748B',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default JobsScreen;
