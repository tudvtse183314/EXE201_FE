# 🔍 Login Flow Debug Guide

## 🚨 **Vấn đề đã phát hiện và sửa:**

### **1. API Endpoint không đúng:**
- ❌ **Trước**: `/auth/profile`
- ✅ **Sau**: `/account` (theo API thực tế)

### **2. UserData mapping không đúng:**
- ❌ **Trước**: `fullName: data.fullName`
- ✅ **Sau**: `name: data.fullName || data.name` (fallback)

### **3. Missing accountId:**
- ❌ **Trước**: Không có `accountId`
- ✅ **Sau**: `accountId: data.accountId || data.id`

### **4. useEffect dependency warning:**
- ❌ **Trước**: Missing dependency warning
- ✅ **Sau**: Added eslint-disable comment

## 🔧 **Cách debug login flow:**

### **1. Sử dụng debug utility:**
```javascript
// Import debug utility
import { debugLoginFlow, testLogin, clearLoginData, checkAuthStatus } from './utils/loginDebug';

// Debug current state
debugLoginFlow();

// Test với mock data
testLogin();

// Check auth status
checkAuthStatus();

// Clear data
clearLoginData();
```

### **2. Check browser console:**
```javascript
// Trong browser console
localStorage.getItem("authToken");
localStorage.getItem("user");

// Check user data
JSON.parse(localStorage.getItem("user"));
```

### **3. Check network requests:**
- Mở DevTools → Network tab
- Thử login
- Check request/response cho `/login` endpoint

## 🎯 **Login Flow Steps:**

### **1. User nhập thông tin:**
```javascript
// Form data
{
  phone: "0123456789",
  password: "password123"
}
```

### **2. API call:**
```javascript
// POST /login
const data = await login(formData.phone, formData.password);
```

### **3. Process response:**
```javascript
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
```

### **4. Save to context:**
```javascript
loginUser(userData, data.token);
```

### **5. Redirect:**
```javascript
const redirectPath = userData.role === 'ADMIN' ? '/admin/dashboard' :
                    userData.role === 'STAFF' ? '/staff/dashboard' :
                    '/customer/dashboard';
navigate(redirectPath, { replace: true });
```

## 🐛 **Common Issues:**

### **1. API Response Format:**
```javascript
// Expected response format
{
  id: "12345",
  fullName: "John Doe", // hoặc name: "John Doe"
  email: "john@example.com",
  phone: "0123456789",
  role: "CUSTOMER",
  accountId: "12345", // hoặc sử dụng id
  token: "jwt-token-here",
  petName: "Buddy",
  petAge: 3,
  petType: "Dog",
  petSize: "Medium"
}
```

### **2. LocalStorage Keys:**
```javascript
// Correct keys
localStorage.setItem("authToken", token);
localStorage.setItem("user", JSON.stringify(userData));
```

### **3. AuthContext State:**
```javascript
// Check context state
const { user, isAuthenticated, isLoading } = useAuth();
console.log('User:', user);
console.log('Is Authenticated:', isAuthenticated());
console.log('Is Loading:', isLoading);
```

## 🧪 **Test Cases:**

### **1. Test với mock data:**
```javascript
import { testLogin } from './utils/loginDebug';

// Test login
testLogin();

// Check result
debugLoginFlow();
```

### **2. Test với real API:**
```javascript
// Sử dụng form thật
// Check network tab
// Check console logs
```

### **3. Test error handling:**
```javascript
// Test với wrong credentials
// Test với network error
// Test với invalid response
```

## 🔍 **Debug Checklist:**

- [ ] Check API endpoint URL
- [ ] Check request/response format
- [ ] Check localStorage data
- [ ] Check AuthContext state
- [ ] Check user data mapping
- [ ] Check redirect logic
- [ ] Check error handling
- [ ] Check loading states

## 🚀 **Quick Fix Commands:**

### **Clear và test lại:**
```javascript
// Clear data
localStorage.clear();

// Test login
import { testLogin } from './utils/loginDebug';
testLogin();

// Check result
import { debugLoginFlow } from './utils/loginDebug';
debugLoginFlow();
```

### **Check current state:**
```javascript
// Check auth status
import { checkAuthStatus } from './utils/loginDebug';
checkAuthStatus();
```

## 📋 **Files đã sửa:**

- ✅ **src/api/auth.js**: Fixed getProfile endpoint
- ✅ **src/pages/public/Login.jsx**: Fixed userData mapping
- ✅ **src/context/AuthContext.jsx**: Fixed useEffect dependency
- ✅ **src/utils/loginDebug.js**: Added debug utilities
- ✅ **src/LOGIN_DEBUG_GUIDE.md**: This guide

## 🎯 **Next Steps:**

1. **Test login flow** với real credentials
2. **Check console logs** cho errors
3. **Check network requests** trong DevTools
4. **Use debug utilities** để troubleshoot
5. **Check localStorage** data
6. **Verify redirect** logic

Login flow đã được sửa và sẵn sàng test! 🎉
