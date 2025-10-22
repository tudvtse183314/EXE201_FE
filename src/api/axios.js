// src/api/axios.js
import axios from "axios";

// ===== Global Loading Registry (đúng với App.js đang dùng) =====
let globalLoadingSetter = null;
export function setGlobalLoadingState(setter) {
  globalLoadingSetter = typeof setter === "function" ? setter : null;
}
// ===============================================================

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "https://exe201-be-uhno.onrender.com/api",
  timeout: 60000,
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

axiosInstance.interceptors.request.use(
  (config) => {
    onReqStart();
    const token = localStorage.getItem("accessToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    onReqEnd();
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (res) => {
    onReqEnd();
    return res;
  },
  (error) => {
    onReqEnd();
    return Promise.reject(error);
  }
);

export default axiosInstance;
