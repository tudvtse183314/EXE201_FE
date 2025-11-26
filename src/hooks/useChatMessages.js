import { useState, useEffect, useRef } from 'react';
import { toUiMessages, generateMessageId, formatChatDate } from '../utils/chatUtils';

/**
 * Hook to manage chat messages and conversion from ChatRecords
 * @param {Array} initialRecords - Initial ChatRecord array
 */
export const useChatMessages = (initialRecords = []) => {
  const [messages, setMessages] = useState(() => toUiMessages(initialRecords));
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);
  const previousRecordsStringRef = useRef(null);
  const isInitialMount = useRef(true);

  // Initialize previous records string on mount
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      previousRecordsStringRef.current = JSON.stringify(initialRecords);
    }
  }, []); // Only run once on mount

  // Update messages when initialRecords change (deep comparison)
  // Only update if initialRecords is not empty or if it actually changed
  useEffect(() => {
    // Skip if this is the initial mount (already handled above)
    if (isInitialMount.current) {
      return;
    }

    const currentRecordsString = JSON.stringify(initialRecords);
    
    // Only update if the content actually changed (deep comparison)
    if (previousRecordsStringRef.current !== currentRecordsString) {
      previousRecordsStringRef.current = currentRecordsString;
      
      // If initialRecords is empty, don't update (keep existing messages)
      // This prevents clearing messages when empty array [] is passed repeatedly
      if (initialRecords.length === 0) {
        return;
      }
      
      const newMessages = toUiMessages(initialRecords);
      
      // Only update if messages actually changed
      setMessages(prev => {
        const prevString = JSON.stringify(prev);
        const newString = JSON.stringify(newMessages);
        if (prevString !== newString) {
          return newMessages;
        }
        return prev; // Return same reference to avoid re-render
      });
    }
  }, [initialRecords]); // Only depend on initialRecords

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

