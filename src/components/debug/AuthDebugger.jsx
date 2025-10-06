import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from 'react-router-dom';

/**
 * Debug component to check authentication status
 * Helps identify issues with token storage and validation
 */
export default function AuthDebugger() {
  const { user, token, login, logout } = useAuth();
  const location = useLocation();
  const [localStorageData, setLocalStorageData] = useState({});

  useEffect(() => {
    try {
      // Check localStorage data
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('authToken');
      
      let userParsed = null;
      if (storedUser && storedUser !== 'undefined' && storedUser !== 'null') {
        try {
          userParsed = JSON.parse(storedUser);
        } catch (parseError) {
          console.error('Error parsing stored user:', parseError);
          userParsed = null;
        }
      }
      
      setLocalStorageData({
        storedUser: storedUser,
        storedToken: storedToken,
        userParsed: userParsed,
        tokenLength: storedToken ? storedToken.length : 0
      });
    } catch (error) {
      console.error('Error in AuthDebugger useEffect:', error);
      setLocalStorageData({
        storedUser: null,
        storedToken: null,
        userParsed: null,
        tokenLength: 0
      });
    }
  }, [user, token]);

  const handleTestLogin = () => {
    const testUser = {
      id: 1,
      fullName: 'Test User',
      email: 'test@example.com',
      phone: '1234567890',
      role: 'CUSTOMER',
      petName: 'Buddy',
      petType: 'dog'
    };
    const testToken = 'test_token_12345';
    
    login(testUser, testToken);
  };

  const handleClearStorage = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    logout();
    window.location.reload();
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-md z-50">
      <h3 className="font-bold text-gray-800 mb-3">🔍 Auth Debugger</h3>
      
      {/* Current Route */}
      <div className="mb-3">
        <div className="text-sm font-semibold text-gray-700">Current Route:</div>
        <div className="text-xs text-gray-600 font-mono">{location.pathname}</div>
      </div>

      {/* Auth Context Status */}
      <div className="mb-3">
        <div className="text-sm font-semibold text-gray-700">Auth Context:</div>
        <div className="text-xs space-y-1">
          <div>User: {user ? '✅ Present' : '❌ None'}</div>
          <div>Token: {token ? '✅ Present' : '❌ None'}</div>
          {user && (
            <div>Name: {user.fullName || user.email}</div>
          )}
          {token && (
            <div>Token: {token.substring(0, 10)}...</div>
          )}
        </div>
      </div>

      {/* LocalStorage Status */}
      <div className="mb-3">
        <div className="text-sm font-semibold text-gray-700">LocalStorage:</div>
        <div className="text-xs space-y-1">
          <div>User: {localStorageData.storedUser ? '✅ Present' : '❌ None'}</div>
          <div>Token: {localStorageData.storedToken ? '✅ Present' : '❌ None'}</div>
          {localStorageData.tokenLength > 0 && (
            <div>Token Length: {localStorageData.tokenLength}</div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={handleTestLogin}
          className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600"
        >
          Test Login
        </button>
        <button
          onClick={handleClearStorage}
          className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
        >
          Clear All
        </button>
      </div>

      {/* Route Protection Status */}
      <div className="mt-3 pt-3 border-t border-gray-200">
        <div className="text-sm font-semibold text-gray-700">Route Protection:</div>
        <div className="text-xs">
          {location.pathname.startsWith('/user/') ? (
            token ? (
              <div className="text-green-600">✅ Protected route - Access granted</div>
            ) : (
              <div className="text-red-600">❌ Protected route - Should redirect to login</div>
            )
          ) : (
            <div className="text-blue-600">ℹ️ Public route</div>
          )}
        </div>
      </div>
    </div>
  );
}
