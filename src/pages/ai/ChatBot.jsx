import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { chatWithGemini } from '../../services/geminiDirect';
import { useChatMessages } from '../../hooks/useChatMessages';
import ChatWindow from '../../components/ai/ChatWindow';
import { ROLES } from '../../constants/roles';

const ChatBot = () => {
  const { user } = useAuth();
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

    // Add pending assistant message
    const pendingId = addPendingMessage('');

    try {
      // Prepare context data
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
      console.error('💬 ChatBot: Error sending message', {
        error: error.message,
      });
      
      // Remove pending message on error
      removeMessage(pendingId);
      
      // Show error toast
      toast.error(error.message || 'Không thể gửi tin nhắn. Vui lòng thử lại sau.');
    } finally {
      setIsSending(false);
    }
  };

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

