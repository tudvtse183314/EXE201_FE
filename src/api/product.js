import axiosInstance from "./axios";

/**
 * Tạo sản phẩm mới
 * @param {Object} productData - Dữ liệu sản phẩm
 * @param {string} productData.name - Tên sản phẩm
 * @param {string} productData.description - Mô tả sản phẩm
 * @param {number} productData.price - Giá sản phẩm
 * @param {number} productData.stock - Số lượng tồn kho
 * @param {number} productData.categoryId - ID danh mục
 * @returns {Promise<Object>} - Dữ liệu sản phẩm đã tạo
 */
export const createProduct = async (productData) => {
  try {
    const response = await axiosInstance.post("/products", productData);
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    }
    if (error.response?.status === 403) {
      throw new Error("Bạn không có quyền tạo sản phẩm.");
    }
    throw error;
  }
};

/**
 * Lấy danh sách tất cả sản phẩm
 * @returns {Promise<Array>} - Danh sách sản phẩm
 */
export const getAllProducts = async () => {
  try {
    const response = await axiosInstance.get("/products");
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    }
    throw error;
  }
};

/**
 * Lấy thông tin sản phẩm theo ID
 * @param {number} productId - ID sản phẩm
 * @returns {Promise<Object>} - Thông tin sản phẩm
 */
export const getProductById = async (productId) => {
  try {
    const response = await axiosInstance.get(`/products/${productId}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    }
    if (error.response?.status === 404) {
      throw new Error("Không tìm thấy sản phẩm.");
    }
    throw error;
  }
};

/**
 * Cập nhật sản phẩm
 * @param {number} productId - ID sản phẩm
 * @param {Object} productData - Dữ liệu cập nhật
 * @returns {Promise<Object>} - Dữ liệu sản phẩm đã cập nhật
 */
export const updateProduct = async (productId, productData) => {
  try {
    const response = await axiosInstance.put(`/products/${productId}`, productData);
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    }
    if (error.response?.status === 403) {
      throw new Error("Bạn không có quyền cập nhật sản phẩm.");
    }
    if (error.response?.status === 404) {
      throw new Error("Không tìm thấy sản phẩm.");
    }
    throw error;
  }
};

/**
 * Xóa sản phẩm (chỉ MANAGER)
 * @param {number} productId - ID sản phẩm
 * @returns {Promise<Object>} - Kết quả xóa
 */
export const deleteProduct = async (productId) => {
  try {
    const response = await axiosInstance.delete(`/products/${productId}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    }
    if (error.response?.status === 403) {
      throw new Error("Bạn không có quyền xóa sản phẩm.");
    }
    if (error.response?.status === 404) {
      throw new Error("Không tìm thấy sản phẩm.");
    }
    throw error;
  }
};

/**
 * Tìm kiếm sản phẩm theo tên
 * @param {string} searchTerm - Từ khóa tìm kiếm
 * @returns {Promise<Array>} - Danh sách sản phẩm tìm được
 */
export const searchProducts = async (searchTerm) => {
  try {
    const response = await axiosInstance.get(`/products/search?q=${encodeURIComponent(searchTerm)}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    }
    throw error;
  }
};

/**
 * Lấy sản phẩm theo danh mục
 * @param {number} categoryId - ID danh mục
 * @returns {Promise<Array>} - Danh sách sản phẩm trong danh mục
 */
export const getProductsByCategory = async (categoryId) => {
  try {
    const response = await axiosInstance.get(`/products/category/${categoryId}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    }
    throw error;
  }
};
