// src/services/orders.js
import axiosInstance from "../api/axios";

/**
 * Tạo đơn hàng mới
 * POST /api/orders
 */
export const createOrder = async (orderData) => {
  try {
    console.log("📦 Orders: Creating order", orderData);
    const res = await axiosInstance.post("/orders", orderData);
    console.log("📦 Orders: Created successfully", res.data);
    return res.data;
  } catch (error) {
    const status = error.response?.status;
    console.error("📦 Orders: Error creating order:", {
      status,
      message: error.response?.data?.message || error.message,
      error
    });
    
    if (status === 401) {
      throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    }
    if (status === 403) {
      throw new Error("Bạn không có quyền tạo đơn hàng.");
    }
    if (status === 400) {
      throw new Error(error.response?.data?.message || "Dữ liệu đơn hàng không hợp lệ.");
    }
    throw error;
  }
};

/**
 * Lấy chi tiết đơn hàng theo ID
 * GET /api/orders/{id}
 */
export const getOrderById = async (orderId) => {
  try {
    console.log("📦 Orders: Fetching order by ID", { orderId });
    const res = await axiosInstance.get(`/orders/${orderId}`);
    console.log("📦 Orders: Fetched order successfully", res.data);
    return res.data;
  } catch (error) {
    const status = error.response?.status;
    console.error("📦 Orders: Error fetching order by ID:", {
      status,
      message: error.response?.data?.message || error.message,
      error
    });
    
    if (status === 401) {
      throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    }
    if (status === 403) {
      throw new Error("Bạn không có quyền xem đơn hàng này.");
    }
    if (status === 404) {
      throw new Error("Không tìm thấy đơn hàng.");
    }
    throw error;
  }
};

// GET /api/orders/my - Lấy danh sách đơn hàng của user hiện tại (KHÔNG gửi userId)
export const getMyOrders = async (params = {}) => {
  try {
    console.log("📦 Orders: Fetching my orders", params);
    const queryParams = new URLSearchParams();
    if (params.page !== undefined && params.page !== null) {
      queryParams.append('page', params.page);
    }
    if (params.size !== undefined && params.size !== null) {
      queryParams.append('size', params.size);
    }
    if (params.status) queryParams.append('status', params.status);
    
    const queryString = queryParams.toString();
    const url = queryString ? `/orders/my?${queryString}` : '/orders/my';
    
    const res = await axiosInstance.get(url);
    console.log("📦 Orders: Fetched my orders successfully", res.data);
    return res.data;
  } catch (e) {
    console.error("📦 Orders: Error fetching my orders:", e);
    throw e;
  }
};

// POST /api/orders/{id}/confirm-payment - Xác nhận thanh toán
export const confirmPayment = async (orderId) => {
  try {
    console.log("📦 Orders: Confirming payment for order", { orderId });
    const res = await axiosInstance.post(`/orders/${orderId}/confirm-payment`);
    console.log("📦 Orders: Confirmed payment successfully", res.data);
    return res.data;
  } catch (error) {
    const status = error.response?.status;
    const responseData = error.response?.data;
    
    // Xử lý error message
    let errorMessage = error.message;
    if (responseData) {
      if (typeof responseData === 'string') {
        errorMessage = responseData;
      } else if (responseData.message) {
        errorMessage = responseData.message;
      } else if (responseData.error) {
        errorMessage = responseData.error;
      }
    }
    
    console.error("📦 Orders: Error confirming payment:", {
      orderId,
      status,
      message: errorMessage,
      responseData,
      fullError: error
    });
    
    // Backend trả về 400 nếu order không ở trạng thái PENDING
    if (status === 400) {
      throw new Error(errorMessage || 'Đơn hàng không ở trạng thái PENDING. Không thể xác nhận thanh toán.');
    }
    
    if (status === 401) {
      throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    }
    if (status === 403) {
      throw new Error(errorMessage || "Bạn không có quyền xác nhận thanh toán đơn hàng này. Vui lòng kiểm tra quyền truy cập.");
    }
    if (status === 404) {
      throw new Error("Không tìm thấy đơn hàng.");
    }
    
    // Xử lý lỗi không có response (network error, CORS, etc.)
    if (!error.response) {
      throw new Error(errorMessage || "Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.");
    }
    
    throw new Error(errorMessage || "Không thể xác nhận thanh toán. Vui lòng thử lại.");
  }
};

// PATCH /api/orders/{id}/payment-status - Cập nhật trạng thái thanh toán thủ công
// paymentStatus phải là một trong: "PENDING", "COMPLETED", "FAILED", "EXPIRED"
export const updatePaymentStatus = async (orderId, paymentStatus) => {
  try {
    // Validate paymentStatus trước khi gửi
    const validStatuses = ['PENDING', 'COMPLETED', 'FAILED', 'EXPIRED'];
    const normalizedStatus = paymentStatus?.toUpperCase()?.trim();
    
    if (!normalizedStatus || !validStatuses.includes(normalizedStatus)) {
      throw new Error(`Trạng thái thanh toán không hợp lệ. Phải là một trong: ${validStatuses.join(', ')}`);
    }
    
    console.log("📦 Orders: Updating payment status", { orderId, paymentStatus: normalizedStatus });
    const res = await axiosInstance.patch(`/orders/${orderId}/payment-status`, { 
      paymentStatus: normalizedStatus 
    });
    console.log("📦 Orders: Updated payment status successfully", res.data);
    return res.data;
  } catch (error) {
    const status = error.response?.status;
    const responseData = error.response?.data;
    
    // Xử lý error message
    let errorMessage = error.message;
    if (responseData) {
      if (typeof responseData === 'string') {
        errorMessage = responseData;
      } else if (responseData.message) {
        errorMessage = responseData.message;
      } else if (responseData.error) {
        errorMessage = responseData.error;
      }
    }
    
    console.error("📦 Orders: Error updating payment status:", {
      orderId,
      paymentStatus,
      status,
      message: errorMessage,
      responseData,
      fullError: error
    });
    
    if (status === 400) {
      throw new Error(errorMessage || "Trạng thái thanh toán không hợp lệ. Phải là: PENDING, COMPLETED, FAILED, hoặc EXPIRED");
    }
    if (status === 401) {
      throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    }
    if (status === 403) {
      throw new Error(errorMessage || "Bạn không có quyền cập nhật trạng thái thanh toán.");
    }
    if (status === 404) {
      throw new Error("Không tìm thấy đơn hàng.");
    }
    
    // Xử lý lỗi không có response (network error, CORS, etc.)
    if (!error.response) {
      throw new Error(errorMessage || "Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.");
    }
    
    throw new Error(errorMessage || "Không thể cập nhật trạng thái thanh toán. Vui lòng thử lại.");
  }
};

/**
 * Hủy đơn hàng (chỉ khi status = PENDING)
 * PATCH /api/orders/{orderId}/cancel
 */
export const cancelOrder = async (orderId) => {
  try {
    console.log("📦 Orders: Cancelling order", { orderId });
    const res = await axiosInstance.patch(`/orders/${orderId}/cancel`);
    console.log("📦 Orders: Cancelled successfully", res.data);
    return res.data;
  } catch (error) {
    const status = error.response?.status;
    const responseData = error.response?.data;
    
    // Xử lý error message
    let errorMessage = error.message;
    if (responseData) {
      if (typeof responseData === 'string') {
        errorMessage = responseData;
      } else if (responseData.message) {
        errorMessage = responseData.message;
      } else if (responseData.error) {
        errorMessage = responseData.error;
      }
    }
    
    console.error("📦 Orders: Error cancelling order:", {
      orderId,
      status,
      message: errorMessage,
      responseData,
      fullError: error
    });
    
    if (status === 401) {
      throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    }
    if (status === 403) {
      throw new Error(errorMessage || "Bạn không có quyền hủy đơn hàng này. Vui lòng kiểm tra quyền truy cập.");
    }
    if (status === 404) {
      throw new Error("Không tìm thấy đơn hàng.");
    }
    if (status === 400) {
      throw new Error(errorMessage || "Không thể hủy đơn hàng ở trạng thái hiện tại.");
    }
    
    // Xử lý lỗi không có response (network error, CORS, etc.)
    if (!error.response) {
      // CORS error hoặc network error
      if (error.message?.includes('CORS') || error.message?.includes('blocked')) {
        throw new Error("Lỗi CORS: Không thể kết nối đến server. Vui lòng kiểm tra cấu hình CORS trên backend.");
      }
      throw new Error(errorMessage || "Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.");
    }
    
    throw new Error(errorMessage || "Không thể hủy đơn hàng. Vui lòng thử lại.");
  }
};

/**
 * Lấy tất cả đơn hàng của một tài khoản
 * GET /api/orders/account/{id}
 */
export const getOrdersByAccount = async (accountId) => {
  try {
    console.log("📦 Orders: Fetching orders by account ID", { accountId });
    const res = await axiosInstance.get(`/orders/account/${accountId}`);
    console.log("📦 Orders: Fetched orders by account ID successfully", { 
      accountId, 
      count: Array.isArray(res.data) ? res.data.length : 0,
      data: res.data 
    });
    // API trả về array trực tiếp
    return Array.isArray(res.data) ? res.data : [];
  } catch (error) {
    const status = error.response?.status;
    console.error("📦 Orders: Error fetching orders by account ID", {
      accountId,
      status,
      message: error.response?.data?.message || error.message,
      error
    });
    
    if (status === 401) {
      throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    }
    if (status === 403) {
      throw new Error("Bạn không có quyền xem đơn hàng của tài khoản này.");
    }
    if (status === 404) {
      throw new Error("Không tìm thấy đơn hàng nào.");
    }
    throw error;
  }
};

// Cancel order (User) - Legacy (dùng POST thay vì PATCH)
export const cancelOrderLegacy = async (orderId) => {
  try {
    console.log("📦 Orders: Cancelling order (legacy)", { orderId });
    const res = await axiosInstance.patch(`/orders/${orderId}/cancel`);
    console.log("📦 Orders: Cancelled successfully", res.data);
    return res.data;
  } catch (e) {
    console.error("📦 Orders: Error cancelling order:", e);
    throw e;
  }
};

/**
 * Cập nhật trạng thái đơn hàng (Admin only)
 * PATCH /api/orders/{orderId}/status
 */
export const updateOrderStatus = async (orderId, status) => {
  try {
    console.log("📦 Orders: Updating order status", { orderId, status });
    const res = await axiosInstance.patch(`/orders/${orderId}/status`, { status });
    console.log("📦 Orders: Updated status successfully", res.data);
    return res.data;
  } catch (error) {
    const status = error.response?.status;
    console.error("📦 Orders: Error updating order status:", {
      status,
      message: error.response?.data?.message || error.message,
      error
    });
    
    if (status === 401) {
      throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    }
    if (status === 403) {
      throw new Error("Bạn không có quyền cập nhật đơn hàng.");
    }
    if (status === 404) {
      throw new Error("Không tìm thấy đơn hàng.");
    }
    if (status === 400) {
      throw new Error(error.response?.data?.message || "Không thể cập nhật trạng thái đơn hàng ở trạng thái hiện tại.");
    }
    throw error;
  }
};

/**
 * Lấy tất cả đơn hàng (Admin only)
 * GET /api/orders/all
 * 
 * Hỗ trợ nhiều kiểu response structure từ backend:
 * - Array trực tiếp: [{orderId: 1, ...}, ...]
 * - Object với orders: { orders: [...] }
 * - Object với content (paging): { content: [...], totalElements, ... }
 * - Object với data: { data: [...] }
 * 
 * @param {Object} params - Query parameters (tùy chọn, backend có thể không hỗ trợ)
 * @param {string} params.status - Filter theo status
 * @param {number} params.page - Page number
 * @param {number} params.size - Page size
 * @param {string} params.q - Search query
 * @returns {Promise<Array>} - Danh sách tất cả đơn hàng
 */
export const getAllOrders = async (params = {}) => {
  try {
    console.log("📦 Orders: Fetching all orders", { params });
    
    // Build query string nếu có params
    const queryParams = new URLSearchParams();
    if (params.status) queryParams.append('status', params.status);
    if (params.page !== undefined && params.page !== null) {
      queryParams.append('page', params.page);
    }
    if (params.size !== undefined && params.size !== null) {
      queryParams.append('size', params.size);
    }
    if (params.q) queryParams.append('q', params.q);
    
    const queryString = queryParams.toString();
    const url = queryString ? `/orders/all?${queryString}` : '/orders/all';
    
    console.log("📦 Orders: Request URL", url);
    const response = await axiosInstance.get(url);
    
    // 🔍 DEBUG: Log RAW response để kiểm tra structure
    console.log("📦 getAllOrders RAW response:", {
      hasResponse: !!response,
      hasData: !!response?.data,
      type: typeof response?.data,
      isArray: Array.isArray(response?.data),
      keys: response?.data && typeof response?.data === 'object' && !Array.isArray(response?.data) ? Object.keys(response?.data) : null,
      dataLength: Array.isArray(response?.data) ? response.data.length : 'N/A',
      firstItem: Array.isArray(response?.data) && response.data.length > 0 ? {
        orderId: response.data[0].orderId,
        status: response.data[0].status
      } : null
    });
    
    // ✅ Defensive check: đảm bảo response và response.data tồn tại
    if (!response) {
      console.error("📦 getAllOrders: No response received");
      return [];
    }
    
    if (!response.data) {
      console.warn("📦 getAllOrders: response.data is null/undefined");
      return [];
    }
    
    let list = [];
    
    // Bắt nhiều kiểu response structure
    if (Array.isArray(response.data)) {
      // Case 1: BE trả thẳng array
      list = response.data;
      console.log("📦 getAllOrders: Detected direct array response, length:", list.length);
    } else if (response.data && typeof response.data === 'object' && Array.isArray(response.data.orders)) {
      // Case 2: { orders: [...] }
      list = response.data.orders;
      console.log("📦 getAllOrders: Detected response.data.orders, length:", list.length);
    } else if (response.data && typeof response.data === 'object' && Array.isArray(response.data.content)) {
      // Case 3: Paging structure { content: [...], totalElements, ... }
      list = response.data.content;
      console.log("📦 getAllOrders: Detected response.data.content (paging), length:", list.length);
    } else if (response.data && typeof response.data === 'object' && Array.isArray(response.data.data)) {
      // Case 4: { data: [...] }
      list = response.data.data;
      console.log("📦 getAllOrders: Detected response.data.data, length:", list.length);
    } else {
      // Fallback: trả về array rỗng nếu không match
      console.warn("📦 getAllOrders: Unknown response structure, returning empty array", {
        responseDataType: typeof response.data,
        responseDataKeys: response.data && typeof response.data === 'object' && !Array.isArray(response.data) ? Object.keys(response.data) : null,
        responseDataValue: response.data
      });
      list = [];
    }
    
    console.log("📦 getAllOrders normalized list:", {
      length: list.length,
      sample: list.length > 0 ? {
        orderId: list[0].orderId,
        accountName: list[0].accountName,
        status: list[0].status,
        hasItems: Array.isArray(list[0].items),
        hasPaymentInfo: !!list[0].paymentInfo
      } : null
    });
    
    // ✅ Đảm bảo luôn return array, không bao giờ return undefined
    if (!Array.isArray(list)) {
      console.warn("📦 getAllOrders: list is not array, returning empty array", { list });
      return [];
    }
    
    return list;
  } catch (error) {
    const status = error.response?.status;
    console.error("📦 Orders: Error fetching all orders:", {
      status,
      message: error.response?.data?.message || error.message,
      response: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL
      }
    });
    
    if (status === 401) {
      throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    }
    if (status === 403) {
      throw new Error("Bạn không có quyền xem tất cả đơn hàng.");
    }
    throw error;
  }
};

// Get orders by status (Admin only)
export const getOrdersByStatus = async (status) => {
  try {
    console.log("📦 Orders: Fetching orders by status", { status });
    const res = await axiosInstance.get(`/orders/status/${status}`);
    console.log("📦 Orders: Fetched orders by status successfully", res.data);
    return res.data;
  } catch (e) {
    console.error("📦 Orders: Error fetching orders by status:", e);
    throw e;
  }
};

// Get payment QR code for existing order
export const getPaymentQR = async (orderId) => {
  try {
    console.log("📦 Orders: Fetching payment QR for order", { orderId });
    const res = await axiosInstance.get(`/orders/${orderId}/payment-qr`);
    console.log("📦 Orders: Fetched payment QR successfully", res.data);
    return res.data;
  } catch (e) {
    console.error("📦 Orders: Error fetching payment QR:", e);
    throw e;
  }
};

// Helper function to validate order data
export const validateOrderData = (orderData) => {
  const errors = [];
  
  if (!orderData.accountId || orderData.accountId <= 0) {
    errors.push("accountId is required and must be positive");
  }
  
  if (!orderData.shippingAddress || orderData.shippingAddress.trim().length === 0) {
    errors.push("shippingAddress is required");
  }
  
  if (!orderData.phoneContact) {
    errors.push("phoneContact is required");
  } else {
    // Vietnamese phone number regex
    const phoneRegex = /^(\+84|84|0)[1-9][0-9]{8,9}$/;
    if (!phoneRegex.test(orderData.phoneContact)) {
      errors.push("phoneContact must be a valid Vietnamese phone number");
    }
  }
  
  if (!orderData.items || !Array.isArray(orderData.items) || orderData.items.length === 0) {
    errors.push("items array is required and must not be empty");
  } else {
    orderData.items.forEach((item, index) => {
      if (!item.productId || item.productId <= 0) {
        errors.push(`items[${index}].productId is required and must be positive`);
      }
      if (!item.quantity || item.quantity < 1) {
        errors.push(`items[${index}].quantity must be at least 1`);
      }
    });
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Helper function to format order for display
export const formatOrderForDisplay = (order) => {
  return {
    ...order,
    formattedTotalAmount: typeof order.totalAmount === 'number'
      ? `${order.totalAmount.toLocaleString('vi-VN')} VNĐ`
      : '--',
    formattedCreatedAt: order.createdAt
      ? new Date(order.createdAt).toLocaleString('vi-VN')
      : '--',
    formattedUpdatedAt: order.updatedAt
      ? new Date(order.updatedAt).toLocaleString('vi-VN')
      : '--',
    statusColor: getStatusColor(order.status),
    statusText: getStatusText(order.status),
    paymentStatusColor: getPaymentStatusColor(order?.paymentInfo?.status),
    paymentStatusText: getPaymentStatusText(order?.paymentInfo?.status)
  };
};

// Helper function to get status color
export const getStatusColor = (status) => {
  const normalized = (status || "").toUpperCase();
  const colors = {
    PENDING: 'orange',
    PAID: 'blue',
    SHIPPED: 'purple',
    DELIVERED: 'green',
    CANCELLED: 'red',
    CANCEL: 'red' // Hỗ trợ cả CANCEL và CANCELLED
  };
  return colors[normalized] || 'default';
};

// Helper function to get status text in Vietnamese
export const getStatusText = (status) => {
  const normalized = (status || "").toUpperCase();
  const texts = {
    PENDING: 'Chờ thanh toán',
    PAID: 'Đã thanh toán',
    SHIPPED: 'Đang giao',
    DELIVERED: 'Đã giao',
    CANCELLED: 'Đã hủy',
    CANCEL: 'Đã hủy' // Hỗ trợ cả CANCEL và CANCELLED
  };
  return texts[normalized] || status;
};

export const getPaymentStatusColor = (status) => {
  const normalized = (status || "").toUpperCase();
  const colors = {
    UNPAID: 'orange',
    PAID: 'green',
    COMPLETED: 'green',
    FAILED: 'red',
    PENDING: 'orange',
    WAITING: 'orange'
  };
  return colors[normalized] || 'default';
};

export const getPaymentStatusText = (status) => {
  const normalized = (status || "").toUpperCase();
  const texts = {
    UNPAID: 'Chưa thanh toán',
    PAID: 'Đã thanh toán',
    COMPLETED: 'Đã thanh toán thành công',
    FAILED: 'Thanh toán thất bại',
    PENDING: 'Đang chờ xác nhận',
    WAITING: 'Đang chờ xác nhận'
  };
  return texts[normalized] || status;
};

export const ORDER_STATUS_FLOW = ['PENDING', 'PAID', 'SHIPPED', 'DELIVERED'];