import React, { useState } from 'react';
import { Input, Button } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';

const { TextArea } = Input;

const InputBar = ({ onSend, disabled = false, placeholder = 'Nhập tin nhắn...' }) => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    const trimmedMessage = message.trim();
    
    if (!trimmedMessage) {
      toast.warning('Vui lòng nhập tin nhắn');
      return;
    }

    if (disabled || isSending) {
      return;
    }

    setIsSending(true);
    
    try {
      await onSend(trimmedMessage);
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Gửi tin nhắn thất bại. Vui lòng thử lại.');
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-gray-200 p-4 bg-white">
      <div className="flex items-end space-x-2">
        <div className="flex-1">
          <TextArea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            autoSize={{ minRows: 1, maxRows: 4 }}
            disabled={disabled || isSending}
            className="resize-none"
            showCount
            maxLength={1000}
          />
          <div className="text-xs text-gray-500 mt-1">
            Nhấn Enter để gửi, Shift+Enter để xuống dòng
          </div>
        </div>
        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={handleSend}
          disabled={disabled || isSending || !message.trim()}
          loading={isSending}
          className="h-10"
        >
          Gửi
        </Button>
      </div>
    </div>
  );
};

export default InputBar;

