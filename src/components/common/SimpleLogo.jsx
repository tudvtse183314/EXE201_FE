import React, { useState } from 'react';

const SimpleLogo = ({ 
  size = 'medium', 
  className = '', 
  onClick = null,
  variant = 'default' // 'default', 'white', 'dark'
}) => {
  const [imageError, setImageError] = useState(false);
  
  const sizeClasses = {
    small: 'w-8 h-8 text-xs',
    medium: 'w-12 h-12 text-sm',
    large: 'w-16 h-16 text-base',
    xlarge: 'w-20 h-20 text-lg'
  };

  const variantClasses = {
    default: 'border-2 border-gray-200 shadow-md bg-gradient-to-br from-blue-500 to-purple-600 text-white',
    white: 'border-2 border-white shadow-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white',
    dark: 'border-2 border-gray-800 shadow-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white'
  };

  // Try different logo sources
  const logoSources = [
    '/src/assets/images/LOGO_PETVIBE.jpg',
    './src/assets/images/LOGO_PETVIBE.jpg',
    require('../../assets/images/LOGO_PETVIBE.jpg').default,
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

  // If all images fail, show text logo
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
          font-bold
          ${className}
        `}
        onClick={onClick}
      >
        <span>PV</span>
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

export default SimpleLogo;
