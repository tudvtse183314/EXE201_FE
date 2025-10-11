import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, User, Heart, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button';
import SvgLogo from '../common/SvgLogo';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  // Different navigation items based on authentication status
  const publicNavigationItems = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Services', path: '/services' },
    { label: 'Shop', path: '/shop' },
    { label: 'Contact', path: '/contact' }
  ];

  const userNavigationItems = [
    { label: 'Home', path: '/' },
    { label: 'Profile', path: '/dashboard' },
    { label: 'Shop', path: '/shop' },
    { label: 'Order', path: '/orders' },
    { label: 'AI Analysis', path: '/ai-analysis' },
    { label: 'Premium', path: '/premium' },
    { label: 'Chat', path: '/chat' }
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
    <nav className="fixed top-0 w-full bg-white shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <SvgLogo 
              size="medium"
              variant="default"
              onClick={() => handleNavigation('/')}
              className="hover:scale-110"
            />
            <span 
              className="text-xl font-bold text-gray-900 cursor-pointer"
              onClick={() => handleNavigation('/')}
            >
              Pawfect Match
            </span>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-6">
              {navigationItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleNavigation(item.path)}
                  className={`text-gray-700 hover:text-indigo-600 transition-colors ${
                    location.pathname === item.path ? 'text-indigo-600 font-medium' : ''
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {iconButtons.map((button, index) => {
              const IconComponent = button.icon;
              return (
                <IconComponent 
                  key={index}
                  className="w-5 h-5 text-gray-600 cursor-pointer hover:text-indigo-600" 
                  onClick={button.action}
                />
              );
            })}
            
            {/* Authentication Buttons */}
            {user ? (
              <div className="flex items-center space-x-3">
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={handleDashboard}
                >
                  Dashboard
                </Button>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm text-gray-700">{user.name || user.email}</span>
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
              <div className="flex items-center space-x-3">
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
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigationItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleNavigation(item.path)}
                  className={`block w-full text-left px-3 py-2 text-gray-700 hover:text-indigo-600 transition-colors ${
                    location.pathname === item.path ? 'text-indigo-600 font-medium' : ''
                  }`}
                >
                  {item.label}
                </button>
              ))}
              
              {/* Mobile Auth Buttons */}
              <div className="px-3 py-2 border-t border-gray-200 mt-2">
                {user ? (
                  <div className="space-y-2">
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
      </div>
    </nav>
  );
}
