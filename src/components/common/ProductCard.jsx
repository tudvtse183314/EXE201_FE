import React from 'react';
import { Heart, ShoppingCart } from 'lucide-react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import ShinyText from '../effects/ShinyText';
import { DiscountGradient, HotGradient, SaleGradient } from '../effects/GradientText';
import { getFallbackImageByIndex } from '../../utils/imageUtils';

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
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 group flex flex-col h-full">
      {/* Product Image */}
      <div className="relative bg-gray-100 h-48 flex items-center justify-center overflow-hidden">
        {product.badge && (
          <div className="absolute top-2 right-2 bg-white bg-opacity-90 backdrop-blur-sm px-2 py-1 rounded-full font-semibold z-10 shadow-lg">
            {getBadgeComponent(product.badge)}
          </div>
        )}
        
        {(() => {
          // Sử dụng imageUrl (đã normalize từ getAllProducts)
          let src = product.imageUrl ?? product.image_url ?? product.image ?? null;
          
          // Debug log cho tất cả products (tạm thời để debug)
          console.log(`🖼️ ProductCard: Product ${product.id} (${product.name})`, {
            imageUrl: product.imageUrl,
            finalBeforeCheck: src,
            isNull: src === null,
            isEmpty: src === '',
            type: typeof src
          });
          
          // Nếu null hoặc empty string → dùng fallback
          if (!src || src === '' || src === 'null' || src === 'undefined') {
            src = getFallbackImageByIndex(product.id);
            console.log(`🖼️ ProductCard: Product ${product.id} using fallback`, src);
          } else if (src.startsWith('http://') || src.startsWith('https://')) {
            // Nếu đã là full URL → dùng trực tiếp
            console.log(`🖼️ ProductCard: Product ${product.id} using external URL`, src);
          } else if (src.startsWith('/api/uploads/')) {
            // Build full URL nếu là relative path từ BE
            const baseURL = process.env.REACT_APP_API_BASE_URL || "https://exe201-be-uhno.onrender.com/api";
            src = baseURL.replace('/api', '') + src;
            console.log(`🖼️ ProductCard: Product ${product.id} building BE URL`, src);
          } else {
            // Không match pattern → dùng fallback
            console.warn(`🖼️ ProductCard: Product ${product.id} unmatched pattern, using fallback`, src);
            src = getFallbackImageByIndex(product.id);
          }
          
          const fallbackSrc = getFallbackImageByIndex(product.id);
          
          return (
            <LazyLoadImage
              src={src}
              alt={product.name || 'Product'}
              width="100%"
              height="192px"
              effect="blur"
              placeholderSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3C/svg%3E"
              className="w-full h-full object-cover"
              style={{ 
                display: 'block',
                width: '100%',
                height: '192px',
                objectFit: 'cover',
                backgroundColor: '#f5f5f5' // Background để thấy khi loading
              }}
              onError={(e) => {
                console.error(`🖼️ ProductCard: Image load error for product ${product.id}`, {
                  attemptedSrc: e.target.src,
                  product: { id: product.id, name: product.name, imageUrl: product.imageUrl }
                });
                // Nếu load lỗi → fallback về assets
                if (e.target.src !== fallbackSrc && fallbackSrc) {
                  console.log(`🖼️ ProductCard: Trying fallback for product ${product.id}`, fallbackSrc);
                  e.target.src = fallbackSrc;
                } else {
                  // Nếu cả fallback cũng lỗi → show placeholder emoji
                  console.error(`🖼️ ProductCard: Fallback also failed for product ${product.id}`);
                  e.target.style.display = 'none';
                  const placeholder = e.target.parentElement.querySelector('.placeholder-image');
                  if (placeholder) placeholder.style.display = 'flex';
                }
              }}
              onLoad={() => {
                console.log(`🖼️ ProductCard: Image loaded successfully for product ${product.id}`);
              }}
            />
          );
        })()}
        
        {/* Placeholder Image - Show only if image fails to load */}
        <div 
          className="placeholder-image w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center hidden absolute inset-0"
        >
          <span className="text-6xl opacity-60">
            {getPlaceholderImage(product.category?.name)}
          </span>
        </div>
        
        {/* Stock Status */}
        {product.stock !== undefined && product.stock < 10 && (
          <div className="absolute bottom-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
            Chỉ còn {product.stock} sản phẩm!
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 flex flex-col" style={{ minHeight: '200px' }}>
        <p 
          className="text-xs text-gray-500 mb-2 font-medium"
          style={{ 
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            height: '16px'
          }}
        >
          {product.category?.name || 'Uncategorized'}
        </p>
        <h3 
          className="font-semibold text-sm mb-2 text-gray-800 group-hover:text-indigo-600 transition-colors"
          style={{ 
            height: '38px',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            textOverflow: 'ellipsis',
            lineHeight: '1.3'
          }}
          title={product.name}
        >
          {product.name}
        </h3>
        <p 
          className="text-xs text-gray-600 mb-3"
          style={{ 
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            textOverflow: 'ellipsis',
            minHeight: '32px',
            maxHeight: '32px'
          }}
        >
          {product.description || 'Không có mô tả'}
        </p>
        <p className="text-lg font-bold text-gray-900 mb-2" style={{ height: '24px' }}>${product.price.toFixed(2)}</p>
        
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
      {/* Fixed height spacer to ensure all cards are same height */}
      <div className="flex-1"></div>
    </div>
  );
}
