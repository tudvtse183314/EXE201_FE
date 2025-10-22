// src/services/products.js
import axiosInstance from "../api/axios";

export const getAllProducts = async () => {
  try {
    console.log("🛍️ Products: Fetching from /products/getAll");
    const res = await axiosInstance.get("/products/getAll");
    const data = Array.isArray(res.data) ? res.data : [];
    console.log("🛍️ Products: Fetched successfully", { count: data.length, data: res.data });
    return data;
  } catch (e) {
    console.error("🛍️ Products: Error fetching products:", e);
    return [];
  }
};

export const getProductById = async (id) => {
  try {
    console.log("🛍️ Products: Fetching product by ID", { id });
    const res = await axiosInstance.get(`/products/${id}`);
    console.log("🛍️ Products: Fetched product successfully", res.data);
    return res.data;
  } catch (e) {
    console.error("🛍️ Products: Error fetching product by ID:", e);
    throw e;
  }
};

export const createProduct = async (payload) => {
  try {
    console.log("🛍️ Products: Creating product", payload);
    const res = await axiosInstance.post("/products", payload);
    console.log("🛍️ Products: Created successfully", res.data);
    return res.data;
  } catch (e) {
    console.error("🛍️ Products: Error creating product:", e);
    throw e;
  }
};

export const updateProduct = async (id, payload) => {
  try {
    console.log("🛍️ Products: Updating product", { id, payload });
    const res = await axiosInstance.put(`/products/${id}`, payload);
    console.log("🛍️ Products: Updated successfully", res.data);
    return res.data;
  } catch (e) {
    console.error("🛍️ Products: Error updating product:", e);
    throw e;
  }
};

export const deleteProduct = async (id) => {
  try {
    console.log("🛍️ Products: Deleting product", { id });
    const res = await axiosInstance.delete(`/products/${id}`);
    console.log("🛍️ Products: Deleted successfully", res.data);
    return res.data;
  } catch (e) {
    console.error("🛍️ Products: Error deleting product:", e);
    throw e;
  }
};

export const getProductsByCategory = async (categoryId) => {
  try {
    console.log("🛍️ Products: Fetching products by category", { categoryId });
    const allProducts = await getAllProducts();
    const filtered = allProducts.filter(p => p?.category?.id === categoryId);
    console.log("🛍️ Products: Filtered by category successfully", { count: filtered.length });
    return filtered;
  } catch (e) {
    console.error("🛍️ Products: Error filtering by category:", e);
    return [];
  }
};