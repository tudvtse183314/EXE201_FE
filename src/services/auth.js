// src/services/auth.js
import axiosInstance from "../api/axios";

// Get all accounts (Admin/Staff)
export const getAllAccounts = async () => {
  try {
    console.log("👥 Auth: Fetching all accounts");
    const res = await axiosInstance.get("/accounts");
    console.log("👥 Auth: Fetched accounts successfully", res.data);
    return res.data;
  } catch (e) {
    console.error("👥 Auth: Error fetching accounts:", e);
    throw e;
  }
};

/**
 * PUT /api/accounts/{id} - Cập nhật thông tin tài khoản
 * @param {number} id - Account ID
 * @param {Object} accountData - { fullName, email, phone }
 * @returns {Object} Updated account data
 */
export const updateAccount = async (id, accountData) => {
  try {
    console.log("👥 Auth: Updating account", { id, accountData });
    const res = await axiosInstance.put(`/accounts/${id}`, accountData);
    console.log("👥 Auth: Updated account successfully", { id, data: res.data });
    return res.data;
  } catch (error) {
    console.error("👥 Auth: Error updating account", {
      id,
      accountData,
      error: error.response?.data || error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      config: error.config,
    });
    throw error;
  }
};

/**
 * POST /api/reset - Đặt lại mật khẩu
 * @param {Object} passwordData - { email, newPassword, confirmPassword }
 * @returns {Object} Response data
 */
export const resetPassword = async (passwordData) => {
  try {
    console.log("👥 Auth: Resetting password", { email: passwordData.email });
    const res = await axiosInstance.post("/reset", passwordData);
    console.log("👥 Auth: Password reset successfully", res.data);
    return res.data;
  } catch (error) {
    console.error("👥 Auth: Error resetting password", {
      email: passwordData.email,
      error: error.response?.data || error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      config: error.config,
    });
    throw error;
  }
};

// Create staff account
export const createStaff = async (staffData) => {
  try {
    console.log("👥 Auth: Creating staff account", staffData);
    const res = await axiosInstance.post("/create-staff", staffData);
    console.log("👥 Auth: Staff created successfully", res.data);
    return res.data;
  } catch (e) {
    console.error("👥 Auth: Error creating staff:", e);
    throw e;
  }
};

// Delete account
export const deleteAccount = async (id) => {
  try {
    console.log("👥 Auth: Deleting account", { id });
    const res = await axiosInstance.delete(`/accounts/${id}`);
    console.log("👥 Auth: Deleted account successfully", res.data);
    return res.data;
  } catch (e) {
    console.error("👥 Auth: Error deleting account:", e);
    throw e;
  }
};

/**
 * PUT /api/{id}/restore - Khôi phục tài khoản bị xóa (Admin only)
 * Note: Endpoint này nằm trong AuthenticationAPI với base path /api
 * @param {number} id - Account ID
 * @returns {Object} Restored account data
 */
export const restoreAccount = async (id) => {
  try {
    console.log("👥 Auth: Restoring account", { id });
    // Endpoint: PUT /api/{id}/restore (baseURL đã có /api)
    const res = await axiosInstance.put(`/${id}/restore`);
    console.log("👥 Auth: Restored account successfully", { id, data: res.data });
    return res.data;
  } catch (error) {
    console.error("👥 Auth: Error restoring account", {
      id,
      error: error.response?.data || error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      config: error.config,
    });
    throw error;
  }
};
