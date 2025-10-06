import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * Demo component showing route protection
 * Clearly demonstrates public vs private routes
 */
export default function RouteProtectionDemo() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const publicRoutes = [
    { path: '/', name: 'Home', description: 'Public homepage' },
    { path: '/about', name: 'About', description: 'About page' },
    { path: '/services', name: 'Services', description: 'Services page' },
    { path: '/shop', name: 'Public Shop', description: 'Browse products (login required for purchase)' },
    { path: '/contact', name: 'Contact', description: 'Contact page' },
    { path: '/login', name: 'Login', description: 'Login page' },
    { path: '/register', name: 'Register', description: 'Registration page' }
  ];

  const privateRoutes = [
    { path: '/user/home', name: 'User Home', description: 'Personalized homepage with carousel' },
    { path: '/user/profile', name: 'Pet Profile', description: 'Pet profile setup wizard' },
    { path: '/user/shop', name: 'User Shop', description: 'Enhanced shopping experience' },
    { path: '/user/orders', name: 'Orders', description: 'Order management' },
    { path: '/user/ai-analysis', name: 'AI Analysis', description: 'AI-powered recommendations' },
    { path: '/user/premium', name: 'Premium', description: 'Premium features' },
    { path: '/user/chat', name: 'Chat', description: 'Support chat' },
    { path: '/dashboard', name: 'Dashboard (Legacy)', description: 'Legacy dashboard route' }
  ];

  const adminRoutes = [
    { path: '/admin', name: 'Admin Dashboard', description: 'Admin panel (requires admin role)' }
  ];

  const getRouteStatus = (route) => {
    if (route.path.startsWith('/user/') || route.path === '/dashboard') {
      return token ? 'accessible' : 'protected';
    } else if (route.path === '/admin') {
      return user?.role === 'admin' ? 'accessible' : 'protected';
    } else {
      return 'public';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'public': return 'text-green-600 bg-green-50 border-green-200';
      case 'accessible': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'protected': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'public': return '🌐';
      case 'accessible': return '✅';
      case 'protected': return '🔒';
      default: return '❓';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">🛣️ Route Protection Demo</h1>
          <p className="text-xl text-gray-600">
            Clear demonstration of public vs private route access
          </p>
        </div>

        {/* Current Status */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold mb-6">📊 Current Authentication Status</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl mb-2">👤</div>
              <div className="font-semibold">User Status</div>
              <div className="text-sm text-gray-600">
                {user ? `✅ ${user.fullName || user.email}` : '❌ Not logged in'}
              </div>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl mb-2">🔑</div>
              <div className="font-semibold">Token Status</div>
              <div className="text-sm text-gray-600">
                {token ? '✅ Valid token' : '❌ No token'}
              </div>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl mb-2">📍</div>
              <div className="font-semibold">Current Route</div>
              <div className="text-sm text-gray-600 font-mono">
                {location.pathname}
              </div>
            </div>
          </div>
        </div>

        {/* Public Routes */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold mb-6">🌐 Public Routes</h2>
          <p className="text-gray-600 mb-6">
            These routes are accessible to everyone, no authentication required.
          </p>
          
          <div className="grid md:grid-cols-2 gap-4">
            {publicRoutes.map((route) => {
              const status = getRouteStatus(route);
              return (
                <div
                  key={route.path}
                  className={`p-4 rounded-lg border-2 ${getStatusColor(status)} cursor-pointer hover:shadow-md transition-shadow`}
                  onClick={() => navigate(route.path)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{route.name}</h3>
                    <span className="text-lg">{getStatusIcon(status)}</span>
                  </div>
                  <p className="text-sm mb-2">{route.description}</p>
                  <div className="text-xs font-mono text-gray-500">{route.path}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Private Routes */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold mb-6">🔒 Private Routes</h2>
          <p className="text-gray-600 mb-6">
            These routes require authentication. Users will be redirected to login if not authenticated.
          </p>
          
          <div className="grid md:grid-cols-2 gap-4">
            {privateRoutes.map((route) => {
              const status = getRouteStatus(route);
              return (
                <div
                  key={route.path}
                  className={`p-4 rounded-lg border-2 ${getStatusColor(status)} cursor-pointer hover:shadow-md transition-shadow`}
                  onClick={() => navigate(route.path)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{route.name}</h3>
                    <span className="text-lg">{getStatusIcon(status)}</span>
                  </div>
                  <p className="text-sm mb-2">{route.description}</p>
                  <div className="text-xs font-mono text-gray-500">{route.path}</div>
                  {status === 'protected' && (
                    <div className="mt-2 text-xs text-red-600 font-semibold">
                      ⚠️ Login required
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Admin Routes */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold mb-6">👑 Admin Routes</h2>
          <p className="text-gray-600 mb-6">
            These routes require admin role. Regular users will be redirected to home page.
          </p>
          
          <div className="grid md:grid-cols-2 gap-4">
            {adminRoutes.map((route) => {
              const status = getRouteStatus(route);
              return (
                <div
                  key={route.path}
                  className={`p-4 rounded-lg border-2 ${getStatusColor(status)} cursor-pointer hover:shadow-md transition-shadow`}
                  onClick={() => navigate(route.path)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{route.name}</h3>
                    <span className="text-lg">{getStatusIcon(status)}</span>
                  </div>
                  <p className="text-sm mb-2">{route.description}</p>
                  <div className="text-xs font-mono text-gray-500">{route.path}</div>
                  {status === 'protected' && (
                    <div className="mt-2 text-xs text-red-600 font-semibold">
                      ⚠️ Admin role required
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold mb-6">📋 Legend</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-50 border-2 border-green-200 rounded-lg">
              <div className="text-2xl mb-2">🌐</div>
              <h3 className="font-semibold text-green-600">Public Routes</h3>
              <p className="text-sm text-gray-600">
                Accessible to everyone, no authentication required
              </p>
            </div>
            
            <div className="text-center p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
              <div className="text-2xl mb-2">✅</div>
              <h3 className="font-semibold text-blue-600">Accessible</h3>
              <p className="text-sm text-gray-600">
                You have the required authentication/role
              </p>
            </div>
            
            <div className="text-center p-4 bg-red-50 border-2 border-red-200 rounded-lg">
              <div className="text-2xl mb-2">🔒</div>
              <h3 className="font-semibold text-red-600">Protected</h3>
              <p className="text-sm text-gray-600">
                Authentication or specific role required
              </p>
            </div>
          </div>
        </div>

        {/* Test Actions */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold mb-6">🧪 Test Actions</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">Without Authentication</h3>
              <div className="space-y-2">
                <button
                  onClick={() => navigate('/user/shop')}
                  className="w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                >
                  Try to access /user/shop (should redirect to login)
                </button>
                <button
                  onClick={() => navigate('/admin')}
                  className="w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                >
                  Try to access /admin (should redirect to home)
                </button>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4">Public Routes</h3>
              <div className="space-y-2">
                <button
                  onClick={() => navigate('/shop')}
                  className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                >
                  Access Public Shop (always works)
                </button>
                <button
                  onClick={() => navigate('/about')}
                  className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                >
                  Access About Page (always works)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center py-8">
          <p className="text-gray-600">
            Route protection demonstration for Pawfect Match
          </p>
          <div className="mt-4">
            <span className="text-sm text-gray-500">
              Click on any route card to navigate to that page
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}
