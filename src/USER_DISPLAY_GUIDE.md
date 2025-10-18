# 👤 User Display in Header - Implementation Guide

## ✅ **Đã hoàn thành**

### **1. AuthContext.jsx - Cải thiện:**
- ✅ **Login function**: Lưu user data vào localStorage và context
- ✅ **Logout function**: Xóa user data khỏi localStorage và context  
- ✅ **fetchProfile**: Cập nhật localStorage với data mới từ server
- ✅ **useEffect**: Tự động load user từ localStorage khi app khởi chạy

### **2. Header.jsx - Hiển thị tên user:**
- ✅ **Desktop**: Hiển thị "Xin chào, {user.name}" hoặc "Welcome, {user.email}"
- ✅ **Mobile**: Hiển thị user info trong mobile menu
- ✅ **Avatar**: Icon User với background màu oldCopper-400
- ✅ **Styling**: Font-medium, màu #34140e

### **3. Login.jsx - Sửa conflict:**
- ✅ **Function naming**: Đổi `login` thành `loginUser` để tránh conflict
- ✅ **Context call**: Gọi `loginUser(userData, data.token)` sau khi login thành công

## 🎯 **Cách hoạt động**

### **Khi user đăng nhập:**
1. **Login form** → API call → Nhận response
2. **Extract user data** từ response (name, email, role, accountId...)
3. **Call AuthContext.login()** → Lưu vào localStorage + context
4. **Header tự động update** → Hiển thị tên user
5. **Redirect** → Chuyển đến dashboard

### **Khi app khởi chạy:**
1. **AuthContext useEffect** → Check localStorage
2. **Nếu có token + user** → Set user vào context
3. **Header hiển thị** → Tên user từ context
4. **Nếu không có** → Hiển thị nút Login

### **Khi user logout:**
1. **Call AuthContext.logout()** → Xóa localStorage + context
2. **Header tự động update** → Hiển thị nút Login

## 🖥️ **Hiển thị trong Header**

### **Desktop (khi đã login):**
```jsx
<div className="flex items-center space-x-3">
  <Button>Dashboard</Button>
  <div className="flex items-center space-x-2">
    <div className="w-8 h-8 bg-oldCopper-400 rounded-full">
      <User className="w-5 h-5 text-white" />
    </div>
    <span className="text-base font-medium">
      {user.name ? `Xin chào, ${user.name}` : `Welcome, ${user.email}`}
    </span>
  </div>
  <Button>Logout</Button>
</div>
```

### **Mobile (khi đã login):**
```jsx
<div className="space-y-3">
  <div className="flex items-center space-x-3">
    <div className="w-8 h-8 bg-oldCopper-400 rounded-full">
      <User className="w-5 h-5 text-white" />
    </div>
    <span className="text-sm font-medium">
      {user.name ? `Xin chào, ${user.name}` : `Welcome, ${user.email}`}
    </span>
  </div>
  <Button>Dashboard</Button>
  <Button>Logout</Button>
</div>
```

### **Khi chưa login:**
```jsx
<div className="flex items-center space-x-3">
  <Button onClick={handleLogin}>Login</Button>
  <Button onClick={handleRegister}>Register</Button>
</div>
```

## 🧪 **Cách test**

### **1. Test với user có name:**
```javascript
// Trong browser console
localStorage.setItem("user", JSON.stringify({
  name: "Nguyễn Văn A",
  email: "nguyenvana@example.com",
  role: "CUSTOMER",
  accountId: "12345"
}));
localStorage.setItem("authToken", "test-token");
// Refresh page → Header sẽ hiển thị "Xin chào, Nguyễn Văn A"
```

### **2. Test với user không có name:**
```javascript
// Trong browser console
localStorage.setItem("user", JSON.stringify({
  email: "test@example.com",
  role: "CUSTOMER",
  accountId: "12345"
}));
localStorage.setItem("authToken", "test-token");
// Refresh page → Header sẽ hiển thị "Welcome, test@example.com"
```

### **3. Test logout:**
```javascript
// Trong browser console
localStorage.removeItem("authToken");
localStorage.removeItem("user");
// Refresh page → Header sẽ hiển thị nút Login/Register
```

### **4. Sử dụng utility test:**
```javascript
// Import utility
import { testUserData, simulateLogin, clearUserData } from './utils/userTest';

// Test current data
testUserData();

// Simulate login
simulateLogin();

// Clear data
clearUserData();
```

## 📱 **Responsive Behavior**

### **Desktop (md+):**
- User info hiển thị inline với Dashboard và Logout buttons
- Avatar + text trên cùng một dòng
- Font size: text-base

### **Mobile (< md):**
- User info hiển thị trong mobile menu
- Avatar + text trên cùng một dòng
- Font size: text-sm
- Buttons stack vertically

## 🎨 **Styling Details**

### **Colors:**
- **Text**: #34140e (oldCopper-1600)
- **Avatar background**: oldCopper-400 (#eda274)
- **Avatar icon**: white
- **Hover effects**: #c47256 (oldCopper-hover)

### **Typography:**
- **Font**: Inter, sans-serif (default)
- **Weight**: font-medium
- **Size**: text-base (desktop), text-sm (mobile)

### **Layout:**
- **Spacing**: space-x-2, space-x-3
- **Avatar size**: w-8 h-8
- **Icon size**: w-5 h-5

## 🔧 **Technical Implementation**

### **State Management:**
```javascript
// AuthContext
const [user, setUser] = useState(null);

// Login
const login = (userData, token) => {
  localStorage.setItem("authToken", token);
  localStorage.setItem("user", JSON.stringify(userData));
  setUser(userData);
};

// Logout
const logout = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("user");
  setUser(null);
};
```

### **Header Logic:**
```javascript
// Import context
const { user, logout } = useAuth();

// Conditional rendering
{user ? (
  // Show user info + logout
  <div>
    <span>{user.name ? `Xin chào, ${user.name}` : `Welcome, ${user.email}`}</span>
    <Button onClick={logout}>Logout</Button>
  </div>
) : (
  // Show login/register
  <div>
    <Button onClick={handleLogin}>Login</Button>
    <Button onClick={handleRegister}>Register</Button>
  </div>
)}
```

## ✅ **Checklist hoàn thành**

- ✅ AuthContext lưu user data vào localStorage
- ✅ Header hiển thị tên user khi đã login
- ✅ Header hiển thị nút Login khi chưa login
- ✅ Mobile menu cũng hiển thị user info
- ✅ Logout xóa user data và update header
- ✅ Responsive design cho desktop và mobile
- ✅ Styling phù hợp với theme hiện có
- ✅ Không ảnh hưởng logic navigation khác
- ✅ Sử dụng lại file có sẵn, không tạo file mới

## 🚀 **Kết quả**

Khi user đăng nhập thành công → Tên user hiển thị ở góc phải header với format "Xin chào, {user.name}" hoặc "Welcome, {user.email}".

Khi user logout → Header trở lại trạng thái mặc định với nút Login/Register.
