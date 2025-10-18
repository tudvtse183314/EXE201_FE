import React from 'react';

/**
 * GradientText Component - Creates animated gradient text effects
 * Perfect for hot deals, discounts, and attention-grabbing text
 */
const GradientText = ({ 
  children, 
  colors = ["#ef4444", "#f59e0b", "#f97316", "#ef4444", "#f59e0b"], // Red-Orange-Yellow gradient
  animationSpeed = 3,
  showBorder = false,
  className = '',
  size = 'text-2xl',
  weight = 'font-bold'
}) => {
  const animationDuration = `${animationSpeed}s`;
  const gradientString = colors.join(', ');
  
  return (
    <span 
      className={`
        relative inline-block
        ${size} ${weight}
        ${showBorder ? 'border-2 border-transparent bg-clip-border' : ''}
        ${className}
      `}
      style={{
        background: `linear-gradient(45deg, ${gradientString})`,
        backgroundSize: '300% 300%',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        animation: `gradientShift ${animationDuration} ease-in-out infinite`
      }}
    >
      {children}
      <style jsx>{`
        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </span>
  );
};

// Predefined gradient presets for common use cases
export const HotGradient = ({ children, ...props }) => (
  <GradientText 
    colors={["#ef4444", "#f59e0b", "#f97316", "#ef4444", "#f59e0b"]} // Red-Orange-Yellow
    {...props}
  >
    {children}
  </GradientText>
);

export const DiscountGradient = ({ children, ...props }) => (
  <GradientText 
    colors={["#dc2626", "#f59e0b", "#fbbf24", "#dc2626", "#f59e0b"]} // Red-Yellow-Gold
    {...props}
  >
    {children}
  </GradientText>
);

export const AIGradient = ({ children, ...props }) => (
  <GradientText 
    colors={["#3b82f6", "#8b5cf6", "#ec4899", "#3b82f6", "#8b5cf6"]} // Blue-Purple-Pink
    {...props}
  >
    {children}
  </GradientText>
);

export const PremiumGradient = ({ children, ...props }) => (
  <GradientText 
    colors={["#fbbf24", "#f59e0b", "#d97706", "#fbbf24", "#f59e0b"]} // Gold-Orange
    {...props}
  >
    {children}
  </GradientText>
);

export const SaleGradient = ({ children, ...props }) => (
  <GradientText 
    colors={["#ef4444", "#dc2626", "#b91c1c", "#ef4444", "#dc2626"]} // Red variations
    {...props}
  >
    {children}
  </GradientText>
);

export default GradientText;
