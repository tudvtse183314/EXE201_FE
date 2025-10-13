// PetVibe Theme - Main Export File
export { default as PetVibeTheme } from './theme';
export { usePetVibeTheme } from '../hooks/usePetVibeTheme';

// Styled Components
export * from './styledComponents';

// CSS Variables (import this in your main CSS file)
export './petvibe.css';

// Theme utilities
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

// Common style objects for inline styles
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
    accent: {
      background: PetVibeTheme.gradients.accentButton,
      color: PetVibeTheme.colors.white,
      border: 'none',
      borderRadius: PetVibeTheme.borderRadius.lg,
      padding: `${PetVibeTheme.spacing.md} ${PetVibeTheme.spacing.lg}`,
      fontSize: PetVibeTheme.typography.fontSize.base,
      fontWeight: PetVibeTheme.typography.fontWeight.semibold,
      cursor: 'pointer',
      transition: `all ${PetVibeTheme.animation.duration.normal} ${PetVibeTheme.animation.easing.ease}`,
    },
    outline: {
      background: 'transparent',
      color: PetVibeTheme.colors.primary,
      border: `2px solid ${PetVibeTheme.colors.primary}`,
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
    border: `1px solid rgba(246, 166, 35, 0.1)`,
  },
  
  input: {
    border: `2px solid ${PetVibeTheme.colors.gray[300]}`,
    borderRadius: PetVibeTheme.borderRadius.lg,
    padding: `${PetVibeTheme.spacing.md} ${PetVibeTheme.spacing.lg}`,
    fontSize: PetVibeTheme.typography.fontSize.base,
    transition: `border-color ${PetVibeTheme.animation.duration.normal} ${PetVibeTheme.animation.easing.ease}`,
  },
  
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: `0 ${PetVibeTheme.spacing.lg}`,
  },
  
  section: {
    padding: `${PetVibeTheme.spacing['4xl']} 0`,
  },
  
  heading: {
    fontFamily: PetVibeTheme.typography.fontFamily.sans.join(', '),
    fontWeight: PetVibeTheme.typography.fontWeight.bold,
    color: PetVibeTheme.text.heading,
    marginBottom: PetVibeTheme.spacing.lg,
  },
  
  text: {
    fontFamily: PetVibeTheme.typography.fontFamily.sans.join(', '),
    fontSize: PetVibeTheme.typography.fontSize.base,
    color: PetVibeTheme.text.body,
    lineHeight: PetVibeTheme.typography.lineHeight.normal,
  },
};

// Animation presets
export const animations = {
  fadeIn: {
    animation: `fadeIn ${PetVibeTheme.animation.duration.normal} ${PetVibeTheme.animation.easing.ease}`,
  },
  slideUp: {
    animation: `slideUp ${PetVibeTheme.animation.duration.normal} ${PetVibeTheme.animation.easing.easeOut}`,
  },
  slideDown: {
    animation: `slideDown ${PetVibeTheme.animation.duration.normal} ${PetVibeTheme.animation.easing.easeOut}`,
  },
  scaleIn: {
    animation: `scaleIn ${PetVibeTheme.animation.duration.normal} ${PetVibeTheme.animation.easing.easeOut}`,
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

// Responsive breakpoints
export const breakpoints = PetVibeTheme.breakpoints;

// Media query helpers
export const media = {
  sm: `@media (min-width: ${PetVibeTheme.breakpoints.sm})`,
  md: `@media (min-width: ${PetVibeTheme.breakpoints.md})`,
  lg: `@media (min-width: ${PetVibeTheme.breakpoints.lg})`,
  xl: `@media (min-width: ${PetVibeTheme.breakpoints.xl})`,
  '2xl': `@media (min-width: ${PetVibeTheme.breakpoints['2xl']})`,
};

// Default export
export default PetVibeTheme;
