import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://exe201-be-uhno.onrender.com/api";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { 
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
  timeout: 150000,
  withCredentials: false // Tắt credentials để tránh CORS issues
});

console.log('API base =', axiosInstance.defaults.baseURL);
console.log('Axios timeout =', axiosInstance.defaults.timeout);

// Loading state management
let loadingCount = 0;
const setGlobalLoading = (show) => {
  // This will be set by the app when axios instance is created
  if (window.setGlobalLoading) {
    window.setGlobalLoading(show);
  }
};

// Auto attach token and manage loading
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  
  // Show loading for non-health check requests
  if (!config.url?.includes('/health')) {
    loadingCount++;
    if (loadingCount === 1) {
      setGlobalLoading(true);
    }
  }
  
  return config;
});

// Global error handler and loading management
axiosInstance.interceptors.response.use(
  (res) => {
    // Hide loading for non-health check requests
    if (!res.config.url?.includes('/health')) {
      loadingCount--;
      if (loadingCount === 0) {
        setGlobalLoading(false);
      }
    }
    return res;
  },
  (err) => {
    // Hide loading on error
    if (!err.config?.url?.includes('/health')) {
      loadingCount--;
      if (loadingCount === 0) {
        setGlobalLoading(false);
      }
    }
    
    if (err.response?.status === 401) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

// Export function to set global loading state
export const setGlobalLoadingState = (setLoading) => {
  window.setGlobalLoading = setLoading;
};

export default axiosInstance;
