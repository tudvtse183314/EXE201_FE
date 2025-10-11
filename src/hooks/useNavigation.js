import { useNavigate, useLocation } from 'react-router-dom';
import { routeConfig } from '../routes';

/**
 * Custom hook for navigation with route validation
 */
export const useAppNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Navigate to a specific route
  const goTo = (path, options = {}) => {
    // Validate route exists
    const route = getRouteByPath(path);
    if (!route) {
      console.warn(`Route ${path} not found in route configuration`);
    }
    
    navigate(path, options);
  };

  // Navigate to user routes
  const goToUser = (route, options = {}) => {
    const userRoute = `/user/${route}`;
    goTo(userRoute, options);
  };

  // Navigate to admin routes
  const goToAdmin = (route, options = {}) => {
    const adminRoute = `/admin${route ? `/${route}` : ''}`;
    goTo(adminRoute, options);
  };

  // Navigate to shop routes
  const goToShop = (route, options = {}) => {
    const shopRoute = `/shop/${route}`;
    goTo(shopRoute, options);
  };

  // Navigate to public routes
  const goToPublic = (route, options = {}) => {
    const publicRoute = route.startsWith('/') ? route : `/${route}`;
    goTo(publicRoute, options);
  };

  // Get current route info
  const getCurrentRoute = () => {
    return getRouteByPath(location.pathname);
  };

  // Check if current route is active
  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  // Get breadcrumbs for current route
  const getBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs = [];
    
    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const route = getRouteByPath(currentPath);
      if (route) {
        breadcrumbs.push({
          path: currentPath,
          title: route.title,
          isLast: index === pathSegments.length - 1
        });
      }
    });
    
    return breadcrumbs;
  };

  // Navigate back with fallback
  const goBack = (fallbackPath = '/') => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(fallbackPath);
    }
  };

  return {
    // Navigation functions
    goTo,
    goToUser,
    goToAdmin,
    goToShop,
    goToPublic,
    goBack,
    
    // Route information
    getCurrentRoute,
    isActiveRoute,
    getBreadcrumbs,
    
    // Current location
    currentPath: location.pathname,
    currentRoute: getCurrentRoute()
  };
};

// Helper function to get route by path
const getRouteByPath = (path) => {
  const allRoutes = [
    ...routeConfig.public,
    ...routeConfig.user,
    ...routeConfig.admin,
    ...routeConfig.shop,
    ...routeConfig.legacy
  ];
  return allRoutes.find(route => route.path === path);
};

export default useAppNavigation;
