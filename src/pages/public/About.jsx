import React from 'react';
import MainLayout from '../../components/layout/MainLayout';
import HeroSection from '../../components/sections/HeroSection';
import StatsSection from '../../components/sections/StatsSection';
import FeaturesSection from '../../components/sections/FeaturesSection';
import TeamSection from '../../components/sections/TeamSection';
import ContactInfoSection from '../../components/sections/ContactInfoSection';
import Card from '../../components/common/Card';
import { aboutData } from '../../data/pagesData';

export default function About() {
  return (
    <MainLayout>
      <HeroSection 
        title={aboutData.hero.title}
        subtitle={aboutData.hero.subtitle}
        emoji={aboutData.hero.emoji}
        className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white"
      />
      
      {/* Mission Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              {aboutData.mission.title}
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              {aboutData.mission.description}
            </p>
          </Card>
        </div>
      </section>
      
      <StatsSection stats={aboutData.stats} />
      
      <FeaturesSection 
        title="Our Values"
        features={aboutData.values}
        className="bg-gray-50"
      />
      
      <TeamSection teamMembers={aboutData.team} />
      
      <ContactInfoSection contactInfo={aboutData.contactInfo} />
    </MainLayout>
  );
}
