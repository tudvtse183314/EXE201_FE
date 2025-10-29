// src/services/users.js
import axiosInstance from "../api/axios";

/**
 * User/Account API Service
 * Lưu ý: Tất cả API này KHÔNG gửi userId từ client; BE sẽ lấy từ JWT token
 */

// GET /api/users/me - Lấy thông tin user hiện tại
export const getMyProfile = async () => {
  try {
    console.log("👤 Users: Fetching my profile");
    const res = await axiosInstance.get("/users/me");
    console.log("👤 Users: Fetched my profile successfully", res.data);
    return res.data;
  } catch (e) {
    console.error("👤 Users: Error fetching my profile:", e);
    throw e;
  }
};

// PUT /api/users/me - Cập nhật thông tin user hiện tại
export const updateMyProfile = async (data) => {
  try {
    console.log("👤 Users: Updating my profile", data);
    const res = await axiosInstance.put("/users/me", data);
    console.log("👤 Users: Updated my profile successfully", res.data);
    return res.data;
  } catch (e) {
    console.error("👤 Users: Error updating my profile:", e);
    throw e;
  }
};

// POST /api/users/change-password - Đổi mật khẩu
export const changePassword = async (oldPassword, newPassword) => {
  try {
    console.log("👤 Users: Changing password");
    const res = await axiosInstance.post("/users/change-password", {
      oldPassword,
      newPassword,
    });
    console.log("👤 Users: Changed password successfully", res.data);
    return res.data;
  } catch (e) {
    console.error("👤 Users: Error changing password:", e);
    throw e;
  }
};

