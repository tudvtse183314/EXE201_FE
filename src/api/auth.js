import axiosInstance from "./axios";

export const login = async (phone, password) => {
  const res = await axiosInstance.post("/login", { phone, password });
  return res.data;
};

export const register = async (data) => {
  try {
    const res = await axiosInstance.post("/register", data);
    return res.data;
  } catch (error) {
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
