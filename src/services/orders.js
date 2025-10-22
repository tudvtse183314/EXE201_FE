// src/services/orders.js
import axiosInstance from "../api/axios";

// Dành cho khu vực "tôi": để BE tự lấy từ token sẽ ít lỗi hơn
export const getMyOrders = async () => {
  const res = await axiosInstance.get("/orders/my"); // nếu BE có /orders/my
  return res.data;
};

// Nếu BE bắt buộc truyền accountId:
export const getOrdersByAccount = async (accountId) => {
  // path CHUẨN: /orders/account/{id}  (không có "orders" lặp)
  const res = await axiosInstance.get(`/orders/account/${accountId}`);
  return res.data;
};
