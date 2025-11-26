import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../constants/roles';
import { chatHistoryApi } from '../../services/chatHistory';
import { useChatMessages } from '../../hooks/useChatMessages';
import ChatWindow from '../../components/ai/ChatWindow';
import { CloseOutlined } from '@ant-design/icons';
import './AIChatFloatingBot.css';

const AIChatFloatingBot = () => {
  const { isAuthenticated, user } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  // Chat logic states
  const [currentTab, setCurrentTab] = useState('general');
  const [chatRecords, setChatRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Default false, load on open
  
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

  // Only show for authenticated CUSTOMER users
  useEffect(() => {
    const authenticated = isAuthenticated();
    if (authenticated && user?.role === ROLES.CUSTOMER) {
      // Delay appearance for smooth entrance
      const timer = setTimeout(() => setIsVisible(true), 300);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [user?.role, user?.id]); // Sử dụng user?.id thay vì isAuthenticated function

  // Load chat history when opened or tab changes
  useEffect(() => {
    const loadChatHistory = async () => {
      if (!user?.userId || !isOpen) return;

      setIsLoading(true);
      try {
        const records = await chatHistoryApi.getByUserIdAndType(user.userId, currentTab);
        setChatRecords(records || []);
      } catch (error) {
        console.error('💬 AIChatFloatingBot: Error loading chat history', {
          error: error.response?.data || error.message,
          status: error.response?.status,
          userId: user.userId,
          chatType: currentTab,
        });
        // Silent error for floating bot - không hiển thị toast để tránh làm phiền user
        // Chỉ log để debug
      } finally {
        setIsLoading(false);
      }
    };

    loadChatHistory();
  }, [user?.userId, currentTab, isOpen]);

  // Handle image upload
  const handleImageUpload = (imageData, fileName) => {
    if (!user?.userId) {
      toast.error('Vui lòng đăng nhập để sử dụng tính năng này');
      return;
    }

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

    addMessage({
      id: `user-${Date.now()}`,
      role: 'user',
      text: userMessage,
      createdAt: new Date().toISOString(),
    });

    setIsSending(true);
    const pendingId = addPendingMessage('');

    try {
      const contextData = {
        page: window.location.pathname,
        timestamp: new Date().toISOString(),
      };

      const response = await chatHistoryApi.chatWithAI({
        userId: user.userId,
        userMessage,
        chatType: currentTab,
        contextData,
      });

      // Response từ chatHistory.js đã được xử lý để trả về chatHistory object
      if (response && response.aiResponse) {
        updateMessage(pendingId, {
          text: response.aiResponse,
          pending: false,
        });
      } else {
        throw new Error('Invalid response from AI: missing aiResponse');
      }
    } catch (error) {
      console.error('💬 AIChatFloatingBot: Error sending message', {
        error: error.response?.data || error.message,
        status: error.response?.status,
        userId: user.userId,
        chatType: currentTab,
      });
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

  // Don't show for non-authenticated users or non-customers
  if (!isAuthenticated() || user?.role !== ROLES.CUSTOMER) {
    return null;
  }

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Floating Chat Window */}
      {isOpen && (
        <div 
          className="fixed bottom-24 right-5 w-[400px] h-[600px] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-gray-200"
          style={{ 
            maxHeight: 'calc(100vh - 120px)',
            animation: 'fadeInUp 0.3s ease-out',
            zIndex: 1001
          }}
        >
          {/* Header with Close Button */}
          <div className="absolute top-2 right-2 z-10">
            <button 
              onClick={() => setIsOpen(false)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            >
              <CloseOutlined />
            </button>
          </div>
          
          {isLoading && chatRecords.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
            </div>
          ) : (
            <ChatWindow
              messages={messages}
              isSending={isSending}
              onSendMessage={handleSendMessage}
              currentTab={currentTab}
              onTabChange={setCurrentTab}
              formatChatDate={formatChatDate}
              onImageUpload={handleImageUpload}
            />
          )}
        </div>
      )}

      {/* Floating Bot Trigger */}
      <div 
        className={`ai-chat-bot-container ${isVisible ? 'visible' : ''}`} 
        onClick={toggleChat}
      >
        <div className="ai-chat-bot-pulse"></div>
        <div className="loader">
          <div className="eva">
            <div className="head">
              <div className="eyeChamber">
                <div className="eye"></div>
                <div className="eye"></div>
              </div>
            </div>
            <div className="body">
              <div className="hand"></div>
              <div className="hand"></div>
              <div className="scannerThing"></div>
              <div className="scannerOrigin"></div>
            </div>
          </div>
        </div>
        <div className="ai-chat-bot-label">
          <span>{isOpen ? 'Đóng Chat' : '💬 Chat với AI'}</span>
        </div>
      </div>
    </>
  );
};

export default AIChatFloatingBot;

