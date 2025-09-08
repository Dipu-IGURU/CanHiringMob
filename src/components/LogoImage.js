import React from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';

const LogoImage = ({ size = 'large' }) => {
  const isLarge = size === 'large';
  const imageSize = isLarge ? 200 : 120;
  const textSize = isLarge ? 24 : 18;
  const taglineSize = isLarge ? 12 : 10;

  return (
    <View style={styles.container}>
      {/* Logo Image */}
      <Image
        source={require('../../assets/logowitohutbg.png')}
        style={[
          styles.logoImage,
          {
            width: imageSize,
            height: imageSize,
          }
        ]}
        resizeMode="contain"
      />
      
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
});

export default LogoImage;
