import React from 'react';
import { background } from '../../assets/images';

// ✅ Test component để kiểm tra background
export default function BackgroundTest() {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">Background Test</h1>
      
      {/* Test 1: CSS Background */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Test 1: CSS Background</h2>
        <div 
          className="h-64 bg-cover bg-center bg-no-repeat rounded-lg"
          style={{ backgroundImage: `url(${background})` }}
        >
          <div className="h-full flex items-center justify-center">
            <p className="text-white text-lg font-semibold bg-black bg-opacity-50 px-4 py-2 rounded">
              CSS Background
            </p>
          </div>
        </div>
      </div>

      {/* Test 2: Image Tag */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Test 2: Image Tag</h2>
        <div className="h-64 rounded-lg overflow-hidden">
          <img 
            src={background} 
            alt="Background" 
            className="w-full h-full object-cover"
            onLoad={() => console.log('✅ Background loaded successfully:', background)}
            onError={() => console.error('❌ Background failed to load:', background)}
          />
        </div>
      </div>

      {/* Test 3: Debug Info */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Debug Info</h2>
        <div className="bg-gray-100 p-4 rounded-lg">
          <p><strong>Background URL:</strong> {background}</p>
          <p><strong>Type:</strong> {typeof background}</p>
          <p><strong>Length:</strong> {background?.length || 'N/A'}</p>
        </div>
      </div>

      {/* Test 4: Multiple Backgrounds */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Test 4: Multiple Backgrounds</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div 
            className="h-32 bg-cover bg-center rounded-lg"
            style={{ backgroundImage: `url(${background})` }}
          >
            <div className="h-full flex items-center justify-center">
              <span className="text-white font-semibold bg-black bg-opacity-50 px-2 py-1 rounded">
                Background 1
              </span>
            </div>
          </div>
          <div 
            className="h-32 bg-cover bg-center rounded-lg"
            style={{ backgroundImage: `url(${background})` }}
          >
            <div className="h-full flex items-center justify-center">
              <span className="text-white font-semibold bg-black bg-opacity-50 px-2 py-1 rounded">
                Background 2
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
