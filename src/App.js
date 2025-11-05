// src/App.js
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ConfigProvider } from "antd";
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

function AppContent() {
  const [initialLoading, setInitialLoading] = useState(true);
  const { apiLoading, logout } = useAuth();
  const { loading, setLoadingState } = useLoading();
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

  // Nếu health check của Auth fail, tạm thời không block toàn UI:
  const shouldBlock =
    initialLoading || loading || (process.env.NODE_ENV === "production" ? apiLoading : false);

  if (shouldBlock) {
    return <LoadingSpinner />;
  }

  return <AppRoutes />;
}

export default function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: "Poppins, ui-sans-serif, system-ui, 'Segoe UI', Roboto, Arial, sans-serif",
          fontFamilyCode: "source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace",
        },
        components: {
          Typography: {
            fontFamily: "Poppins, ui-sans-serif, system-ui",
            titleMarginTop: 0,
            titleMarginBottom: 8,
          },
          Button: {
            fontWeight: 600,
          },
          Input: {
            fontFamily: "Poppins, ui-sans-serif, system-ui",
          },
        },
      }}
    >
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
    </ConfigProvider>
  );
}


