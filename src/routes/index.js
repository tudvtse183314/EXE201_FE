import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { PrivateRoute } from '../components/auth/PrivateRoute';

// Public Pages
import PublicHome from '../pages/public/Home';
import About from '../pages/public/About';
import Contact from '../pages/public/Contact';
import Services from '../pages/public/Services';
import PublicShop from '../pages/public/Shop';
import Login from '../pages/Login';
import Register from '../pages/Register';

// User Pages
import UserHome from '../pages/user/Home';
import UserDashboard from '../pages/user/UserDashboard';
import UserShop from '../pages/user/Shop';
import UserOrders from '../pages/user/Orders';
import UserAIAnalysis from '../pages/user/AIAnalysis';
import UserProfile from '../pages/user/Profile';
import UserPets from '../pages/user/Pets';

// Admin Pages
import AdminDashboard from '../pages/admin/Dashboard';
import AdminReports from '../pages/admin/Reports';
import AdminUserManagement from '../pages/admin/UserManagement';

// Shop Pages
import ShopAnalytics from '../pages/shop/Analytics';
import ShopOrders from '../pages/shop/Orders';
import ShopProducts from '../pages/shop/Products';

// Placeholder Components
const ComingSoon = ({ title }) => (
  <div className="min-h-screen bg-gray-100 p-8">
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">{title}</h1>
      <p className="text-lg text-gray-700">This page is coming soon...</p>
    </div>
  </div>
);

// Route Configuration
export const routeConfig = {
  // Public Routes
  public: [
    { path: '/', element: <PublicHome />, title: 'Home' },
    { path: '/about', element: <About />, title: 'About' },
    { path: '/contact', element: <Contact />, title: 'Contact' },
    { path: '/services', element: <Services />, title: 'Services' },
    { path: '/shop', element: <PublicShop />, title: 'Shop' },
    { path: '/login', element: <Login />, title: 'Login' },
    { path: '/register', element: <Register />, title: 'Register' }
  ],

  // User Routes (Authenticated)
  user: [
    { path: '/user/home', element: <UserHome />, title: 'User Home' },
    { path: '/user/profile', element: <UserDashboard />, title: 'Profile' },
    { path: '/user/shop', element: <UserShop />, title: 'User Shop' },
    { path: '/user/orders', element: <UserOrders />, title: 'Orders' },
    { path: '/user/ai-analysis', element: <UserAIAnalysis />, title: 'AI Analysis' },
    { path: '/user/pets', element: <UserPets />, title: 'My Pets' },
    { path: '/user/premium', element: <ComingSoon title="Premium" />, title: 'Premium' },
    { path: '/user/chat', element: <ComingSoon title="Chat" />, title: 'Chat' }
  ],

  // Admin Routes (Admin role required)
  admin: [
    { path: '/admin', element: <AdminDashboard />, title: 'Admin Dashboard' },
    { path: '/admin/reports', element: <AdminReports />, title: 'Reports' },
    { path: '/admin/users', element: <AdminUserManagement />, title: 'User Management' }
  ],

  // Shop Routes (Shop owner role required)
  shop: [
    { path: '/shop/analytics', element: <ShopAnalytics />, title: 'Shop Analytics' },
    { path: '/shop/orders', element: <ShopOrders />, title: 'Shop Orders' },
    { path: '/shop/products', element: <ShopProducts />, title: 'Shop Products' }
  ],

  // Legacy Routes
  legacy: [
    { path: '/dashboard', element: <UserDashboard />, title: 'Dashboard' }
  ]
};

// Main Routes Component
export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      {routeConfig.public.map((route) => (
        <Route key={route.path} path={route.path} element={route.element} />
      ))}

      {/* User Routes - Protected */}
      {routeConfig.user.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={
            <PrivateRoute>
              {route.element}
            </PrivateRoute>
          }
        />
      ))}

      {/* Admin Routes - Admin role required */}
      {routeConfig.admin.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={
            <PrivateRoute roles={['admin']}>
              {route.element}
            </PrivateRoute>
          }
        />
      ))}

      {/* Shop Routes - Shop owner role required */}
      {routeConfig.shop.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={
            <PrivateRoute roles={['shop_owner', 'admin']}>
              {route.element}
            </PrivateRoute>
          }
        />
      ))}

      {/* Legacy Routes */}
      {routeConfig.legacy.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={
            <PrivateRoute>
              {route.element}
            </PrivateRoute>
          }
        />
      ))}
    </Routes>
  );
};

// Helper functions for navigation
export const getRouteByPath = (path) => {
  const allRoutes = [
    ...routeConfig.public,
    ...routeConfig.user,
    ...routeConfig.admin,
    ...routeConfig.shop,
    ...routeConfig.legacy
  ];
  return allRoutes.find(route => route.path === path);
};

export const getRoutesByRole = (role) => {
  switch (role) {
    case 'admin':
      return [...routeConfig.public, ...routeConfig.user, ...routeConfig.admin, ...routeConfig.shop];
    case 'shop_owner':
      return [...routeConfig.public, ...routeConfig.user, ...routeConfig.shop];
    case 'user':
    case 'customer':
      return [...routeConfig.public, ...routeConfig.user];
    default:
      return routeConfig.public;
  }
};

export default AppRoutes;
