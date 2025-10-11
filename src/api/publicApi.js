import axios from 'axios';
import mockAxios from './mockApi';
import API_CONFIG from '../config/api';

// Axios instance for public endpoints (no authentication required)
const publicApi = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT
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
    if (API_CONFIG.USE_MOCK_API && (error.code === 'ERR_NETWORK' || error.message === 'Network Error')) {
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
    const endpoint = url.replace(API_CONFIG.BASE_URL, '');
    
    console.log('Using Mock API for:', method?.toUpperCase(), endpoint);
    
    if (method?.toLowerCase() === 'post') {
      return await mockAxios.post(endpoint, data);
    } else if (method?.toLowerCase() === 'get') {
      return await mockAxios.get(endpoint, config);
    }
    
    throw new Error(`Mock API: Method ${method} not supported`);
  } catch (error) {
    console.error('Mock API Error:', error);
    throw error;
  }
}

// Function to fetch user account data
export const fetchUserAccount = async (token) => {
  try {
    console.log('Fetching user account data with token:', token ? `${token.substring(0, 10)}...` : 'null');
    
    const response = await publicApi.get(API_CONFIG.ENDPOINTS.ACCOUNT, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('User account response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching user account:', error);
    
    // If using mock API, return mock user data
    if (API_CONFIG.USE_MOCK_API && (error.code === 'ERR_NETWORK' || error.message === 'Network Error')) {
      console.log('Backend unavailable, returning mock user data...');
      return {
        id: 1,
        fullName: 'Test User',
        email: 'test@example.com',
        phone: '1234567890',
        role: 'CUSTOMER',
        petName: 'Buddy',
        petType: 'dog',
        petAge: '2 years',
        petSize: 'medium'
      };
    }
    
    throw error;
  }
};

export default publicApi;
