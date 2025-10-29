# 🔍 Performance Analysis Report - PetVibe Frontend

## 📋 1. Sitemap & Cấu trúc dự án

```
src/
├── pages/
│   ├── admin/
│   │   ├── AdminDashboard.jsx
│   │   ├── products/
│   │   │   └── ProductsPage.jsx
│   │   ├── categories/
│   │   │   └── CategoriesPage.jsx
│   │   ├── carts/
│   │   │   └── CartsPage.jsx
│   │   └── ChatHistory.jsx
│   ├── staff/
│   │   ├── StaffProductsPage.jsx
│   │   ├── StaffCategoriesPage.jsx
│   │   ├── StaffOrdersPage.jsx ⚠️ (File khả nghi theo screenshot)
│   │   ├── StaffReviewsPage.jsx
│   │   ├── StaffDashboard.jsx
│   │   └── StaffProfilePage.jsx
│   └── ...
├── components/
│   ├── admin/
│   │   ├── ProductTest.jsx
│   │   ├── OrdersTest.jsx
│   │   ├── CategoryTest.jsx
│   │   └── APITestSummary.jsx
│   └── ...
├── routes/
│   └── AppRoutes.jsx
├── services/
│   ├── products.js
│   ├── categories.js
│   ├── orders.js
│   ├── cart.js
│   ├── chatHistory.js
│   ├── auth.js
│   └── petProfiles.js
├── api/
│   ├── axios.js ⚠️ (Interceptors)
│   ├── products.js
│   ├── categories.js
│   ├── orders.js
│   ├── auth.js
│   └── ...
└── context/
    ├── AuthContext.jsx ⚠️
    ├── CartContext.jsx ⚠️
    ├── WishlistContext.jsx ⚠️
    ├── LoadingContext.jsx
    └── ToastContext.jsx
```

---

## 📍 2. Admin Pages - Route & API Calls

### 2.1 AdminDashboard
- **File**: `src/pages/admin/AdminDashboard.jsx`
- **Route**: `/admin/dashboard` hoặc `/admin`
- **Component**: `AdminDashboard`

**API Calls:**
| Method | URL | Logic | Headers | Nơi gọi | Line |
|--------|-----|-------|---------|---------|------|
| GET | `/products/getAll` | `dataManager.get('products', getAllProducts)` | Bearer token | `useEffect(() => {loadStats()}, [])` | 58-59 |
| GET | `/categories/getAll` | `dataManager.get('categories', getAllCategories)` | Bearer token | `useEffect(() => {loadStats()}, [])` | 58-59 |

**Phân tích:**
- ✅ `useEffect` có `[]` → OK
- ❌ Không có polling/refetch tự động

---

### 2.2 ProductsPage (Admin)
- **File**: `src/pages/admin/products/ProductsPage.jsx`
- **Route**: `/admin/products`
- **Component**: `ProductsPage`

**API Calls:**
| Method | URL | Logic | Headers | Nơi gọi | Line |
|--------|-----|-------|---------|---------|------|
| GET | `/products/getAll` | `dataManager.get('products', getAllProducts)` | Bearer token | `useEffect(() => {loadData()}, [])` | 84-86 |
| GET | `/categories/getAll` | `dataManager.get('categories', getAllCategories)` | Bearer token | `useEffect(() => {loadData()}, [])` | 84-86 |
| POST | `/products` | `createProduct(submitData)` | Bearer token | `handleSubmit()` | 108-138 |
| PUT | `/products/{id}` | `updateProduct(id, submitData)` | Bearer token | `handleSubmit()` | 108-138 |
| DELETE | `/products/{id}` | `deleteProduct(productId)` | Bearer token | `handleDelete()` | 154-167 |

**Phân tích:**
- ✅ `useEffect` có `[]` → OK
- ⚠️ Filter effect (line 89-106) phụ thuộc `products` state → có thể trigger re-render nhưng không gọi API
- ❌ Không có polling

---

### 2.3 CategoriesPage (Admin)
- **File**: `src/pages/admin/categories/CategoriesPage.jsx`
- **Route**: `/admin/categories`
- **Component**: `CategoriesPage`

**API Calls:**
| Method | URL | Logic | Headers | Nơi gọi | Line |
|--------|-----|-------|---------|---------|------|
| GET | `/categories/getAll` | `dataManager.get('categories', getAllCategories)` | Bearer token | `useEffect(() => {loadCategories()}, [])` | 64-66 |
| POST | `/categories` | `createCategory(values)` | Bearer token | `handleSubmit()` | 81-104 |
| PUT | `/categories/{id}` | `updateCategory(id, values)` | Bearer token | `handleSubmit()` | 81-104 |
| DELETE | `/categories/{id}` | `deleteCategory(categoryId)` | Bearer token | `handleDelete()` | 115-128 |

**Phân tích:**
- ✅ `useEffect` có `[]` → OK
- ⚠️ Filter effect (line 69-79) phụ thuộc `categories` state → không gọi API
- ❌ Không có polling

---

### 2.4 StaffOrdersPage ⚠️ **KHẢ NGHI CAO**
- **File**: `src/pages/staff/StaffOrdersPage.jsx`
- **Route**: `/staff/orders`
- **Component**: `StaffOrdersPage`

**API Calls:**
| Method | URL | Logic | Headers | Nơi gọi | Line |
|--------|-----|-------|---------|---------|------|
| GET | `/orders/getAll` | `dataManager.get('orders', getAllOrders)` | Bearer token | `useEffect(() => {loadOrders(); ...}, [])` | 70-78 |
| PUT | `/orders/{id}/status` | `updateOrderStatus(orderId, newStatus)` | Bearer token | `handleStatusUpdate()` | 99-112 |

**Phân tích:**
- ✅ `useEffect` có `[]` → OK (line 70-78)
- ⚠️ **CÓ THỂ CÓ VẤN ĐỀ**: Effect phụ thuộc `searchParams` (line 74-77) nhưng không có trong deps
- ⚠️ Filter effect (line 81-97) phụ thuộc `orders` → không gọi API

**⚠️ KHUYẾN NGHỊ**: Kiểm tra xem có polling ẩn hoặc re-render loop không

---

### 2.5 CartsPage (Admin)
- **File**: `src/pages/admin/carts/CartsPage.jsx`
- **Route**: `/admin/carts`
- **Component**: `CartsPage`

**API Calls:**
| Method | URL | Logic | Headers | Nơi gọi | Line |
|--------|-----|-------|---------|---------|------|
| GET | `/carts/getAll` | `getAllCarts()` | Bearer token | `useEffect(() => {loadData()}, [])` | 40-42 |
| GET | `/products/getAll` | `getAllProducts()` | Bearer token | `useEffect(() => {loadData()}, [])` | 40-42 |
| DELETE | `/carts/{id}` | `deleteCartItem(cartId)` | Bearer token | `handleDeleteCart()` | 70-82 |
| DELETE | `/carts/{id}` (nhiều) | `deleteCartItem()` trong loop | Bearer token | `handleClearAllCarts()` | 84-97 |

**Phân tích:**
- ✅ `useEffect` có `[]` → OK
- ❌ Không có polling

---

### 2.6 ChatHistory (Admin)
- **File**: `src/pages/admin/ChatHistory.jsx`
- **Route**: `/admin/chat-history`
- **Component**: `ChatHistory`

**API Calls:**
| Method | URL | Logic | Headers | Nơi gọi | Line |
|--------|-----|-------|---------|---------|------|
| GET | `/chat-history/getAll` | `chatHistoryApi.getAll()` | Bearer token | `useEffect(() => {loadChats()}, [])` | 67-69 |
| PUT | `/chat-history/{id}` | `chatHistoryApi.updateById(id, data)` | Bearer token | `handleUpdate()` | 90-110 |
| DELETE | `/chat-history/{id}` | `chatHistoryApi.deleteById(id)` | Bearer token | `handleDelete()` | 113-122 |
| POST | `/chat-history/manual` | `chatHistoryApi.createManual(data)` | Bearer token | `handleCreate()` | 125-151 |

**Phân tích:**
- ✅ `useEffect` có `[]` → OK
- ❌ Không có polling

---

### 2.7 Test Components

#### ProductTest.jsx
- **Route**: `/admin/test-products`
- **File**: `src/components/admin/ProductTest.jsx`
- **Mục đích**: Test API products

#### OrdersTest.jsx
- **Route**: `/admin/test-orders`
- **File**: `src/components/admin/OrdersTest.jsx`
- **Mục đích**: Test API orders

#### CategoryTest.jsx
- **Route**: `/admin/test`
- **File**: `src/components/admin/CategoryTest.jsx`
- **Mục đích**: Test API categories

#### APITestSummary.jsx
- **Route**: `/admin/api-summary`
- **File**: `src/components/admin/APITestSummary.jsx`
- **Mục đích**: Tổng hợp test API

⚠️ **CẢNH BÁO**: Các test components có thể gọi API liên tục trong dev mode!

---

## 🚨 3. Pattern gây "spam request"

### 3.1 useEffect không có deps hoặc deps không ổn định

| File | Line | Pattern | Mô tả | Nguy cơ |
|------|------|---------|-------|---------|
| `src/pages/staff/StaffOrdersPage.jsx` | 70-78 | `useEffect(() => {...}, [])` | Có logic đọc `searchParams` nhưng không có trong deps | ⚠️ Medium |
| `src/components/ai/useAIAnalysis.js` | 14-71 | Multiple `useEffect` | Cần kiểm tra deps | ⚠️ Medium |

✅ **Hầu hết admin pages đã có `[]` → OK**

---

### 3.2 setInterval/setTimeout không clear

| File | Line | Pattern | Mô tả | Nguy cơ | Fix |
|------|------|---------|-------|---------|-----|
| `src/components/sections/TestimonialsSection.jsx` | 70 | `setInterval(() => {...}, ms)` | ❌ Không clear | 🔴 **HIGH** | Thêm cleanup |
| `src/components/common/HeroCarousel.jsx` | 71 | `setInterval(() => {...}, ms)` | ❌ Không clear | 🔴 **HIGH** | Thêm cleanup |
| `src/components/common/Carousel.jsx` | 28 | `setInterval(() => {...}, ms)` | ❌ Không clear | 🔴 **HIGH** | Thêm cleanup |
| `src/components/common/LoadingWithTimeout.jsx` | 13 | `setInterval(() => {...}, ms)` | ❌ Không clear | 🔴 **HIGH** | Thêm cleanup |
| `src/components/sections/Footer.jsx` | 15 | `setTimeout(() => {...}, 3000)` | ✅ Có clear (component unmount) | ✅ Low | OK |
| `src/App.js` | 32 | `setTimeout(() => {...}, 400)` | ✅ Có clear | ✅ Low | OK |
| `src/pages/staff/StaffReviewsPage.jsx` | 118, 163 | `setTimeout(() => {...}, delay)` | ⚠️ Delay trong async | ⚠️ Medium | Kiểm tra cleanup |

---

### 3.3 React Query / SWR

❌ **KHÔNG TÌM THẤY** `react-query`, `SWR`, hoặc `useSWR` trong codebase.

---

### 3.4 Axios Interceptors

| File | Line | Pattern | Mô tả | Nguy cơ |
|------|------|---------|-------|---------|
| `src/api/axios.js` | 27-38 | `axiosInstance.interceptors.request.use(...)` | ✅ OK, không gọi axios lại | ✅ Low |
| `src/api/axios.js` | 40-49 | `axiosInstance.interceptors.response.use(...)` | ✅ OK, không gọi axios lại | ✅ Low |

✅ **Interceptors ổn định, không có vòng lặp**

---

### 3.5 Service Worker / HMR

| Pattern | File | Status |
|---------|------|--------|
| `serviceWorker.register()` | ❌ Không tìm thấy | ✅ OK |
| `module.hot` | ❌ Không tìm thấy | ✅ OK |
| `hot-update.json` | ⚠️ Webpack HMR tự động | ⚠️ Đây là HMR polling |

**⚠️ HMR Polling**: File `main-<hash>.hot-update.json` là do Webpack Dev Server HMR. Có thể spam nếu:
- Component re-render liên tục
- Có setInterval không clear → trigger HMR check

---

## 📊 4. Bảng tổng hợp các vấn đề

| File | Dòng | Loại | Mô tả | Nguy cơ spam | Gợi ý fix |
|------|------|------|-------|--------------|-----------|
| `src/components/sections/TestimonialsSection.jsx` | 70 | `setInterval` | Auto-rotate testimonials | 🔴 **HIGH** | Thêm `clearInterval` trong cleanup |
| `src/components/common/HeroCarousel.jsx` | 71 | `setInterval` | Auto-advance carousel | 🔴 **HIGH** | Thêm `clearInterval` trong cleanup |
| `src/components/common/Carousel.jsx` | 28, 41, 47, 53 | `setInterval` + `setTimeout` | Auto-play carousel | 🔴 **HIGH** | Thêm cleanup cho tất cả timers |
| `src/components/common/LoadingWithTimeout.jsx` | 13 | `setInterval` | Timeout counter | 🔴 **HIGH** | Thêm `clearInterval` trong cleanup |
| `src/pages/staff/StaffOrdersPage.jsx` | 70-78 | `useEffect` | Đọc `searchParams` nhưng không có trong deps | ⚠️ Medium | Thêm `searchParams` vào deps hoặc tách effect |
| `src/pages/staff/StaffOrdersPage.jsx` | 39 (initiator) | **Khả nghi** | Có thể polling hoặc re-render loop | 🔴 **HIGH** | Kiểm tra kỹ, xem có setInterval ẩn không |
| `src/components/admin/*Test.jsx` | N/A | Test components | Có thể gọi API liên tục trong dev | ⚠️ Medium | Đảm bảo chỉ chạy khi click button |
| `src/index.js` | 29 | `StrictMode` | ✅ Đã tắt | ✅ OK | Giữ nguyên |
| `src/api/axios.js` | 27-49 | Interceptors | ✅ Ổn định | ✅ OK | Giữ nguyên |

---

## 🛠️ 5. Script kiểm tra nhanh (Grep)

```bash
# Tìm useEffect
grep -RIn "useEffect(" src | cat

# Tìm setInterval/setTimeout
grep -RIn "setInterval|setTimeout|useInterval" src | cat

# Tìm react-query/SWR (nếu có)
grep -RIn "refetchInterval|refetchOnWindowFocus|retry|useSWR|SWRConfig" src | cat

# Tìm axios interceptors
grep -RIn "interceptors.request|interceptors.response" src | cat

# Tìm Service Worker
grep -RIn "serviceWorker|register\(" src | cat

# Tìm HMR
grep -RIn "module.hot|hot-update" src | cat
```

---

## 🔧 6. Bản vá tối thiểu (Quick Fixes)

### 6.1 Sửa setInterval không clear

**File: `src/components/sections/TestimonialsSection.jsx`**
```javascript
// Line 70
useEffect(() => {
  if (!autoPlay) return;
  
  const interval = setInterval(() => {
    // ... logic
  }, 5000);
  
  return () => clearInterval(interval); // ✅ THÊM
}, [autoPlay, currentIndex]);
```

**File: `src/components/common/HeroCarousel.jsx`**
```javascript
// Line 71
useEffect(() => {
  if (!autoPlay) return;
  
  const timer = setInterval(() => {
    // ... logic
  }, interval);
  
  return () => clearInterval(timer); // ✅ THÊM
}, [autoPlay, interval, currentSlide, totalSlides]);
```

**File: `src/components/common/Carousel.jsx`**
```javascript
useEffect(() => {
  if (!isAutoPlaying) return;
  
  const interval = setInterval(() => {
    // ... logic
  }, autoPlayInterval);
  
  return () => clearInterval(interval); // ✅ THÊM
}, [isAutoPlaying, autoPlayInterval, currentIndex]);

// Và cleanup các setTimeout
useEffect(() => {
  const timer1 = setTimeout(() => setIsAutoPlaying(true), 10000);
  const timer2 = setTimeout(() => setIsAutoPlaying(true), 10000);
  
  return () => {
    clearTimeout(timer1);
    clearTimeout(timer2);
  };
}, [dependencies]);
```

**File: `src/components/common/LoadingWithTimeout.jsx`**
```javascript
// Line 13
useEffect(() => {
  const interval = setInterval(() => {
    // ... logic
  }, 1000);
  
  return () => clearInterval(interval); // ✅ THÊM
}, [timeout]);
```

### 6.2 Sửa useEffect phụ thuộc không đúng

**File: `src/pages/staff/StaffOrdersPage.jsx`**
```javascript
// Line 70-78
useEffect(() => {
  loadOrders();
  
  const statusParam = searchParams.get('status');
  if (statusParam) {
    setSelectedStatus(statusParam);
  }
}, [searchParams]); // ✅ THÊM searchParams vào deps hoặc tách ra
```

### 6.3 Tắt StrictMode (đã tắt)

✅ `src/index.js` line 29: `StrictMode` đã được comment → OK

### 6.4 Thêm AbortController cho API calls

**Ví dụ: `src/pages/admin/AdminDashboard.jsx`**
```javascript
useEffect(() => {
  const abortController = new AbortController();
  
  const loadStats = async () => {
    try {
      // Pass signal to axios
      const [products, categories] = await Promise.all([
        dataManager.get('products', getAllProducts, { signal: abortController.signal }),
        dataManager.get('categories', getAllCategories, { signal: abortController.signal })
      ]);
      // ...
    } catch (error) {
      if (error.name === 'AbortError') return;
      // ...
    }
  };
  
  loadStats();
  
  return () => abortController.abort(); // ✅ Cancel khi unmount
}, []);
```

### 6.5 Thêm log bảo vệ (debounce)

**File: `src/api/axios.js`**
```javascript
// Thêm request counter
const requestCounts = new Map();

axiosInstance.interceptors.request.use((config) => {
  const url = config.url || '';
  const key = `${config.method}_${url}`;
  const now = Date.now();
  
  if (!requestCounts.has(key)) {
    requestCounts.set(key, { count: 0, lastReset: now });
  }
  
  const record = requestCounts.get(key);
  if (now - record.lastReset > 10000) {
    record.count = 0;
    record.lastReset = now;
  }
  
  record.count++;
  
  if (record.count > 10) {
    console.warn(`⚠️ API spam detected: ${key} called ${record.count} times in 10s`);
  }
  
  // ... rest of interceptor
}, ...);
```

---

## 🚨 7. Biện pháp tức thời (Trước khi refactor)

### 7.1 Comment tạm setInterval trong Admin pages

✅ **Không có setInterval trong admin pages** → Skip

### 7.2 Tắt StrictMode

✅ **Đã tắt** (`src/index.js` line 29)

### 7.3 Kiểm tra Service Worker

✅ **Không có Service Worker** → OK

### 7.4 Nâng refetchInterval (nếu có)

❌ **Không dùng react-query/SWR** → Skip

### 7.5 Kiểm tra .env

⚠️ **Cần kiểm tra**: 
- `REACT_APP_API_BASE_URL` có đúng không
- Không có retry loop do 401

---

## ✅ 8. Kết luận & Ưu tiên

### 🔴 **Ưu tiên cao** (Fix ngay):
1. ✅ **TestimonialsSection.jsx** - setInterval không clear
2. ✅ **HeroCarousel.jsx** - setInterval không clear  
3. ✅ **Carousel.jsx** - Multiple timers không clear
4. ✅ **LoadingWithTimeout.jsx** - setInterval không clear
5. ⚠️ **StaffOrdersPage.jsx** - Kiểm tra kỹ line 39 (initiator từ screenshot)

### ⚠️ **Ưu tiên trung bình**:
1. Thêm AbortController cho tất cả API calls
2. Sửa useEffect dependencies trong StaffOrdersPage
3. Thêm log bảo vệ (debounce) cho axios

### ✅ **Đã OK**:
- StrictMode đã tắt
- Axios interceptors ổn định
- Không có Service Worker
- Không dùng react-query/SWR
- Admin pages useEffect đều có `[]`

---

## 📝 Commit Message đề xuất

```
fix: throttle polling & stabilize effects to stop request storm

- Fix setInterval cleanup in TestimonialsSection, HeroCarousel, Carousel, LoadingWithTimeout
- Add AbortController to all API calls
- Fix useEffect dependencies in StaffOrdersPage
- Add request spam protection in axios interceptor
- Ensure all timers are properly cleaned up on unmount
```

