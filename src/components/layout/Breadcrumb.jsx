import React from 'react';
import { useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export default function Breadcrumb() {
  const location = useLocation();

  // Map paths to readable names
  const pathMap = {
    '/': 'Home',
    '/about': 'About',
    '/services': 'Services',
    '/shop': 'Shop',
    '/contact': 'Contact',
    '/login': 'Login',
    '/register': 'Register',
    '/dashboard': 'Dashboard',
    '/orders': 'Orders',
    '/ai-analysis': 'AI Analysis',
    '/premium': 'Premium',
    '/chat': 'Chat',
    '/profile': 'Profile',
    '/customer/dashboard': 'Customer Dashboard',
    '/manager/dashboard': 'Manager Dashboard',
    '/doctor/dashboard': 'Doctor Dashboard',
    '/user/home': 'Home',
    '/my-pets': 'Thú cưng của tôi',
    '/ai/analysis': 'AI Analysis',
    '/ai/seasonal-outfits': 'Seasonal Outfits',
    '/unauthorized': 'Unauthorized'
  };

  // Generate breadcrumb items
  const generateBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(segment => segment !== '');
    const breadcrumbs = [
      { name: 'Pawfect Match', path: '/', isHome: true }
    ];

    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const name = pathMap[currentPath] || segment.charAt(0).toUpperCase() + segment.slice(1);
      breadcrumbs.push({
        name,
        path: currentPath,
        isLast: index === pathSegments.length - 1
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Don't show breadcrumb on home page
  if (location.pathname === '/') {
    return null;
  }

  return (
    <nav className="bg-gray-50 border-b border-gray-200 py-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ol className="flex items-center space-x-2 text-sm">
          {breadcrumbs.map((breadcrumb, index) => (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <ChevronRight className="w-4 h-4 text-gray-400 mx-2" />
              )}
              <div className="flex items-center">
                {breadcrumb.isHome && <Home className="w-4 h-4 mr-1" />}
                <span 
                  className={`${
                    breadcrumb.isLast 
                      ? 'font-semibold text-oldCopper-600' 
                      : 'text-gray-600 hover:text-oldCopper-600 cursor-pointer transition-colors duration-300'
                  }`}
                  style={{
                    color: breadcrumb.isLast ? '#c47256' : undefined
                  }}
                  onClick={() => {
                    if (!breadcrumb.isLast) {
                      window.location.href = breadcrumb.path;
                    }
                  }}
                >
                  {breadcrumb.name}
                </span>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
