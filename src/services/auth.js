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

// Update account profile
export const updateAccount = async (id, accountData) => {
  try {
    console.log("👥 Auth: Updating account", { id, accountData });
    const res = await axiosInstance.put(`/accounts/${id}`, accountData);
    console.log("👥 Auth: Updated account successfully", res.data);
    return res.data;
  } catch (e) {
    console.error("👥 Auth: Error updating account:", e);
    throw e;
  }
};

// Reset password
export const resetPassword = async (passwordData) => {
  try {
    console.log("👥 Auth: Resetting password");
    const res = await axiosInstance.post("/reset-password", passwordData);
    console.log("👥 Auth: Password reset successfully", res.data);
    return res.data;
  } catch (e) {
    console.error("👥 Auth: Error resetting password:", e);
    throw e;
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
    const res = await axiosInstance.delete(`/${id}`);
    console.log("👥 Auth: Deleted account successfully", res.data);
    return res.data;
  } catch (e) {
    console.error("👥 Auth: Error deleting account:", e);
    throw e;
  }
};

// Restore account
export const restoreAccount = async (id) => {
  try {
    console.log("👥 Auth: Restoring account", { id });
    const res = await axiosInstance.put(`/${id}/restore`);
    console.log("👥 Auth: Restored account successfully", res.data);
    return res.data;
  } catch (e) {
    console.error("👥 Auth: Error restoring account:", e);
    throw e;
  }
};
