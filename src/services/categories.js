import axiosInstance from '../api/axios';

export const getAllCategories = async () => {
  // Swagger: GET /api/categories/getAll
  const res = await axiosInstance.get('/categories/getAll');
  return res.data; // [{ id, name, description }]
};
