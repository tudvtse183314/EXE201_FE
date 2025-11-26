# 📊 PHÂN TÍCH FLOW PAYMENT VÀ XÁC NHẬN THANH TOÁN

## 🔍 TỔNG QUAN

Hệ thống sử dụng **VietQR API** để tạo QR code thanh toán và **manual confirmation** (xác nhận thủ công) để cập nhật trạng thái thanh toán. **KHÔNG có webhook tự động** từ ngân hàng.

---

## 📋 FLOW CHI TIẾT

### **BƯỚC 1: TẠO ĐƠN HÀNG (Create Order)**

#### Request:
```http
POST /api/orders
Content-Type: application/json
Authorization: Bearer {token}
```

#### Request Body:
```json
{
  "accountId": 79,
  "shippingAddress": "Tỉnh/ Huyện/ Xã/ địa chỉ chi tiết/ Ghi chú",
  "phoneContact": "0911111114",
  "note": "Ghi chú đơn hàng",
  "items": [
    {
      "productId": 13,
      "quantity": 6
    },
    {
      "productId": 11,
      "quantity": 1
    }
  ]
}
```

#### Backend Logic (`OrderAPI.createOrder`):
1. **Tạo Order** với `status = "PENDING"` (mặc định)
2. **Tính `totalAmount`** từ các items
3. **Tạo PaymentInfo** bằng `QRPaymentService.generatePaymentInfo()`:
   - Tạo QR code URL từ VietQR API
   - Set `paymentInfo.status = "PENDING"` (mặc định)
4. **Trả về OrderResponse** với `paymentInfo` kèm theo

#### Response:
```json
{
  "orderId": 35,
  "status": "PENDING",
  "totalAmount": 12000,
  "shippingAddress": "Tỉnh/ Huyện/ Xã/ địa chỉ chi tiết/ Ghi chú",
  "phoneContact": "0911111114",
  "note": "Ghi chú đơn hàng",
  "items": [
    {
      "productId": 13,
      "productName": "meoFood",
      "quantity": 6,
      "price": 10000
    },
    {
      "productId": 11,
      "productName": "Laze",
      "quantity": 1,
      "price": 2000
    }
  ],
  "paymentInfo": {
    "qrCodeUrl": "https://img.vietqr.io/image/970407-19074497420010-compact2.png?amount=12000&addInfo=PETVIBE+ORDER+35&accountName=NGUYEN+TRAN+GIA+HUNG",
    "bankId": "970407",
    "accountNo": "19074497420010",
    "accountName": "NGUYEN TRAN GIA HUNG",
    "amount": 12000,
    "description": "PETVIBE ORDER 35",
    "status": "PENDING",
    "message": "Vui lòng quét mã QR để thanh toán đơn hàng. Nội dung chuyển khoản: PETVIBE ORDER 35"
  },
  "createdAt": "2025-11-24T11:06:03.349922",
  "updatedAt": "2025-11-24T11:06:03.349120599"
}
```

#### QR Code Generation (`QRPaymentService.generatePaymentQR`):
```java
// URL format:
https://img.vietqr.io/image/{BANK_ID}-{ACCOUNT_NO}-{TEMPLATE}.png
  ?amount={amount}
  &addInfo={description}
  &accountName={accountName}

// Ví dụ:
https://img.vietqr.io/image/970407-19074497420010-compact2.png
  ?amount=12000
  &addInfo=PETVIBE+ORDER+35
  &accountName=NGUYEN+TRAN+GIA+HUNG
```

**Lưu ý quan trọng:**
- QR code này là **tĩnh** (static), không có webhook callback
- Ngân hàng **KHÔNG tự động thông báo** cho backend khi có giao dịch
- User phải **tự quét QR và chuyển khoản** bằng app ngân hàng của họ

---

### **BƯỚC 2: NGƯỜI DÙNG CHUYỂN KHOẢN**

1. User quét QR code bằng app ngân hàng (Vietcombank, Techcombank, v.v.)
2. App ngân hàng hiển thị:
   - **Số tiền**: 12,000 VNĐ
   - **Tài khoản nhận**: 19074497420010 (NGUYEN TRAN GIA HUNG)
   - **Nội dung**: PETVIBE ORDER 35
3. User xác nhận và chuyển khoản
4. **Giao dịch hoàn tất ở phía ngân hàng**
5. **Backend CHƯA biết** giao dịch đã thành công

---

### **BƯỚC 3: XÁC NHẬN THANH TOÁN (Manual Confirmation)**

#### Request:
```http
POST /api/orders/{orderId}/confirm-payment
Authorization: Bearer {token}
```

#### Backend Logic (`OrderAPI.confirmPayment`):

```java
@PostMapping("/{orderId}/confirm-payment")
public ResponseEntity<?> confirmPayment(@PathVariable Long orderId) {
    // 1. Lấy order từ database
    Order order = orderService.getOrderById(orderId);
    
    // 2. Validate: Order phải đang ở trạng thái PENDING
    if (!"PENDING".equals(order.getStatus())) {
        return ResponseEntity.badRequest()
            .body("Order is not in PENDING status. Current status: " + order.getStatus());
    }
    
    // 3. Tạo PaymentInfo mới với status = "COMPLETED"
    QRPaymentService.PaymentInfo paymentInfo = qrPaymentService.generatePaymentInfo(
        order.getId(),
        order.getTotalAmount()
    );
    paymentInfo.setStatus("COMPLETED");
    
    // 4. Cập nhật order.status = "PAID" (quan trọng!)
    order = orderService.updateOrderStatus(orderId, "PAID");
    
    // 5. Trả về OrderResponse với paymentInfo
    OrderResponse response = orderMapper.toResponseWithPayment(order, paymentInfo);
    return ResponseEntity.ok(response);
}
```

#### Response:
```json
{
  "orderId": 35,
  "status": "PAID",  // ✅ Đã được cập nhật từ "PENDING" → "PAID"
  "totalAmount": 12000,
  "paymentInfo": {
    "qrCodeUrl": "https://img.vietqr.io/image/...",
    "bankId": "970407",
    "accountNo": "19074497420010",
    "accountName": "NGUYEN TRAN GIA HUNG",
    "amount": 12000,
    "description": "PETVIBE ORDER 35",
    "status": "COMPLETED",  // ✅ Đã được cập nhật từ "PENDING" → "COMPLETED"
    "message": "Vui lòng quét mã QR để thanh toán đơn hàng..."
  },
  "items": [...],
  "updatedAt": "2025-11-24T11:10:15.123456"  // ✅ Timestamp cập nhật
}
```

#### Order Status Transition (`OrderService.updateOrderStatus`):

```java
// Valid transitions:
"PENDING" → ["PAID", "CANCELLED"]
"PAID" → ["SHIPPED", "CANCELLED"]
"SHIPPED" → ["DELIVERED", "CANCELLED"]
"DELIVERED" → []  // Không thể chuyển sang trạng thái khác
"CANCELLED" → []  // Không thể chuyển sang trạng thái khác
```

**Khi gọi `confirmPayment`:**
- `order.status`: `"PENDING"` → `"PAID"` ✅
- `paymentInfo.status`: `"PENDING"` → `"COMPLETED"` ✅

---

### **BƯỚC 4: VERIFY PAYMENT STATUS (Optional)**

Frontend có thể gọi `GET /api/orders/{orderId}` để verify lại status:

#### Request:
```http
GET /api/orders/{orderId}
Authorization: Bearer {token}
```

#### Response:
```json
{
  "orderId": 35,
  "status": "PAID",  // ✅ Đã được cập nhật
  "totalAmount": 12000,
  // ⚠️ Lưu ý: getOrderById KHÔNG trả về paymentInfo
  // (dùng toResponse, không phải toResponseWithPayment)
  "items": [...]
}
```

**Lưu ý:** `getOrderById` **KHÔNG trả về `paymentInfo`** vì dùng `orderMapper.toResponse()` thay vì `toResponseWithPayment()`.

---

## 🔄 SO SÁNH CÁC API PAYMENT

### **1. POST `/api/orders/{orderId}/confirm-payment`** (Shortcut - Khuyên dùng)
- **Mục đích**: Xác nhận thanh toán thành công (shortcut)
- **Logic**: 
  - Set `paymentInfo.status = "COMPLETED"`
  - Set `order.status = "PAID"`
- **Validation**: Order phải đang `PENDING`
- **Response**: `OrderResponse` với `paymentInfo` kèm theo

### **2. PATCH `/api/orders/{orderId}/payment-status`** (Manual Update)
- **Mục đích**: Cập nhật trạng thái thanh toán thủ công
- **Request Body**:
  ```json
  {
    "paymentStatus": "COMPLETED" | "PENDING" | "FAILED" | "EXPIRED"
  }
  ```
- **Logic**:
  - Set `paymentInfo.status = {paymentStatus}`
  - Nếu `paymentStatus = "COMPLETED"` và `order.status = "PENDING"`:
    - Set `order.status = "CONFIRMED"` (⚠️ khác với `confirmPayment` là `"PAID"`)
- **Response**: `OrderResponse` với `paymentInfo` kèm theo

### **3. GET `/api/orders/{orderId}`** (Get Order Details)
- **Mục đích**: Lấy chi tiết đơn hàng
- **Response**: `OrderResponse` **KHÔNG có `paymentInfo`**
- **Lưu ý**: Dùng để verify `order.status`, không dùng để lấy `paymentInfo`

---

## ⚠️ ĐIỂM QUAN TRỌNG

### **1. Không có Webhook tự động**
- Backend **KHÔNG nhận được thông báo tự động** từ ngân hàng khi có giao dịch
- User phải **tự xác nhận** bằng cách click "Tôi đã chuyển khoản"
- Đây là **manual confirmation flow**, không phải automatic

### **2. PaymentInfo là In-Memory**
- `PaymentInfo` là object trong memory, **KHÔNG lưu vào database**
- Mỗi lần gọi API, backend tạo lại `PaymentInfo` từ `QRPaymentService.generatePaymentInfo()`
- Chỉ có `order.status` được lưu vào database

### **3. Status Mapping**
- `order.status`: `"PENDING"` → `"PAID"` (khi confirm payment)
- `paymentInfo.status`: `"PENDING"` → `"COMPLETED"` (khi confirm payment)
- Frontend cần check **cả 2** để xác định đã thanh toán:
  ```javascript
  const isPaid = status === 'PAID' || paymentStatus === 'COMPLETED';
  ```

### **4. QR Code là Static**
- QR code URL được tạo từ VietQR API, **không thay đổi** theo thời gian
- Cùng một order sẽ luôn có cùng QR code URL
- QR code **không có expiration time** (cần tự implement nếu cần)

---

## 📊 FLOW DIAGRAM

```
┌─────────────┐
│   User      │
│  (Frontend) │
└──────┬──────┘
       │
       │ 1. POST /api/orders
       │    { items, shippingAddress, ... }
       ▼
┌─────────────────┐
│   Backend       │
│  OrderAPI       │
└──────┬──────────┘
       │
       │ 2. Create Order (status = "PENDING")
       │ 3. Generate QR Code (VietQR API)
       │ 4. Return OrderResponse + PaymentInfo
       │
       ▼
┌─────────────────┐
│   Frontend      │
│  PaymentPage    │
└──────┬──────────┘
       │
       │ 5. Display QR Code
       │ 6. User quét QR và chuyển khoản
       │    (bằng app ngân hàng)
       │
       ▼
┌─────────────────┐
│   Ngân hàng     │
│  (VietQR)       │
└──────┬──────────┘
       │
       │ 7. Giao dịch hoàn tất
       │    (Backend CHƯA biết)
       │
       ▼
┌─────────────────┐
│   User          │
│  (Frontend)     │
└──────┬──────────┘
       │
       │ 8. User click "Tôi đã chuyển khoản"
       │ 9. POST /api/orders/{orderId}/confirm-payment
       │
       ▼
┌─────────────────┐
│   Backend       │
│  OrderAPI       │
└──────┬──────────┘
       │
       │ 10. Validate order.status = "PENDING"
       │ 11. Set paymentInfo.status = "COMPLETED"
       │ 12. Update order.status = "PAID"
       │ 13. Return OrderResponse
       │
       ▼
┌─────────────────┐
│   Frontend      │
│  PaymentPage    │
└──────┬──────────┘
       │
       │ 14. Verify status (optional)
       │     GET /api/orders/{orderId}
       │ 15. Clear cart
       │ 16. Show success message
       │
       ▼
    ✅ DONE
```

---

## 🎯 KẾT LUẬN

### **Flow hiện tại:**
1. ✅ Tạo order → Trả về QR code
2. ✅ User chuyển khoản bằng app ngân hàng
3. ✅ User click "Tôi đã chuyển khoản" → Backend cập nhật status
4. ✅ Frontend verify và clear cart

### **Điểm mạnh:**
- ✅ Đơn giản, dễ implement
- ✅ Không cần tích hợp webhook phức tạp
- ✅ User có quyền kiểm soát khi nào xác nhận

### **Điểm yếu:**
- ⚠️ Phụ thuộc vào user tự xác nhận (có thể quên hoặc gian lận)
- ⚠️ Không có cơ chế tự động verify giao dịch từ ngân hàng
- ⚠️ Cần admin/staff kiểm tra thủ công để đảm bảo giao dịch thực sự đã thành công

### **Cải thiện có thể:**
1. **Tích hợp VietQR Webhook** (nếu có): Tự động nhận thông báo khi có giao dịch
2. **Bank Statement Parsing**: Tự động parse sao kê ngân hàng để verify
3. **Admin Verification**: Cho phép admin/staff xác nhận thanh toán thay vì user
4. **Payment Expiration**: Tự động expire QR code sau một thời gian

---

## 📝 REQUEST/RESPONSE SUMMARY

### **Create Order**
- **Request**: `POST /api/orders` với `OrderRequest`
- **Response**: `OrderResponse` với `paymentInfo.status = "PENDING"`, `order.status = "PENDING"`

### **Confirm Payment**
- **Request**: `POST /api/orders/{orderId}/confirm-payment` (không có body)
- **Response**: `OrderResponse` với `paymentInfo.status = "COMPLETED"`, `order.status = "PAID"`

### **Get Order**
- **Request**: `GET /api/orders/{orderId}`
- **Response**: `OrderResponse` **KHÔNG có `paymentInfo`** (chỉ có `order.status`)

---

**Tài liệu này được tạo dựa trên phân tích code backend tại:**
- `EXE201-BE/src/main/java/com/example/web_petvibe/api/OrderAPI.java`
- `EXE201-BE/src/main/java/com/example/web_petvibe/service/QRPaymentService.java`
- `EXE201-BE/src/main/java/com/example/web_petvibe/service/OrderService.java`

