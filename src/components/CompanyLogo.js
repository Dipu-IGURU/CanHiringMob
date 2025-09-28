import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CompanyLogo = ({ 
  companyName, 
  size = 48, 
  fontSize = 18, 
  style = {},
  textStyle = {} 
}) => {
  // Function to get first letter of company name
  const getCompanyInitial = (name) => {
    if (!name || name.trim() === '') return '?';
    return name.trim().charAt(0).toUpperCase();
  };

  // Function to get a color for the company logo based on name
  const getCompanyLogoColor = (name) => {
    const colors = [
      '#3B82F6', // Blue
      '#10B981', // Green
      '#F59E0B', // Yellow
      '#EF4444', // Red
      '#8B5CF6', // Purple
      '#EC4899', // Pink
      '#06B6D4', // Cyan
      '#84CC16', // Lime
      '#F97316', // Orange
      '#6366F1', // Indigo
    ];
    
    if (!name) return colors[0];
    
    // Use the first character to determine color
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const logoSize = size;
  const borderRadius = logoSize / 2;

  return (
    <View 
      style={[
        styles.logoContainer, 
        { 
          width: logoSize, 
          height: logoSize, 
          borderRadius,
          backgroundColor: getCompanyLogoColor(companyName)
        },
        style
      ]}
    >
      <Text 
        style={[
          styles.logoText, 
          { fontSize },
          textStyle
        ]}
      >
        {getCompanyInitial(companyName)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  logoText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});

export default CompanyLogo;
