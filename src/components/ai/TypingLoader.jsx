import React from 'react';

const TypingLoader = ({ className = '' }) => {
  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      <div className="flex space-x-1">
        <div 
          className="w-2 h-2 bg-accent rounded-full animate-bounce"
          style={{ animationDelay: '0ms', animationDuration: '1.4s' }}
        />
        <div 
          className="w-2 h-2 bg-accent rounded-full animate-bounce"
          style={{ animationDelay: '150ms', animationDuration: '1.4s' }}
        />
        <div 
          className="w-2 h-2 bg-accent rounded-full animate-bounce"
          style={{ animationDelay: '300ms', animationDuration: '1.4s' }}
        />
      </div>
      <span className="text-sm text-gray-500 ml-2">AI đang soạn tin nhắn...</span>
    </div>
  );
};

export default TypingLoader;

