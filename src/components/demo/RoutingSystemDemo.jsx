import React from 'react';
import { useAuth } from '../../context/AuthContext';

/**
 * Demo component showing the new routing system and permission structure
 * Highlights the clear separation between public and private routes
 */
export default function RoutingSystemDemo() {
  const { user, token } = useAuth();

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-4xl font-bold text-center mb-8">🛣️ Routing System Demo</h1>
      
      {/* Authentication Status */}
      <section className="space-y-4">
        <h2 className="text-3xl font-semibold">Authentication Status</h2>
        <div className={`p-6 rounded-lg border-2 ${
          token ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-4 h-4 rounded-full ${
              token ? 'bg-green-500' : 'bg-red-500'
            }`}></div>
            <h3 className="text-lg font-semibold">
              {token ? 'Authenticated' : 'Not Authenticated'}
            </h3>
          </div>
          {user && (
            <div className="space-y-2 text-sm">
              <p><strong>User:</strong> {user.fullName || user.email}</p>
              <p><strong>Role:</strong> {user.role || 'CUSTOMER'}</p>
              <p><strong>Token:</strong> {token ? 'Present' : 'None'}</p>
            </div>
          )}
        </div>
      </section>

      {/* Public Routes */}
      <section className="space-y-4">
        <h2 className="text-3xl font-semibold">Public Routes</h2>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-4">🌐 Accessible to Everyone</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <code className="text-sm bg-white px-2 py-1 rounded">/</code>
                <span className="text-sm text-gray-700">Public Home</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <code className="text-sm bg-white px-2 py-1 rounded">/about</code>
                <span className="text-sm text-gray-700">About Page</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <code className="text-sm bg-white px-2 py-1 rounded">/services</code>
                <span className="text-sm text-gray-700">Services Page</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <code className="text-sm bg-white px-2 py-1 rounded">/contact</code>
                <span className="text-sm text-gray-700">Contact Page</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <code className="text-sm bg-white px-2 py-1 rounded">/login</code>
                <span className="text-sm text-gray-700">Login Page</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <code className="text-sm bg-white px-2 py-1 rounded">/register</code>
                <span className="text-sm text-gray-700">Register Page</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Private User Routes */}
      <section className="space-y-4">
        <h2 className="text-3xl font-semibold">Private User Routes</h2>
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-800 mb-4">🔒 Requires Authentication</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <code className="text-sm bg-white px-2 py-1 rounded">/user/home</code>
                <span className="text-sm text-gray-700">User Home (with carousel)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <code className="text-sm bg-white px-2 py-1 rounded">/user/profile</code>
                <span className="text-sm text-gray-700">Pet Profile Setup</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <code className="text-sm bg-white px-2 py-1 rounded">/user/shop</code>
                <span className="text-sm text-gray-700">Shop Page</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <code className="text-sm bg-white px-2 py-1 rounded">/user/orders</code>
                <span className="text-sm text-gray-700">Orders Page</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <code className="text-sm bg-white px-2 py-1 rounded">/user/ai-analysis</code>
                <span className="text-sm text-gray-700">AI Analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <code className="text-sm bg-white px-2 py-1 rounded">/user/premium</code>
                <span className="text-sm text-gray-700">Premium Features</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <code className="text-sm bg-white px-2 py-1 rounded">/user/chat</code>
                <span className="text-sm text-gray-700">Chat Support</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <code className="text-sm bg-white px-2 py-1 rounded">/dashboard</code>
                <span className="text-sm text-gray-700">Legacy route (redirects to profile)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Admin Routes */}
      <section className="space-y-4">
        <h2 className="text-3xl font-semibold">Admin Routes</h2>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-purple-800 mb-4">👑 Requires Admin Role</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <code className="text-sm bg-white px-2 py-1 rounded">/admin</code>
              <span className="text-sm text-gray-700">Admin Dashboard</span>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Flow */}
      <section className="space-y-4">
        <h2 className="text-3xl font-semibold">Navigation Flow</h2>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">🔄 User Journey</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
              <div>
                <h4 className="font-semibold">Public Access</h4>
                <p className="text-sm text-gray-600">User visits public pages (/, /about, /services, /contact)</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
              <div>
                <h4 className="font-semibold">Registration/Login</h4>
                <p className="text-sm text-gray-600">User registers or logs in to access private features</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
              <div>
                <h4 className="font-semibold">Private Access</h4>
                <p className="text-sm text-gray-600">User accesses /user/* routes with enhanced features</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold">4</div>
              <div>
                <h4 className="font-semibold">Logout</h4>
                <p className="text-sm text-gray-600">User logs out and returns to public pages</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security Features */}
      <section className="space-y-4">
        <h2 className="text-3xl font-semibold">Security Features</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-red-800 mb-3">🔒 Route Protection</h3>
            <ul className="space-y-2 text-red-700 text-sm">
              <li>• PrivateRoute component checks authentication</li>
              <li>• Automatic redirect to login if not authenticated</li>
              <li>• Role-based access control for admin routes</li>
              <li>• Token validation on every private route access</li>
            </ul>
          </div>
          
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-orange-800 mb-3">🛡️ Data Protection</h3>
            <ul className="space-y-2 text-orange-700 text-sm">
              <li>• User data stored securely in localStorage</li>
              <li>• Token-based authentication system</li>
              <li>• Automatic cleanup of corrupted data</li>
              <li>• Safe JSON parsing with error handling</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Current Status */}
      <section className="space-y-4">
        <h2 className="text-3xl font-semibold">Current Status</h2>
        <div className="bg-gray-100 border border-gray-300 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">📊 System Status</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-white font-bold">✓</span>
              </div>
              <h4 className="font-semibold">Public Routes</h4>
              <p className="text-sm text-gray-600">Working</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-white font-bold">✓</span>
              </div>
              <h4 className="font-semibold">Private Routes</h4>
              <p className="text-sm text-gray-600">Protected</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-white font-bold">✓</span>
              </div>
              <h4 className="font-semibold">Authentication</h4>
              <p className="text-sm text-gray-600">Secure</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
