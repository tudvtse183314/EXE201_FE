import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const PrivateRoute = ({ children, roles }) => {
  const { token, hasRole } = useAuth();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  // Nếu route có yêu cầu role, kiểm tra quyền
  if (roles && !hasRole(roles)) {
    return <Navigate to="/" replace />; // hoặc trang lỗi 403
  }

  return children;
};
