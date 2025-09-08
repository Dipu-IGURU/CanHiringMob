import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const AppHeader = ({ 
  title, 
  showLogo = true, 
  rightActions = [], 
  onBackPress,
  showBackButton = false 
}) => {
  return (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        {showBackButton ? (
          <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
            <Ionicons name="arrow-back" size={24} color="#1E293B" />
          </TouchableOpacity>
        ) : showLogo ? (
          <View style={styles.logoContainer}>
            <View style={styles.logoWrapper}>
              <Image
                source={require('../../assets/logowitohutbg.png')}
                style={styles.logoIcon}
                resizeMode="contain"
              />
              {/* <View style={styles.logoTextContainer}>
                <Text style={styles.logoMainText}>CANHIRING</Text>
                <Text style={styles.logoSubText}>SOLUTIONS</Text>
              </View> */}
            </View>
          </View>
        ) : (
          <View style={styles.placeholder} />
        )}
        
        {title && (
          <Text style={styles.headerTitle}>{title}</Text>
        )}
        
        <View style={styles.headerActions}>
          {rightActions.map((action, index) => (
            <TouchableOpacity 
              key={index}
              style={styles.headerButton} 
              onPress={action.onPress}
            >
              <Ionicons name={action.icon} size={24} color="#1E293B" />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 48,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
  },
  logoContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  logoWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIcon: {
    width: 56,
    height: 56,
    marginRight: 14,
  },
  logoTextContainer: {
    flexDirection: 'column',
  },
  logoMainText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#DC2626',
    letterSpacing: 0.5,
    lineHeight: 20,
    fontFamily: 'System',
  },
  logoSubText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#6B7280',
    letterSpacing: 0.3,
    lineHeight: 13,
    marginTop: -1,
    fontFamily: 'System',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 20,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 44,
    minHeight: 44,
  },
  placeholder: {
    width: 40,
  },
});

export default AppHeader;
