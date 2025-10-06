import React from 'react';

/**
 * Documentation component explaining the authentication system
 * Helps understand how login, session management, and route protection work
 */
export default function AuthSystemDocs() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">🔐 Authentication System Documentation</h1>
          <p className="text-xl text-gray-600">
            Complete guide to login, session management, and route protection
          </p>
        </div>

        {/* Overview */}
        <section className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold mb-6">📋 System Overview</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">🔑 Authentication Flow</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
                  <div>
                    <h4 className="font-semibold">User Login</h4>
                    <p className="text-sm text-gray-600">User enters credentials on /login page</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
                  <div>
                    <h4 className="font-semibold">Token Storage</h4>
                    <p className="text-sm text-gray-600">JWT token saved to localStorage</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
                  <div>
                    <h4 className="font-semibold">Route Protection</h4>
                    <p className="text-sm text-gray-600">PrivateRoute checks token on /user/* pages</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold">4</div>
                  <div>
                    <h4 className="font-semibold">Session Management</h4>
                    <p className="text-sm text-gray-600">Token validated on each protected route access</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4">🛡️ Security Features</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-sm">Token-based authentication</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-sm">Automatic redirect to login</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-sm">Role-based access control</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-sm">Secure token storage</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-sm">Session persistence</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Route Protection */}
        <section className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold mb-6">🛣️ Route Protection</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">Public Routes</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-green-600">✅ Accessible to Everyone</h4>
                    <ul className="text-sm text-gray-600 mt-2 space-y-1">
                      <li>• / (Home)</li>
                      <li>• /about</li>
                      <li>• /services</li>
                      <li>• /shop (Public Shop)</li>
                      <li>• /contact</li>
                      <li>• /login</li>
                      <li>• /register</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-600">ℹ️ Features</h4>
                    <ul className="text-sm text-gray-600 mt-2 space-y-1">
                      <li>• No authentication required</li>
                      <li>• Can browse products</li>
                      <li>• Login required for purchases</li>
                      <li>• Redirect to login when needed</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4">Private Routes</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-red-600">🔒 Requires Authentication</h4>
                    <ul className="text-sm text-gray-600 mt-2 space-y-1">
                      <li>• /user/home</li>
                      <li>• /user/profile</li>
                      <li>• /user/shop</li>
                      <li>• /user/orders</li>
                      <li>• /user/ai-analysis</li>
                      <li>• /user/premium</li>
                      <li>• /user/chat</li>
                      <li>• /dashboard (legacy)</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-purple-600">👑 Admin Routes</h4>
                    <ul className="text-sm text-gray-600 mt-2 space-y-1">
                      <li>• /admin (requires admin role)</li>
                    </ul>
                    <div className="mt-4">
                      <h4 className="font-semibold text-orange-600">⚠️ Protection</h4>
                      <ul className="text-sm text-gray-600 mt-2 space-y-1">
                        <li>• Token validation required</li>
                        <li>• Automatic redirect to /login</li>
                        <li>• Role-based access control</li>
                        <li>• Session persistence</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Technical Implementation */}
        <section className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold mb-6">⚙️ Technical Implementation</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">🔑 AuthContext</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <pre className="text-sm text-gray-700 overflow-x-auto">
{`// src/context/AuthContext.jsx
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Load user from localStorage
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [token, setToken] = useState(() => {
    // Load token from localStorage
    const storedToken = localStorage.getItem('authToken');
    return storedToken || null;
  });

  const login = (userData, tokenValue) => {
    setUser(userData);
    setToken(tokenValue);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('authToken', tokenValue);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};`}
                </pre>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4">🛡️ PrivateRoute Component</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <pre className="text-sm text-gray-700 overflow-x-auto">
{`// src/components/auth/PrivateRoute.jsx
export const PrivateRoute = ({ children, roles }) => {
  const { token, user, hasRole } = useAuth();
  const location = useLocation();

  // Check if token exists
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user exists
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if token is valid
  if (token === 'undefined' || token === 'null' || token.trim() === '') {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role-based access
  if (roles && roles.length > 0 && !hasRole(roles)) {
    return <Navigate to="/" replace />;
  }

  return children;
};`}
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* Session Management */}
        <section className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold mb-6">📱 Session Management</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">💾 Data Storage</h3>
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-600">User Data</h4>
                  <pre className="text-xs text-gray-600 mt-2">
{`{
  "id": 1,
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "role": "CUSTOMER",
  "petName": "Buddy",
  "petType": "dog"
}`}
                  </pre>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-green-600">Token</h4>
                  <pre className="text-xs text-gray-600 mt-2">
{`"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."`}
                  </pre>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4">🔄 Session Lifecycle</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">1</span>
                  </div>
                  <span className="text-sm">User logs in → Token stored</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">2</span>
                  </div>
                  <span className="text-sm">Token validated on each route</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">3</span>
                  </div>
                  <span className="text-sm">Session persists across page reloads</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">4</span>
                  </div>
                  <span className="text-sm">User logs out → Token cleared</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Troubleshooting */}
        <section className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold mb-6">🔧 Troubleshooting</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">❌ Common Issues</h3>
              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-semibold text-red-600">Issue: Can access /user/shop without login</h4>
                  <p className="text-sm text-gray-600 mt-2">
                    <strong>Cause:</strong> Token not properly validated or missing
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Solution:</strong> Check PrivateRoute implementation and token storage
                  </p>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-600">Issue: Token lost on page reload</h4>
                  <p className="text-sm text-gray-600 mt-2">
                    <strong>Cause:</strong> Token not saved to localStorage
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Solution:</strong> Ensure login() function saves token to localStorage
                  </p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-600">Issue: Infinite redirect loop</h4>
                  <p className="text-sm text-gray-600 mt-2">
                    <strong>Cause:</strong> Invalid token or corrupted localStorage data
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Solution:</strong> Clear localStorage and re-login
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4">🛠️ Debug Tools</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-3">
                  Use the debug components in the app to troubleshoot authentication issues:
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• <strong>AuthTest:</strong> Test login/logout functionality</li>
                  <li>• <strong>AuthDebugger:</strong> Check current authentication status</li>
                  <li>• <strong>AuthFlowTest:</strong> Run complete authentication flow test</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Best Practices */}
        <section className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold mb-6">✨ Best Practices</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">🔒 Security</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Always validate token on protected routes</li>
                <li>• Use HTTPS in production</li>
                <li>• Implement token expiration</li>
                <li>• Clear sensitive data on logout</li>
                <li>• Use secure token storage</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4">🚀 Performance</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Cache user data in context</li>
                <li>• Minimize localStorage operations</li>
                <li>• Use efficient token validation</li>
                <li>• Implement lazy loading for routes</li>
                <li>• Optimize re-renders</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center py-8">
          <p className="text-gray-600">
            Authentication system documentation for Pawfect Match
          </p>
          <div className="mt-4">
            <span className="text-sm text-gray-500">
              Built with React, React Router, and Context API
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}
