import React, { useState } from 'react';
import publicApi from '../api/publicApi';
import { mockApi } from '../api/mockApi';

export default function TestAPI() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    try {
      // Test basic connection with public API
      const response = await publicApi.get('/health');
      setResult(`✅ Connection successful: ${JSON.stringify(response.data)}`);
    } catch (err) {
      setResult(`❌ Connection failed: ${err.response?.data || err.message}`);
      console.error('Connection test error:', err);
    }
    setLoading(false);
  };

  const testRegister = async () => {
    setLoading(true);
    try {
      // Generate unique data để tránh duplicate
      const timestamp = Date.now();
      const testData = {
        fullName: `Test User ${timestamp}`,
        email: `test${timestamp}@example.com`,
        phone: `0123456${timestamp.toString().slice(-4)}`,
        password: 'testpassword123',
        role: 'CUSTOMER',
        petName: 'Buddy',
        petAge: '2 years',
        petType: 'DOG',
        petSize: 'MEDIUM'
      };
      
      console.log('Testing register with data:', testData);
      const response = await publicApi.post('/register', testData);
      setResult(`✅ Register test successful: ${JSON.stringify(response.data)}`);
    } catch (err) {
      setResult(`❌ Register test failed: ${err.response?.data?.message || err.response?.data || err.message}`);
      console.error('Register test error:', err);
    }
    setLoading(false);
  };

  const clearMockData = () => {
    mockApi.clearUsers();
    setResult('Mock data cleared!');
  };

  const showMockUsers = () => {
    const users = mockApi.getUsers();
    setResult(`Mock Users (${users.length}): ${JSON.stringify(users, null, 2)}`);
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">API Test (Mock API Enabled)</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <button
          onClick={testConnection}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Connection'}
        </button>
        <button
          onClick={testRegister}
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Register'}
        </button>
        <button
          onClick={showMockUsers}
          className="bg-purple-500 text-white px-4 py-2 rounded"
        >
          Show Mock Users
        </button>
        <button
          onClick={clearMockData}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Clear Mock Data
        </button>
      </div>
      
      <div className="bg-gray-100 p-4 rounded-lg mb-4">
        <h3 className="font-semibold mb-2">Mock API Status:</h3>
        <p className="text-sm text-gray-600 mb-2">
          • Backend server is not running
        </p>
        <p className="text-sm text-gray-600 mb-2">
          • Using mock API for development
        </p>
        <p className="text-sm text-gray-600">
          • All registration/login will work with mock data
        </p>
      </div>
      
      {result && (
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="font-semibold mb-2">Test Result:</h3>
          <pre className="text-xs text-gray-700 break-words whitespace-pre-wrap">{result}</pre>
        </div>
      )}
    </div>
  );
}
