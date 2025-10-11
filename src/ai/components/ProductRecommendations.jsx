import React from 'react';
import { Sparkles, ShoppingCart, Heart, Star, TrendingUp } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

/**
 * ProductRecommendations Component
 * Displays AI-generated product recommendations
 */
export default function ProductRecommendations({ 
  recommendations = [], 
  petProfile,
  onAddToCart,
  onAddToWishlist,
  className = '' 
}) {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!recommendations || recommendations.length === 0) {
    return (
      <div className={`bg-white rounded-lg shadow-lg p-8 text-center ${className}`}>
        <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Recommendations Yet</h3>
        <p className="text-gray-500">Complete the AI analysis to get personalized product recommendations.</p>
      </div>
    );
  }

  const handleAddToCart = (product) => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: '/user/ai-analysis' } } });
      return;
    }
    if (onAddToCart) {
      onAddToCart(product);
    } else {
      console.log('Add to cart:', product);
    }
  };

  const handleAddToWishlist = (product) => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: '/user/ai-analysis' } } });
      return;
    }
    if (onAddToWishlist) {
      onAddToWishlist(product);
    } else {
      console.log('Add to wishlist:', product);
    }
  };

  const getMatchColor = (score) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 80) return 'bg-blue-500';
    if (score >= 70) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Toys': '🎾',
      'Food': '🍖',
      'Accessories': '🐕‍🦺',
      'Furniture': '🛏️',
      'Grooming': '✂️'
    };
    return icons[category] || '🐾';
  };

  return (
    <div className={className}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Sparkles className="w-7 h-7 text-indigo-600" />
        <h3 className="text-2xl font-bold text-gray-900">
          Personalized Product Recommendations
        </h3>
        <div className="flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold">
          <TrendingUp className="w-4 h-4" />
          AI Powered
        </div>
      </div>

      {/* Recommendations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {recommendations.map((product, index) => (
          <div
            key={product.id || index}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
          >
            {/* Product Image */}
            <div className="relative h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
              {/* Match Score Badge */}
              <div className={`absolute top-3 right-3 ${getMatchColor(product.matchScore)} text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1`}>
                <Star className="w-3 h-3" />
                {product.matchScore}% Match
              </div>
              
              {/* Category Icon */}
              <div className="text-6xl opacity-60">
                {getCategoryIcon(product.category)}
              </div>
            </div>

            {/* Product Info */}
            <div className="p-4">
              {/* Category */}
              <p className="text-xs text-indigo-600 font-medium mb-1">
                {product.category}
              </p>
              
              {/* Product Name */}
              <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                {product.name}
              </h4>
              
              {/* Match Reason */}
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {product.reason}
              </p>
              
              {/* Price */}
              <p className="text-xl font-bold text-gray-900 mb-4">
                ${product.price?.toFixed(2)}
              </p>
              
              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleAddToCart(product)}
                  className="flex-1 bg-indigo-600 text-white text-sm py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center justify-center gap-1"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart
                </button>
                <button
                  onClick={() => handleAddToWishlist(product)}
                  className="px-4 border border-indigo-600 text-indigo-600 text-sm py-2 rounded-lg hover:bg-indigo-50 transition-colors flex items-center justify-center"
                >
                  <Heart className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      {petProfile && (
        <div className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6">
          <h4 className="font-semibold text-gray-900 mb-3">
            🎯 Recommendations Based On Your {petProfile.type}
          </h4>
          <p className="text-gray-700 text-sm leading-relaxed">
            These products are specifically selected for {petProfile.breed} {petProfile.type.toLowerCase()}s with 
            {petProfile.activity.toLowerCase()} activity levels. Each recommendation considers your pet's size, 
            personality traits, and lifestyle needs for the perfect match.
          </p>
        </div>
      )}

      {/* No User Message */}
      {!user && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            💡 <strong>Want to save these recommendations?</strong> 
            <button
              onClick={() => navigate('/login', { state: { from: { pathname: '/user/ai-analysis' } } })}
              className="text-yellow-900 underline hover:no-underline ml-1"
            >
              Sign in
            </button>
            {' '}to add items to your cart and wishlist.
          </p>
        </div>
      )}
    </div>
  );
}

