// src/pages/public/Register.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { register as doRegister, login as doLogin } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';
import { RegisterBackground } from '../../components/common/BackgroundImage';
import { getDashboardPathByRole } from '../../constants/roles';

export default function Register() {
  const navigate = useNavigate();
  const { login: loginUser } = useAuth();

  // Form state
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: ''
  });

  // UI state
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear errors when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    if (generalError) {
      setGeneralError(null);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Parent
    if (!formData.fullName.trim()) newErrors.fullName = 'Vui lòng nhập họ tên';
    if (!formData.email.trim()) newErrors.email = 'Vui lòng nhập email';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Email không đúng định dạng';
    if (!formData.phone.trim()) newErrors.phone = 'Vui lòng nhập số điện thoại';
    if (!/^\d{10,11}$/.test(formData.phone.trim())) newErrors.phone = 'Số điện thoại phải có 10-11 chữ số';
    if (!formData.password || formData.password.length < 6) newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';

    // Pet fields là optional - user có thể tạo pet profile sau khi đăng ký qua trang "My Pets"
    // Không validate pet fields vì API register không nhận các field này

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});
    setGeneralError(null);
    setSuccessMessage('');

    try {
      // 1) Đăng ký
      await doRegister(formData);

      // 2) Auto-login: BE chỉ nhận { phone, password } và trả dữ liệu PHẲNG + token
      const data = await doLogin(formData.phone, formData.password);

      if (!data?.token) {
        throw new Error('Đăng nhập tự động thất bại. Vui lòng đăng nhập lại.');
      }

      // 3) Map userData từ response (API không trả về pet fields nữa)
      const userData = {
        id: data.id,
        name: data.fullName || data.name,
        email: data.email,
        phone: data.phone,
        role: data.role,
        accountId: data.accountId || data.id
      };
      
      // Lưu ý: Pet fields không được gửi lên API register nữa
      // User có thể tạo pet profile sau khi đăng ký qua trang "My Pets"

      // 4) Lưu session & điều hướng
      loginUser(userData, data.token);
      setSuccessMessage('Tạo tài khoản & đăng nhập thành công! Đang chuyển hướng...');
      const to = getDashboardPathByRole(userData.role);
      navigate(to, { replace: true });

    } catch (error) {
      console.error('🔐 Register: Registration failed:', error);

      // Reset errors
      const newErrors = {};

      if (error.response?.data?.message) {
        const serverMsg = error.response.data.message;
        setGeneralError(serverMsg);
        
        // Map duplicate errors to specific fields
        if (serverMsg.toLowerCase().includes('email') && (serverMsg.toLowerCase().includes('duplicate') || serverMsg.toLowerCase().includes('đã tồn tại') || serverMsg.toLowerCase().includes('already'))) {
          newErrors.email = 'Email này đã được sử dụng. Vui lòng chọn email khác.';
        }
        if (serverMsg.toLowerCase().includes('phone') && (serverMsg.toLowerCase().includes('duplicate') || serverMsg.toLowerCase().includes('đã tồn tại') || serverMsg.toLowerCase().includes('already'))) {
          newErrors.phone = 'Số điện thoại này đã được sử dụng. Vui lòng chọn số khác.';
        }
      } else if (error.response?.status === 400) {
        const errorText = String(error.response?.data || '').toLowerCase();
        if (errorText.includes('duplicate') || errorText.includes('đã tồn tại') || errorText.includes('already')) {
          if (errorText.includes('email')) {
            newErrors.email = 'Email này đã được sử dụng. Vui lòng chọn email khác.';
            setGeneralError('Email này đã được sử dụng.');
          } else if (errorText.includes('phone') || errorText.includes('số điện thoại')) {
            newErrors.phone = 'Số điện thoại này đã được sử dụng. Vui lòng chọn số khác.';
            setGeneralError('Số điện thoại này đã được sử dụng.');
          } else {
            setGeneralError('Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.');
          }
        } else {
          setGeneralError('Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.');
        }
      } else if (error.response?.status === 409) {
        const errorText = String(error.response?.data?.message || '').toLowerCase();
        if (errorText.includes('email')) {
          newErrors.email = 'Email này đã được sử dụng. Vui lòng chọn email khác.';
        }
        if (errorText.includes('phone') || errorText.includes('số điện thoại')) {
          newErrors.phone = 'Số điện thoại này đã được sử dụng. Vui lòng chọn số khác.';
        }
        setGeneralError('Email hoặc số điện thoại đã được sử dụng.');
      } else if (error.response?.status === 500) {
        setGeneralError('Lỗi server. Vui lòng thử lại sau.');
      } else if (error.code === 'NETWORK_ERROR' || !navigator.onLine) {
        setGeneralError('Không có kết nối mạng. Vui lòng kiểm tra lại.');
      } else {
        setGeneralError(error.message || 'Đăng ký thất bại. Vui lòng thử lại.');
      }

      // Set field-specific errors
      if (Object.keys(newErrors).length > 0) {
        setErrors(prev => ({ ...prev, ...newErrors }));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Side - Image (1/3) */}
      <RegisterBackground className="hidden lg:block lg:w-1/3 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-transparent"></div>
        <div className="relative z-10 h-full flex flex-col items-center justify-center p-8 text-white">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white bg-opacity-20 rounded-full mb-6 backdrop-blur-sm">
              <span className="text-4xl">🐾</span>
            </div>
            <h1 className="text-4xl font-bold mb-4 drop-shadow-lg">Pawfect Match</h1>
            <p className="text-lg drop-shadow-md text-center">Tham gia cộng đồng những người yêu thú cưng của chúng tôi</p>
          </div>
        </div>
      </RegisterBackground>

      {/* Right Side - Form (2/3) */}
      <div className="w-full lg:w-2/3 flex items-center justify-center p-6 sm:p-8">
        <div className="w-full max-w-3xl bg-white shadow-xl rounded-2xl p-6 sm:p-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Tạo tài khoản của bạn</h2>
          <p className="text-gray-500 mb-6">Chỉ mất một phút để tham gia cùng chúng tôi.</p>

          {/* Success */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <p className="text-sm text-green-600 font-medium">{successMessage}</p>
              </div>
            </div>
          )}

          {/* Error */}
          {generalError && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-300 rounded-xl animate-pulse">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-red-700 mb-1">Lỗi đăng ký</p>
                  <p className="text-sm text-red-600">{generalError}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Parent */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Người chăm sóc thú cưng</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                  <input
                    name="fullName"
                    autoComplete="name"
                    type="text"
                    placeholder="Nguyễn Văn A"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className={`w-full px-4 py-3 border ${errors.fullName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  />
                  {errors.fullName && (
                    <p className="text-sm text-red-600 mt-1 flex items-start font-medium bg-red-50 p-2 rounded border border-red-200">
                      <AlertCircle className="h-4 w-4 mr-1.5 flex-shrink-0 mt-0.5" />
                      <span>{errors.fullName}</span>
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    name="email"
                    autoComplete="email"
                    type="email"
                    placeholder="email.cua.ban@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full px-4 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-600 mt-1 flex items-start font-medium bg-red-50 p-2 rounded border border-red-200">
                      <AlertCircle className="h-4 w-4 mr-1.5 flex-shrink-0 mt-0.5" />
                      <span>{errors.email}</span>
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone (đăng nhập bằng SĐT)</label>
                  <input
                    name="phone"
                    autoComplete="tel"
                    type="tel"
                    placeholder="09xxxxxxxx"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`w-full px-4 py-3 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-600 mt-1 flex items-start font-medium bg-red-50 p-2 rounded border border-red-200">
                      <AlertCircle className="h-4 w-4 mr-1.5 flex-shrink-0 mt-0.5" />
                      <span>{errors.phone}</span>
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
                  <div className="relative">
                    <input
                      name="password"
                      autoComplete="new-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className={`w-full px-4 py-3 pr-10 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-600 mt-1 flex items-start font-medium bg-red-50 p-2 rounded border border-red-200">
                      <AlertCircle className="h-4 w-4 mr-1.5 flex-shrink-0 mt-0.5" />
                      <span>{errors.password}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-60"
            >
              {isLoading ? 'Đang xử lý...' : 'Tạo tài khoản'}
            </button>

            <p className="text-sm text-gray-600 text-center">
              Đã có tài khoản?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors"
              >
                Đăng nhập
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
