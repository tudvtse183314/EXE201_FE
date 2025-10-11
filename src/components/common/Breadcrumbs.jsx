import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { useAppNavigation } from '../../hooks/useNavigation';

const Breadcrumbs = ({ className = '' }) => {
  const { getBreadcrumbs, currentPath } = useAppNavigation();
  const breadcrumbs = getBreadcrumbs();

  // Don't show breadcrumbs for home page or if no breadcrumbs
  if (currentPath === '/' || breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav className={`flex items-center space-x-2 text-sm text-gray-600 ${className}`}>
      {/* Home icon */}
      <Link 
        to="/" 
        className="flex items-center hover:text-indigo-600 transition-colors"
      >
        <Home className="w-4 h-4" />
      </Link>
      
      {/* Breadcrumb items */}
      {breadcrumbs.map((breadcrumb, index) => (
        <React.Fragment key={breadcrumb.path}>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          {breadcrumb.isLast ? (
            <span className="text-gray-900 font-medium">
              {breadcrumb.title}
            </span>
          ) : (
            <Link 
              to={breadcrumb.path}
              className="hover:text-indigo-600 transition-colors"
            >
              {breadcrumb.title}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumbs;
