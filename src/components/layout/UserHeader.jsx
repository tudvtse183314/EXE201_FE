// src/components/layout/UserHeader.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Heart, ShoppingCart, User, MessageCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Shuffle from '../effects/Shuffle';
import { motion } from 'framer-motion';
import SvgLogo from '../common/SvgLogo';

export default function UserHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  /**
   * Navigation items
   * - requiresAuth: nếu true thì bắt buộc đăng nhập mới cho vào
   * - Bạn có thể sửa path cho đúng router hiện có
   */
  const userNavigationItems = [
    { label: 'Home', path: '/', requiresAuth: false },
    { label: 'Shop', path: '/shop', requiresAuth: false },

    // 👇 Thêm theo yêu cầu
    { label: 'My Pets', path: '/my-pets', requiresAuth: true },
    { label: 'Profile', path: '/customer/profile', requiresAuth: true },

    // Các mục còn lại (tuỳ dự án)
    { label: 'Orders', path: '/customer/orders', requiresAuth: true },
    { label: 'AI Analysis', path: '/ai-analysis', requiresAuth: true }, // đổi thành /user/ai-analysis nếu bạn đang dùng path đó
    { label: 'Premium', path: '/cusomer/premium', requiresAuth: true },
    { label: 'Chat', path: '/customer/chat', requiresAuth: true },
  ];

  const iconButtons = [
    { icon: Search, label: 'Search', action: () => console.log('Search clicked') },
    { icon: Heart, label: 'Wishlist', action: () => console.log('Wishlist clicked') },
    { icon: ShoppingCart, label: 'Cart', action: () => console.log('Cart clicked') },
    { icon: MessageCircle, label: 'Chat', action: () => console.log('Chat clicked') }
  ];

  const handleNavigation = (itemOrPath, event) => {
    // Ngăn chặn hành vi mặc định của button
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    const item = typeof itemOrPath === 'string'
      ? userNavigationItems.find(i => i.path === itemOrPath) || { path: itemOrPath, requiresAuth: false }
      : itemOrPath;

    if (item.requiresAuth && !user) {
      // Chuyển tới login và nhớ from để quay lại sau khi đăng nhập
      navigate('/login', { state: { from: location } });
      setMobileMenuOpen(false);
      return;
    }
    navigate(item.path);
    setMobileMenuOpen(false);
  };

  const handleLogout = (event) => {
    // Ngăn chặn hành vi mặc định của button
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    logout();
    // Redirect về trang home (không đăng nhập)
    navigate('/', { replace: true });
  };

  const isActive = (path) => {
    // Active khi path khớp chính xác hoặc đang ở nhánh con
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

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
              <div className="flex items-center space-x-4">
                <motion.div 
                  className="flex items-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <SvgLogo 
                    size="medium"
                    variant="white"
                    onClick={(e) => handleNavigation('/', e)}
                    className="hover:scale-110"
                  />
                </motion.div>
                <motion.div 
                  className="flex items-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span 
                    className="text-xl font-bold text-cyan-400 cursor-pointer"
                    onClick={(e) => handleNavigation('/', e)}
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
                      text={`Hi, ${(user?.fullName || user?.name || user?.email || 'Pet Parent').split(' ')[0]}`}
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
                    type="button"
                    whileHover={{ 
                      scale: 1.1, 
                      textShadow: "0 0 12px #38bdf8",
                      y: -2
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => handleNavigation(item, e)}
                    className={`text-sm font-medium px-3 py-2 transition-all duration-300 rounded-lg ${
                      isActive(item.path)
                        ? 'text-cyan-400 bg-cyan-400/20 border border-cyan-400'
                        : 'text-gray-300 hover:text-white hover:bg-gray-700'
                    }`}
                    title={item.requiresAuth && !user ? 'Bạn cần đăng nhập để truy cập' : undefined}
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
                    {user?.fullName || user?.name || user?.email || 'User'}
                  </span>
                </motion.div>

                {/* Logout Button */}
                <motion.button
                  type="button"
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
                type="button"
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
                type="button"
                whileHover={{ x: 10, backgroundColor: "#1e40af" }}
                whileTap={{ scale: 0.98 }}
                onClick={(e) => handleNavigation(item, e)}
                className={`block w-full text-left px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                  isActive(item.path)
                    ? 'text-cyan-400 bg-cyan-400/20'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
                title={item.requiresAuth && !user ? 'Bạn cần đăng nhập để truy cập' : undefined}
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
                    {user?.fullName || user?.name || user?.email || 'User'}
                  </span>
                </div>
                <motion.button
                  type="button"
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
 * UserHeader.jsx (patched)
 * - Thêm "My Pets" & "Profile" trên header
 * - AI Analysis, Profile, Orders, My Pets, Premium, Chat: yêu cầu đăng nhập
 * - Nếu chưa đăng nhập khi bấm -> chuyển đến /login và lưu from để quay lại
 * - Home -> "/", Shop -> "/shop" (đổi được tuỳ router)
 */
