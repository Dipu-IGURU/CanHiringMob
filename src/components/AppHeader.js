import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LogoImage from './LogoImage';

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
          <LogoImage size="small" />
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
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
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
    gap: 15,
  },
  headerButton: {
    padding: 8,
  },
  placeholder: {
    width: 40,
  },
});

export default AppHeader;
