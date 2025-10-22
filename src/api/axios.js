// src/api/axios.js
import axios from 'axios';

// ===== Global Loading Registry (đúng chữ ký App.js đang gọi) =====
let globalLoadingSetter = null;

/**
 * App.js sẽ gọi hàm này: setGlobalLoadingState(setIsLoading)
 * -> mình lưu setter để bật/tắt overlay khi có request.
 */
export function setGlobalLoadingState(setter) {
  globalLoadingSetter = typeof setter === 'function' ? setter : null;
}
// =================================================================

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'https://exe201-be-uhno.onrender.com/api',
  timeout: 60000, // đủ chịu cold-start Render
  withCredentials: false,
});

// Đếm số request đang active để điều khiển loading
let activeRequests = 0;

function turnOnLoading() {
  if (globalLoadingSetter && activeRequests === 1) {
    // chỉ bật khi từ 0 -> 1 để tránh giựt
    globalLoadingSetter(true);
  }
}
function turnOffLoading() {
  if (globalLoadingSetter && activeRequests <= 0) {
    globalLoadingSetter(false);
  }
}

axiosInstance.interceptors.request.use(
  (config) => {
    activeRequests += 1;
    turnOnLoading();

    // Đính token nếu có
    const token = localStorage.getItem('accessToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;

    return config;
  },
  (error) => {
    activeRequests = Math.max(0, activeRequests - 1);
    if (activeRequests === 0) turnOffLoading();
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    activeRequests = Math.max(0, activeRequests - 1);
    if (activeRequests === 0) turnOffLoading();
    return response;
  },
  async (error) => {
    activeRequests = Math.max(0, activeRequests - 1);
    if (activeRequests === 0) turnOffLoading();
    return Promise.reject(error);
  }
);

export default axiosInstance;
