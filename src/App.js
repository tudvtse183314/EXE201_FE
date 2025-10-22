// src/App.js
import React, { useEffect, useRef, useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { LoadingProvider, useLoading } from "./context/LoadingContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import AppRoutes from "./routes/AppRoutes";
import LoadingSpinner from "./components/LoadingSpinner";
import { setGlobalLoadingState } from "./api/axios";

function AppContent() {
  const [initialLoading, setInitialLoading] = useState(true);
  const { apiLoading } = useAuth();
  const { loading, setLoadingState } = useLoading();

  // Guard StrictMode: chỉ đăng ký axios loader đúng 1 lần
  const registeredRef = useRef(false);
  useEffect(() => {
    if (!registeredRef.current) {
      setGlobalLoadingState(setLoadingState);
      registeredRef.current = true;
    }
  }, [setLoadingState]); 
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
    <LoadingProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <AppContent />
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </LoadingProvider>
  );
}


