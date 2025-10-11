// Retry mechanism for API calls
import axios from 'axios';
import API_CONFIG from '../config/api';

// Retry configuration
const RETRY_CONFIG = {
  maxRetries: 3,
  retryDelay: 1000, // 1 second
  retryDelayMultiplier: 2, // Double delay each retry
  retryableErrors: ['ECONNABORTED', 'ERR_NETWORK', 'ETIMEDOUT'],
  retryableStatusCodes: [408, 429, 500, 502, 503, 504]
};

// Calculate delay for retry
const calculateRetryDelay = (attempt) => {
  return RETRY_CONFIG.retryDelay * Math.pow(RETRY_CONFIG.retryDelayMultiplier, attempt - 1);
};

// Check if error is retryable
const isRetryableError = (error) => {
  // Check for network/timeout errors
  if (RETRY_CONFIG.retryableErrors.includes(error.code)) {
    return true;
  }
  
  // Check for retryable status codes
  if (error.response && RETRY_CONFIG.retryableStatusCodes.includes(error.response.status)) {
    return true;
  }
  
  return false;
};

// Sleep function
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Retry wrapper for API calls
export const withRetry = async (apiCall, options = {}) => {
  const { maxRetries = RETRY_CONFIG.maxRetries, onRetry } = options;
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔄 API Call attempt ${attempt}/${maxRetries}`);
      const result = await apiCall();
      console.log(`✅ API Call successful on attempt ${attempt}`);
      return result;
    } catch (error) {
      lastError = error;
      console.log(`❌ API Call failed on attempt ${attempt}:`, error.message);
      
      // Check if error is retryable
      if (!isRetryableError(error) || attempt === maxRetries) {
        console.log(`🚫 Not retrying: ${error.message}`);
        throw error;
      }
      
      // Calculate delay for next retry
      const delay = calculateRetryDelay(attempt);
      console.log(`⏳ Retrying in ${delay}ms...`);
      
      // Call retry callback if provided
      if (onRetry) {
        onRetry(attempt, error, delay);
      }
      
      // Wait before retry
      await sleep(delay);
    }
  }
  
  throw lastError;
};

// Enhanced axios instance with retry
export const createRetryAxios = (baseConfig = {}) => {
  const axiosInstance = axios.create({
    ...baseConfig,
    timeout: API_CONFIG.TIMEOUT
  });
  
  // Request interceptor
  axiosInstance.interceptors.request.use(
    (config) => {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
      return config;
    },
    (error) => {
      console.error('❌ API Request Error:', error);
      return Promise.reject(error);
    }
  );
  
  // Response interceptor with retry logic
  axiosInstance.interceptors.response.use(
    (response) => {
      console.log(`✅ API Response: ${response.status} ${response.config.url}`);
      return response;
    },
    async (error) => {
      console.error(`❌ API Response Error: ${error.message}`);
      
      // If it's a retryable error, let the calling code handle retry
      if (isRetryableError(error)) {
        console.log('🔄 Error is retryable, will be handled by retry mechanism');
      }
      
      return Promise.reject(error);
    }
  );
  
  return axiosInstance;
};

// Retry wrapper for specific API calls
export const retryApiCall = (apiCall, options = {}) => {
  return withRetry(apiCall, {
    ...options,
    onRetry: (attempt, error, delay) => {
      console.log(`🔄 Retry ${attempt}: ${error.message}, waiting ${delay}ms`);
    }
  });
};

export default withRetry;
