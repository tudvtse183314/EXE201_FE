import React from 'react';
import { useNavigate } from 'react-router-dom';
import { pets, products, petGifs } from '../../assets/images';
import Image from '../../components/common/Image';
import { HeroCarousel } from '../../components/common/Carousel';
import UserHeader from '../../components/layout/UserHeader';
import { useAuth } from '../../context/AuthContext';

export default function UserHome() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGetStarted = () => {
    navigate('/dashboard');
  };

  const handleLearnMore = () => {
    navigate('/services');
  };

  const handleGetRecommendations = () => {
    navigate('/ai-analysis');
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
            e.target.src = pets.dog1;
          }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      </div>
      
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-lg">
          Welcome Back, {user?.fullName?.split(' ')[0] || 'Pet Parent'}!
        </h1>
        <p className="text-xl md:text-2xl mb-8 drop-shadow-md">
          Continue setting up your pet's profile for personalized recommendations
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={handleGetStarted}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Complete Profile
          </button>
          <button 
            onClick={handleLearnMore}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 backdrop-blur-sm border border-white border-opacity-30"
          >
            Browse Shop
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
            e.target.src = pets.cat1;
          }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      </div>
      
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-lg">
          Discover Perfect Matches
        </h1>
        <p className="text-xl md:text-2xl mb-8 drop-shadow-md">
          Our AI analyzes your pet's needs to recommend the best accessories
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={handleGetStarted}
            className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            AI Analysis
          </button>
          <button 
            onClick={handleLearnMore}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 backdrop-blur-sm border border-white border-opacity-30"
          >
            View Recommendations
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
            e.target.src = pets.dog2;
          }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      </div>
      
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-lg">
          Your Pet's Perfect Match
        </h1>
        <p className="text-xl md:text-2xl mb-8 drop-shadow-md">
          Join thousands of happy pet parents who found their perfect companion through our platform
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={handleGetStarted}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Start Shopping
          </button>
          <button 
            onClick={handleLearnMore}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 backdrop-blur-sm border border-white border-opacity-30"
          >
            Chat Support
          </button>
        </div>
      </div>
    </div>
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Enhanced User Header */}
      <UserHeader />

      {/* Hero Carousel */}
      <HeroCarousel items={carouselItems} />

      {/* Featured Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Your Personalized Services</h2>
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
                  <h3 className="text-2xl font-bold">AI Pet Matching</h3>
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
    </div>
  );
}
