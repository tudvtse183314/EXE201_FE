import React from 'react';
import { getBackgroundImage } from '../../assets/images';

/**
 * Reusable Background Image Component
 * @param {string} imagePath - URL of the background image
 * @param {string} overlay - CSS color for overlay (default: rgba(0,0,0,0.4))
 * @param {string} className - Additional CSS classes
 * @param {object} style - Additional inline styles
 * @param {React.ReactNode} children - Content to display over the background
 */
export default function BackgroundImage({ 
  imagePath, 
  overlay = 'rgba(0,0,0,0.4)', 
  className = '', 
  style = {},
  children 
}) {
  const backgroundStyle = {
    ...getBackgroundImage(imagePath, overlay),
    ...style
  };

  return (
    <div 
      className={`relative ${className}`}
      style={backgroundStyle}
    >
      {children}
    </div>
  );
}

// Predefined background components for common use cases
export const LoginBackground = ({ children, className = '' }) => (
  <BackgroundImage 
    imagePath="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    overlay="rgba(0,0,0,0.4)"
    className={`min-h-screen ${className}`}
  >
    {children}
  </BackgroundImage>
);

export const RegisterBackground = ({ children, className = '' }) => (
  <BackgroundImage 
    imagePath="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2064&q=80"
    overlay="rgba(0,0,0,0.3)"
    className={`min-h-screen ${className}`}
  >
    {children}
  </BackgroundImage>
);

export const HeroBackground = ({ children, className = '' }) => (
  <BackgroundImage 
    imagePath="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    overlay="rgba(0,0,0,0.2)"
    className={`min-h-screen ${className}`}
  >
    {children}
  </BackgroundImage>
);
