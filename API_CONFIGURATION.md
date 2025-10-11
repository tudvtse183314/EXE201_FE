# API Configuration Guide

## Environment Variables

Tạo file `.env` trong thư mục root của project với nội dung sau:

```env
# API Configuration
REACT_APP_API_BASE_URL=https://exe201-be-uhno.onrender.com/api
REACT_APP_API_TIMEOUT=10000

# Environment
REACT_APP_ENV=production

# Mock API (set to false when backend is fully available)
REACT_APP_USE_MOCK_API=false

# Debug mode
REACT_APP_DEBUG=false

# AI API (optional - for AI features)
REACT_APP_AI_API_URL=https://exe201-be-uhno.onrender.com/api/ai
```

## Cấu trúc API

### Base URL
- **Production**: `https://exe201-be-uhno.onrender.com/api`
- **Development**: Có thể override bằng `REACT_APP_API_BASE_URL`

### Endpoints
- **Login**: `POST /login`
- **Register**: `POST /register`
- **Account**: `GET /account`
- **Verify Token**: `GET /auth/verify`
- **Health Check**: `GET /health`

## Cách sử dụng

### 1. Import config
```javascript
import API_CONFIG from '../config/api';
```

### 2. Sử dụng trong API calls
```javascript
// Thay vì hardcode URL
const response = await axios.post('/login', data);

// Sử dụng config
const response = await axios.post(API_CONFIG.ENDPOINTS.LOGIN, data);
```

### 3. Kiểm tra environment
```javascript
if (API_CONFIG.ENV === 'production') {
  // Production logic
} else {
  // Development logic
}
```

## Mock API

Khi `REACT_APP_USE_MOCK_API=true`, hệ thống sẽ tự động sử dụng mock data khi backend không khả dụng.

## Troubleshooting

### 1. Backend không khả dụng
- Kiểm tra `REACT_APP_USE_MOCK_API=true` để sử dụng mock data
- Kiểm tra network connection
- Verify backend URL trong `.env`

### 2. Timeout errors
- Tăng `REACT_APP_API_TIMEOUT` (mặc định: 10000ms)
- Kiểm tra backend performance

### 3. CORS errors
- Đảm bảo backend đã cấu hình CORS cho frontend domain
- Kiểm tra preflight requests

## Files đã được cập nhật

- `src/config/api.js` - Centralized API configuration
- `src/api/axiosInstance.js` - Updated to use config
- `src/api/authApi.js` - Updated endpoints and parameters
- `src/api/publicApi.js` - Updated to use config
- `src/ai/services/aiVision.js` - Updated AI API URL
- `src/pages/Login.jsx` - Removed hardcoded URLs
- `src/pages/Register.jsx` - Removed hardcoded URLs
- `src/components/demo/MockAPIDemo.jsx` - Updated documentation

## Migration từ localhost

Tất cả hardcoded localhost URLs đã được thay thế bằng:
1. Environment variables
2. Centralized config file
3. Dynamic URL construction

Điều này giúp dễ dàng chuyển đổi giữa development và production environments.
