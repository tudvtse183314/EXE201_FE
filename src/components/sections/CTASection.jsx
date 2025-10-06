import React from 'react';
import Button from '../common/Button';

export default function CTASection({ 
  title = "Ready to Find the Perfect Match for Your Pet?",
  subtitle = "Join thousands of happy pet owners who have found tailored products tailored to their furry friends.",
  buttonText = "Get Personalized Recommendations",
  onButtonClick,
  className = ''
}) {
  return (
    <section className={`py-20 px-4 bg-gradient-to-r from-pink-500 to-pink-600 ${className}`}>
      <div className="max-w-4xl mx-auto text-center text-white">
        <h2 className="text-4xl font-bold mb-4">
          {title}
        </h2>
        <p className="text-xl mb-8 opacity-90">
          {subtitle}
        </p>
        <Button variant="cta" size="lg" onClick={onButtonClick}>
          {buttonText}
        </Button>
      </div>
    </section>
  );
}
