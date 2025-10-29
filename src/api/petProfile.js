import axiosInstance from "./axios";

// 🐶 Tạo hồ sơ thú cưng
export const createPetProfile = async (data) => {
  try {
    const res = await axiosInstance.post("/pet-profiles", data);
    return res.data;
  } catch (error) {
    if (error.response?.status === 401) throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    if (error.response?.status === 403) throw new Error("Bạn không có quyền tạo hồ sơ thú cưng.");
    if (error.response?.status === 400) throw new Error("Dữ liệu hồ sơ thú cưng không hợp lệ. Vui lòng kiểm tra lại.");
    throw error;
  }
};

// 📋 Lấy danh sách thú cưng của user
export const getMyPets = async () => {
  try {
    const res = await axiosInstance.get("/pet-profiles/my-pets");
    return res.data;
  } catch (error) {
    if (error.response?.status === 401) throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    if (error.response?.status === 403) throw new Error("Bạn không có quyền xem hồ sơ thú cưng.");
    throw error;
  }
};

// 🔍 Lấy hồ sơ thú cưng theo ID
export const getPetProfileById = async (id) => {
  try {
    const res = await axiosInstance.get(`/pet-profiles/${id}`);
    return res.data;
  } catch (error) {
    if (error.response?.status === 401) throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    if (error.response?.status === 403) throw new Error("Bạn không có quyền xem hồ sơ thú cưng này.");
    if (error.response?.status === 404) throw new Error("Không tìm thấy hồ sơ thú cưng.");
    throw error;
  }
};

// ✏️ Cập nhật hồ sơ
export const updatePetProfile = async (id, data) => {
  try {
    const res = await axiosInstance.put(`/pet-profiles/${id}`, data);
    return res.data;
  } catch (error) {
    if (error.response?.status === 401) throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    if (error.response?.status === 403) throw new Error("Bạn không có quyền cập nhật hồ sơ thú cưng này.");
    if (error.response?.status === 404) throw new Error("Không tìm thấy hồ sơ thú cưng để cập nhật.");
    if (error.response?.status === 400) throw new Error("Dữ liệu cập nhật không hợp lệ. Vui lòng kiểm tra lại.");
    throw error;
  }
};

// ❌ Xóa hồ sơ
export const deletePetProfile = async (id) => {
  try {
    const res = await axiosInstance.delete(`/pet-profiles/${id}`);
    return res.data;
  } catch (error) {
    if (error.response?.status === 401) throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    if (error.response?.status === 403) throw new Error("Bạn không có quyền xóa hồ sơ thú cưng này.");
    if (error.response?.status === 404) throw new Error("Không tìm thấy hồ sơ thú cưng để xóa.");
    throw error;
  }
};

// 👥 Lấy hồ sơ thú cưng theo User ID
export const getPetProfilesByUserId = async (userId) => {
  try {
    const res = await axiosInstance.get(`/pet-profiles/user/${userId}`);
    return res.data;
  } catch (error) {
    if (error.response?.status === 401) throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    if (error.response?.status === 403) throw new Error("Bạn không có quyền xem hồ sơ thú cưng.");
    throw error;
  }
};

// 🐕 Lấy hồ sơ thú cưng theo loại
export const getPetProfilesByType = async (petType) => {
  try {
    const res = await axiosInstance.get(`/pet-profiles/type/${petType}`);
    return res.data;
  } catch (error) {
    if (error.response?.status === 401) throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    if (error.response?.status === 403) throw new Error("Bạn không có quyền xem hồ sơ thú cưng.");
    throw error;
  }
};

// 📋 Lấy tất cả hồ sơ thú cưng (Admin only)
export const getAllPetProfiles = async () => {
  try {
    const res = await axiosInstance.get("/pet-profiles/getAll");
    return res.data;
  } catch (error) {
    if (error.response?.status === 401) throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    if (error.response?.status === 403) throw new Error("Chỉ admin mới có quyền xem tất cả hồ sơ thú cưng.");
    throw error;
  }
};