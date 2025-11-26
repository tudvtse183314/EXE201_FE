import axiosInstance from "../api/axios";
import { ChatTypes } from "../types/chat";

/**
 * Chat History API Service
 * GET /api/chat-history/{id} - Lấy lịch sử chat theo ID
 * @param {number} id - Chat ID
 */
export const getChatById = async (id) => {
  try {
    console.log("💬 Chat History: Fetching chat by ID", { id });
    const res = await axiosInstance.get(`/chat-history/${id}`);
    console.log("💬 Chat History: Fetched chat successfully", { id, data: res.data });
    return res.data;
  } catch (error) {
    console.error("💬 Chat History: Error fetching chat by ID", {
      id,
      error: error.response?.data || error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      config: error.config,
    });
    throw error;
  }
};

/**
 * PUT /api/chat-history/{id} - Cập nhật lịch sử chat
 * @param {number} id - Chat ID
 * @param {Object} data - Partial update data
 */
export const updateChatById = async (id, data) => {
  try {
    console.log("💬 Chat History: Updating chat", { id, data });
    const res = await axiosInstance.put(`/chat-history/${id}`, data);
    console.log("💬 Chat History: Updated chat successfully", { id, data: res.data });
    return res.data;
  } catch (error) {
    console.error("💬 Chat History: Error updating chat", {
      id,
      data,
      error: error.response?.data || error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      config: error.config,
    });
    throw error;
  }
};

/**
 * DELETE /api/chat-history/{id} - Xóa lịch sử chat
 * @param {number} id - Chat ID
 */
export const deleteChatById = async (id) => {
  try {
    console.log("💬 Chat History: Deleting chat", { id });
    const res = await axiosInstance.delete(`/chat-history/${id}`);
    console.log("💬 Chat History: Deleted chat successfully", { id, data: res.data });
    return res.data;
  } catch (error) {
    console.error("💬 Chat History: Error deleting chat", {
      id,
      error: error.response?.data || error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      config: error.config,
    });
    throw error;
  }
};

/**
 * POST /api/chat-history - Tạo lịch sử chat thủ công (không dùng AI)
 * @param {Object} body - ChatCreateManualDTO
 */
export const createChatManual = async (body) => {
  try {
    console.log("💬 Chat History: Creating manual chat", { body });
    const res = await axiosInstance.post(`/chat-history`, body);
    console.log("💬 Chat History: Created manual chat successfully", { data: res.data });
    return res.data;
  } catch (error) {
    console.error("💬 Chat History: Error creating manual chat", {
      body,
      error: error.response?.data || error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      config: error.config,
    });
    throw error;
  }
};

/**
 * POST /api/chat-history/chat - Chat với AI trợ lý PetVibe
 * Sử dụng Google Gemini để chat và tự động lưu lịch sử
 * Response structure: { message, success, chatHistory: { chatId, userId, userMessage, aiResponse, chatType, createdAt, contextData } }
 * @param {Object} body - ChatWithAIDTO { userId, userMessage, chatType, contextData? }
 * @returns {Object} Response với chatHistory object
 */
export const chatWithAI = async (body) => {
  try {
    console.log("💬 Chat History: Chatting with AI", { 
      userId: body.userId, 
      chatType: body.chatType,
      messageLength: body.userMessage?.length 
    });
    const res = await axiosInstance.post(`/chat-history/chat`, body);
    console.log("💬 Chat History: Chat with AI successful", { 
      response: res.data,
      chatHistory: res.data?.chatHistory || res.data 
    });
    
    // Handle response structure: có thể là { message, success, chatHistory } hoặc trực tiếp chatHistory
    const chatHistory = res.data?.chatHistory || res.data;
    return chatHistory;
  } catch (error) {
    console.error("💬 Chat History: Error chatting with AI", {
      body: { userId: body.userId, chatType: body.chatType, messageLength: body.userMessage?.length },
      error: error.response?.data || error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      config: error.config,
    });
    throw error;
  }
};

/**
 * GET /api/chat-history/my - Lấy lịch sử chat của user hiện tại (KHÔNG gửi userId)
 * Note: Endpoint này có thể không tồn tại trong Swagger, chỉ dùng nếu BE hỗ trợ
 */
export const getMyChatHistory = async () => {
  try {
    console.log("💬 Chat History: Fetching my chat history");
    const res = await axiosInstance.get("/chat-history/my");
    console.log("💬 Chat History: Fetched my chat history successfully", { data: res.data });
    return res.data;
  } catch (error) {
    console.error("💬 Chat History: Error fetching my chat history", {
      error: error.response?.data || error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      config: error.config,
    });
    throw error;
  }
};

/**
 * GET /api/chat-history/user/{userId} - Lấy lịch sử chat theo User ID
 * @param {number} userId - User ID
 * @returns {Array} Danh sách chat history
 */
export const getChatsByUserId = async (userId) => {
  try {
    console.log("💬 Chat History: Fetching chats by user ID", { userId });
    const res = await axiosInstance.get(`/chat-history/user/${userId}`);
    console.log("💬 Chat History: Fetched chats by user ID successfully", { userId, count: res.data?.length || 0 });
    return res.data || [];
  } catch (error) {
    console.error("💬 Chat History: Error fetching chats by user ID", {
      userId,
      error: error.response?.data || error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      config: error.config,
    });
    throw error;
  }
};

/**
 * GET /api/chat-history/user/{userId}/type/{chatType} - Lấy lịch sử chat theo User ID và Chat Type
 * @param {number} userId - User ID
 * @param {string} chatType - Chat type (general, product_inquiry, order_support)
 * @returns {Array} Danh sách chat history
 */
export const getChatsByUserIdAndType = async (userId, chatType) => {
  try {
    console.log("💬 Chat History: Fetching chats by user ID and type", { userId, chatType });
    const res = await axiosInstance.get(`/chat-history/user/${userId}/type/${chatType}`);
    console.log("💬 Chat History: Fetched chats by user ID and type successfully", { 
      userId, 
      chatType, 
      count: res.data?.length || 0 
    });
    return res.data || [];
  } catch (error) {
    console.error("💬 Chat History: Error fetching chats by user ID and type", {
      userId,
      chatType,
      error: error.response?.data || error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      config: error.config,
    });
    throw error;
  }
};

/**
 * GET /api/chat-history/user/{userId}/count - Đếm số lượng chat của user
 * @param {number} userId - User ID
 * @returns {number} Số lượng chat
 */
export const countChatsByUserId = async (userId) => {
  try {
    console.log("💬 Chat History: Counting chats by user ID", { userId });
    const res = await axiosInstance.get(`/chat-history/user/${userId}/count`);
    console.log("💬 Chat History: Counted chats successfully", { userId, count: res.data });
    return res.data;
  } catch (error) {
    console.error("💬 Chat History: Error counting chats", {
      userId,
      error: error.response?.data || error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      config: error.config,
    });
    throw error;
  }
};

/**
 * GET /api/chat-history/type/{chatType} - Lấy lịch sử chat theo Chat Type
 * @param {string} chatType - Chat type (general, product_inquiry, order_support)
 * @returns {Array} Danh sách chat history
 */
export const getChatsByType = async (chatType) => {
  try {
    console.log("💬 Chat History: Fetching chats by type", { chatType });
    const res = await axiosInstance.get(`/chat-history/type/${chatType}`);
    console.log("💬 Chat History: Fetched chats by type successfully", { chatType, count: res.data?.length || 0 });
    return res.data || [];
  } catch (error) {
    console.error("💬 Chat History: Error fetching chats by type", {
      chatType,
      error: error.response?.data || error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      config: error.config,
    });
    throw error;
  }
};

/**
 * GET /api/chat-history/getAll - Lấy tất cả lịch sử chat (Admin only)
 * @returns {Array} Danh sách tất cả chat history
 */
export const getAllChats = async () => {
  try {
    console.log("💬 Chat History: Fetching all chats");
    const res = await axiosInstance.get(`/chat-history/getAll`);
    console.log("💬 Chat History: Fetched all chats successfully", { count: res.data?.length || 0 });
    return res.data || [];
  } catch (error) {
    console.error("💬 Chat History: Error fetching all chats", {
      error: error.response?.data || error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      config: error.config,
    });
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

