import axiosInstance from "../api/axios";

/**
 * Pet Profile API Service
 */

/**
 * Get pet profile by ID
 * @param {number} id - Pet ID
 */
export const getPetById = async (id) => {
  try {
    const res = await axiosInstance.get(`/pet-profiles/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching pet by ID:", error);
    throw error;
  }
};

/**
 * Update pet profile by ID
 * @param {number} id - Pet ID
 * @param {Object} data - Update data
 */
export const updatePetById = async (id, data) => {
  try {
    const res = await axiosInstance.put(`/pet-profiles/${id}`, data);
    return res.data;
  } catch (error) {
    console.error("Error updating pet:", error);
    throw error;
  }
};

/**
 * Delete pet profile by ID
 * @param {number} id - Pet ID
 */
export const deletePetById = async (id) => {
  try {
    const res = await axiosInstance.delete(`/pet-profiles/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error deleting pet:", error);
    throw error;
  }
};

/**
 * Create new pet profile
 * @param {Object} body - Pet profile data
 */
export const createPet = async (body) => {
  try {
    const res = await axiosInstance.post(`/pet-profiles`, body);
    return res.data;
  } catch (error) {
    console.error("Error creating pet:", error);
    throw error;
  }
};

/**
 * Get all pets by user ID
 * @param {number} userId - User ID
 */
export const getPetsByUserId = async (userId) => {
  try {
    const res = await axiosInstance.get(`/pet-profiles/user/${userId}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching pets by user ID:", error);
    throw error;
  }
};

/**
 * Get pets by type (e.g., "Dog", "Cat")
 * @param {string} petType - Pet type
 */
export const getPetsByType = async (petType) => {
  try {
    const res = await axiosInstance.get(`/pet-profiles/type/${petType}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching pets by type:", error);
    throw error;
  }
};

/**
 * Get current user's pets (requires authentication)
 */
export const getMyPets = async () => {
  try {
    const res = await axiosInstance.get(`/pet-profiles/my-pets`);
    return res.data;
  } catch (error) {
    console.error("Error fetching my pets:", error);
    throw error;
  }
};

/**
 * Get all pets (Admin only)
 */
export const getAllPets = async () => {
  try {
    const res = await axiosInstance.get(`/pet-profiles/getAll`);
    return res.data;
  } catch (error) {
    console.error("Error fetching all pets:", error);
    throw error;
  }
};

// Export grouped object for convenience
export const petProfileApi = {
  getById: getPetById,
  updateById: updatePetById,
  deleteById: deletePetById,
  create: createPet,
  getByUserId: getPetsByUserId,
  getByType: getPetsByType,
  getMyPets,
  getAll: getAllPets,
};


