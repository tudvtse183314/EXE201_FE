# 📋 Hướng Dẫn Flow Quản Lý Payment và Xác Nhận Thanh Toán cho Admin

## 🎯 Tổng Quan

Flow quản lý payment cho Admin bao gồm:
1. **Xem danh sách đơn hàng** với trạng thái thanh toán
2. **Xác nhận thanh toán** khi khách đã chuyển khoản
3. **Từ chối đơn hàng** nếu không hợp lệ
4. **Cập nhật trạng thái đơn hàng** theo luồng: PENDING → PAID → SHIPPED → DELIVERED

---

## 📍 Trang Quản Lý: `/admin/orders`

### 1. **Xem Danh Sách Đơn Hàng**

**URL:** `http://localhost:3000/admin/orders`

**API Endpoint:** `GET /api/orders/all`

**Chức năng:**
- Hiển thị **TẤT CẢ** đơn hàng trong hệ thống
- Lọc theo trạng thái (PENDING, PAID, SHIPPED, DELIVERED, CANCELLED)
- Tìm kiếm theo mã đơn, tên khách hàng, địa chỉ, số điện thoại
- Sắp xếp theo mã đơn, tổng tiền, ngày tạo
- Phân trang (10, 20, 50, 100 đơn hàng/trang)

**Các cột hiển thị:**
- **Mã đơn** (`orderId`)
- **Khách hàng** (`accountName`)
- **Địa chỉ giao hàng** (`shippingAddress`)
- **Số điện thoại** (`phoneContact`)
- **Số sản phẩm** (số loại và tổng số lượng)
- **Tổng tiền** (`totalAmount`)
- **Trạng thái** (`status`)
- **Trạng thái thanh toán** (`paymentInfo.status`)
- **Ngày tạo** (`createdAt`)
- **Thao tác** (Xem chi tiết, Xác nhận thanh toán, Từ chối, Cập nhật trạng thái)

---

## 💳 Flow Xác Nhận Thanh Toán

### **Bước 1: Khách hàng tạo đơn hàng**

1. Khách hàng đặt hàng → Order được tạo với `status = "PENDING"`
2. Hệ thống tạo QR Code thanh toán
3. Khách hàng quét QR và chuyển khoản

**Trạng thái lúc này:**
```json
{
  "orderId": 35,
  "status": "PENDING",
  "paymentInfo": {
    "status": "PENDING",
    "qrCodeUrl": "https://img.vietqr.io/image/...",
    "amount": 12000
  }
}
```

---

### **Bước 2: Admin xem đơn hàng chờ xác nhận**

1. Admin vào trang `/admin/orders`
2. Lọc theo trạng thái **"PENDING"** để xem các đơn chờ xác nhận
3. Xem chi tiết đơn hàng bằng cách click icon **👁️ Xem chi tiết**

**Thông tin cần kiểm tra:**
- ✅ Mã đơn hàng (`orderId`)
- ✅ Tên khách hàng (`accountName`)
- ✅ Tổng tiền (`totalAmount`)
- ✅ Thông tin thanh toán:
  - Số tài khoản nhận (`paymentInfo.accountNo`)
  - Tên chủ tài khoản (`paymentInfo.accountName`)
  - Nội dung chuyển khoản (`paymentInfo.description`)
- ✅ Danh sách sản phẩm (`items[]`)

---

### **Bước 3: Admin xác nhận thanh toán**

**Cách 1: Từ bảng danh sách**
1. Tìm đơn hàng có `status = "PENDING"`
2. Click nút **✅ Xác nhận thanh toán** (màu xanh lá)
3. Xác nhận trong modal: "Bạn có chắc muốn xác nhận thanh toán cho đơn hàng #35?"

**Cách 2: Từ modal chi tiết**
1. Click **👁️ Xem chi tiết** để mở modal
2. Click nút **✅ Xác nhận thanh toán** ở cuối modal
3. Xác nhận trong modal

**API được gọi:**
```http
POST /api/orders/{orderId}/confirm-payment
Authorization: Bearer {admin_token}
```

**Backend xử lý:**
1. ✅ Validate: Order phải có `status = "PENDING"`
2. ✅ Tạo `PaymentInfo` mới với `status = "COMPLETED"`
3. ✅ Cập nhật `order.status = "PAID"`
4. ✅ Trả về OrderResponse với thông tin đã cập nhật

**Kết quả:**
```json
{
  "orderId": 35,
  "status": "PAID",  // ✅ Đã chuyển từ PENDING → PAID
  "paymentInfo": {
    "status": "COMPLETED",  // ✅ Đã chuyển từ PENDING → COMPLETED
    "accountNo": "19074497420010",
    "amount": 12000
  },
  "updatedAt": "2025-01-24T11:10:15.123456"
}
```

**Frontend xử lý:**
1. ✅ Gọi `confirmPayment(orderId)`
2. ✅ Clear cache `dataManager.clear('orders')`
3. ✅ Reload danh sách `loadOrders(true)`
4. ✅ Hiển thị toast success: "Đã xác nhận thanh toán thành công!"
5. ✅ Bảng tự động cập nhật, đơn hàng chuyển sang trạng thái **PAID**

---

### **Bước 4: Khách hàng nhận thông báo**

**Tự động (Polling):**
- Khách hàng đang ở trang `/customer/payment?orderId=35`
- Frontend tự động polling mỗi 3 giây để kiểm tra trạng thái
- Khi Admin xác nhận → `status` chuyển sang `PAID`
- Frontend phát hiện → Hiển thị "Đã thanh toán thành công!"
- Tự động xóa giỏ hàng (`clearCart()`)
- Dừng polling

**Trạng thái hiển thị cho khách:**
- **Trước khi Admin xác nhận:** "Chờ thanh toán" (màu cam)
- **Sau khi Admin xác nhận:** "Đã thanh toán thành công!" (màu xanh)

---

## ❌ Flow Từ Chối Đơn Hàng

### **Khi nào từ chối?**
- Khách hàng hủy đơn
- Đơn hàng không hợp lệ
- Không nhận được thanh toán sau thời gian quy định

### **Cách thực hiện:**

**Từ bảng danh sách:**
1. Tìm đơn hàng có `status = "PENDING"`
2. Click nút **❌ Từ chối đơn hàng** (màu đỏ)
3. Xác nhận trong modal: "Bạn có chắc muốn từ chối đơn hàng #35?"

**Từ modal chi tiết:**
1. Click **👁️ Xem chi tiết**
2. Click nút **❌ Từ chối đơn hàng**
3. Xác nhận trong modal

**API được gọi:**
```http
PATCH /api/orders/{orderId}/cancel
Authorization: Bearer {admin_token}
```

**Backend xử lý:**
1. ✅ Validate: Order phải có `status = "PENDING"`
2. ✅ Cập nhật `order.status = "CANCELLED"`
3. ✅ Trả về OrderResponse với status đã cập nhật

**Kết quả:**
```json
{
  "orderId": 35,
  "status": "CANCELLED",  // ✅ Đã chuyển từ PENDING → CANCELLED
  "updatedAt": "2025-01-24T11:15:30.123456"
}
```

**Frontend xử lý:**
1. ✅ Gọi `cancelOrder(orderId)`
2. ✅ Clear cache và reload danh sách
3. ✅ Hiển thị toast success: "Đã từ chối đơn hàng."
4. ✅ Bảng tự động cập nhật, đơn hàng chuyển sang trạng thái **CANCELLED**

---

## 🚚 Flow Cập Nhật Trạng Thái Đơn Hàng

### **Luồng trạng thái hợp lệ:**

```
PENDING → PAID → SHIPPED → DELIVERED
   ↓         ↓        ↓
CANCELLED CANCELLED CANCELLED
```

### **Các bước cập nhật:**

#### **1. PAID → SHIPPED (Bắt đầu giao hàng)**

**Khi nào:** Khi nhân viên đã đóng gói xong và bắt đầu giao hàng

**Cách thực hiện:**
1. Tìm đơn hàng có `status = "PAID"`
2. Click nút **🚚 Bắt đầu giao hàng** (màu xanh dương)
3. Xác nhận trong modal

**API được gọi:**
```http
PATCH /api/orders/{orderId}/status
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "status": "SHIPPED"
}
```

**Kết quả:**
```json
{
  "orderId": 35,
  "status": "SHIPPED",  // ✅ Đã chuyển từ PAID → SHIPPED
  "updatedAt": "2025-01-24T12:00:00.123456"
}
```

---

#### **2. SHIPPED → DELIVERED (Hoàn thành giao hàng)**

**Khi nào:** Khi đơn hàng đã được giao thành công cho khách hàng

**Cách thực hiện:**
1. Tìm đơn hàng có `status = "SHIPPED"`
2. Click nút **🏪 Hoàn thành giao hàng** (màu xanh lá)
3. Xác nhận trong modal

**API được gọi:**
```http
PATCH /api/orders/{orderId}/status
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "status": "DELIVERED"
}
```

**Kết quả:**
```json
{
  "orderId": 35,
  "status": "DELIVERED",  // ✅ Đã chuyển từ SHIPPED → DELIVERED
  "updatedAt": "2025-01-24T14:30:00.123456"
}
```

---

## 📊 Bảng Tóm Tắt Các API

| API Endpoint | Method | Mục đích | Khi nào dùng |
|-------------|--------|----------|--------------|
| `/api/orders/all` | GET | Lấy tất cả đơn hàng | Khi vào trang quản lý |
| `/api/orders/{orderId}` | GET | Lấy chi tiết đơn hàng | Khi xem chi tiết |
| `/api/orders/{orderId}/confirm-payment` | POST | Xác nhận thanh toán | Khi Admin xác nhận khách đã chuyển khoản |
| `/api/orders/{orderId}/cancel` | PATCH | Từ chối đơn hàng | Khi Admin từ chối đơn PENDING |
| `/api/orders/{orderId}/status` | PATCH | Cập nhật trạng thái | Khi cập nhật PAID→SHIPPED, SHIPPED→DELIVERED |

---

## 🎨 UI/UX Flow

### **1. Bảng danh sách đơn hàng**

**Các nút hiển thị theo trạng thái:**

| Trạng thái | Các nút hiển thị |
|-----------|------------------|
| **PENDING** | 👁️ Xem chi tiết<br>✅ Xác nhận thanh toán<br>❌ Từ chối đơn hàng |
| **PAID** | 👁️ Xem chi tiết<br>🚚 Bắt đầu giao hàng |
| **SHIPPED** | 👁️ Xem chi tiết<br>🏪 Hoàn thành giao hàng |
| **DELIVERED** | 👁️ Xem chi tiết |
| **CANCELLED** | 👁️ Xem chi tiết |

### **2. Modal chi tiết đơn hàng**

**Hiển thị:**
- ✅ Thông tin đơn hàng (mã đơn, khách hàng, địa chỉ, số điện thoại)
- ✅ Tổng tiền
- ✅ Trạng thái đơn hàng (Tag màu)
- ✅ Trạng thái thanh toán (Tag màu)
- ✅ Thông tin thanh toán (nếu có):
  - Số tài khoản
  - Tên chủ tài khoản
  - QR Code URL
- ✅ Danh sách sản phẩm (bảng)
- ✅ Ngày tạo, ngày cập nhật
- ✅ Ghi chú (nếu có)

**Các nút thao tác:**
- Tương tự như bảng danh sách, hiển thị theo trạng thái

---

## ⚠️ Lưu Ý Quan Trọng

### **1. Quyền truy cập**
- ✅ Chỉ **ADMIN** và **STAFF** mới có quyền:
  - Xem tất cả đơn hàng (`GET /api/orders/all`)
  - Xác nhận thanh toán (`POST /api/orders/{orderId}/confirm-payment`)
  - Cập nhật trạng thái (`PATCH /api/orders/{orderId}/status`)
- ❌ **CUSTOMER** không có quyền truy cập trang `/admin/orders`

### **2. Validation Backend**
- ✅ `confirmPayment`: Chỉ có thể xác nhận đơn có `status = "PENDING"`
- ✅ `cancelOrder`: Chỉ có thể hủy đơn có `status = "PENDING"`
- ✅ `updateOrderStatus`: Chỉ có thể chuyển trạng thái theo luồng hợp lệ

### **3. Error Handling**
- ✅ Nếu API trả về lỗi (400, 401, 403, 404), Frontend sẽ hiển thị toast error
- ✅ Console log chi tiết để debug
- ✅ Tự động reload danh sách sau khi thành công

### **4. Cache Management**
- ✅ Sau mỗi thao tác (confirm, cancel, update status), Frontend sẽ:
  1. Clear cache: `dataManager.clear('orders')`
  2. Reload danh sách: `loadOrders(true)`
  3. Đảm bảo dữ liệu luôn mới nhất

---

## 🔍 Debug Tips

### **Kiểm tra API có được gọi không:**
1. Mở Developer Tools (F12) → Tab **Network**
2. Thực hiện thao tác (confirm, cancel, update status)
3. Tìm request tương ứng:
   - `POST /api/orders/{orderId}/confirm-payment`
   - `PATCH /api/orders/{orderId}/cancel`
   - `PATCH /api/orders/{orderId}/status`
4. Kiểm tra:
   - ✅ Status code: `200 OK` (thành công)
   - ✅ Response body: Có `status` đã được cập nhật
   - ❌ Status code: `400, 401, 403, 404` (lỗi)

### **Kiểm tra Console Logs:**
- Tìm logs có prefix `📦 AdminOrdersPage:` hoặc `📦 Orders:`
- Xem chi tiết request/response

### **Kiểm tra State:**
- Xem `orders` state có được cập nhật không
- Xem `filteredOrders` có đúng không

---

## 📝 Checklist Khi Xác Nhận Thanh Toán

Trước khi click "Xác nhận thanh toán", Admin cần kiểm tra:

- [ ] ✅ Đơn hàng có `status = "PENDING"`
- [ ] ✅ Đã kiểm tra tài khoản ngân hàng nhận được tiền
- [ ] ✅ Số tiền khớp với `totalAmount`
- [ ] ✅ Nội dung chuyển khoản khớp với `paymentInfo.description`
- [ ] ✅ Khách hàng đã chuyển khoản đúng số tiền
- [ ] ✅ Không có vấn đề gì với đơn hàng

Sau khi xác nhận:

- [ ] ✅ Đơn hàng chuyển sang `status = "PAID"`
- [ ] ✅ `paymentInfo.status` chuyển sang `"COMPLETED"`
- [ ] ✅ Khách hàng nhận được thông báo (tự động qua polling)
- [ ] ✅ Giỏ hàng của khách được xóa (tự động)

---

## 🎯 Tóm Tắt Flow Hoàn Chỉnh

```
1. Khách hàng đặt hàng
   ↓
2. Order tạo với status = "PENDING"
   ↓
3. Khách quét QR và chuyển khoản
   ↓
4. Admin vào /admin/orders
   ↓
5. Admin xem đơn PENDING và kiểm tra thông tin
   ↓
6. Admin click "Xác nhận thanh toán"
   ↓
7. Backend cập nhật: PENDING → PAID, paymentInfo.status → COMPLETED
   ↓
8. Frontend reload danh sách
   ↓
9. Khách hàng (đang ở PaymentPage) nhận thông báo qua polling
   ↓
10. Giỏ hàng tự động xóa
   ↓
11. Admin có thể cập nhật: PAID → SHIPPED → DELIVERED
```

---

**Tài liệu này được cập nhật lần cuối:** 2025-01-24

