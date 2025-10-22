// src/pages/public/Login.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { login } from '../../api/auth';
import { LoginBackground } from '../../components/common/BackgroundImage';
import { AIGradient } from '../../components/effects/GradientText';
import { getDashboardPathByRole } from '../../constants/roles';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login: loginUser, user } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ phone: '', password: '' });
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const from = location.state?.from?.pathname || getDashboardPathByRole(user?.role) || '/';

  useEffect(() => {
    if (user) {
      const redirectPath = from || getDashboardPathByRole(user.role) || '/';
      navigate(redirectPath, { replace: true });
    }
  }, [user, navigate, from]);

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) setErrors({ ...errors, [field]: '' });
    if (generalError) setGeneralError(null);
    if (successMessage) setSuccessMessage('');
  };

  const validateForm = () => {
    const e = {};
    if (!formData.phone.trim()) e.phone = 'Vui lòng nhập số điện thoại';
    else if (!/^[0-9]{10,11}$/.test(formData.phone.trim())) e.phone = 'Số điện thoại phải có 10-11 chữ số';
    if (!formData.password.trim()) e.password = 'Vui lòng nhập mật khẩu';
    else if (formData.password.length < 6) e.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // Helper: bọc promise với timeout riêng (phòng khi server treo quá lâu)
  const withTimeout = (promise, ms) => {
    let t;
    const timeout = new Promise((_, rej) => {
      t = setTimeout(() => rej(new Error('TIMEOUT')), ms);
    });
    return Promise.race([promise, timeout]).finally(() => clearTimeout(t));
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setGeneralError(null);
    setSuccessMessage('');

    // Sau 3s mà vẫn đang chờ -> hiện thông báo “server đang khởi động”
    const slowNotice = setTimeout(() => {
      setSuccessMessage('⏳ Server đang khởi động lần đầu, vui lòng đợi thêm chút…');
    }, 3000);

    try {
      const data = await withTimeout(login(formData.phone, formData.password), 65000); // 65s > axios 60s một chút

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

      loginUser(userData, data.token);

      const redirectPath = getDashboardPathByRole(userData.role); // CUSTOMER -> '/'
      setSuccessMessage('Đăng nhập thành công! Đang chuyển hướng...');
      setTimeout(() => navigate(redirectPath, { replace: true }), 500);
    } catch (err) {
      let msg = 'Đăng nhập thất bại. Vui lòng thử lại.';

      if (err?.message === 'TIMEOUT' || err?.code === 'ECONNABORTED') {
        msg = 'Máy chủ phản hồi chậm. Có thể do khởi động lần đầu trên Render. Vui lòng thử lại sau ít phút.';
      } else if (err.response?.status === 401) {
        msg = 'Username or password invalid!';
      } else if (err.response?.status === 400) {
        msg = 'Thông tin đăng nhập không hợp lệ.';
      } else if (err.response?.status === 403) {
        msg = 'Tài khoản đã bị khóa. Vui lòng liên hệ admin.';
      } else if (err.response?.status === 404) {
        msg = 'Không tìm thấy tài khoản.';
      } else if (err.response?.status >= 500) {
        msg = 'Lỗi server. Vui lòng thử lại sau.';
      } else if (err.message) {
        msg = err.message;
      }

      setGeneralError(msg);
    } finally {
      clearTimeout(slowNotice);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex">
      {/* LEFT SIDE */}
      <LoginBackground className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <div className="relative z-10 h-full flex flex-col items-center justify-center p-12 text-white">
          <div className="max-w-md text-center mb-auto pt-12">
            <AIGradient className="text-8xl font-bold mb-4 drop-shadow-lg" animationSpeed={2}>
              Pawfect Match
            </AIGradient>
            <p className="text-xl drop-shadow-md">Finding the perfect accessories for your furry friend, powered by AI.</p>
          </div>
          {/* ... giữ nguyên phần decor ... */}
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
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-center">
              <CheckCircle className="h-5 w-5 text-blue-500 mr-2" />
              <p className="text-sm text-blue-700 font-medium">{successMessage}</p>
            </div>
          )}

          {generalError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
              <p className="text-sm text-red-600 font-medium">{generalError}</p>
            </div>
          )}

          {/* FORM */}
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Phone Number</label>
              <input
                type="tel"
                autoComplete="tel"
                placeholder="0123456789"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={`w-full px-4 py-3 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-xl bg-gray-50 focus:ring-2 focus:ring-indigo-500 outline-none`}
              />
              {errors.phone && (
                <p className="text-sm text-red-500 mt-2 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" /> {errors.phone}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`w-full px-4 py-3 pr-12 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-xl bg-gray-50 focus:ring-2 focus:ring-indigo-500 outline-none`}
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
                  <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" /> {errors.password}
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
              <button onClick={() => navigate('/register')} className="text-indigo-600 hover:text-indigo-700 font-semibold">
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
