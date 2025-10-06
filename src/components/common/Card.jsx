import React from 'react';

export default function Card({ 
  children, 
  className = '', 
  hover = false,
  padding = 'default',
  ...props 
}) {
  const baseClasses = 'bg-white border border-gray-200 rounded-2xl shadow-sm';
  const hoverClasses = hover ? 'hover:shadow-lg transition-shadow' : '';
  
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    default: 'p-6',
    lg: 'p-8'
  };
  
  const classes = `${baseClasses} ${hoverClasses} ${paddingClasses[padding]} ${className}`;
  
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}
