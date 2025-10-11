import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { getRoutesByRole } from '../../routes';
import { useAppNavigation } from '../../hooks/useNavigation';

const NavigationMenu = ({ className = '', showPublicRoutes = false }) => {
  const { user, isAuthenticated } = useAuth();
  const { isActiveRoute } = useAppNavigation();

  // Get routes based on user role
  const availableRoutes = isAuthenticated 
    ? getRoutesByRole(user?.role || 'user')
    : getRoutesByRole('guest');

  // Filter routes to show
  const routesToShow = showPublicRoutes 
    ? availableRoutes 
    : availableRoutes.filter(route => !route.path.startsWith('/') || route.path !== '/');

  return (
    <nav className={className}>
      <ul className="space-y-2">
        {routesToShow.map((route) => (
          <li key={route.path}>
            <a
              href={route.path}
              className={`
                block px-3 py-2 rounded-md text-sm font-medium transition-colors
                ${isActiveRoute(route.path)
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }
              `}
            >
              {route.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NavigationMenu;
