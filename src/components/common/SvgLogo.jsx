import React, { useState } from 'react';
import logo from '../../assets/images/LOGO_PETVIBE.jpg';

const SvgLogo = ({ 
  size = 'medium', 
  className = '', 
  onClick = null,
  variant = 'default' // 'default', 'white', 'dark'
}) => {
  const [imageError, setImageError] = useState(false);
  
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16',
    xlarge: 'w-20 h-20'
  };

  const variantClasses = {
    default: 'border-2 border-gray-200 shadow-md',
    white: 'border-2 border-white shadow-lg',
    dark: 'border-2 border-gray-800 shadow-lg'
  };

  const colorClasses = {
    default: 'text-blue-600',
    white: 'text-white',
    dark: 'text-gray-800'
  };

  // Try different logo sources
  const logoSources = [
    require('../../assets/images/LOGO_PETVIBE.jpg').default,
    '/src/assets/images/LOGO_PETVIBE.jpg',
    './src/assets/images/LOGO_PETVIBE.jpg',
    '/logo192.png',
    '/logo512.png'
  ];

  const [currentSourceIndex, setCurrentSourceIndex] = useState(0);
  const logoSource = logoSources[currentSourceIndex];

  const handleImageError = () => {
    console.log('Logo image failed to load:', logoSource);
    if (currentSourceIndex < logoSources.length - 1) {
      setCurrentSourceIndex(currentSourceIndex + 1);
    } else {
      setImageError(true);
    }
  };

  const handleImageLoad = () => {
    console.log('Logo loaded successfully:', logoSource);
  };

  // SVG Logo as fallback
  const SvgLogoIcon = () => (
    <svg 
      className={`w-full h-full ${colorClasses[variant]}`}
      viewBox="0 0 24 24" 
      fill="currentColor"
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
      <circle cx="8" cy="8" r="2" fill="currentColor"/>
      <circle cx="16" cy="8" r="2" fill="currentColor"/>
      <path d="M12 14c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" fill="currentColor"/>
    </svg>
  );

  // If all images fail, show SVG logo
  if (imageError) {
    return (
      <div 
        className={`
          ${sizeClasses[size]} 
          ${variantClasses[variant]}
          rounded-full 
          cursor-pointer 
          transition-all 
          duration-300 
          hover:scale-105 
          hover:shadow-xl
          flex items-center justify-center
          bg-gradient-to-br from-blue-500 to-purple-600
          ${className}
        `}
        onClick={onClick}
      >
        <SvgLogoIcon />
      </div>
    );
  }

  return (
    <div 
      className={`
        ${sizeClasses[size]} 
        ${variantClasses[variant]}
        rounded-full 
        overflow-hidden 
        cursor-pointer 
        transition-all 
        duration-300 
        hover:scale-105 
        hover:shadow-xl
        ${className}
      `}
      onClick={onClick}
    >
      <img 
        src={logoSource} 
        alt="PetVibe Logo" 
        className="w-full h-full object-cover"
        onError={handleImageError}
        onLoad={handleImageLoad}
      />
    </div>
  );
};

export default SvgLogo;
