import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * Comprehensive authentication flow test
 * Tests the complete login -> access -> logout cycle
 */
export default function AuthFlowTest() {
  const { user, token, login, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [testStep, setTestStep] = useState(0);
  const [testLog, setTestLog] = useState([]);

  const addLog = (message, type = 'info') => {
    const logEntry = {
      message,
      type,
      timestamp: new Date().toLocaleTimeString(),
      step: testStep
    };
    setTestLog(prev => [...prev, logEntry]);
    console.log(`[AuthFlowTest] ${message}`);
  };

  const runCompleteTest = async () => {
    setTestLog([]);
    setTestStep(0);

    try {
      // Step 1: Clear all data
      addLog('Step 1: Clearing all authentication data', 'info');
      setTestStep(1);
      localStorage.clear();
      logout();
      await new Promise(resolve => setTimeout(resolve, 100));

      // Step 2: Try to access protected route without login
      addLog('Step 2: Attempting to access /user/shop without authentication', 'info');
      setTestStep(2);
      navigate('/user/shop');
      await new Promise(resolve => setTimeout(resolve, 500));

      // Step 3: Check if redirected to login
      addLog(`Step 3: Current location after redirect attempt: ${location.pathname}`, 'info');
      setTestStep(3);

      // Step 4: Perform login
      addLog('Step 4: Performing test login', 'info');
      setTestStep(4);
      const testUser = {
        id: 1,
        fullName: 'Test User',
        email: 'test@example.com',
        phone: '1234567890',
        role: 'CUSTOMER',
        petName: 'Buddy',
        petType: 'dog'
      };
      const testToken = 'test_token_' + Date.now();
      
      login(testUser, testToken);
      await new Promise(resolve => setTimeout(resolve, 200));

      // Step 5: Verify login success
      addLog('Step 5: Verifying login success', 'info');
      setTestStep(5);
      if (user && token) {
        addLog('✅ Login successful - User and token present', 'success');
      } else {
        addLog('❌ Login failed - User or token missing', 'error');
      }

      // Step 6: Try to access protected route after login
      addLog('Step 6: Attempting to access /user/shop after login', 'info');
      setTestStep(6);
      navigate('/user/shop');
      await new Promise(resolve => setTimeout(resolve, 500));

      // Step 7: Check if access granted
      addLog(`Step 7: Current location after login access: ${location.pathname}`, 'info');
      setTestStep(7);
      if (location.pathname === '/user/shop') {
        addLog('✅ Access granted - Successfully reached /user/shop', 'success');
      } else {
        addLog('❌ Access denied - Still not on /user/shop', 'error');
      }

      // Step 8: Test logout
      addLog('Step 8: Testing logout', 'info');
      setTestStep(8);
      logout();
      await new Promise(resolve => setTimeout(resolve, 200));

      // Step 9: Verify logout success
      addLog('Step 9: Verifying logout success', 'info');
      setTestStep(9);
      if (!user && !token) {
        addLog('✅ Logout successful - User and token cleared', 'success');
      } else {
        addLog('❌ Logout failed - User or token still present', 'error');
      }

      // Step 10: Try to access protected route after logout
      addLog('Step 10: Attempting to access /user/shop after logout', 'info');
      setTestStep(10);
      navigate('/user/shop');
      await new Promise(resolve => setTimeout(resolve, 500));

      // Step 11: Check if redirected to login
      addLog(`Step 11: Current location after logout access: ${location.pathname}`, 'info');
      setTestStep(11);
      if (location.pathname === '/login') {
        addLog('✅ Redirect successful - Redirected to login after logout', 'success');
      } else {
        addLog('❌ Redirect failed - Not redirected to login', 'error');
      }

      addLog('🎉 Authentication flow test completed!', 'success');
      setTestStep(12);

    } catch (error) {
      addLog(`❌ Test failed with error: ${error.message}`, 'error');
    }
  };

  const clearTest = () => {
    setTestLog([]);
    setTestStep(0);
  };

  const getLogColor = (type) => {
    switch (type) {
      case 'success': return 'text-green-600';
      case 'error': return 'text-red-600';
      case 'warning': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="fixed top-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-md z-50 max-h-96 overflow-hidden">
      <h3 className="font-bold text-gray-800 mb-3">🔄 Auth Flow Test</h3>
      
      {/* Current Status */}
      <div className="mb-3 p-2 bg-gray-50 rounded text-xs">
        <div>Step: {testStep}/12</div>
        <div>User: {user ? '✅' : '❌'}</div>
        <div>Token: {token ? '✅' : '❌'}</div>
        <div>Location: {location.pathname}</div>
      </div>

      {/* Test Controls */}
      <div className="flex gap-2 mb-3">
        <button
          onClick={runCompleteTest}
          className="flex-1 bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
        >
          Run Full Test
        </button>
        <button
          onClick={clearTest}
          className="flex-1 bg-gray-500 text-white px-2 py-1 rounded text-xs hover:bg-gray-600"
        >
          Clear
        </button>
      </div>

      {/* Test Log */}
      <div className="max-h-48 overflow-y-auto">
        <div className="text-xs space-y-1">
          {testLog.map((log, index) => (
            <div key={index} className={`p-1 rounded ${getLogColor(log.type)}`}>
              <div className="font-mono text-xs">
                [{log.timestamp}] {log.message}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-3 pt-2 border-t border-gray-200">
        <div className="flex gap-1">
          <button
            onClick={() => navigate('/user/shop')}
            className="flex-1 bg-indigo-500 text-white px-1 py-1 rounded text-xs hover:bg-indigo-600"
          >
            /user/shop
          </button>
          <button
            onClick={() => navigate('/login')}
            className="flex-1 bg-gray-500 text-white px-1 py-1 rounded text-xs hover:bg-gray-600"
          >
            /login
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex-1 bg-green-500 text-white px-1 py-1 rounded text-xs hover:bg-green-600"
          >
            /
          </button>
        </div>
      </div>
    </div>
  );
}
