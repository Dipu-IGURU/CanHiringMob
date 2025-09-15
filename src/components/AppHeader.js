import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import StatusBar from './StatusBar';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const AppHeader = ({ 
  title, 
  showLogo = true, 
  rightActions = [], 
  onBackPress,
  showBackButton = false,
  backgroundColor = '#FFFFFF',
  textColor = '#1E293B',
  showStatusBar = true,
  statusBarStyle = 'dark-content'
}) => {
  return (
    <View style={[styles.header, { backgroundColor }]}>
      {showStatusBar && (
        <StatusBar 
          backgroundColor={backgroundColor} 
          barStyle={statusBarStyle}
        />
      )}
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerContent}>
          {/* Left Section */}
          <View style={styles.leftSection}>
            {showBackButton ? (
              <TouchableOpacity 
                style={styles.backButton} 
                onPress={onBackPress}
                activeOpacity={0.7}
              >
                <Ionicons name="arrow-back" size={24} color={textColor} />
              </TouchableOpacity>
            ) : showLogo ? (
              <View style={styles.logoContainer}>
                <Image
                  source={require('../../assets/logowitohutbg.png')}
                  style={styles.logoIcon}
                  resizeMode="contain"
                />
              </View>
            ) : (
              <View style={styles.placeholder} />
            )}
          </View>

          {/* Center Section - Title */}
          {title && (
            <View style={styles.centerSection}>
              <Text style={[styles.headerTitle, { color: textColor }]} numberOfLines={1}>
                {title}
              </Text>
            </View>
          )}

          {/* Right Section - Actions */}
          <View style={styles.rightSection}>
            {rightActions.map((action, index) => (
              <TouchableOpacity 
                key={index}
                style={styles.headerButton} 
                onPress={action.onPress}
                activeOpacity={0.7}
              >
                <Ionicons name={action.icon} size={22} color={textColor} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  safeArea: {
    paddingHorizontal: Platform.OS === 'ios' ? 20 : 16,
    paddingVertical: Platform.OS === 'ios' ? 8 : 12,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: Platform.OS === 'ios' ? 60 : 64, // Increased height for larger logo
    maxHeight: 80, // Increased max height
  },
  leftSection: {
    flex: 2, // Increased to give more space for logo
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  centerSection: {
    flex: 1, // Reduced to make room for larger logo
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  rightSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 40,
    minHeight: 40,
  },
  logoContainer: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    width: '100%', // Take full width of left section
    paddingLeft: screenWidth < 400 ? 20 : 30, // Maximum left padding
    paddingVertical: 12, // Maximum vertical padding
  },
  logoIcon: {
    width: screenWidth * 0.4, // 40% of screen width
    height: screenWidth * 0.4 * 0.6, // Maintain aspect ratio (60% of width)
    maxWidth: screenWidth * 0.5, // Maximum 50% of screen width
    maxHeight: screenWidth * 0.5 * 0.6,
  },
  headerTitle: {
    fontSize: screenWidth < 400 ? 16 : 18,
    fontWeight: '600',
    textAlign: 'center',
    maxWidth: screenWidth * 0.6,
  },
  headerButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 36,
    minHeight: 36,
    maxWidth: 44,
    maxHeight: 44,
  },
  placeholder: {
    width: 40,
  },
});

export default AppHeader;
