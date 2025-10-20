import axiosInstance from "./axios";

/**
 * Login: tự nhận diện người dùng nhập email hay số điện thoại
 * và tự chọn payload đúng (email/password) hoặc (phone/password).
 * Nếu BE yêu cầu form-urlencoded, bật biến USE_FORM_URLENCODED = true.
 */
const USE_FORM_URLENCODED = false;

export const login = async (identity, password) => {
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identity);
  const basePayload = isEmail
    ? { email: identity, password }
    : { phone: identity, password };

  const payload = USE_FORM_URLENCODED
    ? new URLSearchParams(basePayload)
    : basePayload;

  const headers = USE_FORM_URLENCODED
    ? { "Content-Type": "application/x-www-form-urlencoded" }
    : undefined;

  // warm-up nhẹ để tránh cold-start Render
  try { await axiosInstance.get("/health", { timeout: 4000 }); } catch (_) {}

  const res = await axiosInstance.post("/login", payload, { headers });
  return res.data;
};

/**
 * Register: chỉ gửi các trường user cơ bản theo thông lệ BE (fullName/email/phone/password/role).
 * Nếu BE không nhận role, comment dòng role lại.
 * Các trường thú cưng (pet*) nên tạo ở API khác sau khi user tạo xong.
 */
export const register = async (data) => {
  try {
    const payload = {
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      password: data.password,
      role: data.role ?? "CUSTOMER", // nếu BE không dùng role -> xoá dòng này
    };

    console.log("[Register] baseURL:", axiosInstance.defaults.baseURL);
    console.log("[Register] payload:", payload);

    // warm-up
    try { await axiosInstance.get("/health", { timeout: 4000 }); } catch (_) {}

    const res = await axiosInstance.post("/register", payload);
    return res.data;
  } catch (error) {
    console.error("[Register] error:", {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      data: error.response?.data,
    });

    // Network
    if (error.code === "NETWORK_ERROR" || /Network Error/i.test(error.message)) {
      throw new Error("Không thể kết nối đến server. Vui lòng kiểm tra mạng và thử lại.");
    }
    // Timeout
    if (error.code === "ECONNABORTED" || /timeout/i.test(error.message)) {
      throw new Error("Server phản hồi chậm (cold start). Vui lòng thử lại sau vài giây.");
    }
    // CORS
    if (/CORS|cross-origin/i.test(error.message)) {
      throw new Error("Lỗi CORS. Vui lòng liên hệ admin để bật CORS cho domain FE.");
    }
    // Duplicate
    const body = error.response?.data;
    if (typeof body === "string" && body.includes("Duplicate entry")) {
      if (body.includes("email")) throw new Error("Email này đã được sử dụng. Vui lòng chọn email khác.");
      if (body.includes("phone")) throw new Error("Số điện thoại này đã được sử dụng. Vui lòng chọn số khác.");
    }
    // Message từ BE
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
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
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
