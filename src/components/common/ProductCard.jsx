import React from 'react';
import { Heart, ShoppingCart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import ShinyText from '../effects/ShinyText';
import { DiscountGradient, HotGradient, SaleGradient } from '../effects/GradientText';

export default function ProductCard({ product, onAddToCart, onAddToWishlist }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const handleViewDetail = () => {
    // Navigate to product detail page
    navigate(`/product/${product.id}`);
  };

  const handleAddToCart = async () => {
    try {
      if (onAddToCart) {
        onAddToCart(product);
      } else {
        await addToCart(product, 1);
        console.log('Add to cart:', product.id);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleAddToWishlist = () => {
    if (onAddToWishlist) {
      onAddToWishlist(product);
    } else {
      toggleWishlist(product);
      console.log('Add to wishlist:', product.id);
    }
  };

  // Helper function to determine badge type and component
  const getBadgeComponent = (badge) => {
    if (!badge) return null;
    
    const badgeText = badge.replace('%', '').replace('off', '').trim();
    const discountPercent = parseInt(badgeText);
    
    if (discountPercent >= 30) {
      return <HotGradient size="text-xs" weight="font-bold">{badge}</HotGradient>;
    } else if (discountPercent >= 20) {
      return <DiscountGradient size="text-xs" weight="font-bold">{badge}</DiscountGradient>;
    } else {
      return <SaleGradient size="text-xs" weight="font-bold">{badge}</SaleGradient>;
    }
  };

  // Generate placeholder image based on category
  const getPlaceholderImage = (categoryName) => {
    const imageMap = {
      'Cleaning Essentials': '🧽',
      'Dog Clothing': '👕',
      'Feeding Supplies': '🍽️',
      'Dog Accessories': '🎀',
      'Toys': '🎾',
      'Food & Treats': '🍖',
      'Accessories': '📱',
      'Bed & Furniture': '🛏️',
      'Travel Accessories': '🚗'
    };
    return imageMap[categoryName] || '🐾';
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 group">
      {/* Product Image */}
      <div className="relative bg-gray-100 h-48 flex items-center justify-center overflow-hidden">
        {product.badge && (
          <div className="absolute top-2 right-2 bg-white bg-opacity-90 backdrop-blur-sm px-2 py-1 rounded-full font-semibold z-10 shadow-lg">
            {getBadgeComponent(product.badge)}
          </div>
        )}
        
        {/* Placeholder Image */}
        <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
          <span className="text-6xl opacity-60">
            {getPlaceholderImage(product.category.name)}
          </span>
        </div>
        
        {/* Stock Status */}
        {product.stock < 10 && (
          <div className="absolute bottom-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
            Only {product.stock} left!
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <p className="text-xs text-gray-500 mb-1 font-medium">{product.category.name}</p>
        <h3 className="font-semibold text-sm mb-2 text-gray-800 line-clamp-2 group-hover:text-indigo-600 transition-colors">
          {product.name}
        </h3>
        <p className="text-xs text-gray-600 mb-3 line-clamp-2">{product.description}</p>
        <p className="text-lg font-bold text-gray-900 mb-3">${product.price.toFixed(2)}</p>
        
        {/* Action Buttons */}
        <div className="flex gap-2">
          <button 
            onClick={handleViewDetail}
            className="flex-1 bg-indigo-600 text-white text-sm py-2 rounded hover:bg-indigo-700 transition-colors font-medium"
          >
            View Detail
          </button>
          <button 
            onClick={handleAddToWishlist}
            className={`px-3 border text-sm py-2 rounded transition-colors flex items-center justify-center ${
              isInWishlist(product.id) 
                ? 'border-red-500 text-red-500 bg-red-50' 
                : 'border-indigo-600 text-indigo-600 hover:bg-indigo-50'
            }`}
            title={isInWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
          </button>
        </div>
        
        {/* Add to Cart Button */}
        <button 
          onClick={handleAddToCart}
          className="w-full mt-2 bg-green-600 text-white text-sm py-2 rounded hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2"
        >
          <ShoppingCart className="w-4 h-4" />
          Add to Cart
        </button>
      </div>
    </div>
  );
}
