import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useEffect } from 'react';

export const PrivateRoute = ({ children, roles }) => {
  const { token, user, hasRole } = useAuth();
  const location = useLocation();

  // Debug logging
  useEffect(() => {
    console.log('🔒 PrivateRoute Check:', {
      path: location.pathname,
      hasToken: !!token,
      hasUser: !!user,
      tokenValue: token ? `${token.substring(0, 10)}...` : 'null',
      userInfo: user ? { name: user.fullName || user.email, role: user.role } : 'null',
      requiredRoles: roles
    });
  }, [location.pathname, token, user, roles]);

  // Check if token exists
  if (!token) {
    console.log('❌ PrivateRoute: No token found, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user exists
  if (!user) {
    console.log('❌ PrivateRoute: No user found, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if token is valid (not just a string)
  if (token === 'undefined' || token === 'null' || token.trim() === '') {
    console.log('❌ PrivateRoute: Invalid token, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Nếu route có yêu cầu role, kiểm tra quyền
  if (roles && roles.length > 0 && !hasRole(roles)) {
    console.log('❌ PrivateRoute: Insufficient role, redirecting to home');
    return <Navigate to="/" replace />;
  }

  console.log('✅ PrivateRoute: Access granted');
  return children;
};
