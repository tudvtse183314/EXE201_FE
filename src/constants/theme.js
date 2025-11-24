// src/constants/theme.js
// Theme constants để đảm bảo UI/UX thống nhất

export const THEME = {
  colors: {
    primary: '#eda274',
    primaryDark: '#d5956d',
    primaryLight: '#f5c4a0',
    secondary: '#34140e',
    success: '#52c41a',
    warning: '#faad14',
    error: '#ff4d4f',
    info: '#1890ff',
    text: '#362319',
    textSecondary: '#666666',
    textLight: '#999999',
    background: '#ffffff',
    backgroundLight: '#f5f5f5',
    border: '#d9d9d9',
    shadow: 'rgba(0, 0, 0, 0.1)',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
  borderRadius: {
    small: '4px',
    medium: '8px',
    large: '12px',
    xlarge: '16px',
    round: '50%',
  },
  shadows: {
    small: '0 2px 4px rgba(0, 0, 0, 0.1)',
    medium: '0 4px 8px rgba(0, 0, 0, 0.1)',
    large: '0 8px 16px rgba(0, 0, 0, 0.1)',
    xlarge: '0 12px 24px rgba(0, 0, 0, 0.15)',
  },
  transitions: {
    fast: '0.15s ease',
    normal: '0.3s ease',
    slow: '0.5s ease',
  },
  breakpoints: {
    xs: '480px',
    sm: '576px',
    md: '768px',
    lg: '992px',
    xl: '1200px',
    xxl: '1600px',
  },
};

export const getThemeStyle = (component) => {
  const styles = {
    button: {
      primary: {
        background: THEME.colors.primary,
        borderColor: THEME.colors.primary,
        color: '#fff',
        borderRadius: THEME.borderRadius.medium,
        fontWeight: 600,
        transition: `all ${THEME.transitions.normal}`,
        '&:hover': {
          background: THEME.colors.primaryDark,
          borderColor: THEME.colors.primaryDark,
          transform: 'translateY(-2px)',
          boxShadow: THEME.shadows.medium,
        },
      },
    },
    card: {
      borderRadius: THEME.borderRadius.large,
      boxShadow: THEME.shadows.medium,
      border: `1px solid ${THEME.colors.border}`,
      transition: `all ${THEME.transitions.normal}`,
      '&:hover': {
        boxShadow: THEME.shadows.large,
        transform: 'translateY(-4px)',
      },
    },
    input: {
      borderRadius: THEME.borderRadius.medium,
      borderColor: THEME.colors.border,
      '&:focus': {
        borderColor: THEME.colors.primary,
        boxShadow: `0 0 0 2px ${THEME.colors.primaryLight}40`,
      },
    },
  };
  return styles[component] || {};
};

