import React, { useState } from 'react';
import { debugApiCall, testLoginFormats } from '../../utils/debugApi';
import { testMultipleCredentials } from '../../utils/testCredentials';
import { discoverBackend } from '../../utils/backendDiscovery';
import { testRegisterFormat } from '../../utils/testRegister';
import { testLoginWithCredentials } from '../../utils/testLoginFlow';
import API_CONFIG from '../../config/api';

const ApiDebugger = () => {
  const [phone, setPhone] = useState('0707070708');
  const [password, setPassword] = useState('123123123');
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const testLogin = async () => {
    setIsLoading(true);
    setResult(null);
    
    try {
      console.log('🧪 Testing login with phone format...');
      const response = await debugApiCall('/login', { phone, password });
      setResult({ success: true, data: response.data });
    } catch (error) {
      setResult({ success: false, error: error.response?.data || error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const testAllFormats = async () => {
    setIsLoading(true);
    setResult(null);
    
    try {
      const workingFormat = await testLoginFormats(phone, password);
      setResult({ 
        success: !!workingFormat, 
        workingFormat,
        message: workingFormat ? 'Found working format!' : 'No working format found'
      });
    } catch (error) {
      setResult({ success: false, error: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const testHealth = async () => {
    setIsLoading(true);
    setResult(null);
    
    try {
      const response = await debugApiCall('/health', {});
      setResult({ success: true, data: response.data });
    } catch (error) {
      setResult({ success: false, error: error.response?.data || error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const testCredentials = async () => {
    setIsLoading(true);
    setResult(null);
    
    try {
      const result = await testMultipleCredentials(debugApiCall);
      setResult(result);
    } catch (error) {
      setResult({ success: false, error: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const discoverBackendInfo = async () => {
    setIsLoading(true);
    setResult(null);
    
    try {
      const result = await discoverBackend();
      setResult({ success: true, data: result, message: 'Backend discovery complete' });
    } catch (error) {
      setResult({ success: false, error: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const testRegister = async () => {
    setIsLoading(true);
    setResult(null);
    
    try {
      const result = await testRegisterFormat();
      setResult(result);
    } catch (error) {
      setResult({ success: false, error: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const testLoginFlow = async () => {
    setIsLoading(true);
    setResult(null);
    
    try {
      const result = await testLoginWithCredentials();
      setResult(result);
    } catch (error) {
      setResult({ success: false, error: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-md z-50">
      <h3 className="text-lg font-semibold mb-4">🔍 API Debugger</h3>
      
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone:
          </label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password:
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={testLogin}
            disabled={isLoading}
            className="bg-blue-500 text-white px-3 py-2 rounded-md text-sm hover:bg-blue-600 disabled:opacity-50"
          >
            Test Phone
          </button>
          
          <button
            onClick={testAllFormats}
            disabled={isLoading}
            className="bg-green-500 text-white px-3 py-2 rounded-md text-sm hover:bg-green-600 disabled:opacity-50"
          >
            Test All
          </button>
          
          <button
            onClick={testCredentials}
            disabled={isLoading}
            className="bg-purple-500 text-white px-3 py-2 rounded-md text-sm hover:bg-purple-600 disabled:opacity-50"
          >
            Test Creds
          </button>
          
          <button
            onClick={testHealth}
            disabled={isLoading}
            className="bg-gray-500 text-white px-3 py-2 rounded-md text-sm hover:bg-gray-600 disabled:opacity-50"
          >
            Health
          </button>
          
          <button
            onClick={testRegister}
            disabled={isLoading}
            className="bg-yellow-500 text-white px-3 py-2 rounded-md text-sm hover:bg-yellow-600 disabled:opacity-50"
          >
            Test Register
          </button>
          
          <button
            onClick={testLoginFlow}
            disabled={isLoading}
            className="bg-indigo-500 text-white px-3 py-2 rounded-md text-sm hover:bg-indigo-600 disabled:opacity-50"
          >
            Test Login Flow
          </button>
          
          <button
            onClick={discoverBackendInfo}
            disabled={isLoading}
            className="bg-orange-500 text-white px-3 py-2 rounded-md text-sm hover:bg-orange-600 disabled:opacity-50"
          >
            🔍 Discover
          </button>
        </div>

        {isLoading && (
          <div className="text-center text-sm text-gray-600">
            Testing API...
          </div>
        )}

        {result && (
          <div className={`p-3 rounded-md text-sm ${
            result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            <div className="font-medium">
              {result.success ? '✅ Success' : '❌ Error'}
            </div>
            <pre className="mt-2 text-xs overflow-auto max-h-32">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        <div className="text-xs text-gray-500">
          <div>API URL: {API_CONFIG.BASE_URL}</div>
          <div>Environment: {API_CONFIG.ENV}</div>
        </div>
      </div>
    </div>
  );
};

export default ApiDebugger;
