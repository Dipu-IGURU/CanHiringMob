import React from 'react';
import { StatusBar as RNStatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';

const StatusBar = ({ 
  backgroundColor = '#FFFFFF', 
  barStyle = 'dark-content',
  translucent = false 
}) => {
  return (
    <RNStatusBar
      style={barStyle}
      backgroundColor={Platform.OS === 'android' ? backgroundColor : undefined}
      translucent={translucent}
    />
  );
};

export default StatusBar;
