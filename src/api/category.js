import axiosInstance from "./axios";

/**
 * Tạo danh mục mới
 * @param {Object} categoryData - Dữ liệu danh mục
 * @param {string} categoryData.name - Tên danh mục
 * @param {string} categoryData.description - Mô tả danh mục
 * @returns {Promise<Object>} - Dữ liệu danh mục đã tạo
 */
export const createCategory = async (categoryData) => {
  try {
    const response = await axiosInstance.post("/categories", categoryData);
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    }
    if (error.response?.status === 403) {
      throw new Error("Bạn không có quyền tạo danh mục.");
    }
    throw error;
  }
};

/**
 * Lấy danh sách tất cả danh mục
 * @returns {Promise<Array>} - Danh sách danh mục
 */
export const getAllCategories = async () => {
  try {
    const response = await axiosInstance.get("/categories");
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    }
    throw error;
  }
};

/**
 * Lấy thông tin danh mục theo ID
 * @param {number} categoryId - ID danh mục
 * @returns {Promise<Object>} - Thông tin danh mục
 */
export const getCategoryById = async (categoryId) => {
  try {
    const response = await axiosInstance.get(`/categories/${categoryId}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    }
    if (error.response?.status === 404) {
      throw new Error("Không tìm thấy danh mục.");
    }
    throw error;
  }
};

/**
 * Cập nhật danh mục
 * @param {number} categoryId - ID danh mục
 * @param {Object} categoryData - Dữ liệu cập nhật
 * @returns {Promise<Object>} - Dữ liệu danh mục đã cập nhật
 */
export const updateCategory = async (categoryId, categoryData) => {
  try {
    const response = await axiosInstance.put(`/categories/${categoryId}`, categoryData);
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    }
    if (error.response?.status === 403) {
      throw new Error("Bạn không có quyền cập nhật danh mục.");
    }
    if (error.response?.status === 404) {
      throw new Error("Không tìm thấy danh mục.");
    }
    throw error;
  }
};

/**
 * Xóa danh mục (chỉ MANAGER)
 * @param {number} categoryId - ID danh mục
 * @returns {Promise<Object>} - Kết quả xóa
 */
export const deleteCategory = async (categoryId) => {
  try {
    const response = await axiosInstance.delete(`/categories/${categoryId}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    }
    if (error.response?.status === 403) {
      throw new Error("Bạn không có quyền xóa danh mục.");
    }
    if (error.response?.status === 404) {
      throw new Error("Không tìm thấy danh mục.");
    }
    throw error;
  }
};

/**
 * Tìm kiếm danh mục theo tên
 * @param {string} searchTerm - Từ khóa tìm kiếm
 * @returns {Promise<Array>} - Danh sách danh mục tìm được
 */
export const searchCategories = async (searchTerm) => {
  try {
    const response = await axiosInstance.get(`/categories/search?q=${encodeURIComponent(searchTerm)}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    }
    throw error;
  }
};
