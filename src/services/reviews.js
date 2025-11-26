// src/services/reviews.js
import axiosInstance from "../api/axios";

// Get reviews by product ID
export const getReviewsByProductId = async (productId) => {
  try {
    console.log("⭐ Reviews: Fetching reviews for product", { productId });
    const res = await axiosInstance.get(`/reviews/product/${productId}`);
    const reviews = Array.isArray(res.data) ? res.data : [];
    console.log("⭐ Reviews: Fetched reviews successfully", { count: reviews.length });
    return reviews;
  } catch (e) {
    console.error("⭐ Reviews: Error fetching reviews:", e);
    // Return empty array if 404 or other errors
    if (e?.response?.status === 404) {
      return [];
    }
    throw e;
  }
};

// Get reviews by user ID
export const getReviewsByUserId = async (userId) => {
  try {
    console.log("⭐ Reviews: Fetching reviews for user", { userId });
    const res = await axiosInstance.get(`/reviews/user/${userId}`);
    const reviews = Array.isArray(res.data) ? res.data : [];
    console.log("⭐ Reviews: Fetched user reviews successfully", { count: reviews.length });
    return reviews;
  } catch (e) {
    console.error("⭐ Reviews: Error fetching user reviews:", e);
    if (e?.response?.status === 404) {
      return [];
    }
    throw e;
  }
};

// Create review
export const createReview = async (reviewData) => {
  try {
    console.log("⭐ Reviews: Creating review", reviewData);
    const res = await axiosInstance.post("/reviews", reviewData);
    console.log("⭐ Reviews: Created review successfully", res.data);
    return res.data;
  } catch (e) {
    console.error("⭐ Reviews: Error creating review:", e);
    throw e;
  }
};

// Update review
export const updateReview = async (reviewId, reviewData) => {
  try {
    console.log("⭐ Reviews: Updating review", { reviewId, reviewData });
    const res = await axiosInstance.put(`/reviews/${reviewId}`, reviewData);
    console.log("⭐ Reviews: Updated review successfully", res.data);
    return res.data;
  } catch (e) {
    console.error("⭐ Reviews: Error updating review:", e);
    throw e;
  }
};

// Delete review
export const deleteReview = async (reviewId) => {
  try {
    console.log("⭐ Reviews: Deleting review", { reviewId });
    const res = await axiosInstance.delete(`/reviews/${reviewId}`);
    console.log("⭐ Reviews: Deleted review successfully", res.data);
    return res.data;
  } catch (e) {
    console.error("⭐ Reviews: Error deleting review:", e);
    throw e;
  }
};

// Get review by ID
export const getReviewById = async (reviewId) => {
  try {
    console.log("⭐ Reviews: Fetching review by ID", { reviewId });
    const res = await axiosInstance.get(`/reviews/${reviewId}`);
    const review = res.data?.data || res.data;
    console.log("⭐ Reviews: Fetched review successfully", review);
    return review;
  } catch (e) {
    console.error("⭐ Reviews: Error fetching review:", e);
    throw e;
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
    console.error("⭐ Reviews: Error fetching all reviews:", e);
    if (e?.response?.status === 404) {
      return [];
    }
    throw e;
  }
};

