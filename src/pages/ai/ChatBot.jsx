import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { chatHistoryApi } from '../../services/chatHistory';
import { useChatMessages } from '../../hooks/useChatMessages';
import ChatWindow from '../../components/ai/ChatWindow';
import { ROLES } from '../../constants/roles';

const ChatBot = () => {
  const { user } = useAuth();
  const [currentTab, setCurrentTab] = useState('general');
  const [chatRecords, setChatRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const {
    messages,
    isSending,
    setIsSending,
    addMessage,
    addPendingMessage,
    updateMessage,
    removeMessage,
    formatChatDate,
  } = useChatMessages(chatRecords);

  // Load chat history when tab changes
  useEffect(() => {
    const loadChatHistory = async () => {
      if (!user?.userId) return;

      setIsLoading(true);
      try {
        const records = await chatHistoryApi.getByUserIdAndType(user.userId, currentTab);
        setChatRecords(records || []);
      } catch (error) {
        console.error('Error loading chat history:', error);
        toast.error('Không thể tải lịch sử chat');
      } finally {
        setIsLoading(false);
      }
    };

    loadChatHistory();
  }, [user?.userId, currentTab]);

  // Handle sending a message
  const handleSendMessage = async (userMessage) => {
    if (!user?.userId) {
      toast.error('Vui lòng đăng nhập để sử dụng tính năng này');
      return;
    }

    if (isSending) return;

    // Add user message
    addMessage({
      id: `user-${Date.now()}`,
      role: 'user',
      text: userMessage,
      createdAt: new Date().toISOString(),
    });

    setIsSending(true);

    // Add pending assistant message
    const pendingId = addPendingMessage('');

    try {
      // Prepare context data (you can enhance this based on your app state)
      const contextData = {
        page: window.location.pathname,
        timestamp: new Date().toISOString(),
      };

      // Call AI API
      const response = await chatHistoryApi.chatWithAI({
        userId: user.userId,
        userMessage,
        chatType: currentTab,
        contextData,
      });

      // Update pending message with AI response
      if (response && response.aiResponse) {
        updateMessage(pendingId, {
          text: response.aiResponse,
          pending: false,
        });
      } else {
        throw new Error('Invalid response from AI');
      }

      toast.success('Đã gửi tin nhắn thành công');
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Remove pending message on error
      removeMessage(pendingId);
      
      // Show error toast
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      } else if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        toast.error('Kết nối timeout. Vui lòng thử lại.');
      } else {
        toast.error('Không thể gửi tin nhắn. Vui lòng thử lại sau.');
      }
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto h-[calc(100vh-8rem)] mt-8 mb-8">
        <ChatWindow
          messages={messages}
          isSending={isSending}
          onSendMessage={handleSendMessage}
          currentTab={currentTab}
          onTabChange={setCurrentTab}
          formatChatDate={formatChatDate}
        />
      </div>
    </div>
  );
};

export default ChatBot;

