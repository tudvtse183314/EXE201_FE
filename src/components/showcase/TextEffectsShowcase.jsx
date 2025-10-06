import React from 'react';
import ShinyText from '../effects/ShinyText';
import GradientText, { HotGradient, DiscountGradient, AIGradient, PremiumGradient, SaleGradient } from '../effects/GradientText';

/**
 * Showcase component for text effects
 * Demonstrates ShinyText and GradientText in real-world scenarios
 */
export default function TextEffectsShowcase() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-4">
            <ShinyText text="✨ TEXT EFFECTS SHOWCASE" speed={3} size="text-5xl" />
          </h1>
          <p className="text-xl text-gray-600">
            Attention-grabbing text effects for e-commerce and marketing
          </p>
        </div>

        {/* E-commerce Product Showcase */}
        <section className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold mb-8 text-center">
            <AIGradient size="text-3xl">🛍️ E-commerce Product Showcase</AIGradient>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Product 1 - Hot Deal */}
            <div className="bg-gray-50 rounded-xl p-6 relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <HotGradient size="text-sm" weight="font-bold">🔥 HOT</HotGradient>
              </div>
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-red-400 to-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl">
                  🎾
                </div>
                <h3 className="text-lg font-semibold mb-2">Interactive Puzzle Toy</h3>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <span className="text-2xl font-bold text-gray-900">$19.99</span>
                  <span className="text-sm text-gray-500 line-through">$28.99</span>
                </div>
                <div className="mb-4">
                  <ShinyText text="30% OFF!" speed={2} size="text-lg" />
                </div>
                <button className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                  Add to Cart
                </button>
              </div>
            </div>

            {/* Product 2 - AI Recommended */}
            <div className="bg-gray-50 rounded-xl p-6 relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <AIGradient size="text-sm" weight="font-bold">🤖 AI</AIGradient>
              </div>
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl">
                  📱
                </div>
                <h3 className="text-lg font-semibold mb-2">GPS Pet Tracker</h3>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <span className="text-2xl font-bold text-gray-900">$79.99</span>
                </div>
                <div className="mb-4">
                  <PremiumGradient size="text-lg">PREMIUM</PremiumGradient>
                </div>
                <button className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                  Add to Cart
                </button>
              </div>
            </div>

            {/* Product 3 - Best Price */}
            <div className="bg-gray-50 rounded-xl p-6 relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <DiscountGradient size="text-sm" weight="font-bold">💰 BEST</DiscountGradient>
              </div>
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-teal-500 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl">
                  🍖
                </div>
                <h3 className="text-lg font-semibold mb-2">Premium Dog Food</h3>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <span className="text-2xl font-bold text-gray-900">$65.00</span>
                  <span className="text-sm text-gray-500 line-through">$85.00</span>
                </div>
                <div className="mb-4">
                  <SaleGradient size="text-lg">SAVE 25%</SaleGradient>
                </div>
                <button className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Marketing Banner */}
        <section className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">
              <ShinyText text="LIMITED TIME OFFER!" speed={2} size="text-4xl" />
            </h2>
            <p className="text-xl mb-6">
              Get up to <HotGradient size="text-2xl">50% OFF</HotGradient> on all pet accessories
            </p>
            <div className="flex items-center justify-center gap-4 mb-8">
              <PremiumGradient size="text-lg">👑 PREMIUM QUALITY</PremiumGradient>
              <AIGradient size="text-lg">🤖 AI RECOMMENDED</AIGradient>
            </div>
            <button className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors">
              Shop Now
            </button>
          </div>
        </section>

        {/* Category Headers */}
        <section className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold mb-8 text-center">
            <DiscountGradient size="text-3xl">📂 Category Headers</DiscountGradient>
          </h2>
          
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <h3 className="text-2xl font-bold text-gray-900">Clothing & Accessories</h3>
              <HotGradient size="text-lg">🔥 TRENDING</HotGradient>
            </div>
            
            <div className="flex items-center gap-4">
              <h3 className="text-2xl font-bold text-gray-900">Toys & Games</h3>
              <AIGradient size="text-lg">🤖 AI RECOMMENDED</AIGradient>
            </div>
            
            <div className="flex items-center gap-4">
              <h3 className="text-2xl font-bold text-gray-900">Food & Treats</h3>
              <DiscountGradient size="text-lg">💰 BEST PRICES</DiscountGradient>
            </div>
            
            <div className="flex items-center gap-4">
              <h3 className="text-2xl font-bold text-gray-900">Health & Care</h3>
              <PremiumGradient size="text-lg">👑 PREMIUM</PremiumGradient>
            </div>
          </div>
        </section>

        {/* Call-to-Action Buttons */}
        <section className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold mb-8 text-center">
            <SaleGradient size="text-3xl">🎯 Call-to-Action Buttons</SaleGradient>
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <button className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-4 rounded-lg hover:shadow-lg transition-all">
              <HotGradient size="text-lg">🔥 BUY NOW</HotGradient>
            </button>
            
            <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4 rounded-lg hover:shadow-lg transition-all">
              <AIGradient size="text-lg">🤖 AI ANALYSIS</AIGradient>
            </button>
            
            <button className="bg-gradient-to-r from-green-500 to-teal-500 text-white p-4 rounded-lg hover:shadow-lg transition-all">
              <DiscountGradient size="text-lg">💰 SAVE 50%</DiscountGradient>
            </button>
            
            <button className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-4 rounded-lg hover:shadow-lg transition-all">
              <PremiumGradient size="text-lg">👑 PREMIUM</PremiumGradient>
            </button>
          </div>
        </section>

        {/* Notification Badges */}
        <section className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold mb-8 text-center">
            <ShinyText text="🔔 Notification Badges" speed={3} size="text-3xl" />
          </h2>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <div className="bg-gray-100 p-4 rounded-lg">
              <HotGradient size="text-sm">NEW ARRIVAL</HotGradient>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg">
              <SaleGradient size="text-sm">FLASH SALE</SaleGradient>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg">
              <AIGradient size="text-sm">AI PICK</AIGradient>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg">
              <PremiumGradient size="text-sm">PREMIUM</PremiumGradient>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg">
              <DiscountGradient size="text-sm">BEST DEAL</DiscountGradient>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg">
              <ShinyText text="LIMITED TIME" speed={2} size="text-sm" />
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center py-8">
          <p className="text-gray-600">
            Made with <span className="text-red-500">❤️</span> using React and Tailwind CSS
          </p>
          <div className="mt-4">
            <AIGradient size="text-lg">🤖 AI-Powered</AIGradient>
            <span className="mx-2">•</span>
            <PremiumGradient size="text-lg">👑 Premium Quality</PremiumGradient>
            <span className="mx-2">•</span>
            <HotGradient size="text-lg">🔥 Hot Deals</HotGradient>
          </div>
        </footer>
      </div>
    </div>
  );
}
