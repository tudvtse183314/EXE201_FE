import React from 'react';
import { motion } from 'framer-motion';
import { dog5, dog6, cat5, cat6, pet5, pet6 } from '../../assets/images';

export default function Services() {
  const services = [
    {
      icon: '🤖',
      title: 'AI Product Matching',
      description: 'Our advanced AI analyzes your pet\'s breed, age, size, and personality to recommend the perfect products.',
      features: ['Breed-specific recommendations', 'Age-appropriate suggestions', 'Personality-based matching']
    },
    {
      icon: '🛍️',
      title: 'Curated Product Catalog',
      description: 'Hand-picked products from trusted brands, tested and approved by our pet experts.',
      features: ['Quality assurance', 'Expert reviews', 'Brand partnerships']
    },
    {
      icon: '📱',
      title: 'Mobile App',
      description: 'Access your pet\'s profile and get recommendations on the go with our user-friendly mobile app.',
      features: ['Profile management', 'Quick recommendations', 'Order tracking']
    },
    {
      icon: '💬',
      title: 'Expert Support',
      description: 'Get personalized advice from our team of veterinarians and pet care specialists.',
      features: ['24/7 chat support', 'Expert consultations', 'Health advice']
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={dog5} 
            alt="Happy dog" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/70 to-purple-900/70"></div>
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            className="text-4xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Our Services
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-200 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Comprehensive pet care solutions powered by AI and backed by expert knowledge.
          </motion.p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-3xl">{service.icon}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{service.title}</h3>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    <ul className="space-y-2">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                          <span className="w-2 h-2 bg-indigo-600 rounded-full mr-3"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-lg text-gray-600">
              Get started in just a few simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="relative mb-4">
                <img 
                  src={cat5} 
                  alt="Create profile" 
                  className="w-32 h-32 object-cover rounded-full mx-auto shadow-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-600/80 to-transparent rounded-full flex items-end justify-center pb-4">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Create Pet Profile</h3>
              <p className="text-gray-600">
                Tell us about your pet's breed, age, size, and personality traits.
              </p>
            </div>
            
            <div className="text-center">
              <div className="relative mb-4">
                <img 
                  src={dog6} 
                  alt="AI recommendations" 
                  className="w-32 h-32 object-cover rounded-full mx-auto shadow-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-600/80 to-transparent rounded-full flex items-end justify-center pb-4">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Get AI Recommendations</h3>
              <p className="text-gray-600">
                Our AI analyzes your pet's profile and suggests the perfect products.
              </p>
            </div>
            
            <div className="text-center">
              <div className="relative mb-4">
                <img 
                  src={cat6} 
                  alt="Shop and enjoy" 
                  className="w-32 h-32 object-cover rounded-full mx-auto shadow-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-600/80 to-transparent rounded-full flex items-end justify-center pb-4">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Shop & Enjoy</h3>
              <p className="text-gray-600">
                Purchase recommended products and watch your pet enjoy their new favorites.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pet Success Stories */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Success Stories</h2>
            <p className="text-lg text-gray-600">
              See how our AI recommendations have helped pets and their owners.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="relative group">
              <img 
                src={pet5} 
                alt="Happy pet story" 
                className="w-full h-64 object-cover rounded-xl shadow-lg group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-xl flex items-end p-6">
                <div>
                  <h3 className="text-white font-semibold text-lg mb-2">Bella's New Toy</h3>
                  <p className="text-gray-200 text-sm">
                    "The AI recommended the perfect chew toy for Bella's teething phase. She loves it!"
                  </p>
                </div>
              </div>
            </div>
            
            <div className="relative group">
              <img 
                src={pet6} 
                alt="Happy pet story" 
                className="w-full h-64 object-cover rounded-xl shadow-lg group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-xl flex items-end p-6">
                <div>
                  <h3 className="text-white font-semibold text-lg mb-2">Max's Health Journey</h3>
                  <p className="text-gray-200 text-sm">
                    "The nutrition recommendations helped Max maintain a healthy weight and energy level."
                  </p>
                </div>
              </div>
            </div>
            
            <div className="relative group">
              <img 
                src={dog5} 
                alt="Happy pet story" 
                className="w-full h-64 object-cover rounded-xl shadow-lg group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-xl flex items-end p-6">
                <div>
                  <h3 className="text-white font-semibold text-lg mb-2">Luna's Comfort</h3>
                  <p className="text-gray-200 text-sm">
                    "The perfect bed recommendation made Luna's sleep so much better. Thank you!"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
