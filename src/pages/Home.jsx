import React from 'react';
import { motion } from 'framer-motion';
import HeroCarousel from '../components/common/HeroCarousel';
import WhyChooseSection from '../components/sections/WhyChooseSection';
import HowItWorksSection from '../components/sections/HowItWorksSection';
import TestimonialsSection from '../components/sections/TestimonialsSection';
import CTASection from '../components/sections/CTASection';
import PartnersSection from '../components/sections/PartnersSection';
import Footer from '../components/sections/Footer';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Carousel */}
      <HeroCarousel 
        autoPlay={true}
        interval={6000}
        showControls={true}
        showDots={true}
      />
      
      <motion.div 
        className="bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Why Choose Section */}
        <WhyChooseSection />
        
        {/* How It Works Section */}
        <HowItWorksSection />
        
        {/* Testimonials Section */}
        <TestimonialsSection />
        
        {/* CTA Section */}
        <CTASection />
        
        {/* Partners Section */}
        <PartnersSection />
        
        {/* Footer */}
        <Footer />
      </motion.div>
    </div>
  );
}