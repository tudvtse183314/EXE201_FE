// src/services/cart.js
import axiosInstance from "../api/axios";

// Get cart by ID
export const getCartById = async (cartId) => {
  try {
    console.log("🛒 Cart: Fetching cart by ID", { cartId });
    const res = await axiosInstance.get(`/carts/${cartId}`);
    console.log("🛒 Cart: Fetched cart successfully", res.data);
    return res.data;
  } catch (e) {
    console.error("🛒 Cart: Error fetching cart by ID:", e);
    throw e;
  }
};

// Get all carts
export const getAllCarts = async () => {
  try {
    console.log("🛒 Cart: Fetching all carts");
    const res = await axiosInstance.get("/carts/getAll");
    console.log("🛒 Cart: Fetched all carts successfully", res.data);
    return res.data;
  } catch (e) {
    console.error("🛒 Cart: Error fetching all carts:", e);
    throw e;
  }
};

// Get carts by user ID
export const getCartsByUserId = async (userId) => {
  try {
    console.log("🛒 Cart: Fetching carts by user ID", { userId });
    const res = await axiosInstance.get(`/carts/user/${userId}`);
    console.log("🛒 Cart: Fetched carts by user ID successfully", res.data);
    return res.data;
  } catch (e) {
    console.error("🛒 Cart: Error fetching carts by user ID:", e);
    throw e;
  }
};

// Create new cart item
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

// Update cart item
export const updateCartItem = async (cartId, cartData) => {
  try {
    console.log("🛒 Cart: Updating cart item", { cartId, cartData });
    const res = await axiosInstance.put(`/carts/${cartId}`, cartData);
    console.log("🛒 Cart: Updated cart item successfully", res.data);
    return res.data;
  } catch (e) {
    console.error("🛒 Cart: Error updating cart item:", e);
    throw e;
  }
};

// Delete cart item
export const deleteCartItem = async (cartId) => {
  try {
    console.log("🛒 Cart: Deleting cart item", { cartId });
    const res = await axiosInstance.delete(`/carts/${cartId}`);
    console.log("🛒 Cart: Deleted cart item successfully", res.data);
    return res.data;
  } catch (e) {
    console.error("🛒 Cart: Error deleting cart item:", e);
    throw e;
  }
};

// Helper function to format cart data for API
export const formatCartDataForAPI = (product, quantity, userId) => {
  return {
    productId: product.id,
    userId: userId,
    quantity: quantity,
    total: (product.price || 0) * quantity
  };
};

// Helper function to format cart data for display
export const formatCartForDisplay = (cartItem, product) => {
  return {
    ...cartItem,
    product: product,
    totalFormatted: cartItem.total?.toLocaleString('vi-VN') + ' VNĐ'
  };
};
