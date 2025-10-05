import { Navigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const PrivateRoute = ({ children, roles }) => {
  const { user, hasRole } = useContext(AuthContext);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && !roles.some(role => hasRole(role))) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};