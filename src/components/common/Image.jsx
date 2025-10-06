import React, { useState } from 'react';
import { getImage, defaultImage } from '../../assets/images';

/**
 * Reusable Image Component with loading states and error handling
 * @param {string} src - Image source URL
 * @param {string} alt - Alt text for accessibility
 * @param {string} className - CSS classes
 * @param {object} style - Inline styles
 * @param {string} fallback - Fallback image URL
 * @param {boolean} lazy - Enable lazy loading
 * @param {string} loading - Loading placeholder text
 */
export default function Image({ 
  src, 
  alt = '', 
  className = '', 
  style = {},
  fallback = defaultImage,
  lazy = true,
  loading = 'Loading...',
  ...props 
}) {
  const [imageSrc, setImageSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImageSrc(fallback);
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className={`relative ${className}`} style={style}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 animate-pulse">
          <span className="text-gray-500 text-sm">{loading}</span>
        </div>
      )}
      
      <img
        src={getImage(imageSrc, fallback)}
        alt={alt}
        className={`w-full h-full object-cover ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onLoad={handleLoad}
        onError={handleError}
        loading={lazy ? 'lazy' : 'eager'}
        {...props}
      />
    </div>
  );
}

// Predefined image components for common use cases
export const Avatar = ({ src, alt, size = 'md', className = '', ...props }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  return (
    <Image
      src={src}
      alt={alt}
      className={`${sizeClasses[size]} rounded-full ${className}`}
      fallback="https://via.placeholder.com/100x100/f3f4f6/9ca3af?text=?"
      {...props}
    />
  );
};

export const ProductImage = ({ src, alt, className = '', ...props }) => (
  <Image
    src={src}
    alt={alt}
    className={`aspect-square ${className}`}
    fallback="https://via.placeholder.com/300x300/f3f4f6/9ca3af?text=Product"
    {...props}
  />
);

export const BannerImage = ({ src, alt, className = '', ...props }) => (
  <Image
    src={src}
    alt={alt}
    className={`aspect-video ${className}`}
    fallback="https://via.placeholder.com/800x400/f3f4f6/9ca3af?text=Banner"
    {...props}
  />
);

export const PetImage = ({ src, alt, className = '', ...props }) => (
  <Image
    src={src}
    alt={alt}
    className={`aspect-square rounded-lg ${className}`}
    fallback="https://via.placeholder.com/300x300/f3f4f6/9ca3af?text=Pet"
    {...props}
  />
);
