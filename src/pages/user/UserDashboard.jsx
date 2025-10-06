import React, { useState } from 'react';
import { Search, Heart, ShoppingCart, User, Check, ChevronRight, MessageCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { pets, products, petGifs } from '../../assets/images';
import Image from '../../components/common/Image';
import { HeroCarousel } from '../../components/common/Carousel';
// Animation components temporarily disabled

export default function UserDashboard() {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(3);
  const [formData, setFormData] = useState({
    petName: '',
    breed: '',
    species: '',
    age: '',
    weight: '',
    overallSize: '',
    coatType: '',
    neckSize: '',
    backLength: '',
    activityLevel: '',
    chewHabits: [],
    toyPreferences: []
  });

  const steps = [
    { id: 1, name: 'Account Created', completed: true },
    { id: 2, name: 'Basic Information', completed: true },
    { id: 3, name: 'Physical Traits', completed: false, active: true },
    { id: 4, name: 'Behavior & Preferences', completed: false },
    { id: 5, name: 'Dietary Needs', completed: false },
    { id: 6, name: 'Review Profile', completed: false }
  ];

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleCheckboxChange = (field, value) => {
    const current = formData[field];
    if (current.includes(value)) {
      setFormData({ ...formData, [field]: current.filter(item => item !== value) });
    } else {
      setFormData({ ...formData, [field]: [...current, value] });
    }
  };

  const handleSaveProfile = () => {
    alert('Profile saved successfully!');
  };

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
            e.target.src = pets.dog1;
          }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      </div>
      
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-lg">
          Welcome Back, {user?.fullName || 'Pet Parent'}!
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
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <span className="text-xl font-bold text-gray-900">Pawfect Match</span>
              <div className="hidden md:flex space-x-6">
                {['Home', 'Profile', 'Shop', 'Order', 'AI Analysis', 'Premium', 'Chat'].map((item) => (
                  <button 
                    key={item}
                    className={`text-sm font-medium transition-colors hover:text-indigo-600 ${
                      item === 'Profile' ? 'text-indigo-600' : 'text-gray-700'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Search className="w-5 h-5 text-gray-600 cursor-pointer hover:text-indigo-600 transition-colors" />
              <Heart className="w-5 h-5 text-gray-600 cursor-pointer hover:text-red-500 transition-colors" />
              <ShoppingCart className="w-5 h-5 text-gray-600 cursor-pointer hover:text-indigo-600 transition-colors" />
              <MessageCircle className="w-5 h-5 text-gray-600 cursor-pointer hover:text-indigo-600 transition-colors" />
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center cursor-pointer">
                <User className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Carousel */}
      <HeroCarousel items={carouselItems} />

      {/* Pet Profile Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar - Progress Steps */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Profile Setup</h2>
              <p className="text-sm text-gray-500 mb-6">Complete these steps to unlock personalized recommendations</p>
              
              <div className="space-y-4">
                {steps.map((step, index) => (
                  <div 
                    key={step.id}
                    className={`flex items-start gap-3 cursor-pointer group transition-all duration-300 ${
                      step.active ? 'transform scale-105' : ''
                    }`}
                    onClick={() => setCurrentStep(step.id)}
                  >
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                      step.completed 
                        ? 'bg-green-500 shadow-lg' 
                        : step.active 
                        ? 'bg-indigo-600 shadow-lg animate-pulse' 
                        : 'bg-gray-200'
                    }`}>
                      {step.completed ? (
                        <Check className="w-4 h-4 text-white" />
                      ) : (
                        <span className={`text-sm font-semibold ${step.active ? 'text-white' : 'text-gray-500'}`}>
                          {index + 1}
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-medium transition-colors ${
                        step.active ? 'text-indigo-600' : step.completed ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        {step.name}
                      </p>
                    </div>
                    {step.active && (
                      <ChevronRight className="w-4 h-4 text-indigo-600 animate-pulse" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-3">Create Your Pet's Profile</h1>
              <p className="text-gray-600">Provide us with details about your beloved companion to unlock highly personalized accessory recommendations.</p>
            </div>

            {/* Hero Illustration */}
            <div className="bg-gradient-to-br from-orange-100 via-pink-100 to-purple-100 rounded-3xl p-8 mb-8 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-green-200 rounded-full opacity-30 blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-200 rounded-full opacity-30 blur-3xl"></div>
              
              <div className="flex items-center justify-center relative z-10">
                <div className="text-center">
                  <div className="text-9xl mb-4">👨‍⚕️🐕🐕‍🦺</div>
                  <p className="text-gray-700 font-medium text-lg">Let's get to know your furry friend!</p>
                </div>
              </div>
            </div>

            {/* Basic Information Form */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Basic Information</h2>
              <p className="text-gray-500 mb-6">Tell us about your pet's fundamental details.</p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Pet Name</label>
                  <input
                    type="text"
                    placeholder="Enter pet's name"
                    value={formData.petName}
                    onChange={(e) => handleInputChange('petName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Species</label>
                  <select
                    value={formData.species}
                    onChange={(e) => handleInputChange('species', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all appearance-none bg-white"
                  >
                    <option value="">Select species</option>
                    <option value="dog">Dog</option>
                    <option value="cat">Cat</option>
                    <option value="bird">Bird</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Breed</label>
                  <input
                    type="text"
                    placeholder="e.g., Golden Retriever, Siamese"
                    value={formData.breed}
                    onChange={(e) => handleInputChange('breed', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Age (Years)</label>
                  <input
                    type="number"
                    placeholder="e.g., 3"
                    value={formData.age}
                    onChange={(e) => handleInputChange('age', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Weight (kg)</label>
                  <input
                    type="number"
                    placeholder="e.g., 25"
                    value={formData.weight}
                    onChange={(e) => handleInputChange('weight', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Physical Traits */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Physical Traits</h2>
              <p className="text-gray-500 mb-6">Help us understand your pet's size and build for perfect accessory fit.</p>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Overall Size</label>
                  <select
                    value={formData.overallSize}
                    onChange={(e) => handleInputChange('overallSize', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all appearance-none bg-white"
                  >
                    <option value="">Select size</option>
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                    <option value="xlarge">Extra Large</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Coat Type</label>
                  <select
                    value={formData.coatType}
                    onChange={(e) => handleInputChange('coatType', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all appearance-none bg-white"
                  >
                    <option value="">Select coat type</option>
                    <option value="short">Short Hair</option>
                    <option value="medium">Medium Hair</option>
                    <option value="long">Long Hair</option>
                    <option value="curly">Curly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Neck Size (cm)</label>
                  <input
                    type="number"
                    placeholder="e.g., 30"
                    value={formData.neckSize}
                    onChange={(e) => handleInputChange('neckSize', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Back Length (cm)</label>
                  <input
                    type="number"
                    placeholder="e.g., 45"
                    value={formData.backLength}
                    onChange={(e) => handleInputChange('backLength', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Activity Level */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Activity Level</label>
                <div className="space-y-3">
                  {['High Energy', 'Moderate Energy', 'Low Energy / Couch Potato'].map((level) => (
                    <label key={level} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="activityLevel"
                        checked={formData.activityLevel === level}
                        onChange={() => handleInputChange('activityLevel', level)}
                        className="w-5 h-5 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                      />
                      <span className="text-gray-700 group-hover:text-indigo-600 transition-colors">{level}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Chew Habits */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Chew Habits</label>
                <div className="space-y-3">
                  {['Power Chewer', 'Gentle Chewer', "Doesn't Chew Toys Much"].map((habit) => (
                    <label key={habit} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={formData.chewHabits.includes(habit)}
                        onChange={() => handleCheckboxChange('chewHabits', habit)}
                        className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <span className="text-gray-700 group-hover:text-indigo-600 transition-colors">{habit}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Toy Preferences */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Toy Preferences</label>
                <div className="space-y-3">
                  {['Interactive Toys (Puzzles)', 'Plush Toys', 'Fetch Toys (Balls, Frisbees)'].map((pref) => (
                    <label key={pref} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={formData.toyPreferences.includes(pref)}
                        onChange={() => handleCheckboxChange('toyPreferences', pref)}
                        className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <span className="text-gray-700 group-hover:text-indigo-600 transition-colors">{pref}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Pet Images Decoration */}
            <div className="relative bg-white rounded-3xl p-12 mb-8 shadow-xl overflow-hidden">
              <div className="absolute left-8 top-8 w-20 h-20 bg-pink-400 rounded-full opacity-40 blur-xl"></div>
              <div className="absolute right-16 bottom-16 w-24 h-24 bg-purple-400 rounded-full opacity-40 blur-xl"></div>
              <div className="absolute left-1/3 top-1/2 w-16 h-16 bg-orange-400 rounded-full opacity-40 blur-xl"></div>
              
              <div className="relative z-10 flex items-end justify-end gap-6">
                <div className="text-5xl transform hover:scale-110 transition-transform duration-300">🐱</div>
                <div className="text-6xl transform hover:scale-110 transition-transform duration-300">🐕</div>
                <div className="text-8xl transform hover:scale-110 transition-transform duration-300">🐕</div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button 
                onClick={handleSaveProfile}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-10 py-4 rounded-xl font-semibold text-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
              >
                Save Profile
              </button>
            </div>
          </div>
        </div>
      </div>

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
          <p className="text-xl text-white opacity-90 mb-8">
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
          <p className="text-xl text-white opacity-90 mb-8">
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
