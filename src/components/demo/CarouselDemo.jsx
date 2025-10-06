import React from 'react';
import { petGifs } from '../assets/images';
import { HeroCarousel, ImageCarousel } from '../components/common/Carousel';

/**
 * Demo component showing the new Carousel with Pet GIFs
 * Highlights the carousel functionality and pet GIF usage
 */
export default function CarouselDemo() {
  // Demo carousel items
  const demoCarouselItems = [
    <div key="demo1" className="relative h-96 flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600">
      <div className="text-center text-white">
        <h2 className="text-4xl font-bold mb-4">Slide 1: Dog Focus</h2>
        <p className="text-xl">Dogs Love Unconditionally</p>
      </div>
    </div>,
    <div key="demo2" className="relative h-96 flex items-center justify-center bg-gradient-to-r from-pink-500 to-red-500">
      <div className="text-center text-white">
        <h2 className="text-4xl font-bold mb-4">Slide 2: Cat Focus</h2>
        <p className="text-xl">Cats Bring Joy</p>
      </div>
    </div>,
    <div key="demo3" className="relative h-96 flex items-center justify-center bg-gradient-to-r from-green-500 to-blue-500">
      <div className="text-center text-white">
        <h2 className="text-4xl font-bold mb-4">Slide 3: Mixed Pets</h2>
        <p className="text-xl">Find Your Perfect Match</p>
      </div>
    </div>
  ];

  // Image carousel demo
  const imageCarouselItems = [
    { src: petGifs.dog1, alt: 'Happy Dog GIF' },
    { src: petGifs.cat1, alt: 'Playful Cat GIF' },
    { src: petGifs.dog2, alt: 'Another Dog GIF' }
  ];

  return (
    <div className="p-8 space-y-12">
      <h1 className="text-4xl font-bold text-center mb-8">🎠 Carousel with Pet GIFs Demo</h1>
      
      {/* Basic Carousel Demo */}
      <section className="space-y-4">
        <h2 className="text-3xl font-semibold">Basic Carousel</h2>
        <div className="rounded-2xl overflow-hidden shadow-xl">
          <HeroCarousel items={demoCarouselItems} />
        </div>
        <p className="text-gray-600">
          Auto-playing carousel with navigation arrows and dots. Hover to pause auto-play.
        </p>
      </section>

      {/* Image Carousel Demo */}
      <section className="space-y-4">
        <h2 className="text-3xl font-semibold">Pet GIF Carousel</h2>
        <div className="rounded-2xl overflow-hidden shadow-xl">
          <ImageCarousel 
            images={imageCarouselItems}
            className="h-96"
          />
        </div>
        <p className="text-gray-600">
          Carousel specifically designed for images with fallback support.
        </p>
      </section>

      {/* Carousel Features */}
      <section className="space-y-4">
        <h2 className="text-3xl font-semibold">Carousel Features</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4">🎯 Auto Play</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Automatic slide transition every 6 seconds</li>
              <li>• Pauses when user interacts</li>
              <li>• Resumes after 10 seconds of inactivity</li>
              <li>• Configurable interval</li>
            </ul>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4">🎮 Navigation</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Left/Right arrow buttons</li>
              <li>• Dot indicators at bottom</li>
              <li>• Click to jump to specific slide</li>
              <li>• Smooth transitions</li>
            </ul>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4">🖼️ Image Support</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• GIF animation support</li>
              <li>• Fallback to static images</li>
              <li>• Responsive image sizing</li>
              <li>• Error handling</li>
            </ul>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4">📱 Responsive</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Mobile-friendly navigation</li>
              <li>• Touch-friendly controls</li>
              <li>• Adaptive sizing</li>
              <li>• Performance optimized</li>
            </ul>
          </div>
        </div>
      </section>

      {/* GIF Sources */}
      <section className="space-y-4">
        <h2 className="text-3xl font-semibold">Pet GIF Sources</h2>
        <div className="bg-gray-100 p-6 rounded-lg">
          <h3 className="text-lg font-medium mb-4">GIF URLs from Giphy:</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Dog GIFs:</h4>
              <code className="bg-white p-2 rounded block mb-2">{petGifs.dog1}</code>
              <code className="bg-white p-2 rounded block mb-2">{petGifs.dog2}</code>
              <code className="bg-white p-2 rounded block">{petGifs.dog3}</code>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Cat GIFs:</h4>
              <code className="bg-white p-2 rounded block mb-2">{petGifs.cat1}</code>
              <code className="bg-white p-2 rounded block mb-2">{petGifs.cat2}</code>
              <code className="bg-white p-2 rounded block">{petGifs.cat3}</code>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-4">
            All GIFs have fallback static images from Unsplash for better reliability.
          </p>
        </div>
      </section>

      {/* Code Example */}
      <section className="space-y-4">
        <h2 className="text-3xl font-semibold">Code Example</h2>
        <div className="bg-gray-100 p-6 rounded-lg">
          <pre className="text-sm bg-white p-4 rounded border overflow-x-auto">
{`// Import carousel and GIFs
import { HeroCarousel } from '../components/common/Carousel';
import { petGifs } from '../assets/images';

// Create carousel items
const carouselItems = [
  <div key="dog1" className="relative min-h-screen">
    <img 
      src={petGifs.dog1} 
      alt="Happy Dog"
      className="w-full h-full object-cover"
      onError={(e) => {
        e.target.src = petGifs.dog1Static; // Fallback
      }}
    />
    <div className="absolute inset-0 bg-black bg-opacity-40"></div>
    <div className="relative z-10 text-center text-white">
      <h1>Dogs Love Unconditionally</h1>
      <button>Find My Dog</button>
    </div>
  </div>,
  // More slides...
];

// Use in component
return (
  <HeroCarousel items={carouselItems} />
);`}
          </pre>
        </div>
      </section>

      {/* Usage Tips */}
      <section className="space-y-4">
        <h2 className="text-3xl font-semibold">Usage Tips</h2>
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-medium mb-4">💡 Best Practices:</h3>
          <ul className="space-y-2 text-gray-700">
            <li>• Always provide fallback images for GIFs</li>
            <li>• Use appropriate alt text for accessibility</li>
            <li>• Consider performance impact of large GIFs</li>
            <li>• Test carousel on different devices</li>
            <li>• Provide manual navigation options</li>
            <li>• Use consistent slide dimensions</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
