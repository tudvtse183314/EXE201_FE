import React from 'react';
import MainLayout from '../../components/layout/MainLayout';
import HeroSection from '../../components/sections/HeroSection';
import ServicesGridSection from '../../components/sections/ServicesGridSection';
import CTASection from '../../components/sections/CTASection';
import { servicesData } from '../../data/pagesData';

export default function Services() {
  const handleGetStarted = () => {
    alert('Get Started with our services!');
  };

  return (
    <MainLayout>
      <HeroSection 
        title={servicesData.hero.title}
        subtitle={servicesData.hero.subtitle}
        emoji={servicesData.hero.emoji}
        className="bg-gradient-to-br from-green-600 to-blue-600 text-white"
      />
      
      <ServicesGridSection services={servicesData.services} />
      
      <CTASection 
        title="Ready to Get Started?"
        subtitle="Choose the perfect service for your pet and join thousands of happy pet owners."
        buttonText="Get Started Today"
        onButtonClick={handleGetStarted}
        className="bg-gradient-to-r from-green-500 to-blue-500"
      />
    </MainLayout>
  );
}
