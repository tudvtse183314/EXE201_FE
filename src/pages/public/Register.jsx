import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Check, X, AlertCircle, CheckCircle } from 'lucide-react';
import { register } from '../../api/auth';
import { RegisterBackground } from '../../components/common/BackgroundImage';

export default function Register() {
  const navigate = useNavigate();
  
  // Form state
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    role: 'CUSTOMER',
    petName: '',
    petAge: '',
    petType: '',
    petSize: ''
  });
  
  // Error and validation state
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    
    // Clear field error when user types
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
    
    // Clear general error when user types
    if (generalError) {
      setGeneralError(null);
    }
    
    // Clear success message when user types
    if (successMessage) {
      setSuccessMessage('');
    }
    
    // Real-time validation for email
    if (field === 'email' && value.trim()) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        setErrors({ ...errors, email: 'Email không đúng định dạng' });
      } else {
        setErrors({ ...errors, email: '' });
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Basic required field validation
    if (!formData.fullName.trim()) newErrors.fullName = 'Vui lòng nhập họ tên';
    if (!formData.email.trim()) newErrors.email = 'Vui lòng nhập email';
    if (!formData.phone.trim()) newErrors.phone = 'Vui lòng nhập số điện thoại';
    if (!formData.password.trim()) newErrors.password = 'Vui lòng nhập mật khẩu';
    if (!formData.petName.trim()) newErrors.petName = 'Vui lòng nhập tên thú cưng';
    if (!formData.petType.trim()) newErrors.petType = 'Vui lòng chọn loại thú cưng';
    
    // Email format validation
    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không đúng định dạng';
    }
    
    // Phone format validation (Vietnamese phone numbers)
    if (formData.phone.trim() && !/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Số điện thoại phải có 10-11 chữ số';
    }
    
    // Password strength validation
    if (formData.password.trim() && formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    
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
      console.log('🔐 Register: Attempting registration...');
      
      await register(formData);
      
      console.log('🔐 Register: Registration successful');
      setSuccessMessage('Tạo tài khoản thành công! Đang chuyển hướng đến trang đăng nhập...');
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (error) {
      console.error('🔐 Register: Registration failed:', error);
      
      // Handle different types of errors
      if (error.response?.data?.message) {
        setGeneralError(error.response.data.message);
      } else if (error.response?.status === 400) {
        // Check for specific error patterns
        const errorText = error.response?.data?.toString() || '';
        
        if (errorText.includes('Duplicate entry') && errorText.includes('email')) {
          setGeneralError('Email này đã được sử dụng. Vui lòng chọn email khác.');
        } else if (errorText.includes('Duplicate entry') && errorText.includes('phone')) {
          setGeneralError('Số điện thoại này đã được sử dụng. Vui lòng chọn số khác.');
        } else {
          setGeneralError('Thông tin không hợp lệ. Vui lòng kiểm tra lại.');
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
      {/* Left Side - Image */}
      <RegisterBackground className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        
        <div className="relative z-10 h-full flex flex-col items-center justify-center p-8 text-white">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-full mb-4 backdrop-blur-sm">
              <span className="text-3xl">🐾</span>
            </div>
            <h1 className="text-3xl font-bold mb-2 drop-shadow-lg">
              Pawfect Match
            </h1>
            <p className="text-sm drop-shadow-md text-center">
              Join our community of pet lovers
            </p>
          </div>
        </div>
      </RegisterBackground>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
            <p className="text-gray-600">Join Pawfect Match today!</p>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <p className="text-sm text-green-600 font-medium">{successMessage}</p>
              </div>
            </div>
          )}

          {/* General Error */}
          {generalError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                <p className="text-sm text-red-600 font-medium">{generalError}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                className={`w-full px-4 py-3 border ${
                  errors.fullName ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
              />
              {errors.fullName && (
                <p className="text-sm text-red-500 mt-1 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" /> {errors.fullName}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="your@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full px-4 py-3 border ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" /> {errors.email}
                </p>
              )}
              {!errors.email && formData.email && (
                <p className="text-xs text-gray-500 mt-1">
                  Email sẽ được dùng để đăng nhập
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="0123456789"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={`w-full px-4 py-3 border ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
              />
              {errors.phone && (
                <p className="text-sm text-red-500 mt-1 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" /> {errors.phone}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`w-full px-4 py-3 pr-12 border ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500 mt-1 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" /> {errors.password}
                </p>
              )}
            </div>

            {/* Pet Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Pet's Name
              </label>
              <input
                type="text"
                placeholder="Buddy"
                value={formData.petName}
                onChange={(e) => handleInputChange('petName', e.target.value)}
                className={`w-full px-4 py-3 border ${
                  errors.petName ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
              />
              {errors.petName && (
                <p className="text-sm text-red-500 mt-1 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" /> {errors.petName}
                </p>
              )}
            </div>

            {/* Pet Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Pet Type
              </label>
              <select
                value={formData.petType}
                onChange={(e) => handleInputChange('petType', e.target.value)}
                className={`w-full px-4 py-3 border ${
                  errors.petType ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all appearance-none bg-white`}
              >
                <option value="">Select type</option>
                <option value="dog">Dog</option>
                <option value="cat">Cat</option>
                <option value="bird">Bird</option>
                <option value="rabbit">Rabbit</option>
                <option value="other">Other</option>
              </select>
              {errors.petType && (
                <p className="text-sm text-red-500 mt-1 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" /> {errors.petType}
                </p>
              )}
            </div>

            {/* Pet Age */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Pet Age
              </label>
              <input
                type="text"
                placeholder="3 years"
                value={formData.petAge}
                onChange={(e) => handleInputChange('petAge', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Pet Size */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Pet Size
              </label>
              <select
                value={formData.petSize}
                onChange={(e) => handleInputChange('petSize', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all appearance-none bg-white"
              >
                <option value="">Select size</option>
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
                <option value="extra_large">Extra Large</option>
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 text-white py-4 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:bg-indigo-400 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </button>

            {/* Login Link */}
            <p className="text-center text-sm text-gray-600 mt-4">
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
