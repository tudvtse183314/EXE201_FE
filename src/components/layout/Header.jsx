// src/components/layout/Header.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Heart, Menu, X, Phone } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import Button from '../common/Button';
import SvgLogo from '../common/SvgLogo';
import SearchBar from './SearchBar';
import Breadcrumb from './Breadcrumb';
import NavAIButton from '../common/NavAIButton';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const { wishlistCount } = useWishlist();

  // --- MENU LOGIC ---------------------------------------------------------

  // Menu theo thứ tự yêu cầu
  // Chỉ hiển thị menu customer cho user có role CUSTOMER
  const userRole = user?.role?.toUpperCase();
  const isCustomer = userRole === 'CUSTOMER';
  
  const baseMenu = [
    { label: 'Trang chủ', path: '/' },
    { label: 'Cửa hàng', path: '/shop' },
    { label: 'Giới thiệu', path: '/about' },
    { label: 'Liên hệ', path: '/contact' },
    { label: 'Premium', path: '/premium' },
    ...(isCustomer ? [
      { label: 'Thú cưng của tôi', path: '/customer/my-pets', requiresAuth: true },
      { label: 'AI Phân tích', path: '/customer/ai', isSpecial: true, requiresAuth: true },
    ] : []),
  ];

  // Menu items không cần thay đổi theo user
  const navigationItems = baseMenu;

  // Những đường dẫn bắt buộc đăng nhập
  const authRequired = new Set([
    '/customer/my-pets',
    '/customer/ai',
    '/customer/cart',
    '/customer/wishlist',
    '/customer/orders',
    '/customer/profile',
  ]);

  const handleNavigation = (path) => {
    if (authRequired.has(path) && !user) {
      navigate('/login', { state: { from: location } });
      setMobileMenuOpen(false);
      return;
    }
    navigate(path);
    setMobileMenuOpen(false);
  };

  const handleLogin = () => {
    navigate('/login', { state: { from: location } });
  };

  const handleRegister = () => {
    navigate('/register');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + '/');

  // Thêm handler
  const handleProfileClick = () => {
    if (!user) return;
    navigate('/customer/profile');
    setMobileMenuOpen(false);
  };

  // -----------------------------------------------------------------------

  return (
    <>
      {/* Top Bar */}
      <div className="fixed top-0 w-full bg-gray-50 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left: Logo */}
            <div className="flex items-center space-x-4">
              <SvgLogo
                size="large"
                variant="default"
                onClick={() => handleNavigation('/')}
                className="hover:scale-105 transition-transform duration-300"
              />
              <span
                className="text-2xl font-bold cursor-pointer transition-colors duration-300"
                style={{ color: '#facc15' }}
                onMouseEnter={(e) => (e.target.style.color = '#c47256')}
                onMouseLeave={(e) => (e.target.style.color = '#facc15')}
                onClick={() => handleNavigation('/')}
              >
                Pawfect Match
              </span>
            </div>

            {/* Center: Search Bar */}
            <div className="hidden lg:block flex-1 max-w-2xl mx-8">
              <SearchBar />
            </div>

            {/* Right: Actions */}
            <div className="flex items-center space-x-4">
              {/* Hotline */}
              <div className="hidden md:flex items-center space-x-2 text-sm">
                <Phone className="w-4 h-4" style={{ color: '#c47256' }} />
                <span className="font-medium" style={{ color: '#34140e' }}>
                  0778 041 723
                </span>
              </div>

              {/* Wishlist */}
              <button 
                className="relative p-2 hover:bg-gray-100 rounded-full transition-colors duration-300"
                onClick={() => navigate('/wishlist')}
              >
                <Heart className="w-5 h-5" style={{ color: '#34140e' }} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {/* Cart */}
              <button 
                className="relative p-2 hover:bg-gray-100 rounded-full transition-colors duration-300"
                onClick={() => navigate('/cart')}
              >
                <ShoppingCart className="w-5 h-5" style={{ color: '#34140e' }} />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-oldCopper-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
              </button>

              {/* User Actions */}
              {user ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 cursor-pointer group"
                       onClick={handleProfileClick}
                       title="Trang cá nhân">
                    <div className="w-8 h-8 bg-oldCopper-400 rounded-full flex items-center justify-center group-hover:ring-2 ring-c47256 transition" >
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <span
                      className="text-sm font-medium hidden sm:block group-hover:text-c47256 transition"
                      style={{ color: '#34140e' }}
                    >
                      {user.name ? `Xin chào, ${user.name}` : `Xin chào, ${user.email}`}
                    </span>
                  </div>
                  <Button variant="secondary" size="sm" onClick={handleLogout}>
                    Đăng xuất
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button variant="secondary" size="sm" onClick={handleLogin}>
                    Đăng nhập
                  </Button>
                  <Button size="sm" onClick={handleRegister}>
                    Đăng ký
                  </Button>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors duration-300"
                style={{ color: '#34140e' }}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar - Navigation */}
      <div className="fixed top-16 w-full bg-gray-50 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <nav className="hidden md:flex items-center space-x-8 py-3">
              {navigationItems.map((item) => {
                if (item.isSpecial) {
                  return (
                    <NavAIButton key={item.path} size="desktop" />
                  );
                }
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className={`text-base font-medium transition-all duration-300 px-4 py-2 rounded-lg ${
                      isActive(item.path)
                        ? 'text-white shadow-md'
                        : 'text-gray-700 hover:text-c47256'
                    }`}
                    style={{
                      backgroundColor: isActive(item.path) ? '#c47256' : 'transparent',
                      color: isActive(item.path) ? '#ffffff' : undefined,
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive(item.path)) e.target.style.color = '#c47256';
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive(item.path)) e.target.style.color = '#374151';
                    }}
                    title={
                      authRequired.has(item.path) && !user
                        ? 'Bạn cần đăng nhập để truy cập'
                        : undefined
                    }
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Breadcrumb giữ nguyên layout cũ */}
      <div className="pt-32">
        <Breadcrumb />
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed top-32 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-30">
          <div className="px-4 py-4 space-y-1">
            {/* Mobile Search */}
            <div className="mb-4">
              <SearchBar />
            </div>

            {/* Mobile Navigation */}
            {navigationItems.map((item) => {
              if (item.isSpecial) {
                return (
                  <div key={item.path} className="flex justify-center py-3">
                    <NavAIButton size="mobile" />
                  </div>
                );
              }
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={`block w-full text-left px-4 py-3 text-lg transition-all duration-300 rounded-lg ${
                    isActive(item.path)
                      ? 'font-semibold text-white shadow-md'
                      : 'font-medium hover:bg-gray-50'
                  }`}
                  style={{
                    backgroundColor: isActive(item.path) ? '#c47256' : 'transparent',
                    color: isActive(item.path) ? '#ffffff' : '#34140e',
                  }}
                  title={
                    authRequired.has(item.path) && !user
                      ? 'Bạn cần đăng nhập để truy cập'
                      : undefined
                  }
                >
                  {item.label}
                </button>
              );
            })}

            {/* Mobile Auth Section */}
            <div className="pt-4 border-t border-gray-200 mt-4">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 px-3 py-2 bg-gray-50 rounded-md cursor-pointer group"
                       onClick={handleProfileClick}
                       title="Trang cá nhân">
                    <div className="w-8 h-8 bg-oldCopper-400 rounded-full flex items-center justify-center group-hover:ring-2 ring-c47256 transition">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-sm font-medium" style={{ color: '#34140e' }}>
                      {user.name ? `Xin chào, ${user.name}` : `Xin chào, ${user.email}`}
                    </span>
                  </div>

                  {/* Không đưa CUSTOMER vào dashboard */}
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full"
                  >
                    Đăng xuất
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      handleLogin();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full"
                  >
                    Đăng nhập
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      handleRegister();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full"
                  >
                    Đăng ký
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
