// src/api/auth.js
import axiosInstance from "./axios";

/**
 * LOGIN: BE chỉ chấp nhận { phone, password }
 * -> FE phải đăng nhập bằng SĐT, KHÔNG gửi email vào body.
 */
export const login = async (phone, password) => {
  // Ép về phone để khớp LoginRequest của BE
  const payload = { phone, password };
  const res = await axiosInstance.post("/login", payload);
  // expected: { user: {...}, token: "..." }
  return res.data;
};

/**
 * REGISTER: theo spec BE mới
 * POST /api/register
 * Body JSON:
 * {
 *   "fullName": "string",
 *   "email": "string",
 *   "phone": "string",
 *   "password": "string",
 *   "role": "CUSTOMER"
 * }
 * BE trả về user object với token = null -> FE sẽ tự login lại bằng /login (phone+password).
 */
export const register = async (data) => {
  try {
    const payload = {
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      password: data.password,
      role: data.role ?? "CUSTOMER",
    };

    const res = await axiosInstance.post("/register", payload);
    return res.data;
  } catch (error) {
    console.error("[Register] error:", {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      data: error.response?.data,
    });

    // Duplicate entry từ MySQL (chuỗi text)
    const body = error.response?.data;
    if (typeof body === "string" && body.includes("Duplicate entry")) {
      if (body.includes("email")) {
        throw new Error("Email này đã được sử dụng. Vui lòng chọn email khác.");
      }
      if (body.includes("phone")) {
        throw new Error("Số điện thoại này đã được sử dụng. Vui lòng chọn số khác.");
      }
    }

    // Message cụ thể từ BE (nếu có)
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }

    // Timeout
    if (error.code === "ECONNABORTED" || error.message?.includes("timeout")) {
      throw new Error("Kết nối đến server quá chậm. Vui lòng kiểm tra kết nối mạng và thử lại.");
    }

    // Network
    if (error.code === "NETWORK_ERROR" || /Network Error/i.test(error.message)) {
      throw new Error("Không thể kết nối đến server. Vui lòng kiểm tra mạng và thử lại.");
    }

    throw error;
  }
};

export const getProfile = async () => {
  const res = await axiosInstance.get("/profile");
  return res.data;
};

export const logout = async () => {
  const res = await axiosInstance.post("/logout");
  return res.data;
};

export const getAccounts = async () => {
  const res = await axiosInstance.get("/accounts");
  return res.data;
};
