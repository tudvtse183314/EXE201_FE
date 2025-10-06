import React from 'react';
import { pets, products, petGifs } from '../../assets/images';
import Image from '../../components/common/Image';
import { HeroCarousel } from '../../components/common/Carousel';

/**
 * Demo component showing the User Dashboard features
 * Highlights the new navigation and pet profile functionality
 */
export default function UserDashboardDemo() {
  return (
    <div className="p-8 space-y-12">
      <h1 className="text-4xl font-bold text-center mb-8">🏠 User Dashboard Demo</h1>
      
      {/* Navigation Comparison */}
      <section className="space-y-4">
        <h2 className="text-3xl font-semibold">Navigation Changes</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4">Public Navigation</h3>
            <div className="space-y-2">
              {['Home', 'About', 'Services', 'Contact'].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4">User Navigation (After Login)</h3>
            <div className="space-y-2">
              {['Home', 'Profile', 'Shop', 'Order', 'AI Analysis', 'Premium', 'Chat'].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${item === 'Profile' ? 'bg-indigo-600' : 'bg-gray-400'}`}></div>
                  <span className={`${item === 'Profile' ? 'text-indigo-600 font-semibold' : 'text-gray-700'}`}>
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Hero Carousel Demo */}
      <section className="space-y-4">
        <h2 className="text-3xl font-semibold">Personalized Hero Carousel</h2>
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4">Welcome Messages</h3>
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg">
              <h4 className="font-semibold text-indigo-800">Slide 1: Welcome Back</h4>
              <p className="text-gray-700">"Welcome Back, [User Name]! Continue setting up your pet's profile"</p>
            </div>
            <div className="bg-gradient-to-r from-pink-50 to-red-50 p-4 rounded-lg">
              <h4 className="font-semibold text-pink-800">Slide 2: AI Analysis</h4>
              <p className="text-gray-700">"Discover Perfect Matches - Our AI analyzes your pet's needs"</p>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-800">Slide 3: Shopping</h4>
              <p className="text-gray-700">"Your Pet's Perfect Match - Start Shopping & Chat Support"</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pet Profile Section */}
      <section className="space-y-4">
        <h2 className="text-3xl font-semibold">Pet Profile Setup</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4">Progress Steps</h3>
            <div className="space-y-3">
              {[
                { name: 'Account Created', completed: true },
                { name: 'Basic Information', completed: true },
                { name: 'Physical Traits', active: true },
                { name: 'Behavior & Preferences', pending: true },
                { name: 'Dietary Needs', pending: true },
                { name: 'Review Profile', pending: true }
              ].map((step, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                    step.completed ? 'bg-green-500 text-white' : 
                    step.active ? 'bg-indigo-600 text-white animate-pulse' : 
                    'bg-gray-200 text-gray-500'
                  }`}>
                    {step.completed ? '✓' : index + 1}
                  </div>
                  <span className={`text-sm ${
                    step.active ? 'text-indigo-600 font-semibold' : 
                    step.completed ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {step.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4">Profile Form Sections</h3>
            <div className="space-y-3">
              {[
                'Basic Information (Name, Species, Breed, Age, Weight)',
                'Physical Traits (Size, Coat Type, Measurements)',
                'Activity Level (High/Moderate/Low Energy)',
                'Chew Habits (Power/Gentle/Doesn\'t Chew)',
                'Toy Preferences (Interactive/Plush/Fetch)'
              ].map((section, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-sm text-gray-700">{section}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Service Cards */}
      <section className="space-y-4">
        <h2 className="text-3xl font-semibold">Personalized Services</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="h-48 relative">
              <Image 
                src={pets.dog1}
                alt="AI Pet Matching"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-lg font-bold">AI Pet Matching</h3>
                <p className="text-sm opacity-90">Find the perfect companion</p>
              </div>
            </div>
            <div className="p-4">
              <p className="text-gray-600 text-sm mb-3">
                AI-powered matching system for perfect pet companionship.
              </p>
              <button className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors text-sm">
                Learn More →
              </button>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="h-48 relative">
              <Image 
                src={products.collar}
                alt="Pet Accessories"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-lg font-bold">Pet Accessories</h3>
                <p className="text-sm opacity-90">Stylish & functional</p>
              </div>
            </div>
            <div className="p-4">
              <p className="text-gray-600 text-sm mb-3">
                Curated collection of high-quality accessories.
              </p>
              <button className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors text-sm">
                Shop Now →
              </button>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="h-48 relative">
              <Image 
                src={pets.cat1}
                alt="Pet Care Services"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-lg font-bold">Pet Care</h3>
                <p className="text-sm opacity-90">Health & wellness</p>
              </div>
            </div>
            <div className="p-4">
              <p className="text-gray-600 text-sm mb-3">
                Comprehensive care services for your pet's health.
              </p>
              <button className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors text-sm">
                Book Service →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="space-y-4">
        <h2 className="text-3xl font-semibold">Dashboard Features</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">🎯 User Experience</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Personalized welcome messages</li>
              <li>• Pet profile setup wizard</li>
              <li>• Progress tracking with visual indicators</li>
              <li>• Interactive form sections</li>
              <li>• Animated pet illustrations</li>
            </ul>
          </div>
          
          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">🛠️ Technical Features</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Dynamic navigation based on auth status</li>
              <li>• Carousel with pet GIFs</li>
              <li>• Form state management</li>
              <li>• Responsive design</li>
              <li>• Smooth animations & transitions</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Code Example */}
      <section className="space-y-4">
        <h2 className="text-3xl font-semibold">Implementation Details</h2>
        <div className="bg-gray-100 p-6 rounded-lg">
          <h3 className="text-lg font-medium mb-4">Key Components:</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Navigation Logic:</h4>
              <code className="bg-white p-2 rounded block">
                {`const navigationItems = user ? 
  userNavigationItems : 
  publicNavigationItems;`}
              </code>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Profile Steps:</h4>
              <code className="bg-white p-2 rounded block">
                {`const steps = [
  { id: 1, name: 'Account Created', completed: true },
  { id: 2, name: 'Basic Information', completed: true },
  { id: 3, name: 'Physical Traits', active: true },
  // ... more steps
];`}
              </code>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
