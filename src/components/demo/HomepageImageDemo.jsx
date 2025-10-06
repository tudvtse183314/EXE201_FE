import React from 'react';
import { banners, pets, products } from '../assets/images';
import Image from '../components/common/Image';

/**
 * Demo component showing the new Homepage with featured images
 * Highlights the key sections and image usage
 */
export default function HomepageImageDemo() {
  return (
    <div className="p-8 space-y-12">
      <h1 className="text-4xl font-bold text-center mb-8">🏠 Homepage Image Showcase</h1>
      
      {/* Hero Section Demo */}
      <section className="space-y-4">
        <h2 className="text-3xl font-semibold">Hero Section</h2>
        <div className="relative h-96 rounded-2xl overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${banners.hero})` }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          </div>
          
          <div className="relative z-10 text-center text-white px-4 flex items-center justify-center h-full">
            <div>
              <h1 className="text-4xl font-bold mb-4 drop-shadow-lg">
                Find Your Pet's Perfect Match
              </h1>
              <p className="text-lg drop-shadow-md mb-6">
                Discover personalized accessories and products
              </p>
              <div className="flex gap-4 justify-center">
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
                  Get Started
                </button>
                <button className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-6 py-3 rounded-xl font-semibold transition-colors backdrop-blur-sm">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services Demo */}
      <section className="space-y-4">
        <h2 className="text-3xl font-semibold">Featured Services</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {/* Pet Matching */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="h-48 relative">
              <Image 
                src={pets.dog1}
                alt="Pet Matching Service"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-xl font-bold">Pet Matching</h3>
                <p className="text-sm opacity-90">Find the perfect companion</p>
              </div>
            </div>
            <div className="p-4">
              <p className="text-gray-600 text-sm">
                AI-powered matching system for perfect pet companionship.
              </p>
            </div>
          </div>

          {/* Pet Accessories */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="h-48 relative">
              <Image 
                src={products.collar}
                alt="Pet Accessories"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-xl font-bold">Pet Accessories</h3>
                <p className="text-sm opacity-90">Stylish & functional</p>
              </div>
            </div>
            <div className="p-4">
              <p className="text-gray-600 text-sm">
                Curated collection of high-quality accessories.
              </p>
            </div>
          </div>

          {/* Pet Care */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="h-48 relative">
              <Image 
                src={pets.cat1}
                alt="Pet Care Services"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-xl font-bold">Pet Care</h3>
                <p className="text-sm opacity-90">Health & wellness</p>
              </div>
            </div>
            <div className="p-4">
              <p className="text-gray-600 text-sm">
                Comprehensive care services for your pet's health.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Demo */}
      <section className="space-y-4">
        <h2 className="text-3xl font-semibold">Customer Testimonials</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
                <Image 
                  src="https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                  alt="Sarah Johnson"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Sarah Johnson</h4>
                <p className="text-gray-600 text-sm">Dog Owner</p>
              </div>
            </div>
            <p className="text-gray-600 italic text-sm">
              "Pawfect Match helped me find the perfect companion for my lifestyle!"
            </p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
                <Image 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                  alt="Mike Chen"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Mike Chen</h4>
                <p className="text-gray-600 text-sm">Cat Owner</p>
              </div>
            </div>
            <p className="text-gray-600 italic text-sm">
              "Amazing service! The AI matching was spot-on and incredibly helpful."
            </p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
                <Image 
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                  alt="Emily Davis"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Emily Davis</h4>
                <p className="text-gray-600 text-sm">Pet Parent</p>
              </div>
            </div>
            <p className="text-gray-600 italic text-sm">
              "The whole experience was seamless and enjoyable!"
            </p>
          </div>
        </div>
      </section>

      {/* Image Sources */}
      <section className="space-y-4">
        <h2 className="text-3xl font-semibold">Image Sources Used</h2>
        <div className="bg-gray-100 p-6 rounded-lg">
          <h3 className="text-lg font-medium mb-4">Centralized Image Management:</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Hero Background:</h4>
              <code className="bg-white p-2 rounded block">{`banners.hero`}</code>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Pet Images:</h4>
              <code className="bg-white p-2 rounded block">{`pets.dog1, pets.cat1`}</code>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Product Images:</h4>
              <code className="bg-white p-2 rounded block">{`products.collar`}</code>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Customer Photos:</h4>
              <code className="bg-white p-2 rounded block">Unsplash professional photos</code>
            </div>
          </div>
        </div>
      </section>

      {/* Code Example */}
      <section className="space-y-4">
        <h2 className="text-3xl font-semibold">Code Example</h2>
        <div className="bg-gray-100 p-6 rounded-lg">
          <pre className="text-sm bg-white p-4 rounded border overflow-x-auto">
{`// Import images from centralized system
import { banners, pets, products } from '../assets/images';
import Image from '../components/common/Image';

// Hero section with background
<section className="relative min-h-screen">
  <div 
    className="absolute inset-0 bg-cover bg-center"
    style={{ backgroundImage: \`url(\${banners.hero})\` }}
  >
    <div className="absolute inset-0 bg-black bg-opacity-40"></div>
  </div>
  <div className="relative z-10 text-center text-white">
    <h1>Find Your Pet's Perfect Match</h1>
  </div>
</section>

// Service cards with images
<div className="grid md:grid-cols-3 gap-8">
  <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
    <div className="h-64 relative">
      <Image 
        src={pets.dog1}
        alt="Pet Matching Service"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
      <div className="absolute bottom-4 left-4 text-white">
        <h3>Pet Matching</h3>
      </div>
    </div>
  </div>
</div>`}
          </pre>
        </div>
      </section>
    </div>
  );
}
