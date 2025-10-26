// src/services/cart.js
import axiosInstance from "../api/axios";

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

// Get carts by user ID
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

// Create cart item
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

// Delete cart item
export const deleteCartItem = async (cartItemId) => {
  try {
    console.log("🛒 Cart: Deleting cart item", { cartItemId });
    const res = await axiosInstance.delete(`/carts/${cartItemId}`);
    console.log("🛒 Cart: Deleted cart item successfully", res.data);
    return res.data;
  } catch (e) {
    console.error("🛒 Cart: Error deleting cart item:", e);
    throw e;
  }
};

// Format cart data for API
export const formatCartDataForAPI = (cartItem) => {
  return {
    accountId: cartItem.userId,
    productId: cartItem.productId,
    quantity: cartItem.quantity,
    totalPrice: cartItem.total
  };
};
