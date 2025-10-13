/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
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
        
        // PetVibe Semantic Colors (Old Copper based)
        primary: '#eda274',      // oldCopper-400
        secondary: '#d5956d',    // oldCopper-500
        accent: '#ffb07c',       // oldCopper-300
        dark: '#362319',         // oldCopper-1600
        light: '#ffeadd',        // oldCopper-100
        
        // Legacy PetVibe colors (for backward compatibility)
        'pv-primary': '#eda274',
        'pv-secondary': '#d5956d', 
        'pv-dark': '#362319',
        'pv-light': '#ffeadd',
        'pv-accent': '#ffb07c',
        
        // Extended PetVibe palette
        'pv-primary-light': '#ffb07c',
        'pv-primary-dark': '#a6775b',
        'pv-secondary-light': '#bd8664',
        'pv-secondary-dark': '#9e7359',
        
        // Text colors (optimized for contrast)
        'pv-text-heading': '#2a1a10',      // Darker for better contrast
        'pv-text-body': '#553d2d',         // Darker for better readability
        'pv-text-link': '#d5956d',         // Better contrast on light backgrounds
        'pv-text-muted': '#7e5c48',        // Darker muted text
        
        // High contrast text colors
        'pv-text-on-light': '#2a1a10',     // Dark text for light backgrounds
        'pv-text-on-dark': '#ffeadd',      // Light text for dark backgrounds
        'pv-text-on-primary': '#FFFFFF',   // White text on primary color
        'pv-text-on-secondary': '#FFFFFF', // White text on secondary color
        
        // Custom Old Copper text colors
        'old-copper-text': '#34140e',      // Main Old Copper text color
        'old-copper-hover': '#c47256',     // Old Copper hover color
      },
      
      backgroundImage: {
        // Old Copper gradients (PetVibe Theme)
        'old-copper-warm': 'linear-gradient(90deg, #ffb07c 0%, #eda274 100%)',
        'old-copper-soft': 'linear-gradient(180deg, #ffeadd 0%, #ffb07c 100%)',
        'old-copper-sunset': 'linear-gradient(135deg, #ffb07c 0%, #d5956d 50%, #a6775b 100%)',
        'old-copper-hero': 'linear-gradient(135deg, #ffb07c 0%, #eda274 100%)',
        'old-copper-primary': 'linear-gradient(135deg, #eda274 0%, #a6775b 100%)',
        'old-copper-secondary': 'linear-gradient(135deg, #d5956d 0%, #9e7359 100%)',
        'old-copper-accent': 'linear-gradient(135deg, #ffb07c 0%, #bd8664 100%)',
        
        // Legacy PetVibe gradients (for backward compatibility)
        'pv-warm-glow': 'linear-gradient(90deg, #ffb07c 0%, #eda274 100%)',
        'pv-soft-sun': 'linear-gradient(180deg, #ffeadd 0%, #ffb07c 100%)',
        'pv-sunset': 'linear-gradient(135deg, #ffb07c 0%, #d5956d 50%, #a6775b 100%)',
        'pv-warm-bg': 'linear-gradient(180deg, #ffeadd 0%, #ffb07c 100%)',
        'pv-hero': 'linear-gradient(135deg, #ffb07c 0%, #eda274 100%)',
        'pv-primary-btn': 'linear-gradient(135deg, #eda274 0%, #a6775b 100%)',
        'pv-secondary-btn': 'linear-gradient(135deg, #d5956d 0%, #9e7359 100%)',
        'pv-accent-btn': 'linear-gradient(135deg, #ffb07c 0%, #bd8664 100%)',
      },
      
      boxShadow: {
        // Old Copper shadows (PetVibe Theme)
        'old-copper-warm': '0 4px 14px 0 rgba(237, 162, 116, 0.15)',
        'old-copper-glow': '0 0 20px rgba(237, 162, 116, 0.3)',
        'old-copper-glow-lg': '0 0 30px rgba(237, 162, 116, 0.4)',
        'old-copper-card': '0 4px 6px -1px rgba(54, 35, 25, 0.1), 0 2px 4px -1px rgba(54, 35, 25, 0.06)',
        
        // Legacy PetVibe shadows (for backward compatibility)
        'pv-warm': '0 4px 14px 0 rgba(237, 162, 116, 0.15)',
        'pv-glow': '0 0 20px rgba(237, 162, 116, 0.3)',
        'pv-glow-lg': '0 0 30px rgba(237, 162, 116, 0.4)',
      },
      
      fontFamily: {
        'sans': ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
        'serif': ['Georgia', 'serif'],
        'mono': ['Monaco', 'Consolas', 'monospace'],
      },
      
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
        'pulse-warm': 'pulseWarm 2s infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        pulseWarm: {
          '0%, 100%': { 
            boxShadow: '0 0 0 0 rgba(246, 166, 35, 0.4)',
            transform: 'scale(1)'
          },
          '50%': { 
            boxShadow: '0 0 0 10px rgba(246, 166, 35, 0)',
            transform: 'scale(1.05)'
          },
        },
        glow: {
          '0%': { 
            boxShadow: '0 0 5px rgba(246, 166, 35, 0.5)',
          },
          '100%': { 
            boxShadow: '0 0 20px rgba(246, 166, 35, 0.8), 0 0 30px rgba(246, 166, 35, 0.6)',
          },
        },
      },
      
      transitionDuration: {
        '0': '0ms',
        '75': '75ms',
        '100': '100ms',
        '150': '150ms',
        '200': '200ms',
        '300': '300ms',
        '500': '500ms',
        '700': '700ms',
        '1000': '1000ms',
      },
      
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [
    // Custom plugin for PetVibe utilities
    function({ addUtilities, theme }) {
      const newUtilities = {
        '.text-pv-gradient': {
          background: 'linear-gradient(90deg, #F6A623 0%, #E86100 100%)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
        },
        '.bg-pv-gradient': {
          background: 'linear-gradient(135deg, #F6A623 0%, #D97B29 100%)',
        },
        '.border-pv-gradient': {
          border: '2px solid transparent',
          background: 'linear-gradient(white, white) padding-box, linear-gradient(90deg, #F6A623, #E86100) border-box',
        },
        '.shadow-pv-warm': {
          boxShadow: '0 4px 14px 0 rgba(246, 166, 35, 0.15)',
        },
        '.shadow-pv-glow': {
          boxShadow: '0 0 20px rgba(246, 166, 35, 0.3)',
        },
        '.animate-float': {
          animation: 'float 3s ease-in-out infinite',
        },
        '.animate-wiggle': {
          animation: 'wiggle 1s ease-in-out infinite',
        },
      }
      
      addUtilities(newUtilities)
    }
  ],
}
