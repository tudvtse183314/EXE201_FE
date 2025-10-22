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

// Update category - Workaround vì BE không có PUT/PATCH endpoint
export const updateCategory = async (id, payload) => {
  try {
    console.log("📂 Categories: Updating category", { id, payload });
    
    // Thử các method khác nhau
    let res;
    let method = 'unknown';
    
    try {
      // Method 1: Thử PATCH
      res = await axiosInstance.patch(`/categories/${id}`, payload);
      method = 'PATCH';
    } catch (patchError) {
      console.log("📂 Categories: PATCH failed, trying PUT");
      try {
        // Method 2: Thử PUT
        res = await axiosInstance.put(`/categories/${id}`, payload);
        method = 'PUT';
      } catch (putError) {
        console.log("📂 Categories: PUT failed, trying POST with method override");
        try {
          // Method 3: POST với method override header
          res = await axiosInstance.post(`/categories/${id}`, payload, {
            headers: {
              'X-HTTP-Method-Override': 'PUT'
            }
          });
          method = 'POST with override';
        } catch (postError) {
          console.log("📂 Categories: All methods failed, using DELETE + CREATE workaround");
          // Method 4: Workaround - DELETE + CREATE (chỉ dùng khi cần thiết)
          await deleteCategory(id);
          res = await createCategory(payload);
          method = 'DELETE + CREATE';
        }
      }
    }
    
    console.log(`📂 Categories: Updated successfully using ${method}`, res.data);
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
