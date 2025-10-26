import React from 'react';
import { Tabs } from 'antd';
import { MessageOutlined } from '@ant-design/icons';
import MessageList from './MessageList';
import InputBar from './InputBar';

const ChatWindow = ({
  messages = [],
  isSending = false,
  onSendMessage,
  currentTab = 'general',
  onTabChange,
  formatChatDate,
}) => {
  const tabItems = [
    {
      key: 'general',
      label: '💬 General',
      children: (
        <div className="flex-1 overflow-hidden">
          <MessageList messages={messages} formatChatDate={formatChatDate} />
        </div>
      ),
    },
    {
      key: 'product_inquiry',
      label: '🛍️ Product Inquiry',
      children: (
        <div className="flex-1 overflow-hidden">
          <MessageList messages={messages} formatChatDate={formatChatDate} />
        </div>
      ),
    },
    {
      key: 'order_support',
      label: '📦 Order Support',
      children: (
        <div className="flex-1 overflow-hidden">
          <MessageList messages={messages} formatChatDate={formatChatDate} />
        </div>
      ),
    },
  ];

  const getPlaceholder = (tab) => {
    if (tab === 'general') return 'sản phẩm, đơn hàng';
    if (tab === 'product_inquiry') return 'sản phẩm';
    return 'đơn hàng';
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center space-x-2">
          <MessageOutlined className="text-2xl text-accent" />
          <h2 className="text-xl font-semibold text-gray-800">
            AI Assistant
          </h2>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Hỏi đáp thông minh với AI trợ lý PetVibe
        </p>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        <Tabs
          activeKey={currentTab}
          onChange={onTabChange}
          items={tabItems}
          className="flex-1 flex flex-col"
          style={{ 
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}
          tabBarStyle={{ padding: '0 16px', marginBottom: 0 }}
        />
      </div>

      <div className="border-t border-gray-200 bg-white">
        <InputBar
          onSend={onSendMessage}
          disabled={isSending}
          placeholder={`Nhập câu hỏi của bạn về ${getPlaceholder(currentTab)}...`}
        />
      </div>
    </div>
  );
};

export default ChatWindow;

