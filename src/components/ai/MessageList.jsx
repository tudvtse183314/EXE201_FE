import React from 'react';
import { Tag } from 'antd';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import TypingLoader from './TypingLoader';
import { formatChatDate, getChatTypeDisplayName, getChatTypeBadgeColor } from '../../utils/chatUtils';

const MessageList = ({ messages, formatChatDate, currentTab }) => {
  if (!messages || messages.length === 0) {
    let emptyMessage = "Bắt đầu cuộc trò chuyện với AI trợ lý PetVibe";
    let emptyIcon = "💬";

    if (currentTab === 'product_inquiry') {
      emptyMessage = "Hỏi tôi về thức ăn, đồ chơi, hoặc phụ kiện cho thú cưng của bạn!";
      emptyIcon = "🛍️";
    } else if (currentTab === 'order_support') {
      emptyMessage = "Bạn cần hỗ trợ gì về đơn hàng của mình?";
      emptyIcon = "📦";
    }

    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="text-6xl mb-4">{emptyIcon}</div>
          <p className="text-gray-500 text-lg">Chưa có tin nhắn nào</p>
          <p className="text-gray-400 text-sm mt-2">
            {emptyMessage}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message, index) => {
        const isUser = message.role === 'user';
        const isPending = message.pending;
        const showTypeBadge = index === 0 || 
          (messages[index - 1] && messages[index - 1].chatType !== message.chatType);

        return (
          <div
            key={message.id}
            className={`flex ${isUser ? 'justify-end' : 'justify-start'} ${
              index > 0 && messages[index - 1].chatType === message.chatType ? 'mt-2' : ''
            }`}
          >
            <div className={`max-w-[75%] ${isUser ? 'order-2' : 'order-1'}`}>
              {/* Type badge for first message of a new chat type */}
              {!isUser && showTypeBadge && message.chatType && (
                <div className="mb-1">
                  <Tag color={getChatTypeBadgeColor(message.chatType)}>
                    {getChatTypeDisplayName(message.chatType)}
                  </Tag>
                </div>
              )}

              {/* Message bubble */}
              <div
                className={`rounded-2xl px-4 py-3 ${
                  isUser
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-800 border border-gray-200'
                }`}
              >
                {isPending ? (
                  <TypingLoader />
                ) : (
                  <>
                    {message.image && (
                      <div className="mb-2 rounded-lg overflow-hidden">
                        <LazyLoadImage 
                          src={message.image} 
                          alt="Uploaded" 
                          className="max-w-full max-h-64 object-contain rounded-lg"
                          effect="blur"
                          placeholderSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3C/svg%3E"
                        />
                      </div>
                    )}
                    {message.text && (
                      <p className="whitespace-pre-wrap break-words">{message.text}</p>
                    )}
                    <div className="text-xs mt-2 opacity-70">
                      {formatChatDate(message.createdAt)}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MessageList;

