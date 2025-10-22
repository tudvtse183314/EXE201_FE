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
    password: '',
    // Pet fields
    petName: '',
    petAge: '',
    petType: '',
    petSize: '' // select
  });

  // UI state
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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

    // Pet (bắt buộc theo form hiện tại)
    if (!formData.petName.trim()) newErrors.petName = 'Vui lòng nhập tên thú cưng';
    if (!formData.petType.trim()) newErrors.petType = 'Vui lòng chọn loại thú cưng';
    if (!formData.petSize.trim()) newErrors.petSize = 'Vui lòng chọn kích cỡ';

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

      // 3) Map userData giống trang Login (đang hoạt động ổn)
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

      // 4) Lưu session & điều hướng
      loginUser(userData, data.token);
      setSuccessMessage('Tạo tài khoản & đăng nhập thành công! Đang chuyển hướng...');
      const to = getDashboardPathByRole(userData.role);
      navigate(to, { replace: true });

    } catch (error) {
      console.error('🔐 Register: Registration failed:', error);

      if (error.response?.data?.message) {
        setGeneralError(error.response.data.message);
      } else if (error.response?.status === 400) {
        const errorText = String(error.response?.data || '');
        if (errorText.includes('Duplicate entry') && errorText.includes('email')) {
          setGeneralError('Email này đã được sử dụng.');
        } else if (errorText.includes('Duplicate entry') && errorText.includes('phone')) {
          setGeneralError('Số điện thoại này đã được sử dụng.');
        } else {
          setGeneralError('Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.');
        }
      } else if (error.response?.status === 409) {
        setGeneralError('Email hoặc số điện thoại đã được sử dụng.');
      } else if (error.response?.status === 500) {
        setGeneralError('Lỗi server. Vui lòng thử lại sau.');
      } else if (error.code === 'NETWORK_ERROR' || !navigator.onLine) {
        setGeneralError('Không có kết nối mạng. Vui lòng kiểm tra lại.');
      } else {
        setGeneralError(error.message || 'Đăng ký thất bại. Vui lòng thử lại.');
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
            <p className="text-lg drop-shadow-md text-center">Join our community of pet lovers</p>
          </div>
        </div>
      </RegisterBackground>

      {/* Right Side - Form (2/3) */}
      <div className="w-full lg:w-2/3 flex items-center justify-center p-6 sm:p-8">
        <div className="w-full max-w-3xl bg-white shadow-xl rounded-2xl p-6 sm:p-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Create your account</h2>
          <p className="text-gray-500 mb-6">It only takes a minute to join us.</p>

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
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                <p className="text-sm text-red-600 font-medium">{generalError}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Parent */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Pet&apos;s Parent</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
                  <input
                    name="fullName"
                    autoComplete="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className={`w-full px-4 py-3 border ${errors.fullName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  />
                  {errors.fullName && <p className="text-sm text-red-500 mt-1 flex items-center"><AlertCircle className="h-4 w-4 mr-1" />{errors.fullName}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    name="email"
                    autoComplete="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full px-4 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  />
                  {errors.email && <p className="text-sm text-red-500 mt-1 flex items-center"><AlertCircle className="h-4 w-4 mr-1" />{errors.email}</p>}
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
                  {errors.phone && <p className="text-sm text-red-500 mt-1 flex items-center"><AlertCircle className="h-4 w-4 mr-1" />{errors.phone}</p>}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
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
                  {errors.password && <p className="text-sm text-red-500 mt-1 flex items-center"><AlertCircle className="h-4 w-4 mr-1" />{errors.password}</p>}
                </div>
              </div>
            </div>

            {/* Pet */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Pet</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Pet name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pet&apos;s Name</label>
                  <input
                    name="petName"
                    type="text"
                    placeholder="Milo"
                    value={formData.petName}
                    onChange={(e) => handleInputChange('petName', e.target.value)}
                    className={`w-full px-4 py-3 border ${errors.petName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  />
                  {errors.petName && <p className="text-sm text-red-500 mt-1 flex items-center"><AlertCircle className="h-4 w-4 mr-1" />{errors.petName}</p>}
                </div>

                {/* Pet type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    name="petType"
                    value={formData.petType}
                    onChange={(e) => handleInputChange('petType', e.target.value)}
                    className={`w-full px-4 py-3 border ${errors.petType ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white`}
                  >
                    <option value="">Select type</option>
                    <option value="DOG">Dog</option>
                    <option value="CAT">Cat</option>
                    <option value="OTHER">Other</option>
                  </select>
                  {errors.petType && <p className="text-sm text-red-500 mt-1 flex items-center"><AlertCircle className="h-4 w-4 mr-1" />{errors.petType}</p>}
                </div>

                {/* Age */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                  <input
                    name="petAge"
                    type="text"
                    placeholder="e.g. 2"
                    value={formData.petAge}
                    onChange={(e) => handleInputChange('petAge', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Size (select) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
                  <select
                    name="petSize"
                    value={formData.petSize}
                    onChange={(e) => handleInputChange('petSize', e.target.value)}
                    className={`w-full px-4 py-3 border ${errors.petSize ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white`}
                  >
                    <option value="">Select size</option>
                    <option value="SMALL">Small</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LARGE">Large</option>
                  </select>
                  {errors.petSize && <p className="text-sm text-red-500 mt-1 flex items-center"><AlertCircle className="h-4 w-4 mr-1" />{errors.petSize}</p>}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-60"
            >
              {isLoading ? 'Đang xử lý...' : 'Create account'}
            </button>

            <p className="text-sm text-gray-600 text-center">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors"
              >
                Log In
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
