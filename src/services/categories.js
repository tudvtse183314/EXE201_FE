// src/services/categories.js
import axiosInstance from "../api/axios";

export const getAllCategories = async () => {
  try {
    console.log("📂 Categories: Fetching from /categories/getAll");
    const res = await axiosInstance.get("/categories/getAll");
    const data = Array.isArray(res.data) ? res.data : [];
    console.log("📂 Categories: Fetched successfully", { count: data.length });
    return data;
  } catch (e) {
    console.error("📂 Categories: Error fetching categories:", e);
    // Tránh throw để không loop re-render
    return [];
  }
};

export const createCategory = async (payload) => {
  try {
    console.log("📂 Categories: Creating category", payload);
    const res = await axiosInstance.post("/categories", payload);
    console.log("📂 Categories: Created successfully", res.data);
    return res.data;
  } catch (e) {
    console.error("📂 Categories: Error creating category:", e);
    throw e;
  }
};

// Nếu BE có PUT:
export const updateCategory = async (id, payload) => {
  try {
    console.log("📂 Categories: Updating category", { id, payload });
    const res = await axiosInstance.put(`/categories/${id}`, payload);
    console.log("📂 Categories: Updated successfully", res.data);
    return res.data;
  } catch (e) {
    console.error("📂 Categories: Error updating category:", e);
    throw e;
  }
};

export const deleteCategory = async (id) => {
  try {
    console.log("📂 Categories: Deleting category", { id });
    const res = await axiosInstance.delete(`/categories/${id}`);
    console.log("📂 Categories: Deleted successfully", res.data);
    return res.data;
  } catch (e) {
    console.error("📂 Categories: Error deleting category:", e);
    throw e;
  }
};
