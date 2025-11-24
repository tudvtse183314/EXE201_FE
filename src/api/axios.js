// src/api/axios.js
import axios from "axios";
import { toast } from "react-toastify";

// ===== Global Loading Registry (đúng với App.js đang dùng) =====
let globalLoadingSetter = null;
export function setGlobalLoadingState(setter) {
  globalLoadingSetter = typeof setter === "function" ? setter : null;
}

// ===== Global Logout Function =====
let globalLogoutFunction = null;
export function setGlobalLogoutFunction(logoutFn) {
  globalLogoutFunction = typeof logoutFn === "function" ? logoutFn : null;
}

// ===== Navigation Function =====
let globalNavigateFunction = null;
export function setGlobalNavigateFunction(navigateFn) {
  globalNavigateFunction = typeof navigateFn === "function" ? navigateFn : null;
}
// ===============================================================

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "https://exe201-be-uhno.onrender.com/api",
  timeout: 90000, // Tăng timeout lên 90 giây cho các request có thể chậm (như register)
  withCredentials: false,
});

let activeRequests = 0;
function onReqStart() {
  activeRequests += 1;
  if (globalLoadingSetter && activeRequests === 1) globalLoadingSetter(true);
}
function onReqEnd() {
  activeRequests = Math.max(0, activeRequests - 1);
  if (globalLoadingSetter && activeRequests === 0) globalLoadingSetter(false);
}

// Request interceptor: gắn Bearer token
axiosInstance.interceptors.request.use(
  (config) => {
    onReqStart();
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    onReqEnd();
    return Promise.reject(error);
  }
);

// Response interceptor: xử lý 401, 403
axiosInstance.interceptors.response.use(
  (res) => {
    onReqEnd();
    return res;
  },
  (error) => {
    onReqEnd();
    const status = error.response?.status;
    const responseData = error.response?.data;

    // Xử lý 401: Phiên hết hạn → logout + redirect login
    if (status === 401) {
      const errorMessage = responseData?.message || "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 4000,
      });
      
      // Clear auth data
      ["accessToken", "user", "role"].forEach((k) => localStorage.removeItem(k));
      
      // Call global logout function if available
      if (globalLogoutFunction) {
        globalLogoutFunction();
      }
      
      // Navigate to login (sau khi logout context clear)
      if (globalNavigateFunction) {
        setTimeout(() => {
          globalNavigateFunction("/login");
        }, 100);
      } else {
        // Fallback: reload page nếu không có navigate function
        window.location.href = "/login";
      }
      
      return Promise.reject(error);
    }

    // Xử lý 403: Không có quyền → toast error
    if (status === 403) {
      const errorMessage = responseData?.message || "Bạn không có quyền truy cập trang này.";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 4000,
      });
      return Promise.reject(error);
    }

    // Các lỗi khác: trả về như bình thường (để component xử lý)
    return Promise.reject(error);
  }
);

export default axiosInstance;
