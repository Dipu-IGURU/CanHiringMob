// CanHiring Color Palette - Professional Medium Tones
export const Colors = {
  // Primary Colors - Professional Blue
  primary: '#2563EB',        // Medium blue - main brand color
  primaryLight: '#3B82F6',   // Lighter blue for accents
  primaryDark: '#1D4ED8',    // Darker blue for pressed states
  
  // Secondary Colors - Professional Gray
  secondary: '#64748B',      // Medium gray for secondary text
  secondaryLight: '#94A3B8', // Light gray for placeholders
  secondaryDark: '#475569',  // Dark gray for emphasis
  
  // Neutral Colors - Clean and Professional
  background: '#F8FAFC',     // Very light gray background
  surface: '#FFFFFF',        // White for cards and surfaces
  surfaceLight: '#F1F5F9',   // Light gray for subtle backgrounds
  
  // Text Colors - High Contrast
  textPrimary: '#0F172A',    // Dark text for headings
  textSecondary: '#475569',  // Medium text for body
  textTertiary: '#64748B',   // Light text for captions
  textInverse: '#FFFFFF',    // White text for dark backgrounds
  
  // Status Colors - Professional and Accessible
  success: '#059669',        // Medium green for success states
  warning: '#D97706',        // Medium orange for warnings
  error: '#DC2626',          // Medium red for errors
  info: '#0284C7',           // Medium blue for info
  
  // Border and Divider Colors
  border: '#E2E8F0',         // Light border color
  borderLight: '#F1F5F9',    // Very light border
  borderDark: '#CBD5E1',     // Medium border for emphasis
  
  // Shadow Colors
  shadow: 'rgba(0, 0, 0, 0.1)',     // Light shadow
  shadowMedium: 'rgba(0, 0, 0, 0.15)', // Medium shadow
  shadowDark: 'rgba(0, 0, 0, 0.2)',    // Dark shadow
  
  // Gradient Colors
  gradientPrimary: ['#2563EB', '#3B82F6'],
  gradientSecondary: ['#64748B', '#94A3B8'],
  gradientSurface: ['#F8FAFC', '#E2E8F0'],
  
  // Interactive States
  hover: '#F1F5F9',          // Light hover state
  pressed: '#E2E8F0',        // Pressed state
  disabled: '#94A3B8',       // Disabled state
  disabledText: '#CBD5E1',   // Disabled text
};

// Typography Scale
export const Typography = {
  // Font Sizes
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  
  // Font Weights
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  
  // Line Heights
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
};

// Spacing Scale
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
  '6xl': 64,
};

// Border Radius
export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  full: 9999,
};

// Shadow Styles
export const Shadows = {
  sm: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 8,
  },
  xl: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 16,
  },
};

export default Colors;