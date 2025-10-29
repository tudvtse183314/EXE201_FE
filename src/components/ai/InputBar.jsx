import React, { useState, useRef } from 'react';
import { Input, Button } from 'antd';
import { SendOutlined, PictureOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';

const { TextArea } = Input;

const InputBar = ({ onSend, disabled = false, placeholder = 'Nhập tin nhắn...', onImageUpload }) => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const fileInputRef = useRef(null);

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Chỉ chấp nhận file ảnh');
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Kích thước file không được vượt quá 10MB');
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onload = (event) => {
      const imageData = event.target.result;
      if (onImageUpload) {
        onImageUpload(imageData, file.name);
      }
    };
    reader.onerror = () => {
      toast.error('Lỗi khi đọc file ảnh');
    };
    reader.readAsDataURL(file);

    // Reset input
    e.target.value = '';
  };

  const handleImageButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="border-t border-gray-200 p-4 bg-white">
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled || isSending}
      />
      <div className="flex items-end space-x-2">
        <Button
          type="default"
          icon={<PictureOutlined />}
          onClick={handleImageButtonClick}
          disabled={disabled || isSending}
          className="h-10"
          title="Tải ảnh lên"
        />
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

