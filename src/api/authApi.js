import axiosInstance from './axiosInstance';
import API_CONFIG from '../config/api';
import { withRetry } from '../utils/retryApi';

export const authApi = {
  login: async (phone, password) => {
    // Backend expects { phone, password } format
    const loginData = { 
      phone: phone,
      password: password 
    };
    
    console.log('🔍 AuthApi: Sending login data:', loginData);
    
    return await withRetry(async () => {
      const response = await axiosInstance.post(API_CONFIG.ENDPOINTS.LOGIN, loginData);
      console.log('🔍 AuthApi: Login response:', response.data);
      return response.data;
    }, {
      maxRetries: 2, // Login should be fast, fewer retries
      onRetry: (attempt, error, delay) => {
        console.log(`🔄 Login retry ${attempt}: ${error.message}, waiting ${delay}ms`);
      }
    });
  },

  register: async (userData) => {
    // Backend expects specific format for registration
    const registerData = {
      fullName: userData.fullName,
      email: userData.email,
      phone: userData.phone,
      password: userData.password,
      role: userData.role || 'CUSTOMER',
      petName: userData.petName,
      petAge: userData.petAge,
      petType: userData.petType,
      petSize: userData.petSize
    };
    
    console.log('🔍 AuthApi: Sending register data:', registerData);
    
    return await withRetry(async () => {
      const response = await axiosInstance.post(API_CONFIG.ENDPOINTS.REGISTER, registerData);
      console.log('🔍 AuthApi: Register response:', response.data);
      return response.data;
    }, {
      maxRetries: 3, // Register might take longer, more retries
      onRetry: (attempt, error, delay) => {
        console.log(`🔄 Register retry ${attempt}: ${error.message}, waiting ${delay}ms`);
      }
    });
  },

  verifyToken: async (token) => {
    const response = await axiosInstance.get(API_CONFIG.ENDPOINTS.VERIFY_TOKEN, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
};
