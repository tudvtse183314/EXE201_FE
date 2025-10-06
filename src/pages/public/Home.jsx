import React from 'react';
import MainLayout from '../../components/layout/MainLayout';
import HeroSection from '../../components/sections/HeroSection';
import FeaturesSection from '../../components/sections/FeaturesSection';
import StepsSection from '../../components/sections/StepsSection';
import TestimonialsSection from '../../components/sections/TestimonialsSection';
import CTASection from '../../components/sections/CTASection';
import TrustSection from '../../components/sections/TrustSection';
import NewsletterSection from '../../components/sections/NewsletterSection';
import { 
  featuresData, 
  stepsData, 
  testimonialsData 
} from '../../data/landingPageData';

export default function PawfectMatch() {
  const handleGetStarted = () => {
    alert('Get Started clicked!');
  };

  const handleLearnMore = () => {
    alert('Learn More clicked!');
  };

  const handleGetRecommendations = () => {
    alert('Get Personalized Recommendations clicked!');
  };

  const handleSubscribe = (email) => {
    alert(`Thank you for subscribing! We'll send updates to ${email}`);
  };

  return (
    <MainLayout>
      <HeroSection 
        onPrimaryClick={handleGetStarted}
        onSecondaryClick={handleLearnMore}
      />
      
      <FeaturesSection 
        features={featuresData}
      />
      
      <StepsSection 
        steps={stepsData}
      />
      
      <TestimonialsSection 
        testimonials={testimonialsData}
      />
      
      <CTASection 
        onButtonClick={handleGetRecommendations}
      />
      
      <TrustSection />
      
      <NewsletterSection 
        onSubscribe={handleSubscribe}
      />
    </MainLayout>
  );
}
