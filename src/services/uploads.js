// src/services/uploads.js
import axiosInstance from '../api/axios';

/**
 * Upload ảnh lên Backend (MySQL BLOB)
 * @param {File} file - File ảnh cần upload
 * @param {string} folder - Folder path (optional, có thể dùng cho metadata)
 * @returns {Promise<string>} URL của ảnh (dạng /api/uploads/{id})
 */
export async function uploadImageToBE(file, folder = 'products') {
  try {
    if (!file) {
      throw new Error('File không được để trống');
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif'];
    if (!validTypes.includes(file.type.toLowerCase())) {
      throw new Error('Chỉ chấp nhận file ảnh .jpg, .jpeg, .png, .webp, .avif');
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error('Kích thước ảnh không được vượt quá 5MB');
    }

    const formData = new FormData();
    formData.append('file', file);
    // Nếu BE cần folder metadata, có thể thêm:
    // formData.append('folder', folder);

    console.log('📤 Upload: Uploading image to BE...', { 
      filename: file.name, 
      size: file.size, 
      type: file.type 
    });

    const res = await axiosInstance.post('/uploads', formData, {
      headers: { 
        'Content-Type': 'multipart/form-data' 
      }
    });

    // BE trả về: { id, url, contentType, size }
    // url = "/api/uploads/{id}"
    const imageUrl = res.data?.url || res.data?.url || null;

    if (!imageUrl) {
      throw new Error('Backend không trả về URL ảnh');
    }

    console.log('📤 Upload: Upload successful', { 
      id: res.data?.id, 
      url: imageUrl 
    });

    return imageUrl;
  } catch (error) {
    console.error('📤 Upload: Upload error', error);
    throw new Error(error?.response?.data?.message || error?.message || 'Upload thất bại');
  }
}

/**
 * Xóa ảnh từ Backend (optional)
 * @param {string} imageUrl - URL của ảnh (dạng /api/uploads/{id})
 * @returns {Promise<void>}
 */
export async function deleteImageFromBE(imageUrl) {
  try {
    if (!imageUrl || !imageUrl.includes('/api/uploads/')) {
      console.warn('📤 Upload: Invalid URL for deletion:', imageUrl);
      return; // Không phải URL từ BE
    }

    // Extract ID từ URL: /api/uploads/{id}
    const idMatch = imageUrl.match(/\/api\/uploads\/(\d+)/);
    if (!idMatch || !idMatch[1]) {
      console.warn('📤 Upload: Cannot extract ID from URL:', imageUrl);
      return;
    }

    const fileId = idMatch[1];
    console.log('📤 Upload: Deleting image from BE...', { id: fileId });

    await axiosInstance.delete(`/uploads/${fileId}`);
    console.log('📤 Upload: Image deleted successfully', { id: fileId });
  } catch (error) {
    // Bỏ qua lỗi nếu file không tồn tại hoặc đã bị xóa
    console.warn('📤 Upload: Delete skipped', error?.message || error);
  }
}

