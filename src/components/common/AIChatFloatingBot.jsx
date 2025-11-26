import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../constants/roles';
import { chatWithGemini } from '../../services/geminiDirect';
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
  const [chatHistory, setChatHistory] = useState([]); // Lưu lịch sử chat local
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    messages,
    isSending,
    setIsSending,
    addMessage,
    addPendingMessage,
    updateMessage,
    removeMessage,
    formatChatDate,
  } = useChatMessages([]); // Không dùng chatRecords từ BE nữa

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
  }, [user?.role, user?.id]);

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

  // Handle sending a message - Gọi Gemini trực tiếp
  const handleSendMessage = async (userMessage) => {
    if (isSending) return;

    // Add user message
    const userMsg = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: userMessage,
      createdAt: new Date().toISOString(),
    };
    addMessage(userMsg);

    // Cập nhật lịch sử chat local
    setChatHistory(prev => [...prev, userMsg]);

    setIsSending(true);
    const pendingId = addPendingMessage('');

    try {
      const contextData = {
        page: window.location.pathname,
        timestamp: new Date().toISOString(),
      };

      // Gọi Gemini API trực tiếp (không qua backend)
      const aiResponse = await chatWithGemini(userMessage, chatHistory, contextData);

      // Tạo message từ AI
      const aiMsg = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        text: aiResponse,
        createdAt: new Date().toISOString(),
      };

      // Update pending message with AI response
      updateMessage(pendingId, {
        text: aiResponse,
        pending: false,
      });

      // Cập nhật lịch sử chat local
      setChatHistory(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error('💬 AIChatFloatingBot: Error sending message', {
        error: error.message,
      });
      removeMessage(pendingId);
      
      // Show error toast
      toast.error(error.message || 'Không thể gửi tin nhắn. Vui lòng thử lại sau.');
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

