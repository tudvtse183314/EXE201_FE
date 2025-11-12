# 🏗️ Customer Architecture & Flow Documentation

## 📋 Mục lục
1. [Tổng quan kiến trúc](#tổng-quan-kiến-trúc)
2. [Cấu trúc Frontend](#cấu-trúc-frontend)
3. [Cấu trúc Backend](#cấu-trúc-backend)
4. [Customer Flow chi tiết](#customer-flow-chi-tiết)
5. [Cách thức gọi API](#cách-thức-gọi-api)
6. [Authentication & Authorization](#authentication--authorization)
7. [State Management](#state-management)
8. [Error Handling](#error-handling)

---

## 🎯 Tổng quan kiến trúc

### Kiến trúc tổng thể
```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Pages      │  │  Components   │  │   Context    │     │
│  │              │  │               │  │              │     │
│  │ - Shop       │  │ - ProductCard │  │ - AuthContext│     │
│  │ - Cart       │  │ - Modal       │  │ - CartContext│     │
│  │ - Checkout   │  │ - Header      │  │ - Toast     │     │
│  │ - Orders     │  │               │  │              │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│         │                 │                 │               │
│         └─────────────────┴─────────────────┘               │
│                            │                                 │
│                   ┌────────▼────────┐                        │
│                   │   Services Layer │                        │
│                   │  - products.js   │                        │
│                   │  - orders.js     │                        │
│                   │  - cart.js       │                        │
│                   └────────┬────────┘                        │
│                            │                                 │
│                   ┌────────▼────────┐                        │
│                   │  API Layer      │                        │
│                   │  - axios.js     │                        │
│                   │  (Interceptors)  │                        │
│                   └────────┬────────┘                        │
└────────────────────────────┼─────────────────────────────────┘
                             │
                    HTTP/REST │
                             │
┌────────────────────────────▼─────────────────────────────────┐
│                    BACKEND (Spring Boot)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   API Layer  │  │ Service Layer│  │ Repository    │     │
│  │              │  │               │  │              │     │
│  │ - OrderAPI   │  │ - OrderService│  │ - OrderRepo  │     │
│  │ - ProductAPI│  │ - CartService │  │ - ProductRepo │     │
│  │ - CartAPI    │  │               │  │              │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│         │                 │                 │               │
│         └─────────────────┴─────────────────┘               │
│                            │                                 │
│                   ┌────────▼────────┐                        │
│                   │   Database       │                        │
│                   │   (MySQL)        │                        │
│                   └──────────────────┘                        │
└───────────────────────────────────────────────────────────────┘
```

---

## 📁 Cấu trúc Frontend

### 1. **Pages** (`src/pages/`)
```
pages/
├── public/              # Public pages (không cần auth)
│   ├── Shop.jsx         # Trang sản phẩm
│   ├── Cart.jsx         # Giỏ hàng
│   ├── Checkout.jsx     # Thanh toán
│   ├── Login.jsx        # Đăng nhập
│   └── Register.jsx     # Đăng ký
│
└── customer/            # Customer pages (cần auth + role CUSTOMER)
    ├── Orders.jsx       # Danh sách đơn hàng
    ├── OrderDetail.jsx  # Chi tiết đơn hàng
    ├── Profile.jsx      # Thông tin cá nhân
    └── PetProfilePage.jsx # Quản lý thú cưng
```

### 2. **Components** (`src/components/`)
```
components/
├── common/
│   ├── ProductCard.jsx        # Card sản phẩm
│   ├── ProductDetailModal.jsx # Modal chi tiết sản phẩm
│   └── NavigationMenu.jsx     # Menu điều hướng
│
└── layout/
    ├── Header.jsx             # Header chung
    ├── CustomerHeader.jsx      # Header cho customer
    └── Footer.jsx             # Footer
```

### 3. **Context** (`src/context/`)
```
context/
├── AuthContext.jsx      # Quản lý authentication
├── CartContext.jsx       # Quản lý giỏ hàng
├── WishlistContext.jsx   # Quản lý wishlist
├── ToastContext.jsx      # Quản lý thông báo
└── LoadingContext.jsx    # Quản lý loading state
```

### 4. **Services** (`src/services/`)
```
services/
├── products.js    # API calls cho products
├── orders.js      # API calls cho orders
├── cart.js        # API calls cho cart
├── auth.js        # API calls cho authentication
└── petProfiles.js # API calls cho pet profiles
```

### 5. **API Layer** (`src/api/`)
```
api/
├── axios.js       # Axios instance với interceptors
├── products.js    # Product API endpoints
├── orders.js      # Order API endpoints
└── auth.js        # Auth API endpoints
```

### 6. **Routes** (`src/routes/`)
```
routes/
├── AppRoutes.jsx  # Định nghĩa tất cả routes
└── RoleGuard.jsx  # Bảo vệ routes theo role
```

---

## 🏛️ Cấu trúc Backend

### 1. **API Controllers** (`api/`)
```
api/
├── OrderAPI.java       # REST endpoints cho orders
├── ProductAPI.java     # REST endpoints cho products
├── CartAPI.java        # REST endpoints cho cart
├── AuthenticationAPI.java # REST endpoints cho auth
└── PetProfileAPI.java  # REST endpoints cho pet profiles
```

### 2. **Service Layer** (`service/`)
```
service/
├── OrderService.java       # Business logic cho orders
├── ProductService.java     # Business logic cho products
├── CartService.java        # Business logic cho cart
├── AuthenticationService.java # Business logic cho auth
└── QRPaymentService.java   # Tạo QR code thanh toán
```

### 3. **Repository Layer** (`repository/`)
```
repository/
├── OrderRepository.java     # Database operations cho orders
├── ProductRepository.java   # Database operations cho products
├── CartRepository.java      # Database operations cho cart
└── AccountRepository.java   # Database operations cho accounts
```

### 4. **Entities** (`entity/`)
```
entity/
├── Order.java          # Order entity
├── OrderDetails.java   # Order item entity
├── Product.java        # Product entity
├── Cart.java           # Cart entity
└── Account.java        # Account entity
```

### 5. **Configuration** (`config/`)
```
config/
├── SecurityConfig.java  # Security & CORS config
├── Filter.java         # JWT authentication filter
└── ObjectMapperConfig.java # JSON mapping config
```

---

## 🔄 Customer Flow chi tiết

### Flow 1: Xem sản phẩm và thêm vào giỏ hàng

```
┌─────────────┐
│   User      │
│  (Browser)  │
└──────┬──────┘
       │
       │ 1. Truy cập /shop
       ▼
┌─────────────────────────────────────┐
│         Shop.jsx                    │
│  - useEffect() gọi getAllProducts() │
└──────┬──────────────────────────────┘
       │
       │ 2. Gọi API
       ▼
┌─────────────────────────────────────┐
│    services/products.js              │
│    getAllProducts()                  │
└──────┬──────────────────────────────┘
       │
       │ 3. HTTP GET
       ▼
┌─────────────────────────────────────┐
│    api/axios.js                      │
│    - Request interceptor:            │
│      + Bearer token                  │
│      + Loading state                 │
└──────┬───────────────────────────────┘
       │
       │ 4. HTTP Request
       ▼
┌─────────────────────────────────────┐
│    Backend: ProductAPI.java         │
│    GET /api/products/getAll         │
└──────┬──────────────────────────────┘
       │
       │ 5. Service Layer
       ▼
┌─────────────────────────────────────┐
│    ProductService.java              │
│    - Query database                  │
└──────┬───────────────────────────────┘
       │
       │ 6. Response
       ▼
┌─────────────────────────────────────┐
│    Frontend nhận data               │
│    - Hiển thị products              │
│    - User click vào product         │
└──────┬───────────────────────────────┘
       │
       │ 7. Click product
       ▼
┌─────────────────────────────────────┐
│    ProductDetailModal.jsx            │
│    - Mở modal                       │
│    - Gọi getProductById(id)          │
└──────┬───────────────────────────────┘
       │
       │ 8. User click "Thêm vào giỏ"
       ▼
┌─────────────────────────────────────┐
│    CartContext.jsx                  │
│    addToCart(productId, quantity)   │
│    - Gọi addCartItem()               │
└──────┬───────────────────────────────┘
       │
       │ 9. API Call
       ▼
┌─────────────────────────────────────┐
│    services/cart.js                  │
│    addCartItem(productId, qty)      │
│    POST /api/carts                   │
└──────┬───────────────────────────────┘
       │
       │ 10. Backend
       ▼
┌─────────────────────────────────────┐
│    CartAPI.java                      │
│    POST /api/carts                   │
│    - Validate JWT token              │
│    - Lấy userId từ token             │
│    - Tạo cart item                   │
└──────┬───────────────────────────────┘
       │
       │ 11. Response
       ▼
┌─────────────────────────────────────┐
│    CartContext.jsx                  │
│    - Cập nhật cartItems state       │
│    - Hiển thị toast success         │
└─────────────────────────────────────┘
```

### Flow 2: Thanh toán (Checkout)

```
┌─────────────┐
│   User      │
│  (Browser)  │
└──────┬──────┘
       │
       │ 1. Truy cập /customer/checkout
       ▼
┌─────────────────────────────────────┐
│         Checkout.jsx                │
│  - Load cart từ CartContext         │
│  - Hiển thị form thông tin          │
└──────┬──────────────────────────────┘
       │
       │ 2. User điền form và submit
       ▼
┌─────────────────────────────────────┐
│    handleSubmit()                   │
│    - Validate form                  │
│    - Build order payload            │
│    - Gọi createOrder()              │
└──────┬───────────────────────────────┘
       │
       │ 3. API Call
       ▼
┌─────────────────────────────────────┐
│    services/orders.js                │
│    createOrder(payload)              │
│    POST /api/orders                  │
└──────┬───────────────────────────────┘
       │
       │ 4. Backend
       ▼
┌─────────────────────────────────────┐
│    OrderAPI.java                     │
│    POST /api/orders                  │
│    - Validate request                │
│    - Gọi OrderService.createOrder()  │
└──────┬───────────────────────────────┘
       │
       │ 5. Service Layer
       ▼
┌─────────────────────────────────────┐
│    OrderService.java                │
│    createOrder(request)              │
│    - Validate account                │
│    - Validate products & stock      │
│    - Tính total amount               │
│    - Tạo Order entity                │
│    - Lưu vào database                │
└──────┬───────────────────────────────┘
       │
       │ 6. Generate QR Code
       ▼
┌─────────────────────────────────────┐
│    QRPaymentService.java            │
│    generatePaymentInfo()             │
│    - Tạo QR code URL (VietQR)       │
│    - Trả về paymentInfo             │
└──────┬───────────────────────────────┘
       │
       │ 7. Response
       ▼
┌─────────────────────────────────────┐
│    OrderResponse                    │
│    {                                │
│      orderId,                       │
│      totalAmount,                   │
│      status: "PENDING",              │
│      paymentInfo: {                 │
│        qrCodeUrl: "...",            │
│        status: "PENDING"             │
│      }                              │
│    }                                │
└──────┬───────────────────────────────┘
       │
       │ 8. Frontend nhận response
       ▼
┌─────────────────────────────────────┐
│    Checkout.jsx                     │
│    - setOrder(response)              │
│    - Hiển thị QR code                │
│    - Bắt đầu polling                 │
│    - setPolling(true)                │
└──────┬───────────────────────────────┘
       │
       │ 9. Polling (mỗi 5 giây)
       ▼
┌─────────────────────────────────────┐
│    useEffect polling                │
│    - Gọi getOrderById(orderId)      │
│    - Kiểm tra paymentStatus          │
│    - Nếu COMPLETED → clearCart()     │
└─────────────────────────────────────┘
```

### Flow 3: Xác nhận thanh toán

```
┌─────────────┐
│   User      │
│  (Browser)  │
└──────┬──────┘
       │
       │ 1. User quét QR và chuyển khoản
       │    Click "Tôi đã chuyển khoản"
       ▼
┌─────────────────────────────────────┐
│    Checkout.jsx                     │
│    handleConfirmPayment()            │
│    - Gọi confirmPayment(orderId)     │
└──────┬───────────────────────────────┘
       │
       │ 2. API Call
       ▼
┌─────────────────────────────────────┐
│    services/orders.js                │
│    confirmPayment(orderId)            │
│    POST /api/orders/{id}/confirm-    │
│         payment                      │
└──────┬───────────────────────────────┘
       │
       │ 3. Backend
       ▼
┌─────────────────────────────────────┐
│    OrderAPI.java                     │
│    confirmPayment(orderId)           │
│    - Validate order status           │
│    - Update payment status            │
│    - Update order status → PAID      │
└──────┬───────────────────────────────┘
       │
       │ 4. Response
       ▼
┌─────────────────────────────────────┐
│    Checkout.jsx                     │
│    - setOrder(updatedOrder)          │
│    - setPolling(false)               │
│    - clearCart()                     │
│    - Hiển thị "Thanh toán thành công"│
└─────────────────────────────────────┘
```

---

## 🔌 Cách thức gọi API

### 1. **Axios Instance Setup** (`api/axios.js`)

```javascript
// Tạo axios instance với baseURL
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "https://exe201-be-uhno.onrender.com/api",
  timeout: 60000,
  withCredentials: false,
});
```

### 2. **Request Interceptor**

```javascript
// Tự động gắn Bearer token vào mọi request
axiosInstance.interceptors.request.use(
  (config) => {
    onReqStart(); // Bật loading
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    onReqEnd(); // Tắt loading
    return Promise.reject(error);
  }
);
```

### 3. **Response Interceptor**

```javascript
// Xử lý lỗi 401, 403 tự động
axiosInstance.interceptors.response.use(
  (res) => {
    onReqEnd(); // Tắt loading
    return res;
  },
  (error) => {
    onReqEnd();
    
    // 401: Token hết hạn → Logout + Redirect login
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      navigate("/login");
    }
    
    // 403: Không có quyền → Toast error
    if (error.response?.status === 403) {
      toast.error("Bạn không có quyền truy cập");
    }
    
    return Promise.reject(error);
  }
);
```

### 4. **Service Layer Pattern**

```javascript
// services/orders.js
export const createOrder = async (orderData) => {
  try {
    console.log("📦 Orders: Creating order", orderData);
    
    // Gọi API qua axios instance
    const res = await axiosInstance.post("/orders", orderData);
    
    // Unwrap response (axios tự động unwrap res.data)
    console.log("📦 Orders: Created successfully", res.data);
    return res.data; // Trả về data trực tiếp
  } catch (e) {
    console.error("📦 Orders: Error creating order:", e);
    throw e; // Throw để component xử lý
  }
};
```

### 5. **Component sử dụng Service**

```javascript
// pages/public/Checkout.jsx
import { createOrder } from '../services/orders';

const handleSubmit = async (values) => {
  try {
    setSubmitting(true);
    
    // Build payload
    const payload = {
      accountId: user.accountId,
      shippingAddress: values.address,
      phoneContact: values.phone,
      note: values.note,
      items: cartItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      }))
    };
    
    // Gọi service
    const response = await createOrder(payload);
    
    // Xử lý response
    setOrder(response);
    showSuccess('Đặt hàng thành công');
  } catch (error) {
    // Xử lý lỗi
    showError(error.message);
  } finally {
    setSubmitting(false);
  }
};
```

### 6. **API Endpoints Mapping**

| Frontend Service | HTTP Method | Backend Endpoint | Controller |
|-----------------|------------|-----------------|------------|
| `getAllProducts()` | GET | `/api/products/getAll` | `ProductAPI.getAllProducts()` |
| `getProductById(id)` | GET | `/api/products/getProductId/{id}` | `ProductAPI.getProductById()` |
| `getMyCart()` | GET | `/api/carts/user/{userId}` | `CartAPI.getCartByUserId()` |
| `addCartItem()` | POST | `/api/carts` | `CartAPI.createCartItem()` |
| `createOrder()` | POST | `/api/orders` | `OrderAPI.createOrder()` |
| `getOrderById(id)` | GET | `/api/orders/{id}` | `OrderAPI.getOrderById()` |
| `confirmPayment(id)` | POST | `/api/orders/{id}/confirm-payment` | `OrderAPI.confirmPayment()` |
| `getOrdersByAccount(id)` | GET | `/api/orders/account/{id}` | `OrderAPI.getOrdersByAccountId()` |

---

## 🔐 Authentication & Authorization

### 1. **Authentication Flow**

```
┌─────────────┐
│   Login.jsx  │
└──────┬───────┘
       │
       │ 1. User nhập phone/password
       │    Click "Đăng nhập"
       ▼
┌─────────────────────────────────────┐
│    services/auth.js                 │
│    login(phone, password)            │
│    POST /api/login                   │
└──────┬───────────────────────────────┘
       │
       │ 2. Backend validate
       ▼
┌─────────────────────────────────────┐
│    AuthenticationAPI.java           │
│    - Validate credentials            │
│    - Generate JWT token              │
│    - Trả về {token, user}            │
└──────┬───────────────────────────────┘
       │
       │ 3. Frontend nhận response
       ▼
┌─────────────────────────────────────┐
│    Login.jsx                        │
│    - Lưu token vào localStorage      │
│    - Lưu user vào localStorage       │
│    - Gọi AuthContext.login()         │
└──────┬───────────────────────────────┘
       │
       │ 4. Update AuthContext
       ▼
┌─────────────────────────────────────┐
│    AuthContext.jsx                  │
│    - setUser(userData)               │
│    - localStorage.setItem("token")   │
└──────┬───────────────────────────────┘
       │
       │ 5. Redirect
       ▼
┌─────────────────────────────────────┐
│    Navigate theo role:              │
│    - CUSTOMER → /customer/my-pets    │
│    - ADMIN → /admin/dashboard        │
│    - STAFF → /staff/dashboard        │
└─────────────────────────────────────┘
```

### 2. **Authorization (Role-Based)**

```javascript
// routes/RoleGuard.jsx
export default function RoleGuard({ roles = [], children }) {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  const userRole = (user.role || "").toUpperCase();
  const requiredRoles = roles.map(r => r.toUpperCase());
  
  if (roles.length > 0 && !requiredRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" />;
  }
  
  return children;
}
```

### 3. **Protected Routes**

```javascript
// routes/AppRoutes.jsx
<Route
  path="/customer/checkout"
  element={
    <RoleGuard roles={[ROLES.CUSTOMER]}>
      <MainLayout>
        <Checkout />
      </MainLayout>
    </RoleGuard>
  }
/>
```

### 4. **Backend Security**

```java
// config/SecurityConfig.java
@Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) {
  return http
    .csrf(AbstractHttpConfigurer::disable)
    .cors().and()
    .authorizeHttpRequests(
      req -> req
        .requestMatchers("/**")
        .permitAll()
        .anyRequest()
        .authenticated()
    )
    .addFilterBefore(filter, UsernamePasswordAuthenticationFilter.class)
    .build();
}
```

```java
// config/Filter.java
// JWT Authentication Filter
// - Extract token từ Authorization header
// - Validate token
// - Set authentication vào SecurityContext
```

---

## 📦 State Management

### 1. **Context API Pattern**

```javascript
// context/CartContext.jsx
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const addToCart = async (productId, quantity) => {
    try {
      setLoading(true);
      const response = await addCartItem(productId, quantity);
      // Update state
      setCartItems(prev => [...prev, response]);
      showSuccess('Đã thêm vào giỏ hàng');
    } catch (error) {
      showError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <CartContext.Provider value={{ cartItems, addToCart, loading }}>
      {children}
    </CartContext.Provider>
  );
};
```

### 2. **Sử dụng Context**

```javascript
// pages/public/Cart.jsx
import { useCart } from '../context/CartContext';

function Cart() {
  const { cartItems, loading, removeFromCart } = useCart();
  
  return (
    <div>
      {cartItems.map(item => (
        <CartItem key={item.id} item={item} />
      ))}
    </div>
  );
}
```

### 3. **Context Hierarchy**

```
App.js
├── LoadingProvider
│   └── AuthProvider
│       └── ToastProvider
│           └── CartProvider
│               └── WishlistProvider
│                   └── AppContent
```

---

## ⚠️ Error Handling

### 1. **Service Layer Error Handling**

```javascript
// services/orders.js
export const createOrder = async (orderData) => {
  try {
    const res = await axiosInstance.post("/orders", orderData);
    return res.data;
  } catch (e) {
    // Log error
    console.error("📦 Orders: Error creating order:", e);
    
    // Throw để component xử lý
    throw e;
  }
};
```

### 2. **Component Error Handling**

```javascript
// pages/public/Checkout.jsx
const handleSubmit = async (values) => {
  try {
    const response = await createOrder(payload);
    setOrder(response);
  } catch (error) {
    // Xử lý theo từng loại lỗi
    if (error?.response?.status === 401) {
      message = 'Bạn cần đăng nhập';
      navigate('/login');
    } else if (error?.response?.status === 400) {
      message = error.response.data?.message || 'Dữ liệu không hợp lệ';
    } else if (error?.code === 'ERR_NETWORK') {
      message = 'Không thể kết nối đến server';
    } else {
      message = error?.message || 'Đã có lỗi xảy ra';
    }
    
    showError(message);
  }
};
```

### 3. **Global Error Handling (Axios Interceptor)**

```javascript
// api/axios.js
axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => {
    // 401: Auto logout
    if (error.response?.status === 401) {
      localStorage.clear();
      navigate('/login');
    }
    
    // 403: Toast error
    if (error.response?.status === 403) {
      toast.error('Không có quyền truy cập');
    }
    
    return Promise.reject(error);
  }
);
```

---

## 📊 Data Flow Diagram

### Complete Customer Order Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         CUSTOMER JOURNEY                         │
└─────────────────────────────────────────────────────────────────┘

1. BROWSE PRODUCTS
   User → Shop.jsx → getAllProducts() → ProductAPI → Database
   Response → Display products

2. VIEW PRODUCT DETAIL
   User click product → ProductDetailModal → getProductById(id)
   → ProductAPI → Database → Display details

3. ADD TO CART
   User click "Thêm vào giỏ" → CartContext.addToCart()
   → addCartItem() → CartAPI → Database
   → Update CartContext state → Show toast

4. VIEW CART
   User → Cart.jsx → CartContext.cartItems
   → Load product details for each item
   → Display cart with full product info

5. CHECKOUT
   User → Checkout.jsx → Form submit
   → createOrder() → OrderAPI.createOrder()
   → OrderService → Database
   → QRPaymentService.generatePaymentInfo()
   → Response with QR code → Display QR

6. PAYMENT
   User scan QR → Transfer money
   → Click "Tôi đã chuyển khoản"
   → confirmPayment() → OrderAPI.confirmPayment()
   → Update order status → Clear cart → Success message

7. VIEW ORDERS
   User → Orders.jsx → getOrdersByAccount(userId)
   → OrderAPI → Database → Display orders list

8. VIEW ORDER DETAIL
   User click order → OrderDetail.jsx
   → getOrderById(orderId) → OrderAPI
   → Display full order details
```

---

## 🔧 Technical Details

### 1. **API Request Format**

```javascript
// Request
POST /api/orders
Headers:
  Authorization: Bearer <JWT_TOKEN>
  Content-Type: application/json
Body:
{
  "accountId": 81,
  "shippingAddress": "123 Main St",
  "phoneContact": "0911111117",
  "note": "Giao hàng nhanh",
  "items": [
    {
      "productId": 11,
      "quantity": 2
    }
  ]
}
```

### 2. **API Response Format**

```javascript
// Response
Status: 200 OK
Body:
{
  "orderId": 15,
  "totalAmount": 12000,
  "status": "PENDING",
  "createdAt": "2025-11-12T08:26:22.953357",
  "items": [
    {
      "productId": 11,
      "productName": "Product Name",
      "quantity": 2,
      "price": 6000
    }
  ],
  "paymentInfo": {
    "qrCodeUrl": "https://img.vietqr.io/...",
    "bankId": "970407",
    "accountNo": "19074497420010",
    "accountName": "NGUYEN TRAN GIA HUNG",
    "amount": 12000,
    "status": "PENDING",
    "message": "Vui lòng quét mã QR để thanh toán"
  }
}
```

### 3. **State Management Pattern**

```javascript
// Context Pattern
const [state, setState] = useState(initialValue);

// Update state
setState(newValue);

// Async update
const updateState = async () => {
  const data = await fetchData();
  setState(data);
};

// Optimistic update
setState(newValue); // Update UI immediately
try {
  await saveToServer(newValue);
} catch (error) {
  setState(oldValue); // Rollback on error
}
```

### 4. **Loading States**

```javascript
// Component level
const [loading, setLoading] = useState(false);

// Context level
const { loading } = useCart();

// Global level (Axios interceptor)
onReqStart(); // Show global spinner
onReqEnd();   // Hide global spinner
```

---

## 📝 Best Practices

### 1. **API Calls**
- ✅ Luôn sử dụng service layer, không gọi axios trực tiếp trong component
- ✅ Unwrap response data trong service layer
- ✅ Throw error để component xử lý
- ✅ Log mọi API calls để debug

### 2. **State Management**
- ✅ Sử dụng Context cho global state (cart, auth, wishlist)
- ✅ Sử dụng useState cho local state
- ✅ Tránh prop drilling quá sâu

### 3. **Error Handling**
- ✅ Xử lý lỗi ở nhiều tầng (interceptor, service, component)
- ✅ Hiển thị thông báo lỗi rõ ràng cho user
- ✅ Log lỗi để debug

### 4. **Performance**
- ✅ Cache API responses khi có thể
- ✅ Debounce/throttle API calls
- ✅ Lazy load components
- ✅ Memoize expensive computations

---

## 🎯 Summary

### Architecture Highlights
1. **Separation of Concerns**: Pages → Components → Services → API
2. **Centralized State**: Context API cho global state
3. **Reusable Services**: Service layer tách biệt logic
4. **Error Handling**: Multi-layer error handling
5. **Security**: JWT authentication + Role-based authorization

### Key Flows
1. **Product Browsing**: Shop → Product Detail → Add to Cart
2. **Checkout**: Cart → Checkout → Create Order → QR Payment
3. **Order Management**: Orders List → Order Detail → Track Status

### API Pattern
```
Component → Service → Axios Instance → Backend API → Service → Repository → Database
```

---

**Tài liệu này cung cấp cái nhìn toàn diện về kiến trúc và flow của hệ thống cho customer.**
