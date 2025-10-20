import axiosInstance from "./axios";

export const login = async (phone, password) => {
  const res = await axiosInstance.post("/login", { phone, password });
  return res.data;
};

export const register = async (data) => {
  try {
    console.log('🔐 Register: Sending request to:', axiosInstance.defaults.baseURL + '/register');
    console.log('🔐 Register: Data:', data);
    
    const res = await axiosInstance.post("/register", data);
    return res.data;
  } catch (error) {
    console.error('🔐 Register: Error details:', {
      message: error.message,
      code: error.code,
      response: error.response?.data,
      status: error.response?.status,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL
      }
    });

    // Handle network errors
    if (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error')) {
      throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng và thử lại.');
    }

    // Handle timeout errors
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Server đang phản hồi chậm, vui lòng thử lại.');
    }

    // Handle CORS errors
    if (error.message.includes('CORS') || error.message.includes('cross-origin')) {
      throw new Error('Lỗi CORS. Vui lòng liên hệ admin để khắc phục.');
    }

    // Re-throw with more specific error information
    if (error.response?.data) {
      const errorData = error.response.data;
      if (typeof errorData === 'string' && errorData.includes('Duplicate entry')) {
        if (errorData.includes('email')) {
          throw new Error('Email này đã được sử dụng. Vui lòng chọn email khác.');
        } else if (errorData.includes('phone')) {
          throw new Error('Số điện thoại này đã được sử dụng. Vui lòng chọn số khác.');
        }
      }
    }
    throw error;
  }
};

export const getProfile = async () => {
  const res = await axiosInstance.get("/account");
  return res.data;
};

export const logout = async () => {
  const res = await axiosInstance.post("/logout");
  return res.data;
};

export const verifyToken = async (token) => {
  const res = await axiosInstance.get("/auth/verify", {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};
