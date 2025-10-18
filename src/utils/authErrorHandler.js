/**
 * Authentication Error Handler Utilities
 * Provides comprehensive error handling for login and register flows
 */

// Error types for better categorization
export const AUTH_ERROR_TYPES = {
  VALIDATION: 'VALIDATION',
  NETWORK: 'NETWORK',
  SERVER: 'SERVER',
  AUTHENTICATION: 'AUTHENTICATION',
  AUTHORIZATION: 'AUTHORIZATION',
  TIMEOUT: 'TIMEOUT',
  UNKNOWN: 'UNKNOWN'
};

// Error messages mapping
export const AUTH_ERROR_MESSAGES = {
  // Network errors
  NETWORK_ERROR: 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối internet.',
  TIMEOUT_ERROR: 'Yêu cầu hết thời gian chờ. Vui lòng thử lại.',
  CONNECTION_REFUSED: 'Không thể kết nối đến server. Server có thể đang bảo trì.',
  
  // Authentication errors
  INVALID_CREDENTIALS: 'Số điện thoại hoặc mật khẩu không đúng.',
  ACCOUNT_LOCKED: 'Tài khoản đã bị khóa. Vui lòng liên hệ hỗ trợ.',
  ACCOUNT_DISABLED: 'Tài khoản đã bị vô hiệu hóa.',
  TOKEN_EXPIRED: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
  TOKEN_INVALID: 'Phiên đăng nhập không hợp lệ.',
  
  // Registration errors
  EMAIL_EXISTS: 'Email này đã được sử dụng.',
  PHONE_EXISTS: 'Số điện thoại này đã được đăng ký.',
  WEAK_PASSWORD: 'Mật khẩu không đủ mạnh.',
  INVALID_EMAIL: 'Email không hợp lệ.',
  INVALID_PHONE: 'Số điện thoại không hợp lệ.',
  
  // Server errors
  SERVER_ERROR: 'Lỗi server. Vui lòng thử lại sau.',
  SERVICE_UNAVAILABLE: 'Dịch vụ tạm thời không khả dụng.',
  RATE_LIMITED: 'Quá nhiều yêu cầu. Vui lòng thử lại sau.',
  
  // Validation errors
  REQUIRED_FIELD: 'Trường này là bắt buộc.',
  INVALID_FORMAT: 'Định dạng không hợp lệ.',
  MIN_LENGTH: 'Tối thiểu {min} ký tự.',
  MAX_LENGTH: 'Tối đa {max} ký tự.',
  
  // Unknown errors
  UNKNOWN_ERROR: 'Đã xảy ra lỗi không xác định. Vui lòng thử lại.'
};

/**
 * Parse error response from API
 * @param {Error} error - The error object
 * @returns {Object} Parsed error with type, message, and field errors
 */
export const parseAuthError = (error) => {
  console.log('🔍 Parsing auth error:', error);
  
  // Default error structure
  const defaultError = {
    type: AUTH_ERROR_TYPES.UNKNOWN,
    message: AUTH_ERROR_MESSAGES.UNKNOWN_ERROR,
    fieldErrors: {},
    originalError: error
  };

  // Handle network/timeout errors
  if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
    return {
      ...defaultError,
      type: AUTH_ERROR_TYPES.TIMEOUT,
      message: AUTH_ERROR_MESSAGES.TIMEOUT_ERROR
    };
  }

  // Handle network errors
  if (error.code === 'ERR_NETWORK' || !error.response) {
    return {
      ...defaultError,
      type: AUTH_ERROR_TYPES.NETWORK,
      message: AUTH_ERROR_MESSAGES.NETWORK_ERROR
    };
  }

  // Handle server response errors
  if (error.response) {
    const { status, data } = error.response;
    
    // Handle different HTTP status codes
    switch (status) {
      case 400:
        return parseBadRequestError(data, defaultError);
      case 401:
        return {
          ...defaultError,
          type: AUTH_ERROR_TYPES.AUTHENTICATION,
          message: AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS
        };
      case 403:
        return {
          ...defaultError,
          type: AUTH_ERROR_TYPES.AUTHORIZATION,
          message: AUTH_ERROR_MESSAGES.ACCOUNT_LOCKED
        };
      case 404:
        return {
          ...defaultError,
          type: AUTH_ERROR_TYPES.SERVER,
          message: 'Endpoint không tồn tại.'
        };
      case 429:
        return {
          ...defaultError,
          type: AUTH_ERROR_TYPES.SERVER,
          message: AUTH_ERROR_MESSAGES.RATE_LIMITED
        };
      case 500:
      case 502:
      case 503:
      case 504:
        return {
          ...defaultError,
          type: AUTH_ERROR_TYPES.SERVER,
          message: AUTH_ERROR_MESSAGES.SERVER_ERROR
        };
      default:
        return parseServerError(data, defaultError);
    }
  }

  return defaultError;
};

/**
 * Parse 400 Bad Request errors
 */
const parseBadRequestError = (data, defaultError) => {
  const fieldErrors = {};
  let message = 'Dữ liệu không hợp lệ.';

  // Handle validation errors array
  if (data.errors && Array.isArray(data.errors)) {
    data.errors.forEach(error => {
      if (error.field) {
        fieldErrors[error.field] = error.message || AUTH_ERROR_MESSAGES.INVALID_FORMAT;
      }
    });
  }

  // Handle specific field errors
  if (data.email) fieldErrors.email = data.email;
  if (data.phone) fieldErrors.phone = data.phone;
  if (data.password) fieldErrors.password = data.password;
  if (data.fullName) fieldErrors.fullName = data.fullName;
  if (data.petName) fieldErrors.petName = data.petName;
  if (data.petType) fieldErrors.petType = data.petType;

  // Handle general message
  if (data.message) {
    message = parseErrorMessage(data.message);
  }

  return {
    ...defaultError,
    type: AUTH_ERROR_TYPES.VALIDATION,
    message,
    fieldErrors
  };
};

/**
 * Parse server error messages
 */
const parseServerError = (data, defaultError) => {
  let message = AUTH_ERROR_MESSAGES.SERVER_ERROR;

  if (data.message) {
    message = parseErrorMessage(data.message);
  } else if (data.error) {
    message = parseErrorMessage(data.error);
  }

  return {
    ...defaultError,
    type: AUTH_ERROR_TYPES.SERVER,
    message
  };
};

/**
 * Parse error message and map to Vietnamese
 */
const parseErrorMessage = (message) => {
  const lowerMessage = message.toLowerCase();

  // Email errors
  if (lowerMessage.includes('email') && lowerMessage.includes('already')) {
    return AUTH_ERROR_MESSAGES.EMAIL_EXISTS;
  }
  if (lowerMessage.includes('email') && lowerMessage.includes('invalid')) {
    return AUTH_ERROR_MESSAGES.INVALID_EMAIL;
  }

  // Phone errors
  if (lowerMessage.includes('phone') && lowerMessage.includes('already')) {
    return AUTH_ERROR_MESSAGES.PHONE_EXISTS;
  }
  if (lowerMessage.includes('phone') && lowerMessage.includes('invalid')) {
    return AUTH_ERROR_MESSAGES.INVALID_PHONE;
  }

  // Password errors
  if (lowerMessage.includes('password') && lowerMessage.includes('weak')) {
    return AUTH_ERROR_MESSAGES.WEAK_PASSWORD;
  }

  // Authentication errors
  if (lowerMessage.includes('invalid') && lowerMessage.includes('credentials')) {
    return AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS;
  }
  if (lowerMessage.includes('account') && lowerMessage.includes('locked')) {
    return AUTH_ERROR_MESSAGES.ACCOUNT_LOCKED;
  }
  if (lowerMessage.includes('account') && lowerMessage.includes('disabled')) {
    return AUTH_ERROR_MESSAGES.ACCOUNT_DISABLED;
  }

  // Return original message if no mapping found
  return message;
};

/**
 * Validate form data
 * @param {Object} formData - Form data to validate
 * @param {Object} rules - Validation rules
 * @returns {Object} Validation result with errors
 */
export const validateFormData = (formData, rules) => {
  const errors = {};

  Object.keys(rules).forEach(field => {
    const value = formData[field];
    const fieldRules = rules[field];

    // Required validation
    if (fieldRules.required && (!value || value.toString().trim() === '')) {
      errors[field] = AUTH_ERROR_MESSAGES.REQUIRED_FIELD;
      return;
    }

    // Skip other validations if field is empty and not required
    if (!value || value.toString().trim() === '') return;

    // Length validation
    if (fieldRules.minLength && value.length < fieldRules.minLength) {
      errors[field] = AUTH_ERROR_MESSAGES.MIN_LENGTH.replace('{min}', fieldRules.minLength);
      return;
    }

    if (fieldRules.maxLength && value.length > fieldRules.maxLength) {
      errors[field] = AUTH_ERROR_MESSAGES.MAX_LENGTH.replace('{max}', fieldRules.maxLength);
      return;
    }

    // Pattern validation
    if (fieldRules.pattern && !fieldRules.pattern.test(value)) {
      errors[field] = fieldRules.message || AUTH_ERROR_MESSAGES.INVALID_FORMAT;
      return;
    }

    // Custom validation
    if (fieldRules.custom && !fieldRules.custom(value)) {
      errors[field] = fieldRules.message || AUTH_ERROR_MESSAGES.INVALID_FORMAT;
      return;
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validation rules for different forms
 */
export const VALIDATION_RULES = {
  LOGIN: {
    phone: {
      required: true,
      pattern: /^[0-9]{10,15}$/,
      message: 'Số điện thoại phải có 10-15 chữ số.'
    },
    password: {
      required: true,
      minLength: 6,
      message: 'Mật khẩu phải có ít nhất 6 ký tự.'
    }
  },
  REGISTER: {
    fullName: {
      required: true,
      minLength: 2,
      maxLength: 50,
      message: 'Họ tên phải có 2-50 ký tự.'
    },
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Email không hợp lệ.'
    },
    phone: {
      required: true,
      pattern: /^[0-9]{10,15}$/,
      message: 'Số điện thoại phải có 10-15 chữ số.'
    },
    password: {
      required: true,
      minLength: 8,
      custom: (value) => {
        // At least 8 characters, 1 uppercase, 1 lowercase, 1 number or special char
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9!@#$%^&*(),.?":{}|<>]).{8,}$/.test(value);
      },
      message: 'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số hoặc ký tự đặc biệt.'
    },
    petName: {
      required: true,
      minLength: 1,
      maxLength: 30,
      message: 'Tên thú cưng phải có 1-30 ký tự.'
    },
    petType: {
      required: true,
      message: 'Vui lòng chọn loại thú cưng.'
    }
  }
};

/**
 * Check password strength
 * @param {string} password - Password to check
 * @returns {Object} Password strength indicators
 */
export const checkPasswordStrength = (password) => {
  const strength = {
    hasMinLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    score: 0
  };

  // Calculate strength score
  strength.score = Object.values(strength).filter(Boolean).length - 1; // -1 for score itself

  return strength;
};

/**
 * Format error for display
 * @param {Object} error - Error object
 * @returns {Object} Formatted error for UI
 */
export const formatErrorForDisplay = (error) => {
  return {
    type: error.type,
    message: error.message,
    fieldErrors: error.fieldErrors,
    timestamp: new Date().toISOString()
  };
};

