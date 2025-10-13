import axiosInstance from './axiosInstance';
import API_CONFIG from '../config/api';

export const authApi = {
  login: async (phone, password) => {
    const response = await axiosInstance.post(API_CONFIG.ENDPOINTS.LOGIN, {
      phone,
      password
    });
    return response.data;
  },

  register: async (userData) => {
    const response = await axiosInstance.post(API_CONFIG.ENDPOINTS.REGISTER, {
      fullName: userData.fullName,
      email: userData.email,
      phone: userData.phone,
      password: userData.password,
      role: userData.role || 'CUSTOMER',
      petName: userData.petName,
      petAge: userData.petAge,
      petType: userData.petType,
      petSize: userData.petSize
    });
    return response.data;
  },

  verifyToken: async (token) => {
    const response = await axiosInstance.get(API_CONFIG.ENDPOINTS.VERIFY_TOKEN, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
};
