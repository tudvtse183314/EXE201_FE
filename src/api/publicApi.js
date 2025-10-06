import axios from 'axios';
import mockAxios from './mockApi';

// Check if backend is available
const BACKEND_URL = 'http://localhost:8080/api';
const USE_MOCK_API = true; // Set to false when backend is available

// Axios instance for public endpoints (no authentication required)
const publicApi = axios.create({
  baseURL: BACKEND_URL,
  timeout: 10000 // 10 second timeout
});

// Request interceptor to handle errors
publicApi.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url, config.data);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
publicApi.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error);
    
    // If network error and mock API is enabled, use mock API
    if (USE_MOCK_API && (error.code === 'ERR_NETWORK' || error.message === 'Network Error')) {
      console.log('Backend unavailable, using mock API...');
      return handleWithMockApi(error.config);
    }
    
    return Promise.reject(error);
  }
);

// Function to handle requests with mock API
async function handleWithMockApi(config) {
  try {
    const { method, url, data } = config;
    const endpoint = url.replace(BACKEND_URL, '');
    
    console.log('Using Mock API for:', method?.toUpperCase(), endpoint);
    
    if (method?.toLowerCase() === 'post') {
      return await mockAxios.post(endpoint, data);
    } else if (method?.toLowerCase() === 'get') {
      return await mockAxios.get(endpoint);
    }
    
    throw new Error(`Mock API: Method ${method} not supported`);
  } catch (error) {
    console.error('Mock API Error:', error);
    throw error;
  }
}

export default publicApi;
