// API Configuration
const API_CONFIG = {
  // Production API URL
  BASE_URL: process.env.REACT_APP_API_BASE_URL || 'https://exe201-be-uhno.onrender.com/api',
  
  // Timeout settings - Optimized for faster auth
  TIMEOUT: parseInt(process.env.REACT_APP_API_TIMEOUT) || 8000, // 8 seconds
  
  // Environment
  ENV: process.env.REACT_APP_ENV || 'production',
  
  // Mock API settings
  USE_MOCK_API: process.env.REACT_APP_USE_MOCK_API === 'true' || false,
  
  // Debug mode
  DEBUG: process.env.REACT_APP_DEBUG === 'true' || false,
  
  // API Endpoints
  ENDPOINTS: {
    LOGIN: '/login',
    REGISTER: '/register',
    ACCOUNT: '/account',
    VERIFY_TOKEN: '/auth/verify',
    HEALTH: '/health'
  }
};

export default API_CONFIG;
