import React from 'react';
import { pets } from '../assets/images';
import Image from '../components/common/Image';

/**
 * Demo component showing the new circular image icons
 * Used in Register page headers
 */
export default function CircularImageDemo() {
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold text-center mb-8">🖼️ Circular Image Icons Demo</h1>
      
      {/* User Information Card Demo */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">User Information Card</h2>
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md mx-auto">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full overflow-hidden border-4 border-indigo-200 shadow-lg mb-3">
              <Image 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                alt="User icon"
                className="w-full h-full object-cover"
                fallback="https://via.placeholder.com/64x64/6366f1/ffffff?text=👤"
              />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Create Account</h2>
            <p className="text-sm text-gray-600">
              Join Pawfect Match today!
            </p>
          </div>
        </div>
      </section>

      {/* Pet Information Card Demo */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Pet Information Card</h2>
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md mx-auto">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full overflow-hidden border-4 border-pink-200 shadow-lg mb-3">
              <Image 
                src={pets.dog1}
                alt="Pet icon"
                className="w-full h-full object-cover"
                fallback="https://via.placeholder.com/64x64/ec4899/ffffff?text=🐾"
              />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Pet Information</h2>
            <p className="text-sm text-gray-600">
              Tell us about your furry friend
            </p>
          </div>
          
          {/* Pet Type Selection */}
          <div className="mt-6 text-center">
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200">
                <Image 
                  src={pets.dog1}
                  alt="Dog"
                  className="w-full h-full object-cover"
                  fallback="https://via.placeholder.com/48x48/f3f4f6/9ca3af?text=🐕"
                />
              </div>
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200">
                <Image 
                  src={pets.cat1}
                  alt="Cat"
                  className="w-full h-full object-cover"
                  fallback="https://via.placeholder.com/48x48/f3f4f6/9ca3af?text=🐱"
                />
              </div>
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200">
                <Image 
                  src={pets.dog2}
                  alt="Pet"
                  className="w-full h-full object-cover"
                  fallback="https://via.placeholder.com/48x48/f3f4f6/9ca3af?text=🐰"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500">Choose your pet type</p>
          </div>
        </div>
      </section>

      {/* Different Border Colors Demo */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Different Border Colors</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full overflow-hidden border-4 border-indigo-200 shadow-lg mb-2">
              <Image 
                src={pets.dog1}
                alt="Dog"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-sm text-gray-600">Indigo Border</p>
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full overflow-hidden border-4 border-pink-200 shadow-lg mb-2">
              <Image 
                src={pets.cat1}
                alt="Cat"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-sm text-gray-600">Pink Border</p>
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full overflow-hidden border-4 border-green-200 shadow-lg mb-2">
              <Image 
                src={pets.dog2}
                alt="Dog"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-sm text-gray-600">Green Border</p>
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full overflow-hidden border-4 border-purple-200 shadow-lg mb-2">
              <Image 
                src={pets.cat2}
                alt="Cat"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-sm text-gray-600">Purple Border</p>
          </div>
        </div>
      </section>

      {/* Code Example */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Code Example</h2>
        <div className="bg-gray-100 p-4 rounded-lg">
          <pre className="text-sm bg-white p-3 rounded border overflow-x-auto">
{`// Circular image with border
<div className="inline-flex items-center justify-center w-16 h-16 rounded-full overflow-hidden border-4 border-indigo-200 shadow-lg">
  <Image 
    src={pets.dog1}
    alt="Pet icon"
    className="w-full h-full object-cover"
    fallback="https://via.placeholder.com/64x64/ec4899/ffffff?text=🐾"
  />
</div>

// Small pet type selection
<div className="grid grid-cols-3 gap-2">
  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200">
    <Image 
      src={pets.dog1}
      alt="Dog"
      className="w-full h-full object-cover"
    />
  </div>
  {/* More pet images... */}
</div>`}
          </pre>
        </div>
      </section>
    </div>
  );
}
