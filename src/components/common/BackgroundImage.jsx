import React from 'react';
import { loginBanner, registerBanner, heroBanner, dog1, dog2, cat1, cat2, pet1, pet2 } from '../../assets/images';

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
    imagePath={dog1}
    overlay="rgba(0,0,0,0.4)"
    className={`min-h-screen ${className}`}
  >
    {children}
  </BackgroundImage>
);

export const RegisterBackground = ({ children, className = '' }) => (
  <BackgroundImage 
    imagePath={cat1}
    overlay="rgba(0,0,0,0.3)"
    className={`min-h-screen ${className}`}
  >
    {children}
  </BackgroundImage>
);

export const HeroBackground = ({ children, className = '' }) => (
  <BackgroundImage 
    imagePath={pet1}
    overlay="rgba(0,0,0,0.2)"
    className={`min-h-screen ${className}`}
  >
    {children}
  </BackgroundImage>
);

// Additional pet background components
export const DogBackground = ({ children, className = '' }) => (
  <BackgroundImage 
    imagePath={dog2}
    overlay="rgba(0,0,0,0.3)"
    className={`min-h-screen ${className}`}
  >
    {children}
  </BackgroundImage>
);

export const CatBackground = ({ children, className = '' }) => (
  <BackgroundImage 
    imagePath={cat2}
    overlay="rgba(0,0,0,0.3)"
    className={`min-h-screen ${className}`}
  >
    {children}
  </BackgroundImage>
);

export const PetBackground = ({ children, className = '' }) => (
  <BackgroundImage 
    imagePath={pet2}
    overlay="rgba(0,0,0,0.2)"
    className={`min-h-screen ${className}`}
  >
    {children}
  </BackgroundImage>
);
