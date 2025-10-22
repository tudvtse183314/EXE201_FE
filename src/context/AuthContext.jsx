// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { getProfile } from "../api/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // Đang khởi tạo từ localStorage / xác thực thụ động
  const [isLoading, setIsLoading] = useState(true);
  // Cho phép trang khác hiển thị loading riêng (khi gọi API cục bộ)
  const [apiLoading, setApiLoading] = useState(false);

  // Đăng nhập: lưu token + user vào localStorage và state
  const login = (userData, token) => {
    localStorage.setItem("accessToken", token);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("role", userData?.role ?? "");
    setUser(userData);
  };

  // Đăng xuất: xoá localStorage và đưa user về null
  const logout = () => {
    ["accessToken", "user", "role"].forEach((k) => localStorage.removeItem(k));
    setUser(null);
  };

  // Khởi tạo: đọc localStorage; có token thì set tạm user,
  // TUỲ CHỌN gọi getProfile() để đồng bộ thông tin (nếu BE có /profile)
  useEffect(() => {
    let isMounted = true;

    const bootstrap = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const rawUser = localStorage.getItem("user");

        if (!token || !rawUser) {
          if (isMounted) setIsLoading(false);
          return;
        }

        // Set tạm từ localStorage để UI không giật
        const parsed = JSON.parse(rawUser);
        if (isMounted) setUser(parsed);

        // TẠM THỜI TẮT getProfile() để tránh loop
        // TODO: Bật lại khi BE có endpoint /profile hoạt động
        console.log("[Auth] Using cached user data, skipping getProfile()");

        if (isMounted) setIsLoading(false);
      } catch (err) {
        console.error("[Auth] bootstrap error:", err);
        ["accessToken", "user", "role"].forEach((k) => localStorage.removeItem(k));
        if (isMounted) {
          setUser(null);
          setIsLoading(false);
        }
      }
    };

    bootstrap();
    return () => {
      isMounted = false;
    };
  }, []);

  const isAuthenticated = () => !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isLoading,
        apiLoading,
        setApiLoading,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
