// src/components/auth/RequireAuth.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function RequireAuth({ roles = [], children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Chưa login → về /login và giữ from để quay lại
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  
  // Chuẩn hoá role về UPPERCASE để so sánh
  const userRole = (user.role || "").toUpperCase();
  const requiredRoles = roles.map(r => r.toUpperCase());
  
  if (roles.length > 0 && !requiredRoles.includes(userRole)) {
    // Sai quyền → đá về trang chủ
    console.log("🚫 RequireAuth: User role", userRole, "not in required roles", requiredRoles);
    return <Navigate to="/" replace />;
  }
  
  return children;
}
