import React from 'react';

const TextLogo = ({ 
  size = 'medium', 
  className = '', 
  onClick = null,
  variant = 'default' // 'default', 'white', 'dark'
}) => {
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
};

export default TextLogo;
