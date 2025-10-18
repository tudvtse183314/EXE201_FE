import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Heart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function SeasonalOutfits() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  // Auth Guard - Kiểm tra đăng nhập và role
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login', { replace: true });
      return;
    }
    
    if (user && user.role !== 'CUSTOMER') {
      navigate('/unauthorized', { replace: true });
      return;
    }
  }, [user, isAuthenticated, navigate]);

  const seasonalCollections = [
    {
      id: 1,
      title: 'Winter',
      description: 'Cozy sweaters and warm accessories for cold days',
      image: 'https://cdn.pixabay.com/photo/2017/12/27/14/02/friends-3042751_1280.jpg',
      color: 'from-blue-400 to-blue-600'
    },
    {
      id: 2,
      title: 'Spring',
      description: 'Light and fresh outfits for blooming season',
      image: 'https://cdn.pixabay.com/photo/2018/03/30/07/53/dog-3277415_1280.jpg',
      color: 'from-green-400 to-green-600'
    },
    {
      id: 3,
      title: 'Summer',
      description: 'Cool and comfortable styles for hot weather',
      image: 'https://cdn.pixabay.com/photo/2016/02/19/10/00/dog-1209621_1280.jpg',
      color: 'from-yellow-400 to-orange-500'
    },
    {
      id: 4,
      title: 'Autumn',
      description: 'Rich colors and layered looks for fall',
      image: 'https://cdn.pixabay.com/photo/2015/03/26/09/54/dog-690176_1280.jpg',
      color: 'from-orange-400 to-red-500'
    },
    {
      id: 5,
      title: 'Holiday',
      description: 'Festive outfits for special celebrations',
      image: 'https://cdn.pixabay.com/photo/2016/01/19/17/45/cat-114782_1280.jpg',
      color: 'from-red-400 to-pink-500'
    },
    {
      id: 6,
      title: 'Rainy',
      description: 'Waterproof gear and rain-ready accessories',
      image: 'https://cdn.pixabay.com/photo/2017/11/09/21/41/cat-2934720_1280.jpg',
      color: 'from-gray-400 to-blue-500'
    }
  ];

  const inspirationImages = [
    'https://cdn.pixabay.com/photo/2018/03/30/07/53/dog-3277415_1280.jpg',
    'https://cdn.pixabay.com/photo/2016/02/19/10/00/dog-1209621_1280.jpg',
    'https://cdn.pixabay.com/photo/2015/03/26/09/54/dog-690176_1280.jpg',
    'https://cdn.pixabay.com/photo/2016/01/19/17/45/cat-114782_1280.jpg',
    'https://cdn.pixabay.com/photo/2017/11/09/21/41/cat-2934720_1280.jpg'
  ];

  const categories = [
    {
      title: 'Cozy Comforts',
      description: 'Soft and warm essentials',
      icon: '🏠'
    },
    {
      title: 'Outdoor Adventures',
      description: 'Durable gear for exploration',
      icon: '🌲'
    },
    {
      title: 'Celebration',
      description: 'Special occasion outfits',
      icon: '🎉'
    },
    {
      title: 'Everyday',
      description: 'Daily wear favorites',
      icon: '👕'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-r from-purple-600 to-purple-800 overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: "url('https://cdn.pixabay.com/photo/2017/12/27/14/02/friends-3042751_1280.jpg')"
          }}
        />
        
        {/* Content */}
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center text-white px-4 max-w-4xl mx-auto">
            <motion.h1 
              className="text-5xl md:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Seasonal Style Spotlight
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl mb-8 opacity-90"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Discover curated collections tailored to your pet's seasonal needs and style preferences
            </motion.p>
            <motion.button
              className="bg-white text-purple-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors duration-300 shadow-lg flex items-center space-x-2 mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </section>

      {/* Curated Seasonal Collections */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Curated Seasonal Collections</h2>
            <p className="text-xl text-gray-600">Handpicked outfits for every season and occasion</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {seasonalCollections.map((collection, index) => (
              <motion.div
                key={collection.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={collection.image}
                    alt={collection.title}
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${collection.color} opacity-20`} />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{collection.title}</h3>
                  <p className="text-gray-600 mb-4">{collection.description}</p>
                  <button className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors duration-300">
                    View Outfit
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Inspiration Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Style Inspiration</h2>
            <p className="text-xl text-gray-600">Get inspired by our community's favorite looks</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {inspirationImages.map((image, index) => (
              <motion.div
                key={index}
                className="relative group cursor-pointer"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <img
                  src={image}
                  alt={`Inspiration ${index + 1}`}
                  className="w-full h-48 object-cover rounded-xl shadow-md group-hover:shadow-lg transition-shadow duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-xl transition-all duration-300 flex items-center justify-center">
                  <Heart className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Shop by Category</h2>
            <p className="text-xl text-gray-600">Find exactly what you're looking for</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-2xl shadow-sm text-center hover:shadow-md transition-shadow duration-300 cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="text-4xl mb-4">{category.icon}</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{category.title}</h3>
                <p className="text-sm text-gray-600">{category.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Style Guide Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <img
                src="https://cdn.pixabay.com/photo/2018/03/30/07/53/dog-3277415_1280.jpg"
                alt="Style Guide"
                className="w-full h-96 object-cover rounded-2xl shadow-lg"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-4xl font-bold text-gray-800 mb-6">Style Guide</h2>
              <p className="text-lg text-gray-600 mb-6">
                Our expert stylists have curated the perfect guide to help you choose the best outfits for your pet. 
                From understanding your pet's comfort needs to matching colors and styles, we've got you covered.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                Learn about seasonal considerations, material choices, and how to ensure your pet looks and feels 
                their absolute best in every outfit.
              </p>
              <button className="bg-purple-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-purple-700 transition-colors duration-300 flex items-center space-x-2">
                <span>Read Full Guide</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            
            {/* Logo */}
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold text-purple-400">Pawfect Match</h3>
              <p className="text-gray-400 mt-2">Your pet's perfect companion</p>
            </div>
            
            {/* Newsletter */}
            <div className="text-center">
              <h4 className="text-lg font-semibold mb-4">Stay Updated</h4>
              <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg font-semibold transition-colors duration-300">
                  Subscribe
                </button>
              </div>
            </div>
            
            {/* Copyright */}
            <div className="text-center md:text-right">
              <p className="text-gray-400 text-sm">© 2023 Pawfect Match.</p>
              <p className="text-gray-500 text-xs mt-1">All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
