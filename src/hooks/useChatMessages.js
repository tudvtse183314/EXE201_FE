import { useState, useEffect, useRef } from 'react';
import { toUiMessages, generateMessageId, formatChatDate } from '../utils/chatUtils';

/**
 * Hook to manage chat messages and conversion from ChatRecords
 * @param {Array} initialRecords - Initial ChatRecord array
 */
export const useChatMessages = (initialRecords = []) => {
  const [messages, setMessages] = useState(toUiMessages(initialRecords));
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  // Update messages when initialRecords change
  useEffect(() => {
    setMessages(toUiMessages(initialRecords));
  }, [initialRecords]);

  /**
   * Add a new message
   */
  const addMessage = (message) => {
    setMessages(prev => [...prev, message]);
  };

  /**
   * Add a pending assistant message
   */
  const addPendingMessage = (text = '') => {
    const message = {
      id: generateMessageId(),
      role: 'assistant',
      text,
      createdAt: new Date().toISOString(),
      pending: true,
    };
    addMessage(message);
    return message.id;
  };

  /**
   * Update a message by ID
   */
  const updateMessage = (id, updates) => {
    setMessages(prev =>
      prev.map(msg => (msg.id === id ? { ...msg, ...updates } : msg))
    );
  };

  /**
   * Remove a message by ID
   */
  const removeMessage = (id) => {
    setMessages(prev => prev.filter(msg => msg.id !== id));
  };

  /**
   * Clear all messages
   */
  const clearMessages = () => {
    setMessages([]);
  };

  /**
   * Scroll to bottom
   */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Auto scroll when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return {
    messages,
    setMessages,
    isSending,
    setIsSending,
    addMessage,
    addPendingMessage,
    updateMessage,
    removeMessage,
    clearMessages,
    scrollToBottom,
    messagesEndRef,
    formatChatDate,
  };
};

export default useChatMessages;

