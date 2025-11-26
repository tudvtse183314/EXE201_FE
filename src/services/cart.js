// src/services/cart.js
import axiosInstance from "../api/axios";

/**
 * Customer Cart API Service
 * Lưu ý: Tất cả API này KHÔNG gửi userId từ client; BE sẽ lấy từ JWT token
 */

// GET /api/carts/user/{userId} - Lấy giỏ hàng của user hiện tại
// Backend sẽ validate JWT token và chỉ trả về cart của user đó, không cần lo về userId trong URL

// Cache và debounce để tránh gọi API liên tục
let cartCache = null;
let cartCacheTimestamp = 0;
let pendingCartRequest = null;
const CART_CACHE_DURATION = 2000; // Cache 2 giây để tránh spam

export const getMyCart = async (skipCache = false) => {
  // Kiểm tra cache nếu không skip
  const now = Date.now();
  if (!skipCache && cartCache && (now - cartCacheTimestamp) < CART_CACHE_DURATION) {
    console.log("🛒 Cart: Using cached cart data", { cacheAge: now - cartCacheTimestamp });
    return cartCache;
  }

  // Nếu đang có request pending, chờ request đó thay vì tạo request mới
  if (pendingCartRequest) {
    console.log("🛒 Cart: Request already pending, waiting...");
    try {
      return await pendingCartRequest;
    } catch (e) {
      // Nếu pending request fail, tiếp tục tạo request mới
      pendingCartRequest = null;
    }
  }

  // Tạo request mới
  pendingCartRequest = (async () => {
    try {
      // Log stack trace để biết ai gọi
      const stack = new Error().stack;
      const caller = stack?.split('\n')[2]?.trim() || 'unknown';
      console.log("🛒 Cart: getMyCart() called from:", caller);
      
      // Lấy userId từ localStorage (đã được lưu khi login)
      const userStr = localStorage.getItem("user");
      if (!userStr) {
        console.warn("🛒 Cart: No user in localStorage, returning empty cart");
        cartCache = [];
        cartCacheTimestamp = now;
        return [];
      }

      const user = JSON.parse(userStr);
      const userId = user.id || user.accountId;
      
      if (!userId) {
        console.warn("🛒 Cart: No userId found in user data, returning empty cart");
        cartCache = [];
        cartCacheTimestamp = now;
        return [];
      }

      // Sử dụng endpoint /carts/user/{userId}
      // Backend sẽ validate JWT và chỉ trả về cart của user đó
      console.log(`🛒 Cart: Fetching cart for user ${userId}...`);
      const res = await axiosInstance.get(`/carts/user/${userId}`);
      console.log("🛒 Cart: Fetched my cart successfully", { 
        data: res.data, 
        count: Array.isArray(res.data) ? res.data.length : 0 
      });
      
      // Response là array trực tiếp theo API docs
      const result = Array.isArray(res.data) ? res.data : [];
      
      // Update cache
      cartCache = result;
      cartCacheTimestamp = Date.now();
      
      return result;
    } catch (error) {
      console.error("🛒 Cart: Error fetching my cart:", error);
      
      // Log chi tiết để debug
      if (error?.response) {
        console.error("🛒 Cart: Response status:", error.response.status);
        console.error("🛒 Cart: Response data:", error.response.data);
      }
      
      // Xử lý lỗi 400/404 một cách graceful (endpoint không tồn tại hoặc không có cart)
      if (error?.response?.status === 400 || error?.response?.status === 404) {
        console.warn("🛒 Cart: Endpoint error, returning empty array");
        cartCache = [];
        cartCacheTimestamp = Date.now();
        return [];
      }
      
      // Các lỗi khác (401, 403, 500, ...) throw để interceptor xử lý
      throw error;
    } finally {
      // Clear pending request sau khi hoàn thành
      pendingCartRequest = null;
    }
  })();

  return await pendingCartRequest;
};

// PUT /api/carts/{id} - Cập nhật item trong giỏ hàng
// Backend API spec: { id, quantity, total, productId, userId }
// Lưu ý: userId trong body sẽ bị backend ignore, backend lấy từ JWT
export const updateCartItemQuantity = async (itemId, quantity, price = 0, productId = null) => {
  try {
    console.log("🛒 Cart: Updating cart item quantity", { itemId, quantity, price, productId });
    
    // Tính total mới từ price * quantity
    // Nếu price không được cung cấp, total = 0 (backend có thể tự tính)
    const total = price > 0 ? price * quantity : 0;
    
    // Format theo API spec của backend
    // userId = 0 hoặc có thể bỏ qua, backend sẽ lấy từ JWT
    const payload = {
      id: itemId,
      quantity: quantity,
      total: total,
      productId: productId || 0, // Gửi productId nếu có, backend sẽ validate
      userId: 0 // Backend sẽ ignore và lấy từ JWT token
    };
    
    console.log("🛒 Cart: Update payload:", payload);
    const res = await axiosInstance.put(`/carts/${itemId}`, payload);
    console.log("🛒 Cart: Updated cart item quantity successfully", res.data);
    
    // Response có thể là { message, success, data } hoặc trực tiếp object
    return res.data?.data || res.data;
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
// Backend sẽ validate userId từ JWT và chỉ cho phép xóa cart item của chính user
export const deleteCartItem = async (itemId) => {
  try {
    console.log("🛒 Cart: Deleting cart item", { itemId });
    const res = await axiosInstance.delete(`/carts/${itemId}`);
    console.log("🛒 Cart: Deleted cart item successfully", res.data);
    
    // Response có thể là { message, success } hoặc object
    return res.data?.data || res.data;
  } catch (e) {
    console.error("🛒 Cart: Error deleting cart item:", e);
    if (e.response) {
      console.error("🛒 Cart: Response data:", e.response.data);
      console.error("🛒 Cart: Response status:", e.response.status);
    }
    throw e;
  }
};

// GET /api/carts/{id} - Lấy chi tiết một cart item
export const getCartItemById = async (itemId) => {
  try {
    console.log("🛒 Cart: Fetching cart item by ID", { itemId });
    const res = await axiosInstance.get(`/carts/${itemId}`);
    console.log("🛒 Cart: Fetched cart item successfully", res.data);
    
    // Response có thể là { message, success, data } hoặc trực tiếp object
    return res.data?.data || res.data;
  } catch (e) {
    console.error("🛒 Cart: Error fetching cart item:", e);
    throw e;
  }
};

// POST /api/carts - Thêm item vào giỏ hàng
// Backend API spec: { id: 0, quantity: 0, total: 0, productId: 0, userId: 0 }
// Lưu ý: userId trong body sẽ bị backend ignore, backend lấy từ JWT
export const addCartItem = async (productId, quantity, price = 0) => {
  try {
    console.log("🛒 Cart: Adding item to cart", { productId, quantity, price });
    
    // Validate input
    if (!productId || productId <= 0) {
      throw new Error("Product ID không hợp lệ");
    }
    if (!quantity || quantity <= 0) {
      throw new Error("Số lượng phải lớn hơn 0");
    }
    
    // Tính total từ price * quantity
    // Backend có thể tự tính lại từ product.price, nhưng gửi để đảm bảo
    const total = price > 0 ? price * quantity : 0;
    
    // Format theo API spec của backend (phải đúng thứ tự và types)
    // Lấy userId từ localStorage (backend sẽ ignore, nhưng cần để đáp ứng schema)
    const userStr = localStorage.getItem("user");
    const userId = userStr ? (JSON.parse(userStr).id || JSON.parse(userStr).accountId || 0) : 0;
    
    const payload = {
      id: 0, // Tạo mới nên id = 0
      productId: Number(productId), // Đảm bảo là number
      quantity: Number(quantity), // Đảm bảo là number
      total: Number(total), // Đảm bảo là number
      userId: Number(userId) // Backend sẽ ignore và lấy từ JWT token, nhưng gửi để đáp ứng schema
    };
    
    console.log("🛒 Cart: Request payload:", payload);
    const res = await axiosInstance.post("/carts", payload);
    console.log("🛒 Cart: Added item to cart successfully", res.data);
    
    // Response theo API docs: { message, success, data }
    return res.data?.data || res.data;
  } catch (e) {
    console.error("🛒 Cart: Error adding item to cart:", e);
    // Log chi tiết response để debug
    if (e.response) {
      console.error("🛒 Cart: Response status:", e.response.status);
      console.error("🛒 Cart: Response data:", JSON.stringify(e.response.data, null, 2));
      
      // Nếu có message từ backend, throw error với message đó
      if (e.response.data?.message) {
        throw new Error(e.response.data.message);
      }
    }
    throw e;
  }
};

// ===== Admin APIs (giữ lại cho tương thích) =====

// Get all carts (Admin only)
export const getAllCarts = async () => {
  console.log("🛒 Cart: Fetching all carts");
  
  try {
    const res = await axiosInstance.get("/carts/all");
    console.log("🛒 Cart: Fetched all carts successfully", {
      count: Array.isArray(res.data) ? res.data.length : 'unknown',
    });
    return Array.isArray(res.data) ? res.data : [];
  } catch (error) {
    const status = error.response?.status;
    const backendMessage = error.response?.data?.message;
    
    let message = 'Không thể tải danh sách giỏ hàng.';
    
    if (status === 400) {
      message = backendMessage || 'Yêu cầu không hợp lệ. Vui lòng kiểm tra lại dữ liệu hoặc thử lại sau.';
    } else if (status === 401) {
      message = 'Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.';
    } else if (status === 403) {
      message = 'Bạn không có quyền xem danh sách giỏ hàng.';
    } else if (status === 404) {
      message = 'Không tìm thấy dữ liệu giỏ hàng.';
    } else if (status >= 500) {
      message = 'Hệ thống đang bận. Vui lòng thử lại sau.';
    }
    
    console.error("🛒 Cart: Error fetching all carts:", {
      status,
      backendMessage,
      fullError: error,
    });
    
    // QUAN TRỌNG: chỉ throw 1 Error object, KHÔNG tự gọi lại API
    throw new Error(message);
  }
};

// Get carts by user ID (Admin only)
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
