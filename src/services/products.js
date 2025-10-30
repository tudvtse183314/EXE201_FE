// src/services/products.js
import axiosInstance from "../api/axios";

/**
 * Normalize product data để đảm bảo luôn có imageUrl
 * Hỗ trợ cả imageUrl (camelCase), image_url (snake_case), và image
 */
const normalizeProduct = (product) => {
  if (!product) return null;

  // Ưu tiên: imageUrl > image_url > image
  const imageUrl = product.imageUrl ?? product.image_url ?? product.image ?? null;

  // Normalize category
  const category = product.category || 
    (product.category_id ? { 
      id: product.category_id, 
      name: product.category_name || product.categoryName || 'Chưa phân loại' 
    } : null);

  return {
    ...product,
    imageUrl, // Luôn có field imageUrl (có thể null)
    category,
  };
};

export const getAllProducts = async () => {
  try {
    console.log("🛍️ Products: Fetching from /products/getAll");
    const res = await axiosInstance.get("/products/getAll");
    const data = Array.isArray(res.data) ? res.data : [];
    
    // Normalize tất cả products để luôn có imageUrl
    const normalizedData = data.map(normalizeProduct);
    
    console.log("🛍️ Products: Fetched and normalized successfully", { 
      count: normalizedData.length,
      sample: normalizedData.slice(0, 2).map(p => ({ id: p.id, name: p.name, imageUrl: p.imageUrl }))
    });
    return normalizedData;
  } catch (e) {
    const status = e?.response?.status;
    if (status === 404) {
      console.warn("🛍️ Products: /products/getAll not found (404). Returning empty list.");
      return [];
    }
    console.warn("🛍️ Products: Error fetching products:", e?.message || e);
    return [];
  }
};

export const getProductById = async (id) => {
  try {
    console.log("🛍️ Products: Fetching product by ID", { id });
    const res = await axiosInstance.get(`/products/${id}`);
    const normalized = normalizeProduct(res.data);
    console.log("🛍️ Products: Fetched product successfully", normalized);
    return normalized;
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