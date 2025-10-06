import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

/**
 * Test component to verify authentication flow
 * Helps test login, logout, and route protection
 */
export default function AuthTest() {
  const { user, token, login, logout } = useAuth();
  const navigate = useNavigate();
  const [testResults, setTestResults] = useState([]);

  const addTestResult = (test, result, details = '') => {
    setTestResults(prev => [...prev, {
      test,
      result,
      details,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const runAuthTests = () => {
    setTestResults([]);
    
    // Test 1: Check initial state
    addTestResult(
      'Initial State Check',
      !user && !token ? 'PASS' : 'FAIL',
      `User: ${user ? 'Present' : 'None'}, Token: ${token ? 'Present' : 'None'}`
    );

    // Test 2: Test login
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
    
    setTimeout(() => {
      addTestResult(
        'Login Test',
        user && token ? 'PASS' : 'FAIL',
        `User: ${user?.fullName}, Token: ${token?.substring(0, 10)}...`
      );
    }, 100);

    // Test 3: Check localStorage
    setTimeout(() => {
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('authToken');
      
      addTestResult(
        'LocalStorage Test',
        storedUser && storedToken ? 'PASS' : 'FAIL',
        `Stored User: ${storedUser ? 'Yes' : 'No'}, Stored Token: ${storedToken ? 'Yes' : 'No'}`
      );
    }, 200);

    // Test 4: Test logout
    setTimeout(() => {
      logout();
      
      setTimeout(() => {
        addTestResult(
          'Logout Test',
          !user && !token ? 'PASS' : 'FAIL',
          `User: ${user ? 'Still Present' : 'Cleared'}, Token: ${token ? 'Still Present' : 'Cleared'}`
        );
      }, 100);
    }, 1000);
  };

  const testRouteAccess = () => {
    if (!token) {
      addTestResult(
        'Route Access Test',
        'SKIP',
        'No token - cannot test route access'
      );
      return;
    }

    // Try to navigate to protected route
    navigate('/user/shop');
    addTestResult(
      'Route Access Test',
      'INFO',
      'Navigated to /user/shop - check if access is granted'
    );
  };

  const clearAllData = () => {
    localStorage.clear();
    logout();
    setTestResults([]);
    addTestResult(
      'Clear All Data',
      'COMPLETE',
      'All authentication data cleared'
    );
  };

  return (
    <div className="fixed top-4 left-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-sm z-50">
      <h3 className="font-bold text-gray-800 mb-3">🧪 Auth Test Panel</h3>
      
      {/* Current Status */}
      <div className="mb-4 p-3 bg-gray-50 rounded">
        <div className="text-sm font-semibold mb-2">Current Status:</div>
        <div className="text-xs space-y-1">
          <div>User: {user ? `✅ ${user.fullName || user.email}` : '❌ None'}</div>
          <div>Token: {token ? `✅ ${token.substring(0, 10)}...` : '❌ None'}</div>
          <div>Role: {user?.role || 'None'}</div>
        </div>
      </div>

      {/* Test Buttons */}
      <div className="space-y-2 mb-4">
        <button
          onClick={runAuthTests}
          className="w-full bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600"
        >
          Run Auth Tests
        </button>
        <button
          onClick={testRouteAccess}
          className="w-full bg-green-500 text-white px-3 py-2 rounded text-sm hover:bg-green-600"
        >
          Test Route Access
        </button>
        <button
          onClick={clearAllData}
          className="w-full bg-red-500 text-white px-3 py-2 rounded text-sm hover:bg-red-600"
        >
          Clear All Data
        </button>
      </div>

      {/* Test Results */}
      {testResults.length > 0 && (
        <div className="max-h-40 overflow-y-auto">
          <div className="text-sm font-semibold mb-2">Test Results:</div>
          <div className="space-y-1">
            {testResults.map((result, index) => (
              <div key={index} className="text-xs p-2 bg-gray-50 rounded">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{result.test}</span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    result.result === 'PASS' ? 'bg-green-100 text-green-800' :
                    result.result === 'FAIL' ? 'bg-red-100 text-red-800' :
                    result.result === 'SKIP' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {result.result}
                  </span>
                </div>
                {result.details && (
                  <div className="text-gray-600 mt-1">{result.details}</div>
                )}
                <div className="text-gray-400 text-xs mt-1">{result.timestamp}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-4 pt-3 border-t border-gray-200">
        <div className="text-xs text-gray-600 mb-2">Quick Actions:</div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate('/user/shop')}
            className="flex-1 bg-indigo-500 text-white px-2 py-1 rounded text-xs hover:bg-indigo-600"
          >
            Go to /user/shop
          </button>
          <button
            onClick={() => navigate('/login')}
            className="flex-1 bg-gray-500 text-white px-2 py-1 rounded text-xs hover:bg-gray-600"
          >
            Go to Login
          </button>
        </div>
      </div>
    </div>
  );
}
