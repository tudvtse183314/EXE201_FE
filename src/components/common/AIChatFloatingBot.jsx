import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../constants/roles';
import './AIChatFloatingBot.css';

const AIChatFloatingBot = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [isVisible, setIsVisible] = useState(false);

  // Only show for authenticated CUSTOMER users
  useEffect(() => {
    if (isAuthenticated() && user?.role === ROLES.CUSTOMER) {
      // Delay appearance for smooth entrance
      const timer = setTimeout(() => setIsVisible(true), 300);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, user?.role]);

  // Don't show for non-authenticated users or non-customers
  if (!isAuthenticated() || user?.role !== ROLES.CUSTOMER) {
    return null;
  }

  const handleClick = () => {
    navigate('/customer/ai');
  };

  return (
    <div className={`ai-chat-bot-container ${isVisible ? 'visible' : ''}`} onClick={handleClick}>
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
        <span>💬 Chat với AI</span>
      </div>
    </div>
  );
};

export default AIChatFloatingBot;

