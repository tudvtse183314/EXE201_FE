import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Check, X } from 'lucide-react';
import publicApi from '../api/publicApi';
import { backgrounds } from '../assets/images';

export default function Register() {
  const navigate = useNavigate();
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
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState({
    hasMinLength: false,
    hasSpecialChar: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    
    if (field === 'password') {
      checkPasswordStrength(value);
    }
    
    // Clear error when user types
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
    
    // Clear success message when user types
    if (successMessage) {
      setSuccessMessage('');
    }
  };

  const checkPasswordStrength = (password) => {
    setPasswordStrength({
      hasMinLength: password.length >= 8,
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password) || /[0-9]/.test(password) || /[A-Z]/.test(password)
    });
  };

  // Helper function to render error messages
  const renderErrorMessage = (fieldName) => {
    if (!errors[fieldName]) return null;
    
    return (
      <div className="mt-1 flex items-center">
        <svg className="h-3 w-3 text-red-400 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        <p className="text-xs text-red-500">{errors[fieldName]}</p>
      </div>
    );
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9]{10,15}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number must be 10-15 digits';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!passwordStrength.hasMinLength || !passwordStrength.hasSpecialChar) {
      newErrors.password = 'Password does not meet requirements';
    }

    if (!formData.petName.trim()) {
      newErrors.petName = 'Pet name is required';
    }

    if (!formData.petType) {
      newErrors.petType = 'Pet type is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Prepare data according to Swagger API specification
      const registerData = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: formData.role,
        petName: formData.petName,
        petAge: formData.petAge,
        petType: formData.petType,
        petSize: formData.petSize
      };

      console.log('Sending registration data:', registerData);
      console.log('API endpoint:', '/register');
      console.log('Full URL:', 'http://localhost:8080/api/register');

      const response = await publicApi.post('/register', registerData);
      console.log('Registration response:', response);
      
      // Success - redirect to login
      setErrors({});
      setSuccessMessage('Account created successfully! Redirecting to login...');
      
      // Delay redirect to show success message
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (err) {
      console.error('Registration error:', err);
      console.error('Error response:', err.response);
      console.error('Error data:', err.response?.data);
      
      // Handle different types of errors
      let errorMessage = 'Registration failed. Please try again.';
      let fieldErrors = {};
      
      if (err.response?.data) {
        const errorData = err.response.data;
        
        // Handle validation errors (field-specific)
        if (errorData.errors && Array.isArray(errorData.errors)) {
          errorData.errors.forEach(error => {
            if (error.field) {
              fieldErrors[error.field] = error.message;
            }
          });
        }
        
        // Handle specific error messages
        if (errorData.message) {
          // Check for common error patterns
          if (errorData.message.includes('email') && errorData.message.includes('already')) {
            fieldErrors.email = 'Email address is already registered';
          } else if (errorData.message.includes('phone') && errorData.message.includes('already')) {
            fieldErrors.phone = 'Phone number is already registered';
          } else if (errorData.message.includes('email') && errorData.message.includes('invalid')) {
            fieldErrors.email = 'Please enter a valid email address';
          } else if (errorData.message.includes('phone') && errorData.message.includes('invalid')) {
            fieldErrors.phone = 'Please enter a valid phone number';
          } else if (errorData.message.includes('password')) {
            fieldErrors.password = 'Password does not meet requirements';
          } else {
            errorMessage = errorData.message;
          }
        }
        
        // Handle error object format
        if (errorData.error) {
          errorMessage = errorData.error;
        }
        
        // Handle specific field errors from backend
        if (errorData.email) {
          fieldErrors.email = errorData.email;
        }
        if (errorData.phone) {
          fieldErrors.phone = errorData.phone;
        }
        if (errorData.password) {
          fieldErrors.password = errorData.password;
        }
        if (errorData.fullName) {
          fieldErrors.fullName = errorData.fullName;
        }
        if (errorData.petName) {
          fieldErrors.petName = errorData.petName;
        }
        if (errorData.petType) {
          fieldErrors.petType = errorData.petType;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      // Set errors - prioritize field errors over general error
      if (Object.keys(fieldErrors).length > 0) {
        setErrors(fieldErrors);
      } else {
        setErrors({ general: errorMessage });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Side - Vertical Image (1/4) */}
      <div className="hidden lg:block lg:w-1/4 relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${backgrounds.register})`
          }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center p-8 text-white">
          {/* Logo/Brand */}
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

          {/* Decorative Elements */}
          <div className="flex flex-col items-center space-y-4">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-white rounded-full opacity-60"></div>
              <div className="w-3 h-3 bg-white rounded-full opacity-80"></div>
              <div className="w-3 h-3 bg-white rounded-full opacity-60"></div>
            </div>
            
            <div className="text-4xl">
              <span className="transform hover:scale-110 transition-transform drop-shadow-lg">🐕</span>
            </div>
            
            <div className="flex space-x-2">
              <div className="w-2 h-2 bg-white rounded-full opacity-40"></div>
              <div className="w-2 h-2 bg-white rounded-full opacity-60"></div>
              <div className="w-2 h-2 bg-white rounded-full opacity-40"></div>
            </div>
          </div>

          {/* Footer */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-white opacity-70">
            Made with ❤️ Visily
          </div>
        </div>
      </div>

      {/* Right Side - Form (3/4) */}
      <div className="w-full lg:w-3/4 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* User Information Card */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 hover:shadow-3xl transition-shadow duration-300">
              {/* Header */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-3 shadow-lg">
                  <span className="text-2xl">👤</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">Create Account</h2>
                <p className="text-sm text-gray-600">
                  Join Pawfect Match today!
                </p>
              </div>

              {/* Success Message */}
              {successMessage && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-4 w-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-2">
                      <p className="text-xs text-green-600 font-medium">Success!</p>
                      <p className="text-xs text-green-600 mt-1">{successMessage}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* General Error */}
              {errors.general && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-4 w-4 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-2">
                      <p className="text-xs text-red-600 font-medium">Registration Error</p>
                      <p className="text-xs text-red-600 mt-1">{errors.general}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* User Form */}
              <div className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className={`w-full px-3 py-2.5 text-sm border ${
                      errors.fullName ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
                  />
                  {renderErrorMessage('fullName')}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="your@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full px-3 py-2.5 text-sm border ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
                  />
                  {renderErrorMessage('email')}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="0123456789"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`w-full px-3 py-2.5 text-sm border ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
                  />
                  {renderErrorMessage('phone')}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className={`w-full px-3 py-2.5 pr-10 text-sm border ${
                        errors.password ? 'border-red-500' : 'border-gray-300'
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  
                  {/* Password Requirements */}
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center gap-2">
                      {passwordStrength.hasMinLength ? (
                        <Check className="w-3 h-3 text-green-500" />
                      ) : (
                        <X className="w-3 h-3 text-gray-400" />
                      )}
                      <span className={`text-xs ${passwordStrength.hasMinLength ? 'text-green-600' : 'text-gray-500'}`}>
                        8 or more characters
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {passwordStrength.hasSpecialChar ? (
                        <Check className="w-3 h-3 text-green-500" />
                      ) : (
                        <X className="w-3 h-3 text-gray-400" />
                      )}
                      <span className={`text-xs ${passwordStrength.hasSpecialChar ? 'text-green-600' : 'text-gray-500'}`}>
                        Has a symbol, number, or uppercase letter
                      </span>
                    </div>
                  </div>
                  {renderErrorMessage('password')}
                </div>

                
              </div>
            </div>

            {/* Pet Information Card */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 hover:shadow-3xl transition-shadow duration-300 mt-10">
              {/* Header */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-pink-500 to-orange-500 rounded-2xl mb-3 shadow-lg">
                  <span className="text-2xl">🐾</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">Pet Information</h2>
                <p className="text-sm text-gray-600">
                  Tell us about your furry friend
                </p>
              </div>

              {/* Pet Form */}
              <div className="space-y-4">
                {/* Pet Name */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Pet's Name
                  </label>
                  <input
                    type="text"
                    placeholder="Buddy"
                    value={formData.petName}
                    onChange={(e) => handleInputChange('petName', e.target.value)}
                    className={`w-full px-3 py-2.5 text-sm border ${
                      errors.petName ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all`}
                  />
                  {renderErrorMessage('petName')}
                </div>

                {/* Pet Type */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Pet Type
                  </label>
                  <select
                    value={formData.petType}
                    onChange={(e) => handleInputChange('petType', e.target.value)}
                    className={`w-full px-3 py-2.5 text-sm border ${
                      errors.petType ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all appearance-none bg-white`}
                  >
                    <option value="">Select type</option>
                    <option value="DOG">Dog</option>
                    <option value="CAT">Cat</option>
                    <option value="BIRD">Bird</option>
                    <option value="RABBIT">Rabbit</option>
                    <option value="OTHER">Other</option>
                  </select>
                  {renderErrorMessage('petType')}
                </div>

                {/* Pet Age */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Pet Age
                  </label>
                  <input
                    type="text"
                    placeholder="3 years"
                    value={formData.petAge}
                    onChange={(e) => handleInputChange('petAge', e.target.value)}
                    className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Pet Size */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Pet Size
                  </label>
                  <select
                    value={formData.petSize}
                    onChange={(e) => handleInputChange('petSize', e.target.value)}
                    className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all appearance-none bg-white"
                  >
                    <option value="">Select size</option>
                    <option value="SMALL">Small</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LARGE">Large</option>
                    <option value="EXTRA_LARGE">Extra Large</option>
                  </select>
                </div>

                {/* Sign Up Button */}
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 mt-4"
                >
                  {isLoading ? 'Creating Account...' : 'Sign Up'}
                </button>

                {/* Login Link */}
                <p className="text-center text-xs text-gray-600 mt-3">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors"
                  >
                    Log In
                  </button>
                </p>

                {/* Pet Illustration */}
                <div className="mt-6 text-center">
                  <div className="inline-flex gap-3 text-5xl">
                    <span className="transform hover:scale-110 transition-transform animate-bounce">🐕</span>
                    <span className="transform hover:scale-110 transition-transform animate-bounce" style={{ animationDelay: '0.1s' }}>🐱</span>
                    <span className="transform hover:scale-110 transition-transform animate-bounce" style={{ animationDelay: '0.2s' }}>🐰</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
