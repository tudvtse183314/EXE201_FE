import axiosInstance from "../api/axios";

/**
 * Pet Profile API Service
 * Tất cả các endpoints cho Pet Profile đều đã được implement
 */

/**
 * Get pet profile by ID
 * @param {number} id - Pet ID
 * @returns {Promise<Object>} Pet profile data
 */
export const getPetById = async (id) => {
  try {
    console.log("🐾 PetProfiles: Fetching pet by ID", { id });
    const res = await axiosInstance.get(`/pet-profiles/${id}`);
    console.log("🐾 PetProfiles: Fetched pet successfully", res.data);
    return res.data;
  } catch (error) {
    console.error("🐾 PetProfiles: Error fetching pet by ID:", error);
    if (error.response?.status === 401) {
      throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    }
    if (error.response?.status === 403) {
      throw new Error("Bạn không có quyền xem hồ sơ thú cưng này.");
    }
    if (error.response?.status === 404) {
      throw new Error("Không tìm thấy hồ sơ thú cưng.");
    }
    throw error;
  }
};

/**
 * Update pet profile by ID
 * @param {number} id - Pet ID
 * @param {Object} data - Update data
 * @returns {Promise<Object>} Updated pet profile data
 */
export const updatePetById = async (id, data) => {
  try {
    console.log("🐾 PetProfiles: Updating pet", { id, data });
    const res = await axiosInstance.put(`/pet-profiles/${id}`, data);
    console.log("🐾 PetProfiles: Updated pet successfully", res.data);
    return res.data;
  } catch (error) {
    console.error("🐾 PetProfiles: Error updating pet:", error);
    if (error.response?.status === 401) {
      throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    }
    if (error.response?.status === 403) {
      throw new Error("Bạn không có quyền cập nhật hồ sơ thú cưng này.");
    }
    if (error.response?.status === 404) {
      throw new Error("Không tìm thấy hồ sơ thú cưng để cập nhật.");
    }
    if (error.response?.status === 400) {
      throw new Error("Dữ liệu cập nhật không hợp lệ. Vui lòng kiểm tra lại.");
    }
    throw error;
  }
};

/**
 * Delete pet profile by ID
 * @param {number} id - Pet ID
 * @returns {Promise<Object>} Deletion result
 */
export const deletePetById = async (id) => {
  try {
    console.log("🐾 PetProfiles: Deleting pet", { id });
    const res = await axiosInstance.delete(`/pet-profiles/${id}`);
    console.log("🐾 PetProfiles: Deleted pet successfully", res.data);
    return res.data;
  } catch (error) {
    console.error("🐾 PetProfiles: Error deleting pet:", error);
    if (error.response?.status === 401) {
      throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    }
    if (error.response?.status === 403) {
      throw new Error("Bạn không có quyền xóa hồ sơ thú cưng này.");
    }
    if (error.response?.status === 404) {
      throw new Error("Không tìm thấy hồ sơ thú cưng để xóa.");
    }
    throw error;
  }
};

/**
 * Create new pet profile
 * @param {Object} data - Pet profile data
 * @returns {Promise<Object>} Created pet profile data
 */
export const createPet = async (data) => {
  try {
    console.log("🐾 PetProfiles: Creating pet", data);
    const res = await axiosInstance.post(`/pet-profiles`, data);
    console.log("🐾 PetProfiles: Created pet successfully", res.data);
    return res.data;
  } catch (error) {
    console.error("🐾 PetProfiles: Error creating pet:", error);
    if (error.response?.status === 401) {
      throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    }
    if (error.response?.status === 403) {
      throw new Error("Bạn không có quyền tạo hồ sơ thú cưng.");
    }
    if (error.response?.status === 400) {
      throw new Error("Dữ liệu hồ sơ thú cưng không hợp lệ. Vui lòng kiểm tra lại.");
    }
    throw error;
  }
};

/**
 * Get all pets by user ID
 * @param {number} userId - User ID
 * @returns {Promise<Array>} Array of pet profiles
 */
export const getPetsByUserId = async (userId) => {
  try {
    console.log("🐾 PetProfiles: Fetching pets by user ID", { userId });
    const res = await axiosInstance.get(`/pet-profiles/user/${userId}`);
    console.log("🐾 PetProfiles: Fetched pets by user successfully", { count: res.data?.length || 0 });
    return res.data || [];
  } catch (error) {
    console.error("🐾 PetProfiles: Error fetching pets by user ID:", error);
    if (error.response?.status === 401) {
      throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    }
    if (error.response?.status === 403) {
      throw new Error("Bạn không có quyền xem hồ sơ thú cưng.");
    }
    throw error;
  }
};

/**
 * Get pets by type (e.g., "Dog", "Cat")
 * @param {string} petType - Pet type
 * @returns {Promise<Array>} Array of pet profiles
 */
export const getPetsByType = async (petType) => {
  try {
    console.log("🐾 PetProfiles: Fetching pets by type", { petType });
    const res = await axiosInstance.get(`/pet-profiles/type/${petType}`);
    console.log("🐾 PetProfiles: Fetched pets by type successfully", { count: res.data?.length || 0 });
    return res.data || [];
  } catch (error) {
    console.error("🐾 PetProfiles: Error fetching pets by type:", error);
    if (error.response?.status === 401) {
      throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    }
    if (error.response?.status === 403) {
      throw new Error("Bạn không có quyền xem hồ sơ thú cưng.");
    }
    throw error;
  }
};

/**
 * Get current user's pets (requires authentication)
 * @returns {Promise<Array>} Array of pet profiles belonging to current user
 */
export const getMyPets = async () => {
  try {
    console.log("🐾 PetProfiles: Fetching my pets");
    const res = await axiosInstance.get(`/pet-profiles/my-pets`);
    console.log("🐾 PetProfiles: Fetched my pets successfully", { count: res.data?.length || 0 });
    return res.data || [];
  } catch (error) {
    console.error("🐾 PetProfiles: Error fetching my pets:", error);
    if (error.response?.status === 401) {
      throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    }
    if (error.response?.status === 403) {
      throw new Error("Bạn không có quyền xem hồ sơ thú cưng.");
    }
    throw error;
  }
};

/**
 * Get all pets (Admin only)
 * @returns {Promise<Array>} Array of all pet profiles
 */
export const getAllPets = async () => {
  try {
    console.log("🐾 PetProfiles: Fetching all pets (Admin)");
    const res = await axiosInstance.get(`/pet-profiles/getAll`);
    console.log("🐾 PetProfiles: Fetched all pets successfully", { count: res.data?.length || 0 });
    return res.data || [];
  } catch (error) {
    console.error("🐾 PetProfiles: Error fetching all pets:", error);
    if (error.response?.status === 401) {
      throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    }
    if (error.response?.status === 403) {
      throw new Error("Chỉ admin mới có quyền xem tất cả hồ sơ thú cưng.");
    }
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


