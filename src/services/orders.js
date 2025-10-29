// src/services/orders.js
import axiosInstance from "../api/axios";

// Create new order (User)
export const createOrder = async (orderData) => {
  try {
    console.log("📦 Orders: Creating order", orderData);
    const res = await axiosInstance.post("/orders", orderData);
    console.log("📦 Orders: Created successfully", res.data);
    return res.data;
  } catch (e) {
    console.error("📦 Orders: Error creating order:", e);
    throw e;
  }
};

// Get order by ID (User/Admin)
export const getOrderById = async (orderId) => {
  try {
    console.log("📦 Orders: Fetching order by ID", { orderId });
    const res = await axiosInstance.get(`/orders/${orderId}`);
    console.log("📦 Orders: Fetched order successfully", res.data);
    return res.data;
  } catch (e) {
    console.error("📦 Orders: Error fetching order by ID:", e);
    throw e;
  }
};

// GET /api/orders/my - Lấy danh sách đơn hàng của user hiện tại (KHÔNG gửi userId)
export const getMyOrders = async (params = {}) => {
  try {
    console.log("📦 Orders: Fetching my orders", params);
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.size) queryParams.append('size', params.size);
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
  } catch (e) {
    console.error("📦 Orders: Error confirming payment:", e);
    throw e;
  }
};

// POST /api/orders/{id}/cancel - Hủy đơn hàng (chỉ khi status = PENDING)
export const cancelOrder = async (orderId) => {
  try {
    console.log("📦 Orders: Cancelling order", { orderId });
    const res = await axiosInstance.post(`/orders/${orderId}/cancel`);
    console.log("📦 Orders: Cancelled successfully", res.data);
    return res.data;
  } catch (e) {
    console.error("📦 Orders: Error cancelling order:", e);
    throw e;
  }
};

// Get orders by account ID (User) - Legacy
export const getOrdersByAccount = async (accountId) => {
  try {
    console.log("📦 Orders: Fetching orders by account", { accountId });
    const res = await axiosInstance.get(`/orders/account/${accountId}`);
    console.log("📦 Orders: Fetched account orders successfully", res.data);
    return res.data;
  } catch (e) {
    console.error("📦 Orders: Error fetching orders by account:", e);
    throw e;
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

// Update order status (Admin/Staff)
export const updateOrderStatus = async (orderId, status) => {
  try {
    console.log("📦 Orders: Updating order status", { orderId, status });
    const res = await axiosInstance.patch(`/orders/${orderId}/status`, { status });
    console.log("📦 Orders: Updated status successfully", res.data);
    return res.data;
  } catch (e) {
    console.error("📦 Orders: Error updating order status:", e);
    throw e;
  }
};

// Get all orders (Admin/Staff)
export const getAllOrders = async (params = {}) => {
  try {
    console.log("📦 Orders: Fetching all orders", params);
    const queryParams = new URLSearchParams();
    
    // Add query parameters
    if (params.status) queryParams.append('status', params.status);
    if (params.page) queryParams.append('page', params.page);
    if (params.size) queryParams.append('size', params.size);
    if (params.q) queryParams.append('q', params.q);
    
    const queryString = queryParams.toString();
    const url = queryString ? `/orders/all?${queryString}` : '/orders/all';
    
    const res = await axiosInstance.get(url);
    console.log("📦 Orders: Fetched all orders successfully", res.data);
    return res.data;
  } catch (e) {
    console.error("📦 Orders: Error fetching all orders:", e);
    throw e;
  }
};

// Get orders by status (Admin/Staff)
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
    formattedTotalAmount: order.totalAmount?.toLocaleString('vi-VN') + ' VNĐ',
    formattedCreatedAt: new Date(order.createdAt).toLocaleString('vi-VN'),
    formattedUpdatedAt: new Date(order.updatedAt).toLocaleString('vi-VN'),
    statusColor: getStatusColor(order.status),
    statusText: getStatusText(order.status)
  };
};

// Helper function to get status color
export const getStatusColor = (status) => {
  const colors = {
    'PENDING': 'orange',
    'PAID': 'blue',
    'PROCESSING': 'purple',
    'COMPLETED': 'green',
    'CANCELLED': 'red'
  };
  return colors[status] || 'default';
};

// Helper function to get status text in Vietnamese
export const getStatusText = (status) => {
  const texts = {
    'PENDING': 'Chờ thanh toán',
    'PAID': 'Đã thanh toán',
    'PROCESSING': 'Đang xử lý',
    'COMPLETED': 'Hoàn thành',
    'CANCELLED': 'Đã hủy'
  };
  return texts[status] || status;
};