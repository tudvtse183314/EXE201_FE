// src/App.js
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ConfigProvider, App as AntApp } from "antd";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { LoadingProvider, useLoading } from "./context/LoadingContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { ToastProvider } from "./context/ToastContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AppRoutes from "./routes/AppRoutes";
import LoadingSpinner from "./components/LoadingSpinner";
import { setGlobalLoadingState, setGlobalLogoutFunction, setGlobalNavigateFunction } from "./api/axios";
import { antdThemeConfig } from "./config/antdTheme";

function AppContent() {
  const [initialLoading, setInitialLoading] = useState(true);
  const { apiLoading, logout } = useAuth();
  const { setLoadingState } = useLoading();
  const navigate = useNavigate();

  // Guard StrictMode: chỉ đăng ký axios loader đúng 1 lần
  const registeredRef = useRef(false);
  useEffect(() => {
    if (!registeredRef.current) {
      setGlobalLoadingState(setLoadingState);
      setGlobalLogoutFunction(logout);
      setGlobalNavigateFunction(navigate);
      registeredRef.current = true;
    }
  }, [setLoadingState, logout, navigate]); 
  // Lưu ý: setter từ context thường ổn định, nếu không thì đổi sang [] và gọi trong onMount của LoadingProvider.

  // Tránh chặn UI quá lâu: giảm fake-loading hoặc bỏ hẳn
  useEffect(() => {
    const t = setTimeout(() => setInitialLoading(false), 400); // hoặc 0ms để bỏ hẳn
    return () => clearTimeout(t);
  }, []);

  // Chỉ block UI khi:
  // - app mới khởi động (initialLoading)
  // - và NẾU ở production thì chờ health-check / apiLoading
  // 👉 KHÔNG dùng loading từ LoadingContext để chặn toàn bộ App,
  // vì loading này đang được bật cho mọi axios request (trong đó có /orders/all).
  // Nếu dùng loading để block App, sẽ gây ra vòng lặp:
  // fetch → loading=true → AppRoutes unmount → fetch xong → loading=false → AppRoutes mount → fetch lại...
  const shouldBlock =
    initialLoading || (process.env.NODE_ENV === "production" ? apiLoading : false);

  if (shouldBlock) {
    return <LoadingSpinner />;
  }

  return <AppRoutes />;
}

export default function App() {
  return (
    <ConfigProvider theme={antdThemeConfig}>
      <AntApp>
        <LoadingProvider>
          <AuthProvider>
            <ToastProvider>
              <CartProvider>
                <WishlistProvider>
                  <AppContent />
                  <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                  />
                </WishlistProvider>
              </CartProvider>
            </ToastProvider>
          </AuthProvider>
        </LoadingProvider>
      </AntApp>
    </ConfigProvider>
  );
}


