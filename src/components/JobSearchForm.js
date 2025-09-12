import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const JobSearchForm = ({ onSearch, loading = false, initialJobTitle = '', initialLocation = '' }) => {
  const [jobTitle, setJobTitle] = useState(initialJobTitle);
  const [location, setLocation] = useState(initialLocation);

  // Update form fields when initial values change
  useEffect(() => {
    setJobTitle(initialJobTitle);
    setLocation(initialLocation);
  }, [initialJobTitle, initialLocation]);

  const handleSearch = () => {
    if (jobTitle.trim() || location.trim()) {
      onSearch({
        query: jobTitle.trim(),
        location: location.trim(),
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchCard}>
        {/* Job Title/Keywords Input */}
        <View style={styles.inputContainer}>
          <Ionicons name="search" size={20} color="#64748B" style={styles.inputIcon} />
          <TextInput
            style={styles.textInput}
            placeholder="Job title, keywords..."
            placeholderTextColor="#94A3B8"
            value={jobTitle}
            onChangeText={setJobTitle}
            returnKeyType="next"
            onSubmitEditing={() => {
              // Focus on location input when user presses next
            }}
          />
        </View>

        {/* City/Postcode Input */}
        <View style={styles.inputContainer}>
          <Ionicons name="location-outline" size={20} color="#64748B" style={styles.inputIcon} />
          <TextInput
            style={styles.textInput}
            placeholder="City or postcode"
            placeholderTextColor="#94A3B8"
            value={location}
            onChangeText={setLocation}
            returnKeyType="search"
            onSubmitEditing={handleSearch}
          />
        </View>

        {/* Find Jobs Button */}
        <TouchableOpacity
          style={[styles.searchButton, loading && styles.searchButtonDisabled]}
          onPress={handleSearch}
          disabled={loading}
        >
          <Text style={styles.searchButtonText}>
            {loading ? 'Searching...' : 'Find Jobs'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  searchCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    gap: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#1E293B',
  },
  searchButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchButtonDisabled: {
    backgroundColor: '#94A3B8',
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default JobSearchForm;
