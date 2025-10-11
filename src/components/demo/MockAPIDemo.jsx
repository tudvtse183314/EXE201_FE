import React from 'react';
import { mockApi } from '../api/mockApi';
import TestAPI from '../TestAPI';

/**
 * Demo component showing the Mock API functionality
 * Highlights how the app handles backend unavailability
 */
export default function MockAPIDemo() {
  const users = mockApi.getUsers();

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-4xl font-bold text-center mb-8">🔧 Mock API Demo</h1>
      
      {/* Mock API Status */}
      <section className="space-y-4">
        <h2 className="text-3xl font-semibold">Mock API Status</h2>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-3">⚠️ Backend Server Unavailable</h3>
          <div className="space-y-2 text-yellow-700">
            <p>• Backend server is not available or not responding</p>
            <p>• Mock API is automatically used for development</p>
            <p>• All registration and login functionality works with mock data</p>
            <p>• No network errors - seamless user experience</p>
          </div>
        </div>
      </section>

      {/* Mock API Features */}
      <section className="space-y-4">
        <h2 className="text-3xl font-semibold">Mock API Features</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-800 mb-3">✅ Registration</h3>
            <ul className="space-y-1 text-green-700 text-sm">
              <li>• Validates all required fields</li>
              <li>• Checks for duplicate email/phone</li>
              <li>• Returns proper error messages</li>
              <li>• Simulates network delay (1.5s)</li>
              <li>• Generates mock user data</li>
            </ul>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">✅ Login</h3>
            <ul className="space-y-1 text-blue-700 text-sm">
              <li>• Validates phone number and password</li>
              <li>• Returns user data and mock token</li>
              <li>• Simulates network delay (1s)</li>
              <li>• Handles invalid credentials</li>
              <li>• Works with registered mock users</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Current Mock Users */}
      <section className="space-y-4">
        <h2 className="text-3xl font-semibold">Current Mock Users</h2>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Registered Users ({users.length})</h3>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              Clear All Data
            </button>
          </div>
          
          {users.length === 0 ? (
            <p className="text-gray-500 italic">No users registered yet. Try the registration form!</p>
          ) : (
            <div className="space-y-3">
              {users.map((user, index) => (
                <div key={user.id} className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-gray-900">{user.fullName}</h4>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <p className="text-sm text-gray-600">Phone: {user.phone}</p>
                      <p className="text-sm text-gray-600">Pet: {user.petName} ({user.petType})</p>
                    </div>
                    <div className="text-xs text-gray-400">
                      ID: {user.id}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* API Test Component */}
      <section className="space-y-4">
        <h2 className="text-3xl font-semibold">API Testing</h2>
        <TestAPI />
      </section>

      {/* How to Enable Backend */}
      <section className="space-y-4">
        <h2 className="text-3xl font-semibold">How to Enable Backend</h2>
        <div className="bg-gray-100 border border-gray-300 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3">To use real backend API:</h3>
          <div className="space-y-2 text-gray-700">
            <p>1. Ensure your backend server is running and accessible</p>
            <p>2. Open <code>src/api/publicApi.js</code></p>
            <p>3. Change <code>USE_MOCK_API = false</code></p>
            <p>4. Restart the React development server</p>
          </div>
          
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded">
            <h4 className="font-semibold text-blue-800 mb-2">Current Configuration:</h4>
            <code className="text-sm text-blue-700">
              const USE_MOCK_API = true; // Set to false when backend is available
            </code>
          </div>
        </div>
      </section>

      {/* Error Handling */}
      <section className="space-y-4">
        <h2 className="text-3xl font-semibold">Error Handling</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-red-800 mb-3">❌ Network Errors</h3>
            <ul className="space-y-1 text-red-700 text-sm">
              <li>• Automatically detected</li>
              <li>• Fallback to mock API</li>
              <li>• No user-facing errors</li>
              <li>• Seamless experience</li>
            </ul>
          </div>
          
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-orange-800 mb-3">⚠️ Validation Errors</h3>
            <ul className="space-y-1 text-orange-700 text-sm">
              <li>• Field-specific error messages</li>
              <li>• Duplicate email/phone detection</li>
              <li>• Password strength validation</li>
              <li>• User-friendly error display</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
