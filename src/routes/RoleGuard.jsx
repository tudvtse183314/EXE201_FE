import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RoleGuard({ roles, children }) {
  const { user } = useAuth();
  
  // Chưa đăng nhập → chuyển đến trang login
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Chuẩn hóa role về UPPERCASE để so sánh (tránh lỗi do case sensitivity)
  const userRole = (user.role || "").toUpperCase();
  const requiredRoles = roles.map(r => (r || "").toUpperCase());
  
  // Kiểm tra quyền truy cập
  if (roles.length > 0 && !requiredRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return children;
}


