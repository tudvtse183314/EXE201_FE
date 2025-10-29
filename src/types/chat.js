/**
 * @typedef {'general' | 'product_inquiry' | 'order_support'} ChatType
 */

/**
 * @typedef {Object} ChatRecord
 * @property {number} chatId
 * @property {number} userId
 * @property {string} userMessage
 * @property {string} aiResponse
 * @property {ChatType} chatType
 * @property {string} createdAt
 * @property {Record<string, any>} [contextData]
 */

/**
 * @typedef {Object} ChatCreateManualDTO
 * @property {number} [chatId]
 * @property {number} userId
 * @property {string} userMessage
 * @property {string} aiResponse
 * @property {ChatType} chatType
 * @property {string} [createdAt]
 * @property {Record<string, any>} [contextData]
 */

/**
 * @typedef {Object} ChatWithAIDTO
 * @property {number} userId
 * @property {string} userMessage
 * @property {ChatType} chatType
 * @property {Record<string, any>} [contextData]
 */

/**
 * @typedef {Object} UiMessage
 * @property {string} id - uuid
 * @property {'user' | 'assistant'} role
 * @property {string} text
 * @property {string} createdAt
 * @property {boolean} [pending] - để vẽ loader
 * @property {string} [image] - base64 image data or image URL
 * @property {Record<string, any>} [ctx]
 */

export const ChatTypes = {
  GENERAL: 'general',
  PRODUCT_INQUIRY: 'product_inquiry',
  ORDER_SUPPORT: 'order_support',
};

