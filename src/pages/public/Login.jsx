import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { login } from '../../api/auth';
import { LoginBackground } from '../../components/common/BackgroundImage';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login: loginUser, user } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    phone: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const from = location.state?.from?.pathname || '/customer/dashboard';

  // Nếu đã đăng nhập thì tự động chuyển hướng
  useEffect(() => {
    if (user) {
      console.log('🔐 User authenticated, redirecting to:', from);
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) setErrors({ ...errors, [field]: '' });
    if (generalError) setGeneralError(null);
    if (successMessage) setSuccessMessage('');
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.phone.trim()) newErrors.phone = 'Vui lòng nhập số điện thoại';
    if (!formData.password.trim()) newErrors.password = 'Vui lòng nhập mật khẩu';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setGeneralError(null);
    setSuccessMessage('');

    try {
      console.log('🔐 Sending login request...');

      const data = await login(formData.phone, formData.password);
      console.log('✅ Login success:', data);

      const userData = {
        id: data.id,
        name: data.fullName || data.name,
        email: data.email,
        phone: data.phone,
        role: data.role,
        accountId: data.accountId || data.id,
        petName: data.petName,
        petAge: data.petAge,
        petType: data.petType,
        petSize: data.petSize
      };

      // Gọi context login
      loginUser(userData, data.token);

      // Redirect based on user role
      const redirectPath = userData.role === 'STAFF' ? '/staff/dashboard' :
                        userData.role === 'MANAGER' ? '/manager/dashboard' :
                        userData.role === 'DOCTOR' ? '/doctor/dashboard' :
                        '/customer/dashboard';

      setSuccessMessage('Đăng nhập thành công! Đang chuyển hướng...');
      setTimeout(() => navigate(redirectPath, { replace: true }), 800);
    } catch (err) {
      console.error('❌ Login error:', err);
      setGeneralError(err.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  // const handleSocialLogin = (provider) => {
  //   alert(`Đăng nhập với ${provider} hiện chưa được hỗ trợ`);
  // };

  return (
    <div className="min-h-screen bg-black flex">
      {/* LEFT SIDE */}
      <LoginBackground className="hidden lg:block lg:w-1/2 relative overflow-hidden">

        <div className="relative z-10 h-full flex flex-col items-center justify-center p-12 text-white">
          <div className="max-w-md text-center mb-auto pt-12">
            <h1 className="text-6xl font-bold mb-4 drop-shadow-lg">Pawfect Match</h1>
            <p className="text-xl drop-shadow-md">
              Finding the perfect accessories for your furry friend, powered by AI.
            </p>
          </div>

          <div className="flex-1 flex items-center justify-center w-full">
            <div className="relative">
              <div className="flex items-end gap-4 mb-8">
                <div className="w-16 h-16 bg-cyan-400 rounded-full shadow-lg animate-bounce opacity-80"></div>
                <div className="w-12 h-12 bg-green-400 rounded-full shadow-lg animate-bounce opacity-80" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-20 h-20 bg-pink-400 rounded-full shadow-lg animate-bounce opacity-80" style={{ animationDelay: '0.2s' }}></div>
              </div>

              <div className="text-9xl flex gap-4 mb-8 drop-shadow-lg">
                <span className="transform hover:scale-110 transition-transform">🐕</span>
                <span className="transform hover:scale-110 transition-transform">🐱</span>
              </div>

              <div className="flex gap-3 justify-center">
                <div className="w-10 h-10 bg-yellow-400 rounded-full shadow-lg opacity-80"></div>
                <div className="w-14 h-14 bg-blue-400 rounded-full shadow-lg opacity-80"></div>
                <div className="w-8 h-8 bg-orange-400 rounded-full shadow-lg opacity-80"></div>
                <div className="w-16 h-16 bg-purple-400 rounded-full shadow-lg opacity-80"></div>
              </div>
            </div>
          </div>
        </div>
      </LoginBackground>

      {/* RIGHT SIDE - LOGIN FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 md:p-10">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">Welcome Back!</h2>
            <p className="text-gray-600">Log in to find the perfect accessories for your furry friend.</p>
          </div>

          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <p className="text-sm text-green-600 font-medium">{successMessage}</p>
            </div>
          )}

          {generalError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-sm text-red-600 font-medium">{generalError}</p>
            </div>
          )}

          {/* FORM */}
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Phone Number</label>
              <input
                type="tel"
                placeholder="0123456789"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={`w-full px-4 py-3 border ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                } rounded-xl bg-gray-50 focus:ring-2 focus:ring-indigo-500 outline-none`}
              />
              {errors.phone && (
                <p className="text-sm text-red-500 mt-2 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" /> {errors.phone}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`w-full px-4 py-3 pr-12 border ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  } rounded-xl bg-gray-50 focus:ring-2 focus:ring-indigo-500 outline-none`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500 mt-2 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" /> {errors.password}
                </p>
              )}
            </div>

            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full bg-indigo-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-indigo-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50"
            >
              {isLoading ? 'Đang đăng nhập...' : 'Login'}
            </button>
          </div>

          <div className="text-center mt-6">
            <button
              onClick={() => alert('Chức năng quên mật khẩu đang được phát triển')}
              className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
            >
              Forgot Password?
            </button>
          </div>

          <div className="text-center mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <button
                onClick={() => navigate('/register')}
                className="text-indigo-600 hover:text-indigo-700 font-semibold"
              >
                Sign Up
              </button>
            </p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-6 text-sm text-gray-400">
        Made with ❤️ <span className="font-semibold">Visily</span>
      </div>
    </div>
  );
}
