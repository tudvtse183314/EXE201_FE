import React, { useState } from 'react';
import { logos } from '../../assets/images';

const Logo = ({ 
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

  // Try to get logo source, fallback to default if error
  const logoSource = !imageError ? logos.petvibe : logos.main;

  const handleImageError = () => {
    console.log('Logo image failed to load, using fallback');
    setImageError(true);
  };

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
        onLoad={() => console.log('Logo loaded successfully:', logoSource)}
      />
    </div>
  );
};

export default Logo;
