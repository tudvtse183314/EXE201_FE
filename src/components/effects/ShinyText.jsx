import React from 'react';

/**
 * ShinyText Component - Creates a shiny, animated text effect
 * Perfect for attention-grabbing text like discounts, hot deals, AI features
 */
const ShinyText = ({ 
  text, 
  disabled = false, 
  speed = 3, 
  className = '',
  size = 'text-2xl',
  weight = 'font-bold'
}) => {
  const animationDuration = `${speed}s`;
  
  return (
    <span 
      className={`
        relative inline-block overflow-hidden
        ${size} ${weight}
        ${disabled ? 'text-gray-500' : 'text-gray-900'}
        ${className}
      `}
      style={{
        background: disabled 
          ? 'linear-gradient(90deg, #6b7280, #6b7280, #6b7280)' 
          : 'linear-gradient(90deg, #1f2937, #fbbf24, #f59e0b, #1f2937)',
        backgroundSize: '200% 100%',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        animation: disabled ? 'none' : `shiny ${animationDuration} ease-in-out infinite`
      }}
    >
      {text}
      <style jsx>{`
        @keyframes shiny {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
    </span>
  );
};

export default ShinyText;
