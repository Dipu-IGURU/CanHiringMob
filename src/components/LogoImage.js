import React from 'react';
import { View, Image, StyleSheet, Text, Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const LogoImage = ({ size = 'large' }) => {
  const getImageSize = () => {
    switch (size) {
      case 'small':
        return screenWidth * 0.15; // 15% of screen width
      case 'medium':
        return screenWidth * 0.25; // 25% of screen width
      case 'large':
        return screenWidth * 0.35; // 35% of screen width
      case 'xlarge':
        return screenWidth * 0.45; // 45% of screen width
      case 'header':
        return screenWidth * 0.4; // 40% of screen width for header
      default:
        return screenWidth * 0.25; // 25% of screen width
    }
  };

  const imageSize = getImageSize();

  return (
    <View style={styles.container}>
      {/* Logo Image - Temporarily replaced with text due to build error */}
      {/* <Image
        source={require('../../assets/logowitohutbg.png')}
        style={[
          styles.logoImage,
          {
            width: imageSize,
            height: imageSize * 0.6, // Maintain aspect ratio (60% of width)
          }
        ]}
        resizeMode="contain"
      /> */}
      <Text style={[styles.logoText, { fontSize: imageSize * 0.3 }]}>
        CanHiring
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    marginBottom: 10,
  },
  logoText: {
    fontWeight: 'bold',
    color: '#3B82F6',
    textAlign: 'center',
  },
});

export default LogoImage;
