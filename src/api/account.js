import axiosInstance from "./axios";

// 🧾 Lấy danh sách tất cả tài khoản (Manager)
export const getAllAccounts = async () => {
  try {
    const res = await axiosInstance.get("/accounts");
    return res.data;
  } catch (error) {
    if (error.response?.status === 401) throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    if (error.response?.status === 403) throw new Error("Bạn không có quyền xem danh sách tài khoản.");
    throw error;
  }
};

// 👤 Cập nhật thông tin tài khoản (Customer / Manager)
export const updateAccount = async (id, data) => {
  try {
    const res = await axiosInstance.put(`/accounts/${id}`, data);
    return res.data;
  } catch (error) {
    if (error.response?.status === 401) throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    if (error.response?.status === 403) throw new Error("Bạn không có quyền cập nhật tài khoản này.");
    if (error.response?.status === 404) throw new Error("Không tìm thấy tài khoản để cập nhật.");
    if (error.response?.status === 400) throw new Error("Dữ liệu cập nhật không hợp lệ. Vui lòng kiểm tra lại.");
    throw error;
  }
};

// 🔁 Khôi phục tài khoản bị xóa (Manager)
export const restoreAccount = async (id) => {
  try {
    const res = await axiosInstance.put(`/accounts/${id}/restore`);
    return res.data;
  } catch (error) {
    if (error.response?.status === 401) throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    if (error.response?.status === 403) throw new Error("Bạn không có quyền khôi phục tài khoản.");
    if (error.response?.status === 404) throw new Error("Không tìm thấy tài khoản để khôi phục.");
    throw error;
  }
};

// ❌ Xóa tài khoản (Manager)
export const deleteAccount = async (id) => {
  try {
    const res = await axiosInstance.delete(`/accounts/${id}`);
    return res.data;
  } catch (error) {
    if (error.response?.status === 401) throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    if (error.response?.status === 403) throw new Error("Bạn không có quyền xóa tài khoản.");
    if (error.response?.status === 404) throw new Error("Không tìm thấy tài khoản để xóa.");
    throw error;
  }
};

// 🔑 Đặt lại mật khẩu (Forgot Password)
export const resetPassword = async (email, newPassword, confirmPassword) => {
  try {
    const res = await axiosInstance.post("/reset-password", { email, newPassword, confirmPassword });
    return res.data;
  } catch (error) {
    if (error.response?.status === 401) throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    if (error.response?.status === 400) throw new Error("Dữ liệu đặt lại mật khẩu không hợp lệ.");
    if (error.response?.status === 404) throw new Error("Không tìm thấy tài khoản với email này.");
    throw error;
  }
};

// 🧍 Tạo tài khoản mới (Manager tạo Doctor / Staff)
export const createAccount = async (data) => {
  try {
    const res = await axiosInstance.post("/accounts", data);
    return res.data;
  } catch (error) {
    if (error.response?.status === 401) throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    if (error.response?.status === 403) throw new Error("Bạn không có quyền tạo tài khoản mới.");
    if (error.response?.status === 400) throw new Error("Dữ liệu tài khoản không hợp lệ. Vui lòng kiểm tra lại.");
    if (error.response?.status === 409) throw new Error("Email hoặc số điện thoại đã được sử dụng.");
    throw error;
  }
};

// 🔍 Tìm kiếm tài khoản theo email hoặc tên (Manager)
export const searchAccounts = async (query) => {
  try {
    const res = await axiosInstance.get(`/accounts/search?q=${query}`);
    return res.data;
  } catch (error) {
    if (error.response?.status === 401) throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    if (error.response?.status === 403) throw new Error("Bạn không có quyền tìm kiếm tài khoản.");
    throw error;
  }
};

// 📊 Lấy thống kê tài khoản (Manager)
export const getAccountStats = async () => {
  try {
    const res = await axiosInstance.get("/accounts/stats");
    return res.data;
  } catch (error) {
    if (error.response?.status === 401) throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    if (error.response?.status === 403) throw new Error("Bạn không có quyền xem thống kê tài khoản.");
    throw error;
  }
};
