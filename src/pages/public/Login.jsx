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
    const nextData = { ...formData, [field]: value };
    setFormData(nextData);

    // Clear general and field errors when typing
    const nextErrors = { ...errors, [field]: '' };

    // Realtime inline validation per-field
    if (field === 'phone') {
      const v = value.trim();
      if (!v) {
        nextErrors.phone = 'Vui lòng nhập số điện thoại';
      } else if (!/^[0-9]{10,11}$/.test(v)) {
        nextErrors.phone = 'Số điện thoại phải có 10-11 chữ số';
      } else if (nextErrors.phone === 'Không tìm thấy tài khoản với số này') {
        // Keep server-derived existence error until user changes drastically
        nextErrors.phone = '';
      }
    }
    if (field === 'password') {
      const v = value;
      if (!v) {
        nextErrors.password = 'Vui lòng nhập mật khẩu';
      } else if (v.length < 6) {
        nextErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
      }
    }

    setErrors(nextErrors);
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
        // Lấy message từ server nếu có, hoặc dùng message mặc định
        const serverMsg = err.response?.data?.message || 'Số điện thoại hoặc mật khẩu không đúng.';
        msg = serverMsg;
        // Map 401 to inline field errors for real-time feedback
        setErrors({
          phone: serverMsg,
          password: serverMsg,
        });
      } else if (err.response?.status === 400) {
        msg = 'Thông tin đăng nhập không hợp lệ.';
      } else if (err.response?.status === 403) {
        msg = 'Tài khoản đã bị khóa. Vui lòng liên hệ admin.';
      } else if (err.response?.status === 404) {
        msg = 'Không tìm thấy tài khoản.';
        // Highlight phone field when user/phone not found
        setErrors((prev) => ({
          ...prev,
          phone: prev.phone || 'Không tìm thấy tài khoản với số này',
        }));
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
            <p className="text-xl drop-shadow-md">Tìm phụ kiện hoàn hảo cho thú cưng của bạn, được hỗ trợ bởi AI.</p>
          </div>
          {/* ... giữ nguyên phần decor ... */}
        </div>
      </LoginBackground>

      {/* RIGHT SIDE - LOGIN FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 md:p-10">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">Chào mừng trở lại!</h2>
            <p className="text-gray-600">Đăng nhập để tìm phụ kiện hoàn hảo cho thú cưng của bạn.</p>
          </div>

          {successMessage && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-center">
              <CheckCircle className="h-5 w-5 text-blue-500 mr-2" />
              <p className="text-sm text-blue-700 font-medium">{successMessage}</p>
            </div>
          )}

          {generalError && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-300 rounded-xl flex items-start animate-pulse">
              <AlertCircle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-red-700 mb-1">Lỗi đăng nhập</p>
                <p className="text-sm text-red-600">{generalError}</p>
              </div>
            </div>
          )}

          {/* FORM */}
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Số điện thoại</label>
              <input
                type="tel"
                autoComplete="tel"
                placeholder="0123456789"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={`w-full px-4 py-3 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-xl bg-gray-50 focus:ring-2 focus:ring-indigo-500 outline-none`}
              />
              {errors.phone && (
                <p className="text-sm text-red-600 mt-2 flex items-start font-medium bg-red-50 p-2 rounded border border-red-200">
                  <AlertCircle className="h-4 w-4 mr-1.5 flex-shrink-0 mt-0.5" /> 
                  <span>{errors.phone}</span>
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Mật khẩu</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Nhập mật khẩu của bạn"
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
                <p className="text-sm text-red-600 mt-2 flex items-start font-medium bg-red-50 p-2 rounded border border-red-200">
                  <AlertCircle className="h-4 w-4 mr-1.5 flex-shrink-0 mt-0.5" /> 
                  <span>{errors.password}</span>
                </p>
              )}
            </div>

            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full bg-indigo-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-indigo-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50"
            >
              {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </div>

          <div className="text-center mt-6">
            <button
              onClick={() => alert('Chức năng quên mật khẩu đang được phát triển')}
              className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
            >
              Quên mật khẩu?
            </button>
          </div>

          <div className="text-center mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Chưa có tài khoản?{' '}
              <button onClick={() => navigate('/register')} className="text-indigo-600 hover:text-indigo-700 font-semibold">
                Đăng ký ngay
              </button>
            </p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-6 text-sm text-gray-400">
        Được tạo bằng ❤️ <span className="font-semibold">Visily</span>
      </div>
    </div>
  );
}
