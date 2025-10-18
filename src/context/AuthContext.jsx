import { createContext, useContext, useState, useEffect } from "react";
import { getProfile, verifyToken } from "../api/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = (userData, token) => {
    localStorage.setItem("authToken", token);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("role", userData.role); // Lưu role riêng biệt
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    localStorage.removeItem("role"); // Xóa role khi logout
    setUser(null);
  };

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (token) {
        await verifyToken(token);
        const data = await getProfile();
        setUser(data);
        // Cập nhật localStorage với data mới từ server
        localStorage.setItem("user", JSON.stringify(data));
        localStorage.setItem("role", data.role); // Cập nhật role từ server
      }
    } catch {
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("user");
    const storedRole = localStorage.getItem("role");
    
    if (token && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        // Đảm bảo role được khôi phục từ localStorage
        if (storedRole && !userData.role) {
          userData.role = storedRole;
        }
        setUser(userData);
        fetchProfile();
      } catch {
        logout();
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const isAuthenticated = () => !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
