// COMMENTED OUT: Google Sign-In Button Component
// import React from 'react';
// import {
//   TouchableOpacity,
//   Text,
//   StyleSheet,
//   View,
//   ActivityIndicator,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';

// const GoogleSignInButton = ({ onPress, loading = false, disabled = false, style, text = "Continue with Google" }) => {
//   return (
//     <TouchableOpacity
//       style={[
//         styles.button,
//         disabled && styles.buttonDisabled,
//         style
//       ]}
//       onPress={onPress}
//       disabled={disabled || loading}
//       activeOpacity={0.8}
//     >
//       <View style={styles.buttonContent}>
//         {loading ? (
//           <ActivityIndicator size="small" color="#757575" />
//         ) : (
//           <Ionicons name="logo-google" size={20} color="#4285F4" />
//         )}
//         <Text style={[styles.buttonText, disabled && styles.buttonTextDisabled]}>
//           {loading ? 'Signing in...' : text}
//         </Text>
//       </View>
//     </TouchableOpacity>
//   );
// };

// const styles = StyleSheet.create({
//   button: {
//     backgroundColor: '#FFFFFF',
//     borderWidth: 1,
//     borderColor: '#DADCE0',
//     borderRadius: 8,
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//     marginVertical: 8,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 1,
//     },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//     elevation: 2,
//   },
//   buttonDisabled: {
//     backgroundColor: '#F5F5F5',
//     borderColor: '#E0E0E0',
//   },
//   buttonContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   buttonText: {
//     color: '#3C4043',
//     fontSize: 16,
//     fontWeight: '500',
//     marginLeft: 12,
//   },
//   buttonTextDisabled: {
//     color: '#9AA0A6',
//   },
// });

// export default GoogleSignInButton;

// Placeholder component to prevent import errors
import React from 'react';
import { View } from 'react-native';

const GoogleSignInButton = ({ onPress, loading = false, disabled = false, style, text = "Continue with Google" }) => {
  return <View style={{ display: 'none' }} />;
};

export default GoogleSignInButton;