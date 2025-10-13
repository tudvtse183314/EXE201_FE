// PetVibe Theme - Unified Color Palette
// Based on the warm, friendly pet care aesthetic with brown-orange-cream colors

export const PetVibeTheme = {
  colors: {
    // Old Copper Color Palette (PetVibe Theme)
    oldCopper: {
      50: '#ffffff',
      100: '#ffeadd',
      200: '#ffc8aa',
      300: '#ffb07c',
      400: '#eda274',
      500: '#d5956d',
      600: '#bd8664',
      700: '#a6775b',
      800: '#9e7359',
      900: '#916a53',
      1000: '#88634e',
      1100: '#7e5c48',
      1200: '#715340',
      1300: '#644837',
      1400: '#553d2d',
      1500: '#463023',
      1600: '#362319',
      1700: '#2a1a10',
    },
    
    // Primary brand colors (Old Copper based)
    primary: '#eda274',     // oldCopper-400 (main brand color)
    secondary: '#d5956d',   // oldCopper-500 (warm, friendly feel)
    dark: '#362319',        // oldCopper-1600 (text/headers)
    light: '#ffeadd',       // oldCopper-100 (soft background)
    accent: '#ffb07c',      // oldCopper-300 (CTA buttons, highlights)
    
    // Extended palette for more flexibility
    primaryLight: '#ffb07c',  // oldCopper-300
    primaryDark: '#a6775b',   // oldCopper-700
    secondaryLight: '#bd8664', // oldCopper-600
    secondaryDark: '#9e7359',  // oldCopper-800
    
    // Neutral colors
    white: '#FFFFFF',
    black: '#000000',
    gray: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827',
    },
    
    // Status colors
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  },

  gradients: {
    // Old Copper gradients (PetVibe Theme)
    warmGlow: 'linear-gradient(90deg, #ffb07c 0%, #eda274 100%)',
    softSun: 'linear-gradient(180deg, #ffeadd 0%, #ffb07c 100%)',
    sunset: 'linear-gradient(135deg, #ffb07c 0%, #d5956d 50%, #a6775b 100%)',
    
    // Background gradients
    warmBackground: 'linear-gradient(180deg, #ffeadd 0%, #ffb07c 100%)',
    heroGradient: 'linear-gradient(135deg, #ffb07c 0%, #eda274 100%)',
    
    // Button gradients
    primaryButton: 'linear-gradient(135deg, #eda274 0%, #a6775b 100%)',
    secondaryButton: 'linear-gradient(135deg, #d5956d 0%, #9e7359 100%)',
    accentButton: 'linear-gradient(135deg, #ffb07c 0%, #bd8664 100%)',
    
    // Text gradients
    textGradient: 'linear-gradient(135deg, #eda274 0%, #a6775b 100%)',
    headingGradient: 'linear-gradient(135deg, #ffb07c 0%, #a6775b 100%)',
  },

  text: {
    // Text colors (Old Copper based) - Optimized for contrast
    heading: '#2a1a10',      // Darker for better contrast on light backgrounds
    body: '#553d2d',         // Darker for better readability
    link: '#d5956d',         // Better contrast on light backgrounds
    muted: '#7e5c48',        // Darker muted text
    light: '#ffeadd',        // Light text on dark backgrounds
    white: '#FFFFFF',        // White text
    
    // High contrast text colors
    onLight: '#2a1a10',      // Dark text for light backgrounds
    onDark: '#ffeadd',       // Light text for dark backgrounds
    onPrimary: '#FFFFFF',    // White text on primary color
    onSecondary: '#FFFFFF',  // White text on secondary color
  },

  // Spacing system
  spacing: {
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px
    md: '1rem',       // 16px
    lg: '1.5rem',     // 24px
    xl: '2rem',       // 32px
    '2xl': '3rem',    // 48px
    '3xl': '4rem',    // 64px
    '4xl': '6rem',    // 96px
    '5xl': '8rem',    // 128px
  },

  // Border radius
  borderRadius: {
    none: '0',
    sm: '0.125rem',   // 2px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    '2xl': '1rem',    // 16px
    '3xl': '1.5rem',  // 24px
    full: '9999px',
  },

  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    // Old Copper specific shadows (PetVibe Theme)
    warm: '0 4px 14px 0 rgba(237, 162, 116, 0.15)',
    glow: '0 0 20px rgba(237, 162, 116, 0.3)',
    glowLg: '0 0 30px rgba(237, 162, 116, 0.4)',
    card: '0 4px 6px -1px rgba(54, 35, 25, 0.1), 0 2px 4px -1px rgba(54, 35, 25, 0.06)',
  },

  // Typography
  typography: {
    fontFamily: {
      sans: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
      serif: ['Georgia', 'serif'],
      mono: ['Monaco', 'Consolas', 'monospace'],
    },
    fontSize: {
      xs: '0.75rem',     // 12px
      sm: '0.875rem',    // 14px
      base: '1rem',      // 16px
      lg: '1.125rem',    // 18px
      xl: '1.25rem',     // 20px
      '2xl': '1.5rem',   // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem',  // 36px
      '5xl': '3rem',     // 48px
      '6xl': '3.75rem',  // 60px
      '7xl': '4.5rem',   // 72px
    },
    fontWeight: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
    },
    lineHeight: {
      tight: '1.25',
      snug: '1.375',
      normal: '1.5',
      relaxed: '1.625',
      loose: '2',
    },
  },

  // Breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // Animation durations
  animation: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
    },
    easing: {
      ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },
};

// Helper functions for using the theme
export const getColor = (colorPath) => {
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
};

export const getGradient = (gradientName) => {
  return PetVibeTheme.gradients[gradientName] || PetVibeTheme.gradients.warmGlow;
};

export const getSpacing = (size) => {
  return PetVibeTheme.spacing[size] || PetVibeTheme.spacing.md;
};

export const getShadow = (shadowName) => {
  return PetVibeTheme.shadows[shadowName] || PetVibeTheme.shadows.md;
};

// CSS-in-JS style objects for common components
export const commonStyles = {
  button: {
    primary: {
      background: PetVibeTheme.gradients.primaryButton,
      color: PetVibeTheme.colors.white,
      border: 'none',
      borderRadius: PetVibeTheme.borderRadius.lg,
      padding: `${PetVibeTheme.spacing.md} ${PetVibeTheme.spacing.lg}`,
      fontSize: PetVibeTheme.typography.fontSize.base,
      fontWeight: PetVibeTheme.typography.fontWeight.semibold,
      cursor: 'pointer',
      transition: `all ${PetVibeTheme.animation.duration.normal} ${PetVibeTheme.animation.easing.ease}`,
      boxShadow: PetVibeTheme.shadows.warm,
    },
    secondary: {
      background: PetVibeTheme.gradients.secondaryButton,
      color: PetVibeTheme.colors.white,
      border: 'none',
      borderRadius: PetVibeTheme.borderRadius.lg,
      padding: `${PetVibeTheme.spacing.md} ${PetVibeTheme.spacing.lg}`,
      fontSize: PetVibeTheme.typography.fontSize.base,
      fontWeight: PetVibeTheme.typography.fontWeight.semibold,
      cursor: 'pointer',
      transition: `all ${PetVibeTheme.animation.duration.normal} ${PetVibeTheme.animation.easing.ease}`,
    },
  },
  
  card: {
    background: PetVibeTheme.colors.white,
    borderRadius: PetVibeTheme.borderRadius.xl,
    padding: PetVibeTheme.spacing.lg,
    boxShadow: PetVibeTheme.shadows.lg,
    border: `1px solid ${PetVibeTheme.colors.gray[200]}`,
  },
  
  input: {
    border: `2px solid ${PetVibeTheme.colors.gray[300]}`,
    borderRadius: PetVibeTheme.borderRadius.lg,
    padding: `${PetVibeTheme.spacing.md} ${PetVibeTheme.spacing.lg}`,
    fontSize: PetVibeTheme.typography.fontSize.base,
    transition: `border-color ${PetVibeTheme.animation.duration.normal} ${PetVibeTheme.animation.easing.ease}`,
    '&:focus': {
      borderColor: PetVibeTheme.colors.primary,
      outline: 'none',
      boxShadow: `0 0 0 3px ${PetVibeTheme.colors.primary}20`,
    },
  },
};

export default PetVibeTheme;
