import { useMemo } from 'react';
import { PetVibeTheme } from '../styles/theme';

/**
 * Custom hook for accessing PetVibe theme values
 * @returns {Object} Theme object with colors, gradients, and utility functions
 */
export const usePetVibeTheme = () => {
  return useMemo(() => ({
    // Theme object
    theme: PetVibeTheme,
    
    // Colors
    colors: PetVibeTheme.colors,
    
    // Gradients
    gradients: PetVibeTheme.gradients,
    
    // Text colors
    text: PetVibeTheme.text,
    
    // Spacing
    spacing: PetVibeTheme.spacing,
    
    // Shadows
    shadows: PetVibeTheme.shadows,
    
    // Typography
    typography: PetVibeTheme.typography,
    
    // Animation
    animation: PetVibeTheme.animation,
    
    // Utility functions
    getColor: (colorPath) => {
      const keys = colorPath.split('.');
      let value = PetVibeTheme.colors;
      
      for (const key of keys) {
        value = value[key];
        if (value === undefined) {
          console.warn(`Color path "${colorPath}" not found in theme`);
          return '#000000';
        }
      }
      
      return value;
    },
    
    getGradient: (gradientName) => {
      return PetVibeTheme.gradients[gradientName] || PetVibeTheme.gradients.warmGlow;
    },
    
    getSpacing: (size) => {
      return PetVibeTheme.spacing[size] || PetVibeTheme.spacing.md;
    },
    
    getShadow: (shadowName) => {
      return PetVibeTheme.shadows[shadowName] || PetVibeTheme.shadows.md;
    },
    
    // Style generators
    getButtonStyle: (variant = 'primary') => {
      const baseStyle = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: `${PetVibeTheme.spacing.md} ${PetVibeTheme.spacing.lg}`,
        border: 'none',
        borderRadius: PetVibeTheme.borderRadius.lg,
        fontFamily: PetVibeTheme.typography.fontFamily.sans.join(', '),
        fontSize: PetVibeTheme.typography.fontSize.base,
        fontWeight: PetVibeTheme.typography.fontWeight.semibold,
        cursor: 'pointer',
        transition: `all ${PetVibeTheme.animation.duration.normal} ${PetVibeTheme.animation.easing.ease}`,
        boxShadow: PetVibeTheme.shadows.warm,
      };
      
      switch (variant) {
        case 'primary':
          return {
            ...baseStyle,
            background: PetVibeTheme.gradients.primaryButton,
            color: PetVibeTheme.colors.white,
          };
        case 'secondary':
          return {
            ...baseStyle,
            background: PetVibeTheme.gradients.secondaryButton,
            color: PetVibeTheme.colors.white,
          };
        case 'accent':
          return {
            ...baseStyle,
            background: PetVibeTheme.gradients.accentButton,
            color: PetVibeTheme.colors.white,
          };
        case 'outline':
          return {
            ...baseStyle,
            background: 'transparent',
            color: PetVibeTheme.colors.primary,
            border: `2px solid ${PetVibeTheme.colors.primary}`,
            boxShadow: 'none',
          };
        default:
          return baseStyle;
      }
    },
    
    getCardStyle: () => ({
      background: PetVibeTheme.colors.white,
      borderRadius: PetVibeTheme.borderRadius.xl,
      padding: PetVibeTheme.spacing.lg,
      boxShadow: PetVibeTheme.shadows.lg,
      border: `1px solid ${PetVibeTheme.colors.gray[200]}`,
      transition: `all ${PetVibeTheme.animation.duration.normal} ${PetVibeTheme.animation.easing.ease}`,
    }),
    
    getInputStyle: () => ({
      width: '100%',
      padding: `${PetVibeTheme.spacing.md} ${PetVibeTheme.spacing.lg}`,
      border: `2px solid ${PetVibeTheme.colors.gray[300]}`,
      borderRadius: PetVibeTheme.borderRadius.lg,
      fontFamily: PetVibeTheme.typography.fontFamily.sans.join(', '),
      fontSize: PetVibeTheme.typography.fontSize.base,
      transition: `border-color ${PetVibeTheme.animation.duration.normal} ${PetVibeTheme.animation.easing.ease}`,
      '&:focus': {
        borderColor: PetVibeTheme.colors.primary,
        outline: 'none',
        boxShadow: `0 0 0 3px ${PetVibeTheme.colors.primary}20`,
      },
    }),
    
    // Animation helpers
    getAnimationStyle: (type, duration = 'normal') => {
      const durations = {
        fast: PetVibeTheme.animation.duration.fast,
        normal: PetVibeTheme.animation.duration.normal,
        slow: PetVibeTheme.animation.duration.slow,
      };
      
      const animationMap = {
        fadeIn: {
          animation: `fadeIn ${durations[duration]} ${PetVibeTheme.animation.easing.ease}`,
        },
        slideUp: {
          animation: `slideUp ${durations[duration]} ${PetVibeTheme.animation.easing.easeOut}`,
        },
        slideDown: {
          animation: `slideDown ${durations[duration]} ${PetVibeTheme.animation.easing.easeOut}`,
        },
        scaleIn: {
          animation: `scaleIn ${durations[duration]} ${PetVibeTheme.animation.easing.easeOut}`,
        },
        bounce: {
          animation: `bounceGentle 2s infinite`,
        },
        pulse: {
          animation: `pulseWarm 2s infinite`,
        },
        glow: {
          animation: `glow 2s ease-in-out infinite alternate`,
        },
      };
      
      return animationMap[type] || {};
    },
    
    // Responsive helpers
    getResponsiveValue: (values) => {
      // This would typically use a breakpoint system
      // For now, return the mobile value
      if (typeof values === 'object') {
        return values.mobile || values.sm || values[0];
      }
      return values;
    },
    
    // Color manipulation helpers
    lighten: (color, amount = 0.1) => {
      // Simple color lightening - in a real app, you'd use a color library
      return color;
    },
    
    darken: (color, amount = 0.1) => {
      // Simple color darkening - in a real app, you'd use a color library
      return color;
    },
    
    // Theme-aware media queries
    media: {
      sm: `@media (min-width: ${PetVibeTheme.breakpoints.sm})`,
      md: `@media (min-width: ${PetVibeTheme.breakpoints.md})`,
      lg: `@media (min-width: ${PetVibeTheme.breakpoints.lg})`,
      xl: `@media (min-width: ${PetVibeTheme.breakpoints.xl})`,
      '2xl': `@media (min-width: ${PetVibeTheme.breakpoints['2xl']})`,
    },
  }), []);
};

export default usePetVibeTheme;
