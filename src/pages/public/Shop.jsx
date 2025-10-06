import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, User, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../../components/common/ProductCard';
import { mockProducts, getProductsByCategory, getFeaturedProduct } from '../../data/products';
import Shuffle from '../../components/effects/Shuffle';

export default function PublicShop() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(mockProducts);

  // Get products by category
  const clothingProducts = getProductsByCategory('Dog Clothing');
  const toyProducts = getProductsByCategory('Toys');
  const foodProducts = getProductsByCategory('Food & Treats');
  const accessories = getProductsByCategory('Accessories');
  const recentProducts = mockProducts.slice(-4); // Last 4 products
  const featuredProduct = getFeaturedProduct();

  // Filter products based on search
  useEffect(() => {
    if (searchTerm) {
      const filtered = mockProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(mockProducts);
    }
  }, [searchTerm]);

  const handleAddToCart = (product) => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: '/services' } } });
      return;
    }
    console.log('Adding to cart:', product.name);
    // TODO: Implement cart functionality
  };

  const handleAddToWishlist = (product) => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: '/services' } } });
      return;
    }
    console.log('Adding to wishlist:', product.name);
    // TODO: Implement wishlist functionality
  };

  const handleLogin = () => {
    navigate('/login', { state: { from: { pathname: '/services' } } });
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <h1 
                className="text-xl font-bold text-gray-900 cursor-pointer"
                onClick={() => navigate('/')}
              >
                Pawfect Match
              </h1>
              <nav className="hidden md:flex gap-6">
                <button 
                  onClick={() => navigate('/')}
                  className="text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Home
                </button>
                <button 
                  onClick={() => navigate('/about')}
                  className="text-gray-700 hover:text-gray-900 transition-colors"
                >
                  About
                </button>
                <span className="text-indigo-600 font-medium">Shop</span>
                <button 
                  onClick={() => navigate('/contact')}
                  className="text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Contact
                </button>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              {/* Search Bar */}
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-64"
                />
              </div>
              
              <Heart className="w-5 h-5 text-gray-600 cursor-pointer hover:text-red-500 transition-colors" />
              <ShoppingCart className="w-5 h-5 text-gray-600 cursor-pointer hover:text-indigo-600 transition-colors" />
              
              {user ? (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm text-gray-700">{user.fullName?.split(' ')[0] || 'User'}</span>
                  <button 
                    onClick={() => navigate('/user/home')}
                    className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    Dashboard
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button 
                    onClick={handleLogin}
                    className="text-sm text-gray-700 hover:text-gray-900 font-medium"
                  >
                    Login
                  </button>
                  <button 
                    onClick={handleRegister}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm"
                  >
                    Register
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-gray-700 to-gray-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-xl">
            <h2 className="text-4xl font-bold mb-4">
              <Shuffle
                text={featuredProduct.name}
                shuffleDirection="up"
                duration={0.6}
                ease="power3.out"
                stagger={0.05}
                glowColor="#ffffff"
              />
            </h2>
            <p className="text-gray-200 mb-2">
              {featuredProduct.description}
            </p>
            <p className="text-gray-200 mb-6">
              Keep your pet healthy and happy with our premium products.
            </p>
            <p className="text-3xl font-bold mb-6">${featuredProduct.price.toFixed(2)}</p>
            <button 
              onClick={() => handleAddToCart(featuredProduct)}
              className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              {user ? 'Add to Cart' : 'Login to Buy'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search Results */}
        {searchTerm && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Search Results for "{searchTerm}" ({filteredProducts.length} products)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {filteredProducts.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product}
                  onAddToCart={handleAddToCart}
                  onAddToWishlist={handleAddToWishlist}
                />
              ))}
            </div>
          </section>
        )}

        {/* Clothing Recommendations */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            <Shuffle
              text="Clothing Recommendations"
              shuffleDirection="left"
              duration={0.5}
              ease="power3.out"
              stagger={0.03}
              glowColor="#6366f1"
            />
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {clothingProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product}
                onAddToCart={handleAddToCart}
                onAddToWishlist={handleAddToWishlist}
              />
            ))}
          </div>
        </section>

        {/* Toy Recommendations */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            <Shuffle
              text="Toy Recommendations"
              shuffleDirection="right"
              duration={0.5}
              ease="power3.out"
              stagger={0.03}
              glowColor="#ec4899"
            />
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {toyProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product}
                onAddToCart={handleAddToCart}
                onAddToWishlist={handleAddToWishlist}
              />
            ))}
          </div>
        </section>

        {/* Food & Treat Recommendations */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            <Shuffle
              text="Food & Treat Recommendations"
              shuffleDirection="up"
              duration={0.5}
              ease="power3.out"
              stagger={0.03}
              glowColor="#f59e0b"
            />
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {foodProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product}
                onAddToCart={handleAddToCart}
                onAddToWishlist={handleAddToWishlist}
              />
            ))}
          </div>
        </section>

        {/* Trending Accessories */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            <Shuffle
              text="Trending Accessories"
              shuffleDirection="down"
              duration={0.5}
              ease="power3.out"
              stagger={0.03}
              glowColor="#10b981"
            />
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {accessories.map(product => (
              <ProductCard 
                key={product.id} 
                product={product}
                onAddToCart={handleAddToCart}
                onAddToWishlist={handleAddToWishlist}
              />
            ))}
          </div>
        </section>

        {/* Recently Viewed Products */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            <Shuffle
              text="Recently Viewed Products"
              shuffleDirection="left"
              duration={0.5}
              ease="power3.out"
              stagger={0.03}
              glowColor="#8b5cf6"
            />
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product}
                onAddToCart={handleAddToCart}
                onAddToWishlist={handleAddToWishlist}
              />
            ))}
          </div>
        </section>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2 mb-12">
          <button className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button className="px-3 py-2 bg-indigo-600 text-white rounded">1</button>
          <button className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded transition-colors">2</button>
          <button className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded transition-colors">3</button>
          <span className="px-3 py-2 text-gray-400">...</span>
          <button className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Pawfect Match</h3>
            <p className="text-gray-600 mb-4">Stay up-to-date with our latest products and offers!</p>
            <div className="flex justify-center gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
              <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between pt-8 border-t text-sm text-gray-600">
            <div>English</div>
            <div>© 2025 Pawfect Match</div>
            <div className="flex gap-4">
              <a href="#" className="hover:text-gray-900 transition-colors">Privacy</a>
              <a href="#" className="hover:text-gray-900 transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
