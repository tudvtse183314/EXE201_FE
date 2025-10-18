import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Circle } from 'lucide-react';

export default function CreatePetProfile() {
  const [formData, setFormData] = useState({
    // Basic Information
    petName: '',
    species: '',
    breed: '',
    age: '',
    weight: '',
    
    // Physical Traits
    overallSize: '',
    coatType: '',
    neckGirth: '',
    backLength: '',
    
    // Preferences
    activityLevel: '',
    chewHabits: '',
    toyPreferences: []
  });

  const [currentStep, setCurrentStep] = useState(3); // Behavior & Preferences

  const steps = [
    { id: 1, title: 'Account Created', completed: true },
    { id: 2, title: 'Basic Information', completed: true },
    { id: 3, title: 'Physical Traits', completed: true },
    { id: 4, title: 'Behavior & Preferences', completed: false, current: true },
    { id: 5, title: 'Dietary Needs', completed: false },
    { id: 6, title: 'Review Profile', completed: false }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked 
        ? [...prev[name], value]
        : prev[name].filter(item => item !== value)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Pet Profile Data:', formData);
    alert('Pet profile saved successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar trái - Profile Setup */}
          <div className="lg:col-span-1">
            <motion.div 
              className="bg-white shadow-md rounded-xl p-6 sticky top-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="font-bold text-lg text-gray-800 mb-2">Profile Setup</h2>
              <p className="text-sm text-gray-600 mb-6">
                Complete these steps to unlock personalized recommendations.
              </p>
              
              <div className="space-y-3">
                {steps.map((step, index) => (
                  <motion.div
                    key={step.id}
                    className={`flex items-center space-x-3 p-2 rounded-lg transition-colors duration-200 ${
                      step.current ? 'bg-purple-50' : 'hover:bg-gray-50'
                    }`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    {step.completed ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : step.current ? (
                      <Circle className="w-5 h-5 text-purple-600 fill-current" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-400" />
                    )}
                    <span className={`text-sm font-medium ${
                      step.current ? 'text-purple-600' : 
                      step.completed ? 'text-gray-700' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Main content bên phải */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  Create Your Pet's Profile
                </h1>
                <p className="text-gray-600 text-lg">
                  Provide us with details about your beloved companion to unlock highly personalized accessory recommendations.
                </p>
              </div>

              {/* Ảnh minh họa */}
              <div className="mb-8">
                <img
                  src="https://cdn.pixabay.com/photo/2018/03/30/07/53/dog-3277415_1280.jpg"
                  alt="Pet Profile Banner"
                  className="w-full h-auto rounded-xl shadow-sm"
                />
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Basic Information Card */}
                <motion.div 
                  className="bg-white p-6 rounded-xl shadow-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <h3 className="font-semibold text-lg text-gray-800 mb-4">Basic Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pet Name
                      </label>
                      <input
                        type="text"
                        name="petName"
                        value={formData.petName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                        placeholder="Enter your pet's name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Species
                      </label>
                      <select
                        name="species"
                        value={formData.species}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                      >
                        <option value="">Select species</option>
                        <option value="dog">Dog</option>
                        <option value="cat">Cat</option>
                        <option value="bird">Bird</option>
                        <option value="rabbit">Rabbit</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Breed
                      </label>
                      <input
                        type="text"
                        name="breed"
                        value={formData.breed}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                        placeholder="Enter breed"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Age (Years)
                      </label>
                      <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                        placeholder="Age in years"
                        min="0"
                        max="30"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Weight (kg)
                      </label>
                      <input
                        type="number"
                        name="weight"
                        value={formData.weight}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                        placeholder="Weight in kg"
                        min="0"
                        step="0.1"
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Physical Traits Card */}
                <motion.div 
                  className="bg-white p-6 rounded-xl shadow-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <h3 className="font-semibold text-lg text-gray-800 mb-4">Physical Traits</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Overall Size
                      </label>
                      <select
                        name="overallSize"
                        value={formData.overallSize}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                      >
                        <option value="">Select size</option>
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Coat Type
                      </label>
                      <select
                        name="coatType"
                        value={formData.coatType}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                      >
                        <option value="">Select coat type</option>
                        <option value="short">Short</option>
                        <option value="medium">Medium</option>
                        <option value="long">Long</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Neck Girth (cm)
                      </label>
                      <input
                        type="number"
                        name="neckGirth"
                        value={formData.neckGirth}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                        placeholder="Neck circumference"
                        min="0"
                        step="0.1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Back Length (cm)
                      </label>
                      <input
                        type="number"
                        name="backLength"
                        value={formData.backLength}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                        placeholder="Back length"
                        min="0"
                        step="0.1"
                      />
                    </div>
                  </div>

                  {/* Checkbox Groups */}
                  <div className="space-y-6">
                    {/* Activity Level */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Activity Level</h4>
                      <div className="space-y-2">
                        {['High Energy', 'Moderate Energy', 'Low Energy'].map((level) => (
                          <label key={level} className="flex items-center space-x-3 cursor-pointer">
                            <input
                              type="radio"
                              name="activityLevel"
                              value={level.toLowerCase().replace(' ', '_')}
                              checked={formData.activityLevel === level.toLowerCase().replace(' ', '_')}
                              onChange={handleInputChange}
                              className="accent-purple-600 rounded-md"
                            />
                            <span className="text-sm text-gray-700">{level}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Chew Habits */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Chew Habits</h4>
                      <div className="space-y-2">
                        {['Power Chewer', 'Gentle Chewer', 'Doesn\'t Chew Much'].map((habit) => (
                          <label key={habit} className="flex items-center space-x-3 cursor-pointer">
                            <input
                              type="radio"
                              name="chewHabits"
                              value={habit.toLowerCase().replace(' ', '_').replace('\'', '')}
                              checked={formData.chewHabits === habit.toLowerCase().replace(' ', '_').replace('\'', '')}
                              onChange={handleInputChange}
                              className="accent-purple-600 rounded-md"
                            />
                            <span className="text-sm text-gray-700">{habit}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Toy Preferences */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Toy Preferences</h4>
                      <div className="space-y-2">
                        {['Interactive Toys', 'Plush Toys', 'Fetch Toys'].map((toy) => (
                          <label key={toy} className="flex items-center space-x-3 cursor-pointer">
                            <input
                              type="checkbox"
                              name="toyPreferences"
                              value={toy.toLowerCase().replace(' ', '_')}
                              checked={formData.toyPreferences.includes(toy.toLowerCase().replace(' ', '_'))}
                              onChange={handleCheckboxChange}
                              className="accent-purple-600 rounded-md"
                            />
                            <span className="text-sm text-gray-700">{toy}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Save Button */}
                <motion.div 
                  className="flex justify-end"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold hover:from-purple-700 hover:to-purple-800 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Save Profile
                  </button>
                </motion.div>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
