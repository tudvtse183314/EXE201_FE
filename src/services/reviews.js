// src/services/reviews.js
import axiosInstance from "../api/axios";

// Get reviews by product ID
export const getReviewsByProductId = async (productId) => {
  try {
    if (!productId) {
      throw new Error("Product ID is required");
    }
    console.log("⭐ Reviews: Fetching reviews for product", { productId });
    const res = await axiosInstance.get(`/reviews/product/${productId}`);
    const reviews = Array.isArray(res.data) ? res.data : [];
    console.log("⭐ Reviews: Fetched reviews successfully", { count: reviews.length });
    return reviews;
  } catch (e) {
    const status = e?.response?.status;
    const responseData = e?.response?.data;
    console.error("⭐ Reviews: Error fetching reviews:", {
      productId,
      status,
      message: responseData?.message || e.message,
      response: responseData
    });
    
    // Return empty array if 404 or other errors
    if (status === 404) {
      return [];
    }
    
    // Provide specific error messages
    if (status === 400) {
      throw new Error(responseData?.message || "Product ID không hợp lệ.");
    }
    if (status === 401) {
      throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    }
    if (status === 403) {
      throw new Error("Bạn không có quyền xem đánh giá sản phẩm này.");
    }
    
    throw new Error(responseData?.message || "Không thể tải đánh giá sản phẩm. Vui lòng thử lại.");
  }
};

// Get reviews by user ID
export const getReviewsByUserId = async (userId) => {
  try {
    if (!userId) {
      throw new Error("User ID is required");
    }
    console.log("⭐ Reviews: Fetching reviews for user", { userId });
    const res = await axiosInstance.get(`/reviews/user/${userId}`);
    const reviews = Array.isArray(res.data) ? res.data : [];
    console.log("⭐ Reviews: Fetched user reviews successfully", { count: reviews.length });
    return reviews;
  } catch (e) {
    const status = e?.response?.status;
    const responseData = e?.response?.data;
    console.error("⭐ Reviews: Error fetching user reviews:", {
      userId,
      status,
      message: responseData?.message || e.message,
      response: responseData
    });
    
    if (status === 404) {
      return [];
    }
    
    if (status === 400) {
      throw new Error(responseData?.message || "User ID không hợp lệ.");
    }
    if (status === 401) {
      throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    }
    if (status === 403) {
      throw new Error("Bạn không có quyền xem đánh giá của người dùng này.");
    }
    
    throw new Error(responseData?.message || "Không thể tải đánh giá của người dùng. Vui lòng thử lại.");
  }
};

// Create review
export const createReview = async (reviewData) => {
  try {
    // Validate required fields
    if (!reviewData?.productId) {
      throw new Error("Product ID is required");
    }
    if (!reviewData?.userId) {
      throw new Error("User ID is required");
    }
    if (!reviewData?.rating || reviewData.rating < 1 || reviewData.rating > 5) {
      throw new Error("Rating must be between 1 and 5");
    }
    
    console.log("⭐ Reviews: Creating review", reviewData);
    const res = await axiosInstance.post("/reviews", reviewData);
    console.log("⭐ Reviews: Created review successfully", res.data);
    return res.data;
  } catch (e) {
    const status = e?.response?.status;
    const responseData = e?.response?.data;
    console.error("⭐ Reviews: Error creating review:", {
      reviewData,
      status,
      message: responseData?.message || e.message,
      response: responseData
    });
    
    if (status === 400) {
      throw new Error(responseData?.message || "Dữ liệu đánh giá không hợp lệ. Vui lòng kiểm tra lại.");
    }
    if (status === 401) {
      throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    }
    if (status === 403) {
      throw new Error("Bạn không có quyền tạo đánh giá. Chỉ khách hàng đã mua sản phẩm mới có thể đánh giá.");
    }
    if (status === 409) {
      throw new Error(responseData?.message || "Bạn đã đánh giá sản phẩm này rồi.");
    }
    
    throw new Error(responseData?.message || e.message || "Không thể tạo đánh giá. Vui lòng thử lại.");
  }
};

// Update review
export const updateReview = async (reviewId, reviewData) => {
  try {
    if (!reviewId) {
      throw new Error("Review ID is required");
    }
    
    // Validate rating if provided
    if (reviewData?.rating !== undefined && (reviewData.rating < 1 || reviewData.rating > 5)) {
      throw new Error("Rating must be between 1 and 5");
    }
    
    console.log("⭐ Reviews: Updating review", { reviewId, reviewData });
    const res = await axiosInstance.put(`/reviews/${reviewId}`, reviewData);
    console.log("⭐ Reviews: Updated review successfully", res.data);
    return res.data;
  } catch (e) {
    const status = e?.response?.status;
    const responseData = e?.response?.data;
    console.error("⭐ Reviews: Error updating review:", {
      reviewId,
      reviewData,
      status,
      message: responseData?.message || e.message,
      response: responseData
    });
    
    if (status === 400) {
      throw new Error(responseData?.message || "Dữ liệu đánh giá không hợp lệ. Vui lòng kiểm tra lại.");
    }
    if (status === 401) {
      throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    }
    if (status === 403) {
      throw new Error("Bạn không có quyền cập nhật đánh giá này.");
    }
    if (status === 404) {
      throw new Error("Không tìm thấy đánh giá.");
    }
    
    throw new Error(responseData?.message || e.message || "Không thể cập nhật đánh giá. Vui lòng thử lại.");
  }
};

// Delete review
export const deleteReview = async (reviewId) => {
  try {
    if (!reviewId) {
      throw new Error("Review ID is required");
    }
    
    console.log("⭐ Reviews: Deleting review", { reviewId });
    const res = await axiosInstance.delete(`/reviews/${reviewId}`);
    console.log("⭐ Reviews: Deleted review successfully", res.data);
    return res.data;
  } catch (e) {
    const status = e?.response?.status;
    const responseData = e?.response?.data;
    console.error("⭐ Reviews: Error deleting review:", {
      reviewId,
      status,
      message: responseData?.message || e.message,
      response: responseData
    });
    
    if (status === 401) {
      throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    }
    if (status === 403) {
      throw new Error("Bạn không có quyền xóa đánh giá này. Chỉ Admin/Staff mới có quyền này.");
    }
    if (status === 404) {
      throw new Error("Không tìm thấy đánh giá.");
    }
    
    throw new Error(responseData?.message || e.message || "Không thể xóa đánh giá. Vui lòng thử lại.");
  }
};

// Get review by ID
export const getReviewById = async (reviewId) => {
  try {
    if (!reviewId) {
      throw new Error("Review ID is required");
    }
    
    console.log("⭐ Reviews: Fetching review by ID", { reviewId });
    const res = await axiosInstance.get(`/reviews/${reviewId}`);
    const review = res.data?.data || res.data;
    console.log("⭐ Reviews: Fetched review successfully", review);
    return review;
  } catch (e) {
    const status = e?.response?.status;
    const responseData = e?.response?.data;
    console.error("⭐ Reviews: Error fetching review:", {
      reviewId,
      status,
      message: responseData?.message || e.message,
      response: responseData
    });
    
    if (status === 400) {
      throw new Error(responseData?.message || "Review ID không hợp lệ.");
    }
    if (status === 401) {
      throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    }
    if (status === 403) {
      throw new Error("Bạn không có quyền xem đánh giá này.");
    }
    if (status === 404) {
      throw new Error("Không tìm thấy đánh giá.");
    }
    
    throw new Error(responseData?.message || e.message || "Không thể tải đánh giá. Vui lòng thử lại.");
  }
};

// Get all reviews (Admin only)
export const getAllReviews = async () => {
  try {
    console.log("⭐ Reviews: Fetching all reviews");
    const res = await axiosInstance.get("/reviews/getAll");
    const reviews = Array.isArray(res.data) ? res.data : [];
    console.log("⭐ Reviews: Fetched all reviews successfully", { count: reviews.length });
    return reviews;
  } catch (e) {
    const status = e?.response?.status;
    const responseData = e?.response?.data;
    console.error("⭐ Reviews: Error fetching all reviews:", {
      status,
      message: responseData?.message || e.message,
      response: responseData
    });
    
    if (status === 404) {
      return [];
    }
    
    if (status === 400) {
      throw new Error(responseData?.message || "Yêu cầu không hợp lệ.");
    }
    if (status === 401) {
      throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    }
    if (status === 403) {
      throw new Error("Bạn không có quyền xem tất cả đánh giá. Chỉ Admin/Staff mới có quyền này.");
    }
    
    throw new Error(responseData?.message || e.message || "Không thể tải danh sách đánh giá. Vui lòng thử lại.");
  }
};

