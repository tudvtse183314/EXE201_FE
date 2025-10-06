import React, { useState } from 'react';
import publicApi from '../api/publicApi';

export default function LoginTestAPI() {
  const [result, setResult] = useState('Click buttons to test Login API');
  const [loading, setLoading] = useState(false);
  const [testData, setTestData] = useState({
    phone: '0123456789',
    password: 'testpassword123'
  });

  const testLogin = async () => {
    setLoading(true);
    try {
      console.log('Testing login with data:', testData);
      const response = await publicApi.post('/login', testData);
      setResult(`✅ Login test successful: ${JSON.stringify(response.data)}`);
    } catch (err) {
      setResult(`❌ Login test failed: ${err.response?.data || err.message}`);
      console.error('Login test error:', err);
    }
    setLoading(false);
  };

  const testWithDifferentData = async () => {
    setLoading(true);
    try {
      // Test với data khác
      const testData2 = {
        phone: '0987654321',
        password: 'password123'
      };
      console.log('Testing login with different data:', testData2);
      const response = await publicApi.post('/login', testData2);
      setResult(`✅ Login test successful: ${JSON.stringify(response.data)}`);
    } catch (err) {
      setResult(`❌ Login test failed: ${err.response?.data || err.message}`);
      console.error('Login test error:', err);
    }
    setLoading(false);
  };

  const testConnection = async () => {
    setLoading(true);
    try {
      // Test basic connection
      const response = await publicApi.get('/health');
      setResult(`✅ Connection successful: ${JSON.stringify(response.data)}`);
    } catch (err) {
      setResult(`❌ Connection failed: ${err.response?.data || err.message}`);
      console.error('Connection test error:', err);
    }
    setLoading(false);
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white border rounded-lg shadow-lg">
      <h3 className="text-lg font-bold mb-4">Login API Test</h3>
      
      {/* Test Data Input */}
      <div className="mb-4 space-y-2">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Phone:</label>
          <input
            type="text"
            value={testData.phone}
            onChange={(e) => setTestData({...testData, phone: e.target.value})}
            className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
            placeholder="0123456789"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Password:</label>
          <input
            type="password"
            value={testData.password}
            onChange={(e) => setTestData({...testData, password: e.target.value})}
            className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
            placeholder="password123"
          />
        </div>
      </div>

      {/* Test Buttons */}
      <div className="space-y-2 mb-4">
        <button
          onClick={testConnection}
          disabled={loading}
          className="w-full bg-blue-500 text-white px-3 py-2 rounded text-xs disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Connection'}
        </button>
        
        <button
          onClick={testLogin}
          disabled={loading}
          className="w-full bg-green-500 text-white px-3 py-2 rounded text-xs disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Login (Current Data)'}
        </button>
        
        <button
          onClick={testWithDifferentData}
          disabled={loading}
          className="w-full bg-purple-500 text-white px-3 py-2 rounded text-xs disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Login (Different Data)'}
        </button>
      </div>

      {/* Result */}
      <div className="text-xs text-gray-700 bg-gray-50 p-2 rounded break-words">
        {result}
      </div>

      {/* Instructions */}
      <div className="mt-3 text-xs text-gray-500">
        <p><strong>Instructions:</strong></p>
        <p>1. Test Connection first</p>
        <p>2. Try different phone/password combinations</p>
        <p>3. Check backend logs for valid credentials</p>
        <p>4. Use real registered user data</p>
      </div>
    </div>
  );
}
