import React from 'react';
import { motion } from 'framer-motion';
import HeroSection from '../sections/HeroSection';
import WhyChooseSection from '../sections/WhyChooseSection';
import HowItWorksSection from '../sections/HowItWorksSection';
import TestimonialsSection from '../sections/TestimonialsSection';
import CTASection from '../sections/CTASection';
import PartnersSection from '../sections/PartnersSection';
import Footer from '../sections/Footer';

const HomePage = () => {
  return (
    <motion.div 
      className="min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Hero Section */}
      <HeroSection />
      
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
  );
};

export default HomePage;
