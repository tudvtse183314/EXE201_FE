# Debug Tools Usage Guide

## 🔍 Enhanced API Debugger

Tôi đã cập nhật API Debugger với nhiều tính năng mới để debug login issue.

### 🛠️ Available Debug Tools

#### **1. Test Username** (Blue Button)
- Tests với format `{ username: phone, password }`
- Đây là format mà backend có thể expect

#### **2. Test All** (Green Button)
- Tests tất cả các format khác nhau:
  - `{ username: phone, password }`
  - `{ phone, password }`
  - `{ email: phone, password }`
  - `{ phoneNumber: phone, password }`
  - `{ user: phone, pass: password }`
  - `{ login: phone, password }`
  - `{ identifier: phone, password }`

#### **3. Test Creds** (Purple Button)
- Tests multiple credentials combinations
- Includes common test credentials:
  - `admin/admin123`
  - `test/test123`
  - `user/user123`
  - `demo/demo123`
  - `0808080808/123123123`

#### **4. Health** (Gray Button)
- Tests backend connectivity
- Checks if backend is responding

#### **5. 🔍 Discover Backend** (Orange Button)
- **NEW**: Comprehensive backend discovery
- Tests multiple endpoints:
  - `/login`, `/auth/login`, `/user/login`, `/api/login`
  - `/authenticate`, `/signin`
- Tests health endpoints:
  - `/health`, `/status`, `/ping`
- Tests different data formats
- Provides detailed analysis

## 🚀 How to Use

### **Step 1: Enable Debug Panel**
1. Click "🔧 Show Debug" button (top-left corner)
2. Check "API Debugger" checkbox
3. ApiDebugger sẽ xuất hiện ở bottom-right

### **Step 2: Test Current Issue**
1. Enter phone: `0808080808`
2. Enter password: `123123123`
3. Click "Test Username" để test format mới
4. Check console logs cho detailed information

### **Step 3: Comprehensive Testing**
1. Click "🔍 Discover Backend" để run full discovery
2. Check console logs cho detailed results
3. Look for successful endpoints và formats

### **Step 4: Test Different Credentials**
1. Click "Test Creds" để test multiple credentials
2. Check if any credentials work
3. Use working credentials để test further

## 📊 Expected Results

### **✅ Success Response**
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

### **❌ Current Error**
```json
{
  "message": "Username or password invalid!",
  "status": 400
}
```

## 🔍 Debug Information

### **Current API Configuration**
- **Base URL**: `https://exe201-be-uhno.onrender.com/api`
- **Login Endpoint**: `/login`
- **Full URL**: `https://exe201-be-uhno.onrender.com/api/login`

### **Request Format (Updated)**
```json
{
  "username": "0808080808",
  "password": "123123123"
}
```

## 🧪 Testing Scenarios

### **Scenario 1: Format Issue**
- **Problem**: Backend expects different field names
- **Solution**: Use "Test All" to find working format
- **Expected**: One of the formats should work

### **Scenario 2: Credentials Issue**
- **Problem**: Test credentials are invalid
- **Solution**: Use "Test Creds" to find working credentials
- **Expected**: Some credentials should work

### **Scenario 3: Endpoint Issue**
- **Problem**: Wrong endpoint URL
- **Solution**: Use "🔍 Discover Backend" to find correct endpoints
- **Expected**: Different endpoint should work

### **Scenario 4: Backend Down**
- **Problem**: Backend is not responding
- **Solution**: Use "Health" to check connectivity
- **Expected**: Health check should fail

## 📝 Console Logs

### **Debug API Call Logs**
```
🔍 Debug API Call:
URL: https://exe201-be-uhno.onrender.com/api/login
Data: {username: '0808080808', password: '123123123'}
Headers: {Content-Type: 'application/json', Accept: 'application/json'}
```

### **Backend Discovery Logs**
```
🔍 Starting backend discovery...
🧪 Testing login endpoints...
Testing endpoint: /login
✅ /login - Status: 200
🧪 Testing different data formats...
✅ /login with {"username":"0808080808","password":"123123123"} - SUCCESS!
```

## 🎯 Troubleshooting Steps

### **1. If "Test Username" Fails**
- Click "Test All" to try different formats
- Check console for detailed error messages
- Look for patterns in error responses

### **2. If All Formats Fail**
- Click "Test Creds" to try different credentials
- Check if backend is expecting different user data
- Verify backend is running and accessible

### **3. If Credentials Fail**
- Click "🔍 Discover Backend" to find correct endpoints
- Check if backend has different API structure
- Look for successful endpoints in discovery results

### **4. If Backend Discovery Fails**
- Check network connectivity
- Verify backend URL is correct
- Check if backend is running
- Look for CORS issues

## 🔧 Advanced Debugging

### **Manual Console Testing**
```javascript
// Test specific format
import { debugApiCall } from './src/utils/debugApi';
await debugApiCall('/login', { username: '0808080808', password: '123123123' });

// Test backend discovery
import { discoverBackend } from './src/utils/backendDiscovery';
await discoverBackend();

// Test multiple credentials
import { testMultipleCredentials } from './src/utils/testCredentials';
await testMultipleCredentials(debugApiCall);
```

### **Network Tab Analysis**
1. Open browser DevTools
2. Go to Network tab
3. Run debug tests
4. Check request/response details
5. Look for status codes và error messages

## 📞 Next Steps

### **If Login Still Fails**
1. **Check Backend Documentation**: Verify correct API format
2. **Contact Backend Team**: Ask for correct endpoint và format
3. **Check Backend Logs**: Look for detailed error information
4. **Test with Postman**: Verify backend works with external tools

### **If Login Works**
1. **Update Frontend**: Use working format consistently
2. **Update Documentation**: Document correct API format
3. **Remove Debug Tools**: Clean up for production
4. **Test All Features**: Ensure other API calls work

## 🎉 Benefits

- **Comprehensive Testing**: Multiple formats và credentials
- **Backend Discovery**: Find correct endpoints automatically
- **Detailed Logging**: Clear error messages và debugging info
- **Easy to Use**: Simple UI với clear buttons
- **Development Friendly**: Only shows in development mode

Sử dụng các debug tools này để identify exact issue và find working solution cho login problem!
