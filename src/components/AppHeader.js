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
  textColor = '#1E293B'
}) => {
  return (
    <View style={[styles.header, { backgroundColor }]}>
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
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    ...Shadows.md,
  },
  safeArea: {
    paddingHorizontal: Platform.OS === 'ios' ? Spacing.xl : Spacing.lg,
    paddingVertical: Platform.OS === 'ios' ? Spacing.sm : Spacing.md,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: Platform.OS === 'ios' ? 60 : 64,
    maxHeight: 80,
  },
  leftSection: {
    flex: 2,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xs,
  },
  rightSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: Spacing.sm,
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
    width: '100%',
    paddingLeft: screenWidth < 400 ? Spacing.xl : Spacing['3xl'],
    paddingVertical: Spacing.md,
  },
  logoIcon: {
    width: screenWidth * 0.4,
    height: screenWidth * 0.4 * 0.6,
    maxWidth: screenWidth * 0.5,
    maxHeight: screenWidth * 0.5 * 0.6,
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
