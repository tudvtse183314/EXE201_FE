import React from 'react';
import Button from '../common/Button';

export default function HeroSection({ 
  title = "Discover Your Pet's Perfect Match",
  subtitle = "Our AI-driven pet recommendation system is tailored to your furry friend's unique needs",
  emoji = "🐕",
  primaryButtonText = "Get Started",
  secondaryButtonText = "Learn More →",
  onPrimaryClick,
  onSecondaryClick,
  className = ''
}) {
  return (
    <section className={`pt-32 pb-20 px-4 bg-gradient-to-br from-orange-50 to-pink-50 ${className}`}>
      <div className="max-w-7xl mx-auto text-center">
        <div className="mb-8 text-6xl">{emoji}</div>
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          {title}
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          {subtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={onPrimaryClick}>
            {primaryButtonText}
          </Button>
          <Button variant="secondary" onClick={onSecondaryClick}>
            {secondaryButtonText}
          </Button>
        </div>
      </div>
    </section>
  );
}
