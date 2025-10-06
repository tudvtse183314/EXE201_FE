import React from 'react';
import MainLayout from '../../components/layout/MainLayout';
import { pets, products, petGifs } from '../../assets/images';
import Image from '../../components/common/Image';
import { HeroCarousel } from '../../components/common/Carousel';

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

  // Carousel items with different pet GIFs and content
  const carouselItems = [
    // Slide 1: Dog Focus
    <div key="dog1" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img 
          src={petGifs.dog1} 
          alt="Happy Dog"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = petGifs.dog1Static;
          }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      </div>
      
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-lg">
          Dogs Love Unconditionally
        </h1>
        <p className="text-xl md:text-2xl mb-8 drop-shadow-md">
          Find your loyal companion who will be your best friend for life
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={handleGetStarted}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Find My Dog
          </button>
          <button 
            onClick={handleLearnMore}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 backdrop-blur-sm border border-white border-opacity-30"
          >
            Learn More
          </button>
        </div>
      </div>
    </div>,

    // Slide 2: Cat Focus
    <div key="cat1" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img 
          src={petGifs.cat1} 
          alt="Playful Cat"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = petGifs.cat1Static;
          }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      </div>
      
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-lg">
          Cats Bring Joy
        </h1>
        <p className="text-xl md:text-2xl mb-8 drop-shadow-md">
          Discover the perfect feline friend who will fill your home with purrs and playfulness
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={handleGetStarted}
            className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Find My Cat
          </button>
          <button 
            onClick={handleLearnMore}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 backdrop-blur-sm border border-white border-opacity-30"
          >
            Learn More
          </button>
        </div>
      </div>
    </div>,

    // Slide 3: Mixed Pets
    <div key="mixed" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img 
          src={petGifs.dog2} 
          alt="Happy Pets"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = petGifs.dog2Static;
          }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      </div>
      
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-lg">
          Find Your Perfect Match
        </h1>
        <p className="text-xl md:text-2xl mb-8 drop-shadow-md">
          Whether you prefer dogs, cats, or both - we'll help you find the perfect companion
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={handleGetStarted}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Get Started
          </button>
          <button 
            onClick={handleLearnMore}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 backdrop-blur-sm border border-white border-opacity-30"
          >
            Learn More
          </button>
        </div>
      </div>
    </div>
  ];

  return (
    <MainLayout>
      {/* Hero Carousel with Pet GIFs */}
      <HeroCarousel items={carouselItems} />

      {/* Featured Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Featured Services</h2>
            <p className="text-xl text-gray-600">Everything your pet needs, delivered with love</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Pet Matching */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
              <div className="h-64 relative">
                <Image 
                  src={pets.dog1}
                  alt="Pet Matching Service"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-2xl font-bold">Pet Matching</h3>
                  <p className="text-sm opacity-90">Find the perfect companion</p>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">
                  Our AI-powered matching system helps you find the perfect pet based on your lifestyle and preferences.
                </p>
                <button className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors">
                  Learn More →
                </button>
              </div>
            </div>

            {/* Pet Accessories */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
              <div className="h-64 relative">
                <Image 
                  src={products.collar}
                  alt="Pet Accessories"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-2xl font-bold">Pet Accessories</h3>
                  <p className="text-sm opacity-90">Stylish & functional</p>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">
                  Discover our curated collection of high-quality accessories designed for comfort and style.
                </p>
                <button className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors">
                  Shop Now →
                </button>
              </div>
            </div>

            {/* Pet Care */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
              <div className="h-64 relative">
                <Image 
                  src={pets.cat1}
                  alt="Pet Care Services"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-2xl font-bold">Pet Care</h3>
                  <p className="text-sm opacity-90">Health & wellness</p>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">
                  Comprehensive care services to keep your pet healthy, happy, and thriving.
                </p>
                <button className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors">
                  Book Service →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Simple steps to find your perfect pet match</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">1️⃣</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Tell Us About Yourself</h3>
              <p className="text-gray-600">
                Share your lifestyle, living situation, and preferences to help us understand what you're looking for.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">2️⃣</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Get Matched</h3>
              <p className="text-gray-600">
                Our AI analyzes your preferences and matches you with compatible pets in your area.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">3️⃣</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Meet & Adopt</h3>
              <p className="text-gray-600">
                Connect with your matched pets and start your journey together with our support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Happy Pet Parents</h2>
            <p className="text-xl text-gray-600">See what our community has to say</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
                  <Image 
                    src="https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                    alt="Sarah Johnson"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Sarah Johnson</h4>
                  <p className="text-gray-600">Dog Owner</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "Pawfect Match helped me find the perfect companion for my lifestyle. The matching process was so accurate!"
              </p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
                  <Image 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                    alt="Mike Chen"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Mike Chen</h4>
                  <p className="text-gray-600">Cat Owner</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "Amazing service! The AI matching was spot-on and the support team was incredibly helpful throughout the process."
              </p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
                  <Image 
                    src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                    alt="Emily Davis"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Emily Davis</h4>
                  <p className="text-gray-600">Pet Parent</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "I found my perfect match through Pawfect Match. The whole experience was seamless and enjoyable!"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-indigo-600">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Find Your Perfect Pet Match?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Join thousands of happy pet parents who found their perfect companion through our platform.
          </p>
          <button 
            onClick={handleGetRecommendations}
            className="bg-white text-indigo-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Get Personalized Recommendations
          </button>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold text-white mb-6">
            Stay Updated
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Get the latest pet care tips, adoption stories, and exclusive offers delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button 
              onClick={() => handleSubscribe('user@example.com')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
