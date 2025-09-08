import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  FlatList,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import LogoImage from '../components/LogoImage';
import AppHeader from '../components/AppHeader';
import { fetchJobsByCategory, searchJobs } from '../services/apiService';

const { width } = Dimensions.get('window');

const JobsScreen = ({ navigation, route }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get navigation parameters
  const { category, searchQuery: initialSearchQuery, location: initialLocation } = route.params || {};

  // Initialize search query and filter from navigation params
  useEffect(() => {
    if (initialSearchQuery) {
      setSearchQuery(initialSearchQuery);
    }
    if (category) {
      setSelectedFilter(category.toLowerCase());
    }
  }, [initialSearchQuery, category]);

  // Load jobs when component mounts
  useEffect(() => {
    loadJobs();
  }, []);

  // Load jobs when filters change
  useEffect(() => {
    if (selectedFilter) {
      loadJobs();
    }
  }, [selectedFilter]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Loading jobs with:', { selectedFilter, searchQuery, initialSearchQuery, category });
      
      let jobsData = [];
      
      // Use the current searchQuery state or initialSearchQuery from navigation
      const currentSearchQuery = searchQuery || initialSearchQuery || '';
      
      if (currentSearchQuery.trim()) {
        // Search jobs by query
        console.log('Searching jobs with query:', currentSearchQuery);
        jobsData = await searchJobs(currentSearchQuery, initialLocation);
      } else if (selectedFilter && selectedFilter !== 'all') {
        // Fetch jobs by category (limit to 20 jobs)
        console.log('Fetching jobs by category:', selectedFilter);
        jobsData = await fetchJobsByCategory(selectedFilter, 1, 20);
      } else {
        // Fetch all jobs (limit to 20 jobs)
        console.log('Fetching all jobs');
        jobsData = await fetchJobsByCategory('all', 1, 20);
      }
      
      console.log('Jobs loaded:', jobsData.length, 'jobs');
      setJobs(jobsData);
    } catch (err) {
      console.error('Error loading jobs:', err);
      setError('Failed to load jobs');
      
      // Set fallback data
      setJobs([
        {
          _id: '1',
          title: 'Senior React Native Developer',
          company: 'TechCorp',
          location: 'Toronto, ON',
          type: 'Full-time',
          salary: '$80,000 - $120,000',
          posted: '2 days ago',
          description: 'We are looking for an experienced React Native developer to join our team...',
          category: 'Technology'
        },
        {
          _id: '2',
          title: 'UX/UI Designer',
          company: 'DesignStudio',
          location: 'Vancouver, BC',
          type: 'Full-time',
          salary: '$60,000 - $90,000',
          posted: '1 week ago',
          description: 'Join our creative team as a UX/UI Designer and help shape amazing user experiences...',
          category: 'Design'
        },
        {
          _id: '3',
          title: 'Marketing Manager',
          company: 'GrowthCo',
          location: 'Montreal, QC',
          type: 'Full-time',
          salary: '$70,000 - $100,000',
          posted: '3 days ago',
          description: 'Lead our marketing initiatives and drive growth for our innovative products...',
          category: 'Marketing'
        },
        {
          _id: '4',
          title: 'Data Scientist',
          company: 'DataFlow Inc',
          location: 'Calgary, AB',
          type: 'Full-time',
          salary: '$90,000 - $130,000',
          posted: '5 days ago',
          description: 'Analyze complex data sets and build predictive models to drive business insights...',
          category: 'Technology'
        }
      ]);
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

  const handleSearch = () => {
    loadJobs();
  };

  const filteredJobs = selectedFilter === 'all' 
    ? jobs 
    : jobs.filter(job => job.category && job.category.toLowerCase() === selectedFilter);

  const renderJobCard = ({ item }) => (
    <TouchableOpacity style={styles.jobCard} onPress={() => console.log('Job pressed:', item.title)}>
      <View style={styles.jobHeader}>
        <View style={styles.jobInfo}>
          <Text style={styles.jobTitle}>{item.title}</Text>
          <Text style={styles.companyName}>{item.company}</Text>
        </View>
        <TouchableOpacity style={styles.saveButton}>
          <Ionicons name="bookmark-outline" size={20} color="#64748B" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.jobDetails}>
        <View style={styles.detailItem}>
          <Ionicons name="location-outline" size={16} color="#64748B" />
          <Text style={styles.detailText}>{item.location}</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="time-outline" size={16} color="#64748B" />
          <Text style={styles.detailText}>{item.type}</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="cash-outline" size={16} color="#64748B" />
          <Text style={styles.detailText}>{item.salary}</Text>
        </View>
      </View>
      
      <Text style={styles.jobDescription} numberOfLines={2}>{item.description}</Text>
      
      <View style={styles.jobFooter}>
        <Text style={styles.postedDate}>Posted {item.posted}</Text>
        <TouchableOpacity style={styles.applyButton}>
          <Text style={styles.applyButtonText}>Apply Now</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

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
        {/* Search Section */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#64748B" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search jobs, companies, keywords..."
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterContainer}>
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter.id}
                style={[
                  styles.filterTab,
                  selectedFilter === filter.id && styles.activeFilterTab
                ]}
                onPress={() => setSelectedFilter(filter.id)}
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
        </View>

        {/* Jobs List */}
        <View style={styles.jobsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {selectedFilter === 'all' ? 'All Jobs' : `${selectedFilter.charAt(0).toUpperCase() + selectedFilter.slice(1)} Jobs`}
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
  searchSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1E293B',
  },
  filterSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  filterContainer: {
    paddingHorizontal: 5,
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
