import React from 'react';
import { loginBanner, registerBanner, heroBanner, banner1, banner2, banner3, banner4, banner5 } from '../../assets/images';

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
    backgroundImage: `url(${imagePath})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    ...style
  };

  return (
    <div 
      className={`relative ${className}`}
      style={backgroundStyle}
    >
      <div 
        className="absolute inset-0"
        style={{ backgroundColor: overlay }}
      />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

// Predefined background components for common use cases
export const LoginBackground = ({ children, className = '' }) => (
  <BackgroundImage 
    imagePath={loginBanner}
    overlay="rgba(0,0,0,0.4)"
    className={`min-h-screen ${className}`}
  >
    {children}
  </BackgroundImage>
);

export const RegisterBackground = ({ children, className = '' }) => (
  <BackgroundImage 
    imagePath={registerBanner}
    overlay="rgba(0,0,0,0.3)"
    className={`min-h-screen ${className}`}
  >
    {children}
  </BackgroundImage>
);

export const HeroBackground = ({ children, className = '' }) => (
  <BackgroundImage 
    imagePath={heroBanner}
    overlay="rgba(0,0,0,0.2)"
    className={`min-h-screen ${className}`}
  >
    {children}
  </BackgroundImage>
);

// Additional banner background components
export const Banner1Background = ({ children, className = '' }) => (
  <BackgroundImage 
    imagePath={banner1}
    overlay="rgba(0,0,0,0.3)"
    className={`min-h-screen ${className}`}
  >
    {children}
  </BackgroundImage>
);

export const Banner2Background = ({ children, className = '' }) => (
  <BackgroundImage 
    imagePath={banner2}
    overlay="rgba(0,0,0,0.3)"
    className={`min-h-screen ${className}`}
  >
    {children}
  </BackgroundImage>
);

export const Banner3Background = ({ children, className = '' }) => (
  <BackgroundImage 
    imagePath={banner3}
    overlay="rgba(0,0,0,0.2)"
    className={`min-h-screen ${className}`}
  >
    {children}
  </BackgroundImage>
);

export const Banner4Background = ({ children, className = '' }) => (
  <BackgroundImage 
    imagePath={banner4}
    overlay="rgba(0,0,0,0.3)"
    className={`min-h-screen ${className}`}
  >
    {children}
  </BackgroundImage>
);

export const Banner5Background = ({ children, className = '' }) => (
  <BackgroundImage 
    imagePath={banner5}
    overlay="rgba(0,0,0,0.2)"
    className={`min-h-screen ${className}`}
  >
    {children}
  </BackgroundImage>
);
