import axiosInstance from '../api/axios';

export const getAllProducts = async () => {
  // Swagger: GET /api/products/getAll
  const res = await axiosInstance.get('/products/getAll');
  return res.data; // [{ id, name, price, stock, imageUrl, category: {id,name,description} }]
};

export const getProductById = async (id) =>
  (await axiosInstance.get(`/products/${id}`)).data;

export const createProduct = async (payload) =>
  (await axiosInstance.post('/products', payload)).data;

export const updateProduct = async (id, payload) =>
  (await axiosInstance.put(`/products/${id}`, payload)).data;

export const deleteProduct = async (id) =>
  (await axiosInstance.delete(`/products/${id}`)).data;
