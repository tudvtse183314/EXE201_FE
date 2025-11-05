/**
 * Convert ChatRecord array to UiMessage array
 * Each ChatRecord (userMessage + aiResponse) becomes 2 UiMessage objects
 * @param {Array} records - Array of ChatRecord
 * @returns {Array} Array of UiMessage
 */
export const toUiMessages = (records = []) => {
  const messages = [];
  
  records.forEach((record, idx) => {
    // User message
    messages.push({
      id: `user-${record.chatId}-${idx}`,
      role: 'user',
      text: record.userMessage || '',
      createdAt: record.createdAt || new Date().toISOString(),
      chatId: record.chatId,
      chatType: record.chatType,
      ctx: record.contextData,
    });
    
    // Assistant message
    messages.push({
      id: `assistant-${record.chatId}-${idx}`,
      role: 'assistant',
      text: record.aiResponse || '',
      createdAt: record.createdAt || new Date().toISOString(),
      chatId: record.chatId,
      chatType: record.chatType,
      ctx: record.contextData,
    });
  });
  
  return messages;
};

/**
 * Generate a simple UUID for UI messages
 */
export const generateMessageId = () => {
  return `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Format date for display
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date string (HH:mm • DD/MM)
 */
export const formatChatDate = (dateString) => {
  try {
    const date = new Date(dateString);
    const time = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${time} • ${day}/${month}`;
  } catch (error) {
    return '';
  }
};

/**
 * Get chat type display name
 */
export const getChatTypeDisplayName = (type) => {
  const map = {
    general: 'General',
    product_inquiry: 'Product Inquiry',
    order_support: 'Order Support',
  };
  return map[type] || type;
};

/**
 * Get chat type badge color (Ant Design compatible)
 */
export const getChatTypeBadgeColor = (type) => {
  const map = {
    general: 'default',
    product_inquiry: 'blue',
    order_support: 'green',
  };
  return map[type] || 'default';
};

