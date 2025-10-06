import React, { useState } from 'react';
import publicApi from '../api/publicApi';

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

  return (
    <div className="p-8 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">API Test</h2>
      
      <div className="space-y-4">
        <button
          onClick={testConnection}
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Connection'}
        </button>
        
        <button
          onClick={testRegister}
          disabled={loading}
          className="w-full bg-green-500 text-white py-2 px-4 rounded disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Register'}
        </button>
      </div>
      
      {result && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <pre className="text-sm">{result}</pre>
        </div>
      )}
    </div>
  );
}
