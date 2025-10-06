import React from 'react';
import MainLayout from '../../components/layout/MainLayout';
import HeroSection from '../../components/sections/HeroSection';
import ContactInfoSection from '../../components/sections/ContactInfoSection';
import ContactFormSection from '../../components/sections/ContactFormSection';
import { contactData } from '../../data/pagesData';

export default function Contact() {
  return (
    <MainLayout>
      <HeroSection 
        title={contactData.hero.title}
        subtitle={contactData.hero.subtitle}
        emoji={contactData.hero.emoji}
        className="bg-gradient-to-br from-blue-600 to-purple-600 text-white"
      />
      
      <ContactInfoSection 
        title="Contact Information"
        contactInfo={contactData.contactInfo}
      />
      
      <ContactInfoSection 
        title="Office Hours & Support"
        contactInfo={contactData.officeHours}
        className="bg-gray-50"
      />
      
      <ContactFormSection />
    </MainLayout>
  );
}
