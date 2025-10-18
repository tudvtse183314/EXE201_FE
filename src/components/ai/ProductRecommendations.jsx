import React from 'react';
import { ShoppingCart, Heart, Star } from 'lucide-react';

export default function ProductRecommendations({ recommendations, petProfile, onAddToCart, onAddToWishlist }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Recommended Products</h3>
      <p className="text-gray-600 mb-6">
        Based on your {petProfile?.breed} analysis, here are our top recommendations:
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((product) => (
          <div key={product.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
              <span className="text-gray-400">📦</span>
            </div>
            
            <h4 className="font-semibold text-gray-900 mb-2">{product.name}</h4>
            <p className="text-sm text-gray-600 mb-3">{product.category}</p>
            
            <div className="flex items-center mb-3">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="text-sm text-gray-600 ml-2">(4.8)</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-gray-900">${product.price}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => onAddToWishlist(product)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Heart className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onAddToCart(product)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Add
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
