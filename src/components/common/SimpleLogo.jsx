import React from 'react';
import { logo } from '../../assets/images';

const SimpleLogo = ({ 
  size = 'medium', 
  className = '', 
  onClick = null,
  variant = 'default' // 'default', 'white', 'dark'
}) => {
  const sizeClasses = {
    small: 'w-8 h-8 text-xs',      // 32px - Nhỏ
    medium: 'w-10 h-10 text-sm',   // 40px - Vừa phải cho header
    large: 'w-12 h-12 text-base',  // 48px - Lớn
    xlarge: 'w-14 h-14 text-lg'    // 56px - Rất lớn
  };

  const variantClasses = {
    default: 'border border-gray-200 shadow-sm',
    white: 'border border-white shadow-md',
    dark: 'border border-gray-800 shadow-md'
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
        src={logo} 
        alt="Pawfect Match Logo" 
        className="w-full h-full object-cover"
        onLoad={() => console.log('Simple Logo JPG loaded successfully:', logo)}
      />
    </div>
  );
};

export default SimpleLogo;
