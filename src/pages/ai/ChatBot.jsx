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
        console.error('💬 ChatBot: Error loading chat history', {
          error: error.response?.data || error.message,
          status: error.response?.status,
          userId: user.userId,
          chatType: currentTab,
        });
        if (error.response?.status === 401 || error.response?.status === 403) {
          toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        } else {
          toast.error('Không thể tải lịch sử chat. Vui lòng thử lại sau.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadChatHistory();
  }, [user?.userId, currentTab]);

  // Handle image upload
  const handleImageUpload = (imageData, fileName) => {
    if (!user?.userId) {
      toast.error('Vui lòng đăng nhập để sử dụng tính năng này');
      return;
    }

    // Add image message
    addMessage({
      id: `user-image-${Date.now()}`,
      role: 'user',
      image: imageData,
      text: `Đã gửi ảnh: ${fileName}`,
      createdAt: new Date().toISOString(),
    });

    toast.success('Đã gửi ảnh');
  };

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
      // Response từ chatHistory.js đã được xử lý để trả về chatHistory object
      if (response && response.aiResponse) {
        updateMessage(pendingId, {
          text: response.aiResponse,
          pending: false,
        });
        toast.success('Đã gửi tin nhắn thành công');
      } else {
        throw new Error('Invalid response from AI: missing aiResponse');
      }
    } catch (error) {
      console.error('💬 ChatBot: Error sending message', {
        error: error.response?.data || error.message,
        status: error.response?.status,
        userId: user.userId,
        chatType: currentTab,
      });
      
      // Remove pending message on error
      removeMessage(pendingId);
      
      // Show error toast với thông tin chi tiết
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      } else if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        toast.error('Kết nối timeout. Vui lòng thử lại.');
      } else if (error.response?.data?.message) {
        toast.error(`Lỗi: ${error.response.data.message}`);
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
          onImageUpload={handleImageUpload}
        />
      </div>
    </div>
  );
};

export default ChatBot;

