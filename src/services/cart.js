// src/services/cart.js
import axiosInstance from "../api/axios";

/**
 * Customer Cart API Service
 * Lưu ý: Tất cả API này KHÔNG gửi userId từ client; BE sẽ lấy từ JWT token
 */

// GET /api/cart/my hoặc /api/carts/user/{userId} - Lấy giỏ hàng của user hiện tại
// Lưu ý: KHÔNG gửi userId từ client, backend sẽ lấy từ JWT
export const getMyCart = async () => {
  try {
    console.log("🛒 Cart: Fetching my cart");
    
    // Thử endpoint /cart/my trước (customer endpoint)
    try {
      const res = await axiosInstance.get("/cart/my");
      console.log("🛒 Cart: Fetched my cart successfully (/cart/my)", res.data);
      return res.data;
    } catch (newError) {
      // Nếu endpoint mới không tồn tại, có thể backend chỉ có endpoint cũ
      // Tuy nhiên, không thể gọi /carts/user/{userId} vì không được gửi userId
      // Log để debug
      console.warn("🛒 Cart: /cart/my failed, may need backend update", {
        status: newError.response?.status,
        data: newError.response?.data
      });
      throw newError;
    }
  } catch (e) {
    console.error("🛒 Cart: Error fetching my cart:", e);
    throw e;
  }
};

// PUT /api/carts/{id} - Cập nhật item trong giỏ hàng
// Backend API spec: { id, quantity, total, productId, userId }
export const updateCartItemQuantity = async (itemId, quantity, price = 0, productId = null) => {
  try {
    console.log("🛒 Cart: Updating cart item quantity", { itemId, quantity, price, productId });
    
    // Tính total mới từ price * quantity
    const total = price > 0 ? price * quantity : 0;
    
    // Format theo API spec
    const payload = {
      id: itemId,
      quantity: quantity,
      total: total,
      productId: productId || 0, // Gửi productId nếu có, nếu không backend sẽ tự lấy từ DB
      userId: 0 // KHÔNG gửi userId thực, backend sẽ lấy từ JWT
    };
    
    console.log("🛒 Cart: Update payload:", payload);
    const res = await axiosInstance.put(`/carts/${itemId}`, payload);
    console.log("🛒 Cart: Updated cart item quantity successfully", res.data);
    return res.data;
  } catch (e) {
    console.error("🛒 Cart: Error updating cart item quantity:", e);
    if (e.response) {
      console.error("🛒 Cart: Response data:", e.response.data);
      console.error("🛒 Cart: Response status:", e.response.status);
    }
    throw e;
  }
};

// DELETE /api/carts/{id} - Xóa item khỏi giỏ hàng
export const deleteCartItem = async (itemId) => {
  try {
    console.log("🛒 Cart: Deleting cart item", { itemId });
    const res = await axiosInstance.delete(`/carts/${itemId}`);
    console.log("🛒 Cart: Deleted cart item successfully", res.data);
    return res.data;
  } catch (e) {
    console.error("🛒 Cart: Error deleting cart item:", e);
    if (e.response) {
      console.error("🛒 Cart: Response data:", e.response.data);
    }
    throw e;
  }
};

// POST /api/carts - Thêm item vào giỏ hàng
// Backend API spec: { id: 0, quantity: 0, total: 0, productId: 0, userId: 0 }
// Lưu ý: userId KHÔNG gửi từ client (backend lấy từ JWT), nhưng có thể cần field này
export const addCartItem = async (productId, quantity, price = 0) => {
  try {
    console.log("🛒 Cart: Adding item to cart", { productId, quantity, price });
    
    // Tính total từ price * quantity
    const total = price * quantity;
    
    // Format theo API spec của backend
    // id = 0 khi tạo mới, userId = 0 (backend sẽ lấy từ JWT token)
    const payload = {
      id: 0, // Tạo mới nên id = 0
      productId: productId,
      quantity: quantity,
      total: total,
      userId: 0 // KHÔNG gửi userId thực, backend sẽ lấy từ JWT. Gửi 0 để đáp ứng schema
    };
    
    console.log("🛒 Cart: Request payload:", payload);
    const res = await axiosInstance.post("/carts", payload);
    console.log("🛒 Cart: Added item to cart successfully", res.data);
    return res.data;
  } catch (e) {
    console.error("🛒 Cart: Error adding item to cart:", e);
    // Log chi tiết response để debug
    if (e.response) {
      console.error("🛒 Cart: Response data:", e.response.data);
      console.error("🛒 Cart: Response status:", e.response.status);
    }
    throw e;
  }
};

// ===== Admin/Staff APIs (giữ lại cho tương thích) =====

// Get all carts (Admin/Staff)
export const getAllCarts = async () => {
  try {
    console.log("🛒 Cart: Fetching all carts");
    const res = await axiosInstance.get("/carts/all");
    console.log("🛒 Cart: Fetched all carts successfully", res.data);
    return res.data;
  } catch (e) {
    console.error("🛒 Cart: Error fetching all carts:", e);
    throw e;
  }
};

// Get carts by user ID (Admin/Staff)
export const getCartsByUserId = async (userId) => {
  try {
    console.log("🛒 Cart: Fetching carts for user", { userId });
    const res = await axiosInstance.get(`/carts/user/${userId}`);
    console.log("🛒 Cart: Fetched carts successfully", res.data);
    return res.data;
  } catch (e) {
    console.error("🛒 Cart: Error fetching carts:", e);
    throw e;
  }
};

// Create cart item (legacy)
export const createCartItem = async (cartData) => {
  try {
    console.log("🛒 Cart: Creating cart item", cartData);
    const res = await axiosInstance.post("/carts", cartData);
    console.log("🛒 Cart: Created cart item successfully", res.data);
    return res.data;
  } catch (e) {
    console.error("🛒 Cart: Error creating cart item:", e);
    throw e;
  }
};

// Update cart item (legacy)
export const updateCartItem = async (cartItemId, cartData) => {
  try {
    console.log("🛒 Cart: Updating cart item", { cartItemId, cartData });
    const res = await axiosInstance.put(`/carts/${cartItemId}`, cartData);
    console.log("🛒 Cart: Updated cart item successfully", res.data);
    return res.data;
  } catch (e) {
    console.error("🛒 Cart: Error updating cart item:", e);
    throw e;
  }
};

// Format cart data for API (legacy)
export const formatCartDataForAPI = (cartItem) => {
  return {
    accountId: cartItem.userId,
    productId: cartItem.productId,
    quantity: cartItem.quantity,
    totalPrice: cartItem.total
  };
};
