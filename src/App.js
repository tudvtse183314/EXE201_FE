import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PrivateRoute } from './components/auth/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import PublicHome from './pages/public/Home';
import About from './pages/public/About';
import Contact from './pages/public/Contact';
import Services from './pages/public/Services';
import UserHome from './pages/user/Home';
import UserDashboard from './pages/user/UserDashboard';
import { Dashboard as AdminDashboard } from './pages/admin/Dashboard';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes - Accessible to everyone */}
          <Route path="/" element={<PublicHome />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/services" element={<Services />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Private User Routes - Require authentication */}
          <Route
            path="/user/home"
            element={
              <PrivateRoute>
                <UserHome />
              </PrivateRoute>
            }
          />
          <Route
            path="/user/profile"
            element={
              <PrivateRoute>
                <UserDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/user/shop"
            element={
              <PrivateRoute>
                <div className="min-h-screen bg-gray-100 p-8">
                  <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-6">Shop</h1>
                    <p className="text-lg text-gray-700">Shop page coming soon...</p>
                  </div>
                </div>
              </PrivateRoute>
            }
          />
          <Route
            path="/user/orders"
            element={
              <PrivateRoute>
                <div className="min-h-screen bg-gray-100 p-8">
                  <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-6">Orders</h1>
                    <p className="text-lg text-gray-700">Orders page coming soon...</p>
                  </div>
                </div>
              </PrivateRoute>
            }
          />
          <Route
            path="/user/ai-analysis"
            element={
              <PrivateRoute>
                <div className="min-h-screen bg-gray-100 p-8">
                  <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-6">AI Analysis</h1>
                    <p className="text-lg text-gray-700">AI Analysis page coming soon...</p>
                  </div>
                </div>
              </PrivateRoute>
            }
          />
          <Route
            path="/user/premium"
            element={
              <PrivateRoute>
                <div className="min-h-screen bg-gray-100 p-8">
                  <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-6">Premium</h1>
                    <p className="text-lg text-gray-700">Premium page coming soon...</p>
                  </div>
                </div>
              </PrivateRoute>
            }
          />
          <Route
            path="/user/chat"
            element={
              <PrivateRoute>
                <div className="min-h-screen bg-gray-100 p-8">
                  <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-6">Chat</h1>
                    <p className="text-lg text-gray-700">Chat page coming soon...</p>
                  </div>
                </div>
              </PrivateRoute>
            }
          />

          {/* Legacy route - redirect to user profile */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <UserDashboard />
              </PrivateRoute>
            }
          />

          {/* Admin Routes - Require admin role */}
          <Route
            path="/admin"
            element={
              <PrivateRoute roles={['admin']}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
