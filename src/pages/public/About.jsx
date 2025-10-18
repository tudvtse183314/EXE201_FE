import React from 'react';
import { motion } from 'framer-motion';
import { dog3, dog4, cat3, cat4, pet3, pet4 } from '../../assets/images';

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-50 to-purple-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            className="text-4xl font-bold text-gray-900 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            About Pawfect Match
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            We're passionate about helping pet owners find the perfect products for their beloved companions.
          </motion.p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6">
                At Pawfect Match, we believe every pet deserves the best. Our AI-powered platform 
                helps you discover products that perfectly match your pet's unique personality, 
                needs, and preferences.
              </p>
              <p className="text-lg text-gray-600">
                From toys and accessories to food and healthcare products, we make it easy to 
                find exactly what your furry friend needs to live their happiest, healthiest life.
              </p>
            </div>
            <div className="relative">
              <img 
                src={dog3} 
                alt="Happy dog" 
                className="w-full h-80 object-cover rounded-2xl shadow-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-lg text-gray-600">
              Pet lovers, tech enthusiasts, and product experts working together for your pets.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="relative mb-4">
                <img 
                  src={cat3} 
                  alt="Tech team" 
                  className="w-32 h-32 object-cover rounded-full mx-auto shadow-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-600/80 to-transparent rounded-full flex items-end justify-center pb-4">
                  <span className="text-2xl text-white">👨‍💻</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Tech Team</h3>
              <p className="text-gray-600">
                Building the AI technology that powers our matching algorithm.
              </p>
            </div>
            
            <div className="text-center">
              <div className="relative mb-4">
                <img 
                  src={dog4} 
                  alt="Pet experts" 
                  className="w-32 h-32 object-cover rounded-full mx-auto shadow-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-600/80 to-transparent rounded-full flex items-end justify-center pb-4">
                  <span className="text-2xl text-white">🐕</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Pet Experts</h3>
              <p className="text-gray-600">
                Veterinarians and pet care specialists ensuring product quality.
              </p>
            </div>
            
            <div className="text-center">
              <div className="relative mb-4">
                <img 
                  src={cat4} 
                  alt="Product team" 
                  className="w-32 h-32 object-cover rounded-full mx-auto shadow-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-green-600/80 to-transparent rounded-full flex items-end justify-center pb-4">
                  <span className="text-2xl text-white">🛍️</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Product Team</h3>
              <p className="text-gray-600">
                Curating the best products from trusted brands worldwide.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pet Gallery Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Pet Community</h2>
            <p className="text-lg text-gray-600">
              Meet some of the amazing pets that inspire our product recommendations.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="relative group">
              <img 
                src={pet3} 
                alt="Happy pet" 
                className="w-full h-64 object-cover rounded-xl shadow-lg group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-xl flex items-end p-4">
                <span className="text-white font-semibold">Luna</span>
              </div>
            </div>
            
            <div className="relative group">
              <img 
                src={pet4} 
                alt="Happy pet" 
                className="w-full h-64 object-cover rounded-xl shadow-lg group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-xl flex items-end p-4">
                <span className="text-white font-semibold">Max</span>
              </div>
            </div>
            
            <div className="relative group">
              <img 
                src={dog3} 
                alt="Happy pet" 
                className="w-full h-64 object-cover rounded-xl shadow-lg group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-xl flex items-end p-4">
                <span className="text-white font-semibold">Bella</span>
              </div>
            </div>
            
            <div className="relative group">
              <img 
                src={cat3} 
                alt="Happy pet" 
                className="w-full h-64 object-cover rounded-xl shadow-lg group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-xl flex items-end p-4">
                <span className="text-white font-semibold">Whiskers</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
