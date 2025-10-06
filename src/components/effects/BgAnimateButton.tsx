import React from 'react';
import { GradientType, RadiusType, AnimationType } from './animationsConfig';

interface BgAnimateButtonProps {
  children: React.ReactNode;
  gradient?: GradientType;
  animation?: AnimationType;
  rounded?: RadiusType;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

/**
 * BgAnimateButton - Animated background button component
 * Provides various gradient backgrounds with animations
 */
export default function BgAnimateButton({
  children,
  gradient = "default",
  animation = "pulse",
  rounded = "xl",
  className = "",
  onClick,
  disabled = false,
  type = "button",
}: BgAnimateButtonProps) {
  
  // Gradient configurations
  const gradientClasses = {
    sunrise: "bg-gradient-to-r from-orange-400 via-pink-500 to-red-500",
    ocean: "bg-gradient-to-r from-blue-400 via-cyan-500 to-teal-500",
    candy: "bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-500",
    forest: "bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500",
    sunset: "bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500",
    default: "bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600",
    nebula: "bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500",
  };

  // Animation configurations
  const animationClasses = {
    spin: "animate-spin",
    pulse: "animate-pulse",
    "spin-slow": "animate-spin",
    "spin-fast": "animate-spin",
  };

  // Radius configurations
  const radiusClasses = {
    full: "rounded-full",
    xl: "rounded-xl",
    "2xl": "rounded-2xl",
    "3xl": "rounded-3xl",
    sm: "rounded-sm",
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
    ${radiusClasses[rounded]}
    ${animationDuration[animation]}
    transition-all duration-300
    hover:scale-105 hover:shadow-lg
    focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50
    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
    ${className}
  `.trim();

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={baseClasses}
    >
      {/* Animated background overlay */}
      <div className="absolute inset-0 bg-white bg-opacity-10 hover:bg-opacity-20 transition-all duration-300" />
      
      {/* Content */}
      <div className="relative z-10 px-6 py-3 text-white font-semibold">
        {children}
      </div>
    </button>
  );
}

// Pre-configured button variants
export const PrimaryButton = ({ children, ...props }: Omit<BgAnimateButtonProps, 'gradient' | 'animation' | 'rounded'>) => (
  <BgAnimateButton gradient="sunrise" animation="pulse" rounded="xl" {...props}>
    {children}
  </BgAnimateButton>
);

export const SecondaryButton = ({ children, ...props }: Omit<BgAnimateButtonProps, 'gradient' | 'animation' | 'rounded'>) => (
  <BgAnimateButton gradient="ocean" animation="spin-slow" rounded="xl" {...props}>
    {children}
  </BgAnimateButton>
);

export const CTAButton = ({ children, ...props }: Omit<BgAnimateButtonProps, 'gradient' | 'animation' | 'rounded'>) => (
  <BgAnimateButton gradient="sunset" animation="spin-fast" rounded="full" {...props}>
    {children}
  </BgAnimateButton>
);

export const SoftButton = ({ children, ...props }: Omit<BgAnimateButtonProps, 'gradient' | 'animation' | 'rounded'>) => (
  <BgAnimateButton gradient="candy" animation="pulse" rounded="xl" {...props}>
    {children}
  </BgAnimateButton>
);

export const SocialButton = ({ children, ...props }: Omit<BgAnimateButtonProps, 'gradient' | 'animation' | 'rounded'>) => (
  <BgAnimateButton gradient="default" animation="spin-slow" rounded="xl" {...props}>
    {children}
  </BgAnimateButton>
);
