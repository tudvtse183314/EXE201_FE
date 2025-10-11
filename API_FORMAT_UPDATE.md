# API Format Update - Backend Specification

## ✅ Fixed API Formats

Dựa trên backend specification, tôi đã cập nhật tất cả API calls để sử dụng format đúng.

### 🔐 **Login API** (`/api/login`)

#### **Backend Expects:**
```json
{
  "phone": "string",
  "password": "string"
}
```

#### **Updated Code:**
```javascript
// src/api/authApi.js
export const authApi = {
  login: async (phone, password) => {
    const loginData = { 
      phone: phone,        // ✅ Correct format
      password: password 
    };
    
    const response = await axiosInstance.post(API_CONFIG.ENDPOINTS.LOGIN, loginData);
    return response.data;
  }
};
```

### 📝 **Register API** (`/api/register`)

#### **Backend Expects:**
```json
{
  "fullName": "string",
  "email": "string", 
  "phone": "840984058484070909840884840807840984098423915244",
  "password": "string",
  "role": "CUSTOMER",
  "petName": "string",
  "petAge": "string",
  "petType": "string",
  "petSize": "string"
}
```

#### **Updated Code:**
```javascript
// src/api/authApi.js
export const authApi = {
  register: async (userData) => {
    const registerData = {
      fullName: userData.fullName,
      email: userData.email,
      phone: userData.phone,
      password: userData.password,
      role: userData.role || 'CUSTOMER',
      petName: userData.petName,
      petAge: userData.petAge,
      petType: userData.petType,
      petSize: userData.petSize
    };
    
    const response = await axiosInstance.post(API_CONFIG.ENDPOINTS.REGISTER, registerData);
    return response.data;
  }
};
```

## 🛠️ **Updated Debug Tools**

### **1. ApiDebugger Component**
- **Test Phone** button: Tests với `{ phone, password }` format
- **Test Register** button: Tests register API với correct format
- **Test All** button: Tests multiple formats (phone format first)
- **Test Creds** button: Tests multiple credentials với phone format

### **2. Debug Utilities**
- **`debugApi.js`**: Updated để test phone format first
- **`testCredentials.js`**: Updated tất cả credentials để sử dụng phone format
- **`backendDiscovery.js`**: Updated để test với phone format
- **`testRegister.js`**: New utility để test register API

## 🧪 **Testing Instructions**

### **Step 1: Test Login**
1. Enable Debug Panel: Click "🔧 Show Debug" → Check "API Debugger"
2. Enter credentials: `0808080808` / `123123123`
3. Click "Test Phone" button
4. Check console logs cho detailed information

### **Step 2: Test Register**
1. Click "Test Register" button
2. Check console logs cho register API response
3. Verify register format is correct

### **Step 3: Test All Formats**
1. Click "Test All" button
2. Should show phone format works first
3. Other formats may fail (expected)

## 📊 **Expected Results**

### **✅ Login Success**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "phone": "0808080808",
    "email": "user@example.com",
    "role": "USER"
  }
}
```

### **✅ Register Success**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "fullName": "Test User",
    "email": "test@example.com",
    "phone": "0808080808",
    "role": "CUSTOMER"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## 🔍 **Debug Information**

### **API Configuration**
- **Base URL**: `https://exe201-be-uhno.onrender.com/api`
- **Login Endpoint**: `/login`
- **Register Endpoint**: `/register`

### **Request Headers**
```javascript
{
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}
```

### **Login Request Body**
```json
{
  "phone": "0808080808",
  "password": "123123123"
}
```

### **Register Request Body**
```json
{
  "fullName": "Test User",
  "email": "test@example.com",
  "phone": "0808080808",
  "password": "123123123",
  "role": "CUSTOMER",
  "petName": "Buddy",
  "petAge": "2 years",
  "petType": "dog",
  "petSize": "medium"
}
```

## 🎯 **Key Changes Made**

### **1. Login API**
- **Before**: `{ username: phone, password }`
- **After**: `{ phone: phone, password }` ✅

### **2. Register API**
- **Before**: Generic userData object
- **After**: Structured format với all required fields ✅

### **3. Debug Tools**
- **Before**: Testing username format first
- **After**: Testing phone format first ✅

### **4. Test Credentials**
- **Before**: Using username field
- **After**: Using phone field ✅

## 🚀 **Next Steps**

### **1. Test Login**
- Try login với credentials `0808080808` / `123123123`
- Should work với phone format

### **2. Test Register**
- Try register với complete user data
- Should work với structured format

### **3. Verify Frontend**
- Check if login form works correctly
- Check if register form works correctly

### **4. Clean Up**
- Remove debug tools khi everything works
- Update documentation

## 📝 **Files Updated**

1. **`src/api/authApi.js`** - Updated login và register formats
2. **`src/utils/debugApi.js`** - Updated test formats
3. **`src/utils/testCredentials.js`** - Updated credential formats
4. **`src/utils/backendDiscovery.js`** - Updated discovery formats
5. **`src/utils/testRegister.js`** - New register testing utility
6. **`src/components/debug/ApiDebugger.jsx`** - Updated UI và functions

## 🎉 **Benefits**

- **Correct API Format**: Matches backend specification exactly
- **Better Debug Tools**: Test với correct formats
- **Comprehensive Testing**: Login và register testing
- **Easy Troubleshooting**: Clear error messages và logging
- **Production Ready**: Clean code structure

Bây giờ login và register should work correctly với backend! Sử dụng debug tools để verify và troubleshoot nếu cần.
