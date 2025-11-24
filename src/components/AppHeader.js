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
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/colors';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const AppHeader = ({ 
  title, 
  showLogo = true, 
  rightActions = [], 
  onBackPress,
  showBackButton = false,
  backgroundColor = '#FFFFFF',
  textColor = '#1E293B',
  showBothLogoAndTitle = false, // New prop to show both logo and title
  verticalLayout = false // New prop for vertical layout on small devices
}) => {
  return (
    <View style={[styles.header, { backgroundColor }]}>
      <SafeAreaView style={styles.safeArea}>
        {verticalLayout ? (
          // Vertical layout for small devices
          <View style={styles.verticalHeaderContent}>
            {/* Top row: Logo and Actions */}
            <View style={styles.topRow}>
              <View style={styles.logoContainer}>
                <Image
                  source={require('../../assets/logowitohutbg.png')}
                  style={styles.logoIconVertical}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.rightSectionVertical}>
                {rightActions.map((action, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.headerButton}
                    onPress={action.onPress}
                    activeOpacity={0.7}
                  >
                    <Ionicons name={action.icon} size={20} color={textColor} />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            {/* Bottom row: Title/Greeting */}
            {title && (
              <View style={styles.bottomRow}>
                <Text style={[styles.headerTitleVertical, { color: textColor }]} numberOfLines={1}>
                  {title}
                </Text>
              </View>
            )}
          </View>
        ) : (
          // Horizontal layout for larger devices
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
                    style={[
                      styles.logoIcon,
                      showBothLogoAndTitle && styles.logoWithTitle
                    ]}
                    resizeMode="contain"
                  />
                </View>
              ) : (
                <View style={styles.placeholder} />
              )}
            </View>

            {/* Center Section - Title */}
            {title && (
              <View style={[
                styles.centerSection,
                showBothLogoAndTitle && styles.centerSectionWithLogo
              ]}>
                <Text style={[
                  styles.headerTitle, 
                  { color: textColor },
                  showBothLogoAndTitle && styles.titleWithLogo
                ]} numberOfLines={1}>
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
        )}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 0.5,
    borderBottomColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  safeArea: {
    paddingHorizontal: Platform.OS === 'ios' ? 16 : 20,
    paddingVertical: Platform.OS === 'ios' ? 8 : 12,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: Platform.OS === 'ios' ? 50 : 56,
    maxHeight: 70,
  },
  leftSection: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingRight: 8,
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  rightSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
  },
  backButton: {
    padding: Spacing.sm,
    borderRadius: BorderRadius['2xl'],
    backgroundColor: Colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 40,
    minHeight: 40,
  },
  logoContainer: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  logoIcon: {
    width: screenWidth < 400 ? 120 : 140,
    height: screenWidth < 400 ? 36 : 42,
    maxWidth: 160,
    maxHeight: 48,
  },
  logoText: {
    fontSize: Typography['2xl'],
    fontWeight: Typography.bold,
    color: Colors.primary,
    textAlign: 'left',
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
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 40,
    minHeight: 40,
    marginLeft: 8,
    borderWidth: 0.5,
    borderColor: '#E2E8F0',
  },
  placeholder: {
    width: 40,
  },
  // Responsive styles for logo with title
  logoWithTitle: {
    width: screenWidth < 400 ? screenWidth * 0.2 : screenWidth * 0.15,
    height: screenWidth < 400 ? screenWidth * 0.2 * 0.6 : screenWidth * 0.15 * 0.6,
    maxWidth: screenWidth < 400 ? 80 : 100,
    maxHeight: screenWidth < 400 ? 48 : 60,
  },
  centerSectionWithLogo: {
    flex: 2,
    paddingHorizontal: Spacing.sm,
  },
  titleWithLogo: {
    fontSize: screenWidth < 400 ? 14 : 16,
    maxWidth: screenWidth * 0.4,
    textAlign: 'left',
  },
  // Vertical layout styles
  verticalHeaderContent: {
    paddingVertical: Spacing.sm,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  bottomRow: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.sm,
  },
  logoIconVertical: {
    width: screenWidth < 400 ? screenWidth * 0.35 : screenWidth * 0.3,
    height: screenWidth < 400 ? screenWidth * 0.35 * 0.6 : screenWidth * 0.3 * 0.6,
    maxWidth: screenWidth < 400 ? 140 : 160,
    maxHeight: screenWidth < 400 ? 84 : 96,
  },
  rightSectionVertical: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  headerTitleVertical: {
    fontSize: screenWidth < 400 ? 16 : 18,
    fontWeight: '600',
    textAlign: 'center',
    maxWidth: screenWidth * 0.8,
  },
});

export default AppHeader;
