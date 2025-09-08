import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const UserTypeSelection = ({ navigation }) => {
  const userTypes = [
    {
      id: 'user',
      title: 'Job Seeker',
      subtitle: 'Find your dream job',
      icon: 'person',
      color: '#4CAF50',
      screen: 'UserOnboarding',
    },
    {
      id: 'recruiter',
      title: 'Recruiter',
      subtitle: 'Hire the best talent',
      icon: 'business',
      color: '#2196F3',
      screen: 'RecruiterOnboarding',
    },
  ];

  const handleUserTypeSelect = (screen) => {
    navigation.navigate(screen);
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#f8f9fa', '#e9ecef']}
        style={styles.gradient}
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Choose Your Role</Text>
            <View style={styles.placeholder} />
          </View>

          {/* Title */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>How would you like to use CanHiring?</Text>
            <Text style={styles.subtitle}>
              Select your role to get started with a personalized experience
            </Text>
          </View>

          {/* User Type Cards */}
          <View style={styles.cardsContainer}>
            {userTypes.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[styles.card, { borderLeftColor: type.color }]}
                onPress={() => handleUserTypeSelect(type.screen)}
                activeOpacity={0.8}
              >
                <View style={styles.cardContent}>
                  <View style={[styles.iconContainer, { backgroundColor: type.color }]}>
                    <Ionicons name={type.icon} size={32} color="#fff" />
                  </View>
                  <View style={styles.textContent}>
                    <Text style={styles.cardTitle}>{type.title}</Text>
                    <Text style={styles.cardSubtitle}>{type.subtitle}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={24} color="#ccc" />
                </View>
              </TouchableOpacity>
            ))}
          </View>


          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              You can change your role later in settings
            </Text>
          </View>
        </View>
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  titleContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  cardsContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginVertical: 8,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  textContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});

export default UserTypeSelection;
