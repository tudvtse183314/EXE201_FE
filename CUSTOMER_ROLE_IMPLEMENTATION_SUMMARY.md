# Customer Role Implementation Summary

## ✅ Đã hoàn thành

### 1. **Routing & Redirect**
- ✅ Tất cả customer routes đã có prefix `/customer/`:
  - `/customer/my-pets` - Pet Profile (trang mặc định sau login)
  - `/customer/cart` - Cart
  - `/customer/wishlist` - Wishlist
  - `/customer/checkout` - Checkout
  - `/customer/ai` - AI Chatbot
  - `/customer/orders` - Orders List
  - `/customer/orders/:id` - Order Detail
  - `/customer/profile` - Profile
- ✅ Redirect sau login role=CUSTOMER → `/customer/my-pets`
- ✅ Legacy routes tự động redirect đến `/customer/*`
- ✅ RoleGuard bọc tất cả customer routes với `roles={[ROLES.CUSTOMER]}`

### 2. **Security & Authentication**
- ✅ Axios interceptors:
  - Request: Gắn `Authorization: Bearer <token>` cho mọi request
  - Response 401: Clear auth, toast "Phiên hết hạn", redirect `/login`
  - Response 403: Toast "Không có quyền truy cập"
- ✅ RoleGuard chuẩn hóa role về UPPERCASE để so sánh (case-insensitive)
- ✅ ProductCard: Check auth và role khi Add to Cart/Wishlist
  - Chưa login → redirect `/login` với `state.from`
  - Role không phải CUSTOMER → redirect `/unauthorized`

### 3. **Menu & Navigation**
- ✅ Header menu chỉ hiển thị customer menu khi `user.role === 'CUSTOMER'`
- ✅ Menu paths đã cập nhật sang `/customer/*`

### 4. **API Services (đã có sẵn)**
- ✅ Cart: `getMyCart()`, `addCartItem()`, `updateCartItemQuantity()`, `deleteCartItem()`
- ✅ Pet Profiles: `getMyPets()`, `createPetProfile()`, `updatePetProfile()`, `deletePetProfile()`
- ✅ Orders: `getMyOrders()`, `confirmPayment()`, `cancelOrder()`
- ✅ Users: `getMyProfile()`, `updateMyProfile()`, `changePassword()`
- ✅ Chat History: `getMyChatHistory()`, `sendChatMessage()`

## ⚠️ Cần kiểm tra và hoàn thiện

### 1. **Wishlist Service**
- ❓ Chưa có service API cho Wishlist (hiện đang dùng localStorage)
- Cần tạo:
  - `GET /api/wishlist/my`
  - `POST /api/wishlist { productId }`
  - `DELETE /api/wishlist/{itemId}` hoặc `DELETE /api/wishlist/by-product/{productId}`

### 2. **Pages cần cập nhật paths**
- [ ] `/pages/customer/PetProfilePage.jsx` - Đã dùng đúng API nhưng path trong code có thể cần update
- [ ] `/pages/public/Cart.jsx` - Có thể cần kiểm tra navigation paths
- [ ] `/pages/public/Wishlist.jsx` - Cần tích hợp API thay vì localStorage
- [ ] `/pages/customer/Orders.jsx` - Có thể cần kiểm tra navigation paths
- [ ] `/pages/customer/Profile.jsx` - Có thể cần kiểm tra navigation paths
- [ ] `/pages/ai/ChatBot.jsx` - Cần kiểm tra paths

### 3. **Checkout Flow**
- ❓ Cần xác nhận:
  - Cart page có button "Thanh toán" → `/customer/checkout`?
  - Checkout page tạo order bằng `POST /api/orders`?
  - Sau khi tạo order → redirect `/customer/orders/:id`?

### 4. **UI/UX Enhancements**
- [ ] Empty states cho tất cả pages
- [ ] Loading states với loader
- [ ] Disable buttons khi submit
- [ ] Toast notifications (đã có ToastContext)

## 🔐 Security Rules Đã Implement

1. **Frontend không gửi userId**: 
   - Tất cả API calls không include `userId` trong body/query
   - Backend phải lấy `userId` từ JWT token

2. **Role-based Access Control**:
   - Route protection: RoleGuard kiểm tra role trước khi render
   - Menu filtering: Chỉ hiển thị menu phù hợp với role
   - Button actions: Check auth trước khi thực hiện action

## 📋 Testing Checklist

### Authentication & Authorization
- [ ] Chưa login truy cập `/customer/*` → redirect `/login`
- [ ] Login role=CUSTOMER → redirect `/customer/my-pets`
- [ ] CUSTOMER truy cập `/staff/*` hoặc `/admin/*` → `/unauthorized`
- [ ] Add to Cart/Wishlist từ public:
  - [ ] Chưa login → redirect `/login`, sau login quay lại trang đang xem
  - [ ] Login role khác CUSTOMER → `/unauthorized`

### My Pets
- [ ] GET `/api/pet-profiles/my` - Load danh sách
- [ ] POST `/api/pet-profiles` - Tạo mới (BE lấy userId từ JWT)
- [ ] PUT `/api/pet-profiles/{id}` - Cập nhật (chỉ pet của chính user)
- [ ] DELETE `/api/pet-profiles/{id}` - Xóa (chỉ pet của chính user)

### Cart
- [ ] GET `/api/cart/my` - Load cart
- [ ] POST `/api/cart/items` { productId, quantity } - Thêm vào cart
- [ ] PUT `/api/cart/items/{itemId}` { quantity } - Cập nhật số lượng
- [ ] DELETE `/api/cart/items/{itemId}` - Xóa item
- [ ] Update quantity > stock → lỗi từ BE
- [ ] Button "Thanh toán" → navigate `/customer/checkout`

### Wishlist
- [ ] GET `/api/wishlist/my` - Load wishlist
- [ ] POST `/api/wishlist` { productId } - Thêm vào wishlist
- [ ] DELETE `/api/wishlist/{itemId}` - Xóa khỏi wishlist

### AI Chatbot
- [ ] POST `/api/chat-history/chat` - Gửi tin nhắn/ảnh
- [ ] GET `/api/chat-history/my` - Xem lịch sử
- [ ] (Optional) GET `/api/subscription/status` - Check premium

### Orders
- [ ] GET `/api/orders/my` - Danh sách đơn hàng
- [ ] GET `/api/orders/{id}` - Chi tiết đơn
- [ ] POST `/api/orders` - Tạo đơn (từ checkout) → redirect `/customer/orders/:id`
- [ ] POST `/api/orders/{id}/confirm-payment` - Xác nhận thanh toán (PENDING only)
- [ ] POST `/api/orders/{id}/cancel` - Hủy đơn (PENDING only)

### Profile
- [ ] GET `/api/users/me` - Xem profile
- [ ] PUT `/api/users/me` - Cập nhật profile
- [ ] POST `/api/users/change-password` - Đổi mật khẩu

### Error Handling
- [ ] 401 → logout + redirect `/login` + toast
- [ ] 403 → toast "Không có quyền truy cập"

## 🎯 Next Steps

1. **Tạo Wishlist Service** (nếu backend đã có API)
2. **Kiểm tra và cập nhật các pages** để đảm bảo navigation paths đúng
3. **Test toàn bộ flow** theo checklist trên
4. **Thêm empty states và loading states** cho better UX
