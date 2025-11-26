import axiosInstance from "./axios";

/**
 * Tạo đơn hàng mới
 * @param {Object} orderData - Dữ liệu đơn hàng
 * @param {number} orderData.accountId - ID tài khoản
 * @param {string} orderData.shippingAddress - Địa chỉ giao hàng
 * @param {string} orderData.phoneContact - Số điện thoại liên hệ
 * @param {Array} orderData.items - Danh sách sản phẩm
 * @param {number} orderData.items[].productId - ID sản phẩm
 * @param {number} orderData.items[].quantity - Số lượng
 * @returns {Promise<Object>} - Thông tin đơn hàng đã tạo
 */
export const createOrder = async (orderData) => {
  try {
    const response = await axiosInstance.post("/orders/orders", orderData);
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    }
    if (error.response?.status === 403) {
      throw new Error("Bạn không có quyền tạo đơn hàng.");
    }
    if (error.response?.status === 400) {
      throw new Error("Dữ liệu đơn hàng không hợp lệ.");
    }
    throw error;
  }
};

/**
 * Lấy chi tiết đơn hàng theo ID
 * @param {number} orderId - ID đơn hàng
 * @returns {Promise<Object>} - Thông tin chi tiết đơn hàng
 */
export const getOrderById = async (orderId) => {
  try {
    const response = await axiosInstance.get(`/orders/${orderId}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    }
    if (error.response?.status === 403) {
      throw new Error("Bạn không có quyền xem đơn hàng này.");
    }
    if (error.response?.status === 404) {
      throw new Error("Không tìm thấy đơn hàng.");
    }
    throw error;
  }
};

/**
 * Lấy tất cả đơn hàng của một tài khoản
 * @param {number} accountId - ID tài khoản
 * @returns {Promise<Array>} - Danh sách đơn hàng
 */
export const getOrdersByAccount = async (accountId) => {
  try {
    const response = await axiosInstance.get(`/orders/account/${accountId}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    }
    if (error.response?.status === 403) {
      throw new Error("Bạn không có quyền xem đơn hàng của tài khoản này.");
    }
    if (error.response?.status === 404) {
      throw new Error("Không tìm thấy đơn hàng nào.");
    }
    throw error;
  }
};

/**
 * Lấy tất cả đơn hàng (dành cho STAFF và MANAGER)
 * @returns {Promise<Array>} - Danh sách tất cả đơn hàng
 */
export const getAllOrders = async () => {
  try {
    const response = await axiosInstance.get("/orders/all");
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    }
    if (error.response?.status === 403) {
      throw new Error("Bạn không có quyền xem tất cả đơn hàng.");
    }
    throw error;
  }
};

/**
 * Cập nhật trạng thái đơn hàng (dành cho STAFF và MANAGER)
 * @param {number} orderId - ID đơn hàng
 * @param {Object} updateData - Dữ liệu cập nhật
 * @param {string} updateData.status - Trạng thái mới
 * @param {string} updateData.notes - Ghi chú
 * @returns {Promise<Object>} - Thông tin đơn hàng đã cập nhật
 */
export const updateOrderStatus = async (orderId, updateData) => {
  try {
    const response = await axiosInstance.put(`/orders/${orderId}`, updateData);
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    }
    if (error.response?.status === 403) {
      throw new Error("Bạn không có quyền cập nhật đơn hàng.");
    }
    if (error.response?.status === 404) {
      throw new Error("Không tìm thấy đơn hàng.");
    }
    throw error;
  }
};

/**
 * Hủy đơn hàng (dành cho CUSTOMER và MANAGER)
 * @param {number} orderId - ID đơn hàng
 * @returns {Promise<Object>} - Kết quả hủy đơn hàng
 */
export const cancelOrder = async (orderId) => {
  try {
    const response = await axiosInstance.delete(`/orders/${orderId}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    }
    if (error.response?.status === 403) {
      throw new Error("Bạn không có quyền hủy đơn hàng này.");
    }
    if (error.response?.status === 404) {
      throw new Error("Không tìm thấy đơn hàng.");
    }
    if (error.response?.status === 400) {
      throw new Error("Không thể hủy đơn hàng ở trạng thái hiện tại.");
    }
    throw error;
  }
};
