# 🚀 Quick Fixes - Stop Request Storm

## ⚡ Ưu tiên cao (Fix ngay)

### 1. ✅ TestimonialsSection.jsx - ĐÃ CÓ CLEANUP
**File**: `src/components/sections/TestimonialsSection.jsx`  
**Line**: 70-73  
**Status**: ✅ **ĐÃ CÓ** `return () => clearInterval(interval);`  
**Action**: Không cần sửa

---

### 2. ✅ HeroCarousel.jsx - ĐÃ CÓ CLEANUP
**File**: `src/components/common/HeroCarousel.jsx`  
**Line**: 71-75  
**Status**: ✅ **ĐÃ CÓ** `return () => clearInterval(timer);`  
**Action**: Không cần sửa

---

### 3. ⚠️ Carousel.jsx - CẦN KIỂM TRA
**File**: `src/components/common/Carousel.jsx`  
**Pattern**: Multiple `setInterval` và `setTimeout`  
**Action**: Cần kiểm tra xem có cleanup đầy đủ không

---

### 4. ⚠️ LoadingWithTimeout.jsx - CẦN KIỂM TRA
**File**: `src/components/common/LoadingWithTimeout.jsx`  
**Pattern**: `setInterval` trong useEffect  
**Action**: Cần kiểm tra xem có cleanup không

---

### 5. ✅ StaffOrdersPage.jsx line 39 - KHÔNG PHẢI VẤN ĐỀ
**File**: `src/pages/staff/StaffOrdersPage.jsx`  
**Line**: 39  
**Status**: ✅ Chỉ là khai báo function `export default function StaffOrdersPage()`  
**Action**: Không phải nguồn gốc spam. Có thể HMR polling do component re-render, không phải do code.

---

## 🔧 Các fix cần làm

### Fix 1: Sửa useEffect dependencies trong StaffOrdersPage

**File**: `src/pages/staff/StaffOrdersPage.jsx`

```javascript
// TRƯỚC (line 70-78):
useEffect(() => {
  loadOrders();
  
  // Check for status filter from URL params
  const statusParam = searchParams.get('status');
  if (statusParam) {
    setSelectedStatus(statusParam);
  }
}, []); // ❌ Thiếu searchParams trong deps

// SAU:
useEffect(() => {
  loadOrders();
}, []); // ✅ Tách riêng loadOrders

// Tách effect riêng cho searchParams
useEffect(() => {
  const statusParam = searchParams.get('status');
  if (statusParam) {
    setSelectedStatus(statusParam);
  }
}, [searchParams]); // ✅ Đúng deps
```

---

### Fix 2: Thêm AbortController cho tất cả API calls

**Ví dụ**: `src/pages/admin/AdminDashboard.jsx`

```javascript
useEffect(() => {
  const abortController = new AbortController();
  let isMounted = true;

  const loadStats = async () => {
    if (!isMounted) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const [products, categories] = await Promise.all([
        dataManager.get('products', () => getAllProducts()),
        dataManager.get('categories', () => getAllCategories())
      ]);
      
      if (!isMounted) return;
      
      setStats({
        products: Array.isArray(products) ? products.length : 0,
        categories: Array.isArray(categories) ? categories.length : 0,
        orders: 0
      });
    } catch (error) {
      if (!isMounted || abortController.signal.aborted) return;
      setError(error?.message || "Không thể tải thống kê");
    } finally {
      if (isMounted) setLoading(false);
    }
  };

  loadStats();

  return () => {
    isMounted = false;
    abortController.abort();
  };
}, []);
```

---

### Fix 3: Thêm spam protection cho axios

**File**: `src/api/axios.js`

```javascript
// Thêm vào đầu file
const requestCounts = new Map();
const MAX_REQUESTS_PER_10S = 10;

// Thêm vào interceptor.request (sau line 29)
axiosInstance.interceptors.request.use(
  (config) => {
    // Spam protection
    const url = config.url || '';
    const key = `${config.method?.toUpperCase()}_${url}`;
    const now = Date.now();
    
    if (!requestCounts.has(key)) {
      requestCounts.set(key, { count: 0, lastReset: now, warnings: 0 });
    }
    
    const record = requestCounts.get(key);
    if (now - record.lastReset > 10000) {
      record.count = 0;
      record.lastReset = now;
      record.warnings = 0;
    }
    
    record.count++;
    
    if (record.count > MAX_REQUESTS_PER_10S && record.warnings < 3) {
      record.warnings++;
      console.warn(
        `⚠️ API spam detected: ${key} called ${record.count} times in 10s. ` +
        `This may indicate a request loop.`
      );
      
      // Optionally: reject request if spam is severe
      if (record.count > MAX_REQUESTS_PER_10S * 2) {
        console.error(`❌ Rejecting request to prevent spam: ${key}`);
        return Promise.reject(new Error(`Too many requests to ${url}`));
      }
    }
    
    onReqStart();
    const token = localStorage.getItem("accessToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  // ... rest
);
```

---

### Fix 4: Đảm bảo tất cả setInterval có cleanup

**Kiểm tra các file sau và đảm bảo có cleanup**:

1. `src/components/common/Carousel.jsx` - Kiểm tra tất cả timers
2. `src/components/common/LoadingWithTimeout.jsx` - Thêm cleanup nếu thiếu

**Pattern chuẩn**:
```javascript
useEffect(() => {
  const interval = setInterval(() => {
    // ... logic
  }, delay);
  
  return () => {
    clearInterval(interval); // ✅ Bắt buộc có
  };
}, [dependencies]);
```

---

## 🎯 Action Items

### Ngay lập tức:
1. ✅ Kiểm tra `Carousel.jsx` và `LoadingWithTimeout.jsx` có cleanup đầy đủ không
2. ✅ Sửa `StaffOrdersPage.jsx` useEffect dependencies
3. ✅ Thêm AbortController cho admin pages

### Trong 1-2 giờ:
4. ✅ Thêm spam protection vào axios interceptor
5. ✅ Test lại xem còn spam không

### Sau khi test:
6. ✅ Monitor Network tab để xác nhận không còn spam
7. ✅ Xem log console để check warnings

---

## 📝 Notes

- **HMR Polling** (`main-<hash>.hot-update.json`): Đây là Webpack Dev Server tự động polling. Không phải do code của bạn. Nếu spam quá nhiều, có thể do component re-render liên tục → cần fix re-render loop.
- **StaffOrdersPage line 39**: "Initiator: StaffOrdersPage.jsx:39" trong screenshot chỉ là khai báo function, không phải polling code. Vấn đề có thể là component re-render → trigger HMR check.

