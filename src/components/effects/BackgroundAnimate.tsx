import React from 'react';
import { GradientType, AnimationType } from './animationsConfig';

interface BackgroundAnimateProps {
  children: React.ReactNode;
  gradient?: GradientType;
  animation?: AnimationType;
  className?: string;
  overlay?: boolean;
  overlayOpacity?: number;
}

/**
 * BackgroundAnimate - Animated background section component
 * Provides animated gradient backgrounds for page sections
 */
export default function BackgroundAnimate({
  children,
  gradient = "default",
  animation = "pulse",
  className = "",
  overlay = true,
  overlayOpacity = 0.1,
}: BackgroundAnimateProps) {
  
  // Gradient configurations
  const gradientClasses = {
    sunrise: "bg-gradient-to-br from-orange-400 via-pink-500 to-red-500",
    ocean: "bg-gradient-to-br from-blue-400 via-cyan-500 to-teal-500",
    candy: "bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-500",
    forest: "bg-gradient-to-br from-green-400 via-emerald-500 to-teal-500",
    sunset: "bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500",
    default: "bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600",
    nebula: "bg-gradient-to-br from-purple-400 via-pink-500 to-blue-500",
  };

  // Animation configurations
  const animationClasses = {
    spin: "animate-spin",
    pulse: "animate-pulse",
    "spin-slow": "animate-spin",
    "spin-fast": "animate-spin",
  };

  // Custom animation durations
  const animationDuration = {
    "spin-slow": "duration-3000",
    "spin-fast": "duration-500",
    spin: "duration-1000",
    pulse: "duration-1000",
  };

  const baseClasses = `
    relative overflow-hidden
    ${gradientClasses[gradient]}
    ${animationClasses[animation]}
    ${animationDuration[animation]}
    ${className}
  `.trim();

  return (
    <div className={baseClasses}>
      {/* Animated background */}
      <div className="absolute inset-0" />
      
      {/* Overlay */}
      {overlay && (
        <div 
          className="absolute inset-0 bg-white transition-opacity duration-300"
          style={{ opacity: overlayOpacity }}
        />
      )}
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

// Pre-configured background variants
export const HeroBackground = ({ children, ...props }: Omit<BackgroundAnimateProps, 'gradient' | 'animation'>) => (
  <BackgroundAnimate gradient="nebula" animation="spin-slow" {...props}>
    {children}
  </BackgroundAnimate>
);

export const NaturalBackground = ({ children, ...props }: Omit<BackgroundAnimateProps, 'gradient' | 'animation'>) => (
  <BackgroundAnimate gradient="forest" animation="spin-slow" {...props}>
    {children}
  </BackgroundAnimate>
);

export const SoftBackground = ({ children, ...props }: Omit<BackgroundAnimateProps, 'gradient' | 'animation'>) => (
  <BackgroundAnimate gradient="candy" animation="pulse" {...props}>
    {children}
  </BackgroundAnimate>
);

export const OceanBackground = ({ children, ...props }: Omit<BackgroundAnimateProps, 'gradient' | 'animation'>) => (
  <BackgroundAnimate gradient="ocean" animation="spin-slow" {...props}>
    {children}
  </BackgroundAnimate>
);

export const SunsetBackground = ({ children, ...props }: Omit<BackgroundAnimateProps, 'gradient' | 'animation'>) => (
  <BackgroundAnimate gradient="sunset" animation="pulse" {...props}>
    {children}
  </BackgroundAnimate>
);
