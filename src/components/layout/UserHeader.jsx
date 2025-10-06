import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Heart, ShoppingCart, User, MessageCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Shuffle from '../effects/Shuffle';
import { motion } from 'framer-motion';

export default function UserHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Navigation items for logged-in users
  const userNavigationItems = [
    { label: 'Home', path: '/user/home' },
    { label: 'Profile', path: '/user/profile' },
    { label: 'Shop', path: '/user/shop' },
    { label: 'Order', path: '/user/orders' },
    { label: 'AI Analysis', path: '/user/ai-analysis' },
    { label: 'Premium', path: '/user/premium' },
    { label: 'Chat', path: '/user/chat' }
  ];

  const iconButtons = [
    { icon: Search, label: 'Search', action: () => console.log('Search clicked') },
    { icon: Heart, label: 'Wishlist', action: () => console.log('Wishlist clicked') },
    { icon: ShoppingCart, label: 'Cart', action: () => console.log('Cart clicked') },
    { icon: MessageCircle, label: 'Chat', action: () => console.log('Chat clicked') }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Removed unused handleDashboard function

  return (
    <header className="w-full bg-black text-white shadow-lg relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-4 left-10 w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
        <div className="absolute top-8 right-20 w-1 h-1 bg-purple-400 rounded-full animate-ping"></div>
        <div className="absolute bottom-6 left-1/4 w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce"></div>
        <div className="absolute bottom-4 right-1/3 w-1 h-1 bg-yellow-400 rounded-full animate-pulse"></div>
      </div>

      <div className="relative z-10">
        {/* Navigation Bar with Welcome Message */}
        <nav className="bg-gray-900 bg-opacity-50 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center h-16">
              {/* Logo and Welcome */}
              <div className="flex items-center space-x-6">
                <motion.div 
                  className="flex items-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span 
                    className="text-xl font-bold text-cyan-400 cursor-pointer"
                    onClick={() => handleNavigation('/user/home')}
                  >
                    Pawfect Match
                  </span>
                </motion.div>
                
                {/* Welcome Message */}
                <motion.div 
                  className="hidden md:block"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  <div className="text-sm">
                    <Shuffle
                      text={`Hi, ${(user?.fullName || user?.email || 'Pet Parent').split(' ')[0]}`}
                      shuffleDirection="left"
                      duration={0.4}
                      ease="power3.out"
                      stagger={0.03}
                      glowColor="#22d3ee"
                    />
                  </div>
                </motion.div>
              </div>
              
              {/* Desktop Navigation */}
              <div className="hidden md:flex space-x-8">
                {userNavigationItems.map((item, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ 
                      scale: 1.1, 
                      textShadow: "0 0 12px #38bdf8",
                      y: -2
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleNavigation(item.path)}
                    className={`text-sm font-medium px-3 py-2 transition-all duration-300 rounded-lg ${
                      location.pathname === item.path
                        ? 'text-cyan-400 bg-cyan-400 bg-opacity-20 border border-cyan-400'
                        : 'text-gray-300 hover:text-white hover:bg-gray-700'
                    }`}
                  >
                    {item.label}
                  </motion.button>
                ))}
              </div>

              {/* Desktop Actions */}
              <div className="hidden md:flex items-center space-x-4">
                {iconButtons.map((button, index) => {
                  const IconComponent = button.icon;
                  return (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <IconComponent 
                        className="w-5 h-5 text-gray-300 cursor-pointer hover:text-cyan-400 transition-colors duration-300" 
                        onClick={button.action}
                      />
                    </motion.div>
                  );
                })}
                
                {/* User Avatar */}
                <motion.div 
                  className="flex items-center space-x-2"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full flex items-center justify-center cursor-pointer">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm text-gray-300">
                    {user?.fullName || user?.email || 'User'}
                  </span>
                </motion.div>

                {/* Logout Button */}
                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: "#ef4444" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="text-sm font-medium px-4 py-2 bg-gray-700 hover:bg-red-600 text-white rounded-lg transition-colors duration-300"
                >
                  Logout
                </motion.button>
              </div>

              {/* Mobile Menu Button */}
              <motion.button 
                className="md:hidden"
                whileTap={{ scale: 0.9 }}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <div className="w-6 h-6 flex flex-col justify-center space-y-1">
                  <motion.div 
                    className="w-6 h-0.5 bg-cyan-400"
                    animate={mobileMenuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                  <motion.div 
                    className="w-6 h-0.5 bg-cyan-400"
                    animate={mobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                  <motion.div 
                    className="w-6 h-0.5 bg-cyan-400"
                    animate={mobileMenuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </motion.button>
            </div>
          </div>
        </nav>

        {/* Mobile Menu */}
        <motion.div 
          className="md:hidden bg-gray-900 bg-opacity-95 backdrop-blur-sm"
          initial={{ opacity: 0, height: 0 }}
          animate={{ 
            opacity: mobileMenuOpen ? 1 : 0, 
            height: mobileMenuOpen ? 'auto' : 0 
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="px-4 py-4 space-y-2">
            {userNavigationItems.map((item, index) => (
              <motion.button
                key={index}
                whileHover={{ x: 10, backgroundColor: "#1e40af" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleNavigation(item.path)}
                className={`block w-full text-left px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                  location.pathname === item.path
                    ? 'text-cyan-400 bg-cyan-400 bg-opacity-20'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                {item.label}
              </motion.button>
            ))}
            
            {/* Mobile Actions */}
            <div className="pt-4 border-t border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm text-gray-300">
                    {user?.fullName || user?.email || 'User'}
                  </span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: "#ef4444" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="text-sm font-medium px-4 py-2 bg-gray-700 hover:bg-red-600 text-white rounded-lg transition-colors duration-300"
                >
                  Logout
                </motion.button>
              </div>
              
              {/* Mobile Icon Buttons */}
              <div className="flex justify-center space-x-6">
                {iconButtons.map((button, index) => {
                  const IconComponent = button.icon;
                  return (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.3, rotate: 10 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <IconComponent 
                        className="w-6 h-6 text-gray-300 cursor-pointer hover:text-cyan-400 transition-colors duration-300" 
                        onClick={button.action}
                      />
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </header>
  );
}

/**
 * UserHeader.jsx
 * Enhanced header for logged-in users with:
 * - Animated "WELCOME! USERNAME" text with shuffle effect and cyan glow
 * - Smooth navigation with hover effects and active states
 * - Animated background particles
 * - Mobile-responsive design with animated hamburger menu
 * - Maintains original navigation logic and routing
 * - Uses Framer Motion for smooth animations
 */
