import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

/**
 * Reusable Carousel Component
 * @param {Array} items - Array of carousel items
 * @param {number} autoPlayInterval - Auto play interval in milliseconds (default: 5000)
 * @param {boolean} showDots - Show navigation dots (default: true)
 * @param {boolean} showArrows - Show navigation arrows (default: true)
 * @param {string} className - Additional CSS classes
 */
export default function Carousel({ 
  items, 
  autoPlayInterval = 5000, 
  showDots = true, 
  showArrows = true,
  className = '' 
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto play functionality
  useEffect(() => {
    if (!isAutoPlaying || items.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === items.length - 1 ? 0 : prevIndex + 1
      );
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [currentIndex, isAutoPlaying, autoPlayInterval, items.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    // Resume auto play after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? items.length - 1 : currentIndex - 1);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === items.length - 1 ? 0 : currentIndex + 1);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  if (!items || items.length === 0) {
    return <div className="h-96 bg-gray-200 flex items-center justify-center">No items to display</div>;
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Carousel Container */}
      <div 
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {items.map((item, index) => (
          <div key={index} className="w-full flex-shrink-0">
            {item}
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {showArrows && items.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-800 p-2 rounded-full shadow-lg transition-all duration-300 z-10"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-800 p-2 rounded-full shadow-lg transition-all duration-300 z-10"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Navigation Dots */}
      {showDots && items.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-white' 
                  : 'bg-white bg-opacity-50 hover:bg-opacity-75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Progress Bar */}
      {isAutoPlaying && items.length > 1 && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-white bg-opacity-20">
          <div 
            className="h-full bg-white transition-all duration-100 ease-linear"
            style={{ 
              width: `${((currentIndex + 1) / items.length) * 100}%` 
            }}
          />
        </div>
      )}
    </div>
  );
}

// Predefined carousel components for common use cases
export const HeroCarousel = ({ items, className = '' }) => (
  <Carousel 
    items={items}
    autoPlayInterval={6000}
    showDots={true}
    showArrows={true}
    className={`min-h-screen ${className}`}
  />
);

export const ImageCarousel = ({ images, className = '' }) => {
  const imageItems = images.map((image, index) => (
    <div key={index} className="w-full h-full">
      <LazyLoadImage 
        src={image.src} 
        alt={image.alt || `Carousel image ${index + 1}`}
        className="w-full h-full object-cover"
        effect="blur"
        placeholderSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3C/svg%3E"
      />
    </div>
  ));

  return (
    <Carousel 
      items={imageItems}
      autoPlayInterval={5000}
      showDots={true}
      showArrows={true}
      className={className}
    />
  );
};
