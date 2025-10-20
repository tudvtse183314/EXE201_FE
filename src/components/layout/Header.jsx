import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, User, Heart, Menu, X, Phone } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button';
import SvgLogo from '../common/SvgLogo';
import SearchBar from './SearchBar';
import Breadcrumb from './Breadcrumb';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  // Different navigation items based on authentication status
  const publicNavigationItems = [
    { label: 'Home', path: '/' },
    { label: 'Shop', path: '/shop' },
    { label: 'AI Analysis', path: '/ai-analysis' },
    { label: 'Premium', path: '/services' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' }
  ];

  const userNavigationItems = [
    { label: 'Home', path: '/' },
    { label: 'Shop', path: '/shop' },
    { label: 'AI Analysis', path: '/ai-analysis' },
    { label: 'Premium', path: '/services' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' }
  ];

  const navigationItems = user ? userNavigationItems : publicNavigationItems;

  const iconButtons = [
    { icon: Search, label: 'Search', action: () => console.log('Search clicked') },
    { icon: Heart, label: 'Wishlist', action: () => console.log('Wishlist clicked') },
    { icon: ShoppingCart, label: 'Cart', action: () => console.log('Cart clicked') }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleDashboard = () => {
    navigate('/dashboard');
  };

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
                onMouseEnter={(e) => e.target.style.color = '#c47256'}
                onMouseLeave={(e) => e.target.style.color = '#facc15'}
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
              <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors duration-300">
                <Heart className="w-5 h-5" style={{ color: '#34140e' }} />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  0
                </span>
              </button>

              {/* Cart */}
              <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors duration-300">
                <ShoppingCart className="w-5 h-5" style={{ color: '#34140e' }} />
                <span className="absolute -top-1 -right-1 bg-oldCopper-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  0
                </span>
              </button>

              {/* User Actions */}
              {user ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-oldCopper-400 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-sm font-medium hidden sm:block" style={{ color: '#34140e' }}>
                      {user.name ? `Xin chào, ${user.name}` : `Welcome, ${user.email}`}
                    </span>
                  </div>
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={handleLogin}
                  >
                    Login
                  </Button>
                  <Button 
                    size="sm"
                    onClick={handleRegister}
                  >
                    Sign Up
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
            <nav className="hidden md:flex space-x-8 py-3">
              {navigationItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleNavigation(item.path)}
                  className={`text-base font-medium transition-all duration-300 px-4 py-2 rounded-lg ${
                    location.pathname === item.path 
                      ? 'text-white shadow-md' 
                      : 'text-gray-700 hover:text-c47256'
                  }`}
                  style={{ 
                    backgroundColor: location.pathname === item.path ? '#c47256' : 'transparent',
                    color: location.pathname === item.path ? '#ffffff' : undefined
                  }}
                  onMouseEnter={(e) => {
                    if (location.pathname !== item.path) {
                      e.target.style.color = '#c47256';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (location.pathname !== item.path) {
                      e.target.style.color = '#374151';
                    }
                  }}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
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
            {navigationItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleNavigation(item.path)}
                className={`block w-full text-left px-4 py-3 text-lg transition-all duration-300 rounded-lg ${
                  location.pathname === item.path ? 'font-semibold text-white shadow-md' : 'font-medium hover:bg-gray-50'
                }`}
                style={{ 
                  backgroundColor: location.pathname === item.path ? '#c47256' : 'transparent',
                  color: location.pathname === item.path ? '#ffffff' : '#34140e'
                }}
              >
                {item.label}
              </button>
            ))}
            
            {/* Mobile Auth Section */}
            <div className="pt-4 border-t border-gray-200 mt-4">
              {user ? (
                <div className="space-y-3">
                  {/* User Info */}
                  <div className="flex items-center space-x-3 px-3 py-2 bg-gray-50 rounded-md">
                    <div className="w-8 h-8 bg-oldCopper-400 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-sm font-medium" style={{ color: '#34140e' }}>
                      {user.name ? `Xin chào, ${user.name}` : `Welcome, ${user.email}`}
                    </span>
                  </div>
                  
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={() => {
                      handleDashboard();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full"
                  >
                    Dashboard
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full"
                  >
                    Logout
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
                    Login
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => {
                      handleRegister();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full"
                  >
                    Sign Up
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
