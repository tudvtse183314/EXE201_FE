# Customer Role Implementation Summary

## ✅ Đã hoàn thành

### 1. Axios Interceptors (✅)
- File: `src/api/axios.js`
- Đã cập nhật:
  - ✅ Gắn Bearer token vào mọi request
  - ✅ Xử lý 401: Auto logout + redirect `/login` + toast error
  - ✅ Xử lý 403: Toast error
  - ✅ Setup global logout và navigate functions

### 2. Services API (✅)
- `src/services/cart.js`: Đã cập nhật với Customer APIs:
  - ✅ `getMyCart()`: GET /api/cart/my
  - ✅ `addCartItem(productId, quantity)`: POST /api/cart/items
  - ✅ `updateCartItemQuantity(itemId, quantity)`: PUT /api/cart/items/{itemId}
  - ✅ `deleteCartItem(itemId)`: DELETE /api/cart/items/{itemId}

- `src/services/orders.js`: Đã cập nhật:
  - ✅ `getMyOrders(params)`: GET /api/orders/my
  - ✅ `confirmPayment(orderId)`: POST /api/orders/{id}/confirm-payment
  - ✅ `cancelOrder(orderId)`: POST /api/orders/{id}/cancel

- `src/services/users.js`: Mới tạo:
  - ✅ `getMyProfile()`: GET /api/users/me
  - ✅ `updateMyProfile(data)`: PUT /api/users/me
  - ✅ `changePassword(oldPassword, newPassword)`: POST /api/users/change-password

- `src/services/chatHistory.js`: Đã cập nhật:
  - ✅ `getMyChatHistory()`: GET /api/chat-history/my

### 3. CartContext (✅)
- File: `src/context/CartContext.jsx`
- Đã chuyển từ localStorage sang API:
  - ✅ Load cart từ API khi user đăng nhập
  - ✅ `addToCart()`: Gọi API thêm item
  - ✅ `removeFromCart()`: Gọi API xóa item
  - ✅ `updateQuantity()`: Gọi API cập nhật số lượng
  - ✅ `clearCart()`: Xóa tất cả items
  - ✅ Toast notifications cho mọi action
  - ✅ Guards để tránh spam API calls

### 4. Routes với RoleGuard (✅)
- File: `src/routes/AppRoutes.jsx`
- Đã bọc các customer routes:
  - ✅ `/cart` → RoleGuard CUSTOMER
  - ✅ `/checkout` → RoleGuard CUSTOMER
  - ✅ `/wishlist` → RoleGuard CUSTOMER
  - ✅ `/orders` → RoleGuard CUSTOMER
  - ✅ `/orders/:id` → RoleGuard CUSTOMER
  - ✅ `/my-pets` → RoleGuard CUSTOMER
  - ✅ `/profile` → RoleGuard CUSTOMER
  - ✅ `/ai-analysis` → RoleGuard CUSTOMER

### 5. App.js Setup (✅)
- File: `src/App.js`
- Đã đăng ký:
  - ✅ Global logout function cho axios interceptor
  - ✅ Global navigate function cho axios interceptor
  - ✅ Toastify đã được setup sẵn

### 6. Cart Page (✅)
- File: `src/pages/public/Cart.jsx`
- Đã cập nhật để hiển thị đúng data từ API:
  - ✅ Xử lý `itemId` hoặc `id`
  - ✅ Hiển thị product, price, quantity, total
  - ✅ Cập nhật số lượng với max=stock
  - ✅ Xóa item

## ⚠️ Cần hoàn thiện

### 1. Checkout Page
- File: `src/pages/public/Checkout.jsx`
- Cần cập nhật:
  - [ ] Gọi `POST /api/orders` với data từ form (KHÔNG gửi userId)
  - [ ] Nhận orderId + status từ BE
  - [ ] Hiển thị QR code nếu payment method = QR
  - [ ] Cho phép "Xác nhận đã thanh toán" → gọi `POST /api/orders/{id}/confirm-payment`
  - [ ] Redirect `/orders/:id` sau khi đặt hàng thành công
  - [ ] Xử lý cart rỗng (đã có)

### 2. Orders Page
- File: `src/pages/customer/Orders.jsx`
- Cần cập nhật:
  - [ ] Gọi `GET /api/orders/my` thay vì localStorage
  - [ ] Hiển thị danh sách orders với phân trang
  - [ ] Link "Xem" → navigate `/orders/:id`
  - [ ] Order Detail: Hiển thị chi tiết order
  - [ ] Nút "Hủy đơn" nếu status = PENDING (gọi `POST /api/orders/{id}/cancel`)
  - [ ] Nút "Thanh toán" nếu PENDING và chưa thanh toán
  - [ ] Không cho Customer tự chuyển PENDING → DELIVERED

### 3. Profile Page
- File: `src/pages/customer/Profile.jsx`
- Cần tạo/cập nhật:
  - [ ] Gọi `GET /api/users/me` để load profile
  - [ ] Form cập nhật profile (gọi `PUT /api/users/me`)
  - [ ] Form đổi mật khẩu (gọi `POST /api/users/change-password`)
  - [ ] Toast notifications cho success/error
  - [ ] Validation cho form

### 4. AI Analysis Page
- File: `src/pages/AIAnalysis.jsx`
- Cần cập nhật:
  - [ ] Gọi `POST /api/chat-history/chat` khi user chat/upload ảnh
  - [ ] Gọi `GET /api/chat-history/my` để hiển thị lịch sử
  - [ ] Kiểm tra premium/subscription nếu cần (GET /api/subscription/status)
  - [ ] Hiển thị upsell nếu hết hạn premium

### 5. Header/Menu
- File: `src/components/layout/Header.jsx`
- Cần cập nhật:
  - [ ] Ẩn toàn bộ menu Staff/Admin khi role = CUSTOMER
  - [ ] Dropdown menu cho user: Profile, My Orders, My Pets, Wishlist, Logout
  - [ ] Hiển thị "Xin chào, <name>" và avatar

### 6. Wishlist (nếu có)
- File: `src/pages/public/Wishlist.jsx`
- Cần kiểm tra/cập nhật:
  - [ ] Gọi `GET /api/wishlist/my` để load wishlist
  - [ ] `POST /api/wishlist` để thêm item
  - [ ] `DELETE /api/wishlist/{itemId}` để xóa item
  - [ ] Cập nhật WishlistContext nếu cần

## 📝 Testing Checklist

### Authentication & Authorization
- [ ] Không login truy cập `/cart` → redirect `/login`
- [ ] Customer truy cập `/staff/dashboard` → `/unauthorized`
- [ ] 401 từ API → logout + toast + redirect `/login`
- [ ] 403 từ API → toast error

### Cart
- [ ] Thêm item vào cart → gọi API thành công
- [ ] Cập nhật số lượng > stock → báo lỗi từ BE
- [ ] Xóa item khỏi cart → gọi API thành công
- [ ] Cart rỗng → hiển thị empty state

### Checkout
- [ ] Đặt hàng thành công → redirect `/orders/:id`
- [ ] QR payment: hiển thị QR code
- [ ] Confirm payment → gọi API confirm-payment

### Orders
- [ ] Danh sách orders hiển thị đúng
- [ ] Hủy đơn khi PENDING → thành công
- [ ] Không cho hủy đơn khi đã PAID/SHIPPED
- [ ] Order detail hiển thị đúng tổng tiền

### Profile
- [ ] Cập nhật profile thành công
- [ ] Đổi mật khẩu với oldPassword đúng → thành công
- [ ] Đổi mật khẩu với oldPassword sai → báo lỗi

### My Pets
- [ ] Tạo pet → chỉ tác động data của user hiện tại
- [ ] Sửa pet → chỉ sửa pet của user hiện tại
- [ ] Xóa pet → chỉ xóa pet của user hiện tại

## 🔧 Notes

1. **KHÔNG gửi userId từ client**: Tất cả API customer đều lấy userId từ JWT token
2. **Error Handling**: Axios interceptor đã xử lý 401/403, component chỉ cần xử lý các lỗi khác
3. **Loading States**: Dùng toastify và Ant Design Spin/Skeleton cho loading states
4. **Empty States**: Dùng Ant Design Empty component
5. **Toast Notifications**: Đã setup sẵn trong ToastContext, dùng `useToast()` hook

## 🚀 Next Steps

1. Hoàn thiện Checkout page
2. Hoàn thiện Orders page (list + detail)
3. Hoàn thiện Profile page
4. Cập nhật AI Analysis page
5. Cập nhật Header để ẩn menu Staff/Admin
6. Test toàn bộ flow end-to-end

