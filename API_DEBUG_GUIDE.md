# API Debug Guide

## 🐛 Vấn đề hiện tại

**Error**: `Request failed with status code 400` - "Username or password invalid!"

## 🔍 Phân tích vấn đề

### 1. **Root Cause**
- Backend đang expect format khác với frontend đang gửi
- Error message "Username or password invalid!" cho thấy backend expect `username` thay vì `phone`

### 2. **Changes Made**

#### **Updated Login.jsx**
```javascript
// Before: Using publicApi directly
const response = await publicApi.post('/login', formData);

// After: Using authApi with proper format
const response = await authApi.login(formData.phone, formData.password);
```

#### **Updated authApi.js**
```javascript
// Before: Sending { phone, password }
const response = await axiosInstance.post(API_CONFIG.ENDPOINTS.LOGIN, { phone, password });

// After: Sending { username, password }
const loginData = { 
  username: phone,  // Backend expects 'username' instead of 'phone'
  password: password 
};
```

## 🛠️ Debug Tools Created

### 1. **ApiDebugger Component**
- Real-time API testing
- Multiple format testing
- Health check functionality
- Located in bottom-right corner (development only)

### 2. **Debug Utilities**
- `src/utils/debugApi.js` - API testing utilities
- `src/components/debug/ApiDebugger.jsx` - Interactive debug component

## 🧪 Testing Different Formats

The debugger can test these formats:
```javascript
const formats = [
  { phone, password },           // Original format
  { username: phone, password }, // Backend expected format
  { email: phone, password },    // Alternative format
  { phoneNumber: phone, password }, // Alternative format
  { user: phone, pass: password }   // Alternative format
];
```

## 📋 Debug Steps

### 1. **Enable Debug Panel**
- Click "🔧 Show Debug" button (top-left)
- Check "API Debugger" checkbox
- ApiDebugger will appear in bottom-right

### 2. **Test Current Format**
- Enter phone: `0808080808`
- Enter password: `123123123`
- Click "Test Login"

### 3. **Test All Formats**
- Click "Test All" to try different formats
- Check console for detailed logs

### 4. **Health Check**
- Click "Health" to test backend connectivity

## 🔧 Manual Testing

### Using Browser Console:
```javascript
// Test different formats
import { debugApiCall } from './src/utils/debugApi';

// Test current format
await debugApiCall('/login', { phone: '0808080808', password: '123123123' });

// Test username format
await debugApiCall('/login', { username: '0808080808', password: '123123123' });

// Test email format
await debugApiCall('/login', { email: '0808080808', password: '123123123' });
```

## 📊 Expected Results

### ✅ **Success Response**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "0808080808",
    "email": "user@example.com",
    "role": "USER"
  }
}
```

### ❌ **Error Response**
```json
{
  "message": "Username or password invalid!",
  "status": 400
}
```

## 🎯 Next Steps

### 1. **If Username Format Works**
- Update all login calls to use `username` instead of `phone`
- Update documentation

### 2. **If Still Failing**
- Check backend API documentation
- Verify correct endpoint URL
- Check if backend expects different field names

### 3. **Alternative Solutions**
- Contact backend team for correct format
- Check backend logs for more details
- Test with Postman/curl

## 🔍 Debug Information

### API Configuration:
- **Base URL**: `https://exe201-be-uhno.onrender.com/api`
- **Login Endpoint**: `/login`
- **Full URL**: `https://exe201-be-uhno.onrender.com/api/login`

### Request Headers:
```javascript
{
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}
```

### Request Body (Current):
```json
{
  "username": "0808080808",
  "password": "123123123"
}
```

## 📝 Common Issues & Solutions

### 1. **CORS Errors**
- Backend needs to allow frontend domain
- Check CORS configuration

### 2. **Network Errors**
- Check internet connection
- Verify backend is running
- Check firewall settings

### 3. **Timeout Errors**
- Increase timeout in API_CONFIG
- Check backend performance

### 4. **Authentication Errors**
- Verify token format
- Check token expiration
- Validate JWT secret

## 🚀 Production Considerations

### 1. **Remove Debug Tools**
- Disable ApiDebugger in production
- Remove debug console logs
- Clean up test utilities

### 2. **Error Handling**
- Implement proper error messages
- Add retry mechanisms
- Log errors for monitoring

### 3. **Security**
- Validate input on frontend
- Sanitize user data
- Use HTTPS in production

## 📞 Support

If issues persist:
1. Check backend API documentation
2. Contact backend development team
3. Review backend logs
4. Test with external tools (Postman)

The debug tools should help identify the exact format the backend expects and resolve the login issue.
