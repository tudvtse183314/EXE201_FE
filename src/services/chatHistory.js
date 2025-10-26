import axiosInstance from "../api/axios";
import { ChatTypes } from "../types/chat";

/**
 * Chat History API Service
 * @param {number} id - Chat ID
 */
export const getChatById = async (id) => {
  try {
    const res = await axiosInstance.get(`/chat-history/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching chat by ID:", error);
    throw error;
  }
};

/**
 * Update chat by ID
 * @param {number} id - Chat ID
 * @param {Object} data - Partial update data
 */
export const updateChatById = async (id, data) => {
  try {
    const res = await axiosInstance.put(`/chat-history/${id}`, data);
    return res.data;
  } catch (error) {
    console.error("Error updating chat:", error);
    throw error;
  }
};

/**
 * Delete chat by ID
 * @param {number} id - Chat ID
 */
export const deleteChatById = async (id) => {
  try {
    const res = await axiosInstance.delete(`/chat-history/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error deleting chat:", error);
    throw error;
  }
};

/**
 * Create chat manually (without AI)
 * @param {Object} body - ChatCreateManualDTO
 */
export const createChatManual = async (body) => {
  try {
    const res = await axiosInstance.post(`/chat-history`, body);
    return res.data;
  } catch (error) {
    console.error("Error creating manual chat:", error);
    throw error;
  }
};

/**
 * Chat with AI
 * @param {Object} body - ChatWithAIDTO
 */
export const chatWithAI = async (body) => {
  try {
    const res = await axiosInstance.post(`/chat-history/chat`, body);
    return res.data;
  } catch (error) {
    console.error("Error chatting with AI:", error);
    throw error;
  }
};

/**
 * Get all chats by user ID
 * @param {number} userId - User ID
 */
export const getChatsByUserId = async (userId) => {
  try {
    const res = await axiosInstance.get(`/chat-history/user/${userId}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching chats by user ID:", error);
    throw error;
  }
};

/**
 * Get chats by user ID and chat type
 * @param {number} userId - User ID
 * @param {string} chatType - Chat type (general, product_inquiry, order_support)
 */
export const getChatsByUserIdAndType = async (userId, chatType) => {
  try {
    const res = await axiosInstance.get(`/chat-history/user/${userId}/type/${chatType}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching chats by user ID and type:", error);
    throw error;
  }
};

/**
 * Count chats by user ID
 * @param {number} userId - User ID
 */
export const countChatsByUserId = async (userId) => {
  try {
    const res = await axiosInstance.get(`/chat-history/user/${userId}/count`);
    return res.data;
  } catch (error) {
    console.error("Error counting chats:", error);
    throw error;
  }
};

/**
 * Get chats by type
 * @param {string} chatType - Chat type
 */
export const getChatsByType = async (chatType) => {
  try {
    const res = await axiosInstance.get(`/chat-history/type/${chatType}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching chats by type:", error);
    throw error;
  }
};

/**
 * Get all chats (Admin only)
 */
export const getAllChats = async () => {
  try {
    const res = await axiosInstance.get(`/chat-history/getAll`);
    return res.data;
  } catch (error) {
    console.error("Error fetching all chats:", error);
    throw error;
  }
};

// Export grouped object for convenience
export const chatHistoryApi = {
  getById: getChatById,
  updateById: updateChatById,
  deleteById: deleteChatById,
  createManual: createChatManual,
  chatWithAI,
  getByUserId: getChatsByUserId,
  getByUserIdAndType: getChatsByUserIdAndType,
  countByUserId: countChatsByUserId,
  getByType: getChatsByType,
  getAll: getAllChats,
};

// Re-export ChatTypes for convenience
export { ChatTypes } from "../types/chat";

