# 💳 Flow Thanh Toán QR Code - Hướng Dẫn Chi Tiết

## 📋 Tổng Quan

Flow thanh toán QR code bao gồm các bước từ tạo order đến xác nhận thanh toán thành công.

---

## 🔄 Flow Tổng Thể

```
1. User điền form checkout
   ↓
2. Submit → Tạo Order (POST /api/orders)
   ↓
3. Backend tạo Order + QR Payment Info
   ↓
4. Frontend nhận Order với paymentInfo.qrCodeUrl
   ↓
5. Render QR Code từ URL
   ↓
6. User quét QR và chuyển khoản
   ↓
7. [Tự động] Polling check trạng thái mỗi 5s
   ↓
8. [Thủ công] User click "Tôi đã chuyển khoản"
   ↓
9. Xác nhận thanh toán → Update status
   ↓
10. Clear cart → Hiển thị thông báo thành công
```

---

## 📝 Chi Tiết Từng Bước

### **Bước 1: Tạo Order và Nhận QR Code**

**File**: `Checkout.jsx` - `handleSubmit()`

```javascript
// 1. User điền form và submit
const payload = {
  accountId: user.id,
  shippingAddress: values.address,
  phoneContact: values.phone,
  note: values.note,
  items: cartItems.map(item => ({
    productId: item.productId,
    quantity: item.quantity
  }))
};

// 2. Gọi API tạo order
const response = await createOrder(payload);
// API: POST /api/orders
// Response: {
//   orderId: 27,
//   totalAmount: 7000,
//   status: "PENDING",
//   paymentInfo: {
//     qrCodeUrl: "https://img.vietqr.io/image/...",
//     bankId: "970407",
//     accountNo: "19074497420010",
//     accountName: "NGUYEN TRAN GIA HUNG",
//     amount: 7000,
//     description: "PETVIBE ORDER 27",
//     status: "PENDING"
//   }
// }

// 3. Set order state và ref
orderRef.current = createdOrder;  // Persist vào ref
setOrder(createdOrder);           // Set state để render

// 4. Bắt đầu polling tự động
setPolling(true);
```

**Kết quả**:
- ✅ Order được tạo với `status: "PENDING"`
- ✅ QR Code URL được trả về trong `paymentInfo.qrCodeUrl`
- ✅ Component render QR code từ URL
- ✅ Polling bắt đầu tự động check trạng thái

---

### **Bước 2: Render QR Code**

**File**: `Checkout.jsx` - `renderOrderSuccess()`

```javascript
// Đọc qrCodeUrl từ paymentInfo
const paymentInfo = orderToRender?.paymentInfo || {};
const qrUrl = paymentInfo.qrCodeUrl || '';

// Render img tag với URL
<img
  key={`${orderToRender?.orderId}-${qrUrl}`}
  src={qrUrl}
  alt="QR Code thanh toán"
  style={{ width: '250px', height: '250px' }}
/>
```

**QR Code URL Format**:
```
https://img.vietqr.io/image/970407-19074497420010-compact2.png?
  amount=7000&
  addInfo=PETVIBE+ORDER+27&
  accountName=NGUYEN+TRAN+GIA+HUNG
```

**Thông tin hiển thị**:
- QR Code image
- Số tiền: `paymentInfo.amount`
- Ngân hàng: `paymentInfo.bankId`
- Số tài khoản: `paymentInfo.accountNo`
- Tên tài khoản: `paymentInfo.accountName`
- Nội dung: `paymentInfo.description`

---

### **Bước 3: User Quét QR và Chuyển Khoản**

**User thực hiện**:
1. Mở app ngân hàng trên điện thoại
2. Quét QR code trên màn hình
3. Kiểm tra thông tin:
   - Số tiền: `7000 VNĐ`
   - Nội dung: `PETVIBE ORDER 27`
   - Tài khoản nhận: `NGUYEN TRAN GIA HUNG`
4. Xác nhận chuyển khoản

**Lưu ý**:
- ⚠️ Phải chuyển đúng số tiền
- ⚠️ Phải ghi đúng nội dung (ORDER ID)
- ⚠️ Chuyển khoản đến đúng tài khoản

---

### **Bước 4: Polling Tự Động Check Trạng Thái**

**File**: `Checkout.jsx` - `useEffect` polling

```javascript
// Polling mỗi 5 giây
useEffect(() => {
  if (!order?.orderId || !polling) return;
  
  // Dừng nếu đã thanh toán
  if (paymentStatus === 'COMPLETED' || orderStatus === 'PAID') {
    setPolling(false);
    return;
  }
  
  // Bắt đầu polling
  pollingIntervalRef.current = setInterval(async () => {
    // Gọi API check order status
    const updatedOrder = await getOrderById(order.orderId);
    // API: GET /api/orders/{orderId}
    
    setOrder(updatedOrder);
    
    // Nếu thanh toán thành công
    if (updatedPaymentStatus === 'COMPLETED' || updatedOrderStatus === 'PAID') {
      setPolling(false);
      clearCart();  // Xóa cart
      showSuccess('Thanh toán thành công!');
    }
  }, 5000);  // Mỗi 5 giây
}, [order?.orderId, polling]);
```

**Điều kiện dừng polling**:
- ✅ `paymentInfo.status === 'COMPLETED'`
- ✅ `order.status === 'PAID'`
- ✅ User đóng trang
- ✅ Component unmount

**Kết quả khi polling phát hiện thanh toán**:
- ✅ Dừng polling
- ✅ Clear cart
- ✅ Hiển thị thông báo thành công
- ✅ Cập nhật UI (hiển thị "Thanh toán thành công")

---

### **Bước 5: Xác Nhận Thanh Toán Thủ Công**

**File**: `Checkout.jsx` - `handleConfirmPayment()`

```javascript
// User click "Tôi đã chuyển khoản"
const handleConfirmPayment = async () => {
  // Gọi API xác nhận thanh toán
  const response = await confirmPaymentApi(order.orderId);
  // API: POST /api/orders/{orderId}/confirm-payment
  
  // Cập nhật order state
  const updatedOrder = {
    ...order,
    status: 'PAID',
    paymentInfo: {
      ...order.paymentInfo,
      status: 'COMPLETED'
    }
  };
  
  setOrder(updatedOrder);
  setPolling(false);  // Dừng polling
  
  // Xóa cart nếu thanh toán thành công
  if (paymentStatus === 'COMPLETED') {
    clearCart();
  }
  
  showSuccess('Thanh toán thành công!');
};
```

**Khi nào dùng**:
- User đã chuyển khoản nhưng hệ thống chưa tự động phát hiện
- User muốn xác nhận ngay lập tức
- Polling chưa kịp phát hiện thanh toán

**Kết quả**:
- ✅ Order status → `PAID`
- ✅ Payment status → `COMPLETED`
- ✅ Dừng polling
- ✅ Clear cart
- ✅ Hiển thị thông báo thành công

---

### **Bước 6: Refresh QR Code (Nếu Cần)**

**File**: `Checkout.jsx` - `handleRefreshQR()`

```javascript
// User click "Lấy lại mã QR" hoặc "Nhận QR mới"
const handleRefreshQR = async () => {
  // Gọi API lấy QR code mới
  const response = await getPaymentQR(order.orderId);
  // API: GET /api/orders/{orderId}/payment-qr
  
  // Cập nhật paymentInfo với QR mới
  setOrder((prev) => ({
    ...prev,
    paymentInfo: {
      ...prev.paymentInfo,
      ...response.paymentInfo
    }
  }));
  
  showSuccess('Đã làm mới mã QR thành công.');
};
```

**Khi nào dùng**:
- QR code bị lỗi không hiển thị
- QR code hết hạn
- User muốn lấy QR code mới với số tiền mới

**Lưu ý**:
- ⚠️ Chỉ có thể lấy QR mới khi `order.status === 'PENDING'`
- ⚠️ QR code mới sẽ có số tiền và ORDER ID giống cũ

---

## 🔍 Các Trạng Thái Order và Payment

### **Order Status**
- `PENDING`: Chờ thanh toán
- `PAID`: Đã thanh toán
- `SHIPPED`: Đang giao hàng
- `DELIVERED`: Đã giao hàng
- `CANCELLED`: Đã hủy

### **Payment Status**
- `PENDING`: Đang chờ thanh toán
- `COMPLETED`: Đã thanh toán thành công
- `FAILED`: Thanh toán thất bại
- `EXPIRED`: Hết hạn thanh toán

---

## 🎯 Các API Endpoints

### **1. Tạo Order**
```
POST /api/orders
Request: {
  accountId: number,
  shippingAddress: string,
  phoneContact: string,
  note?: string,
  items: Array<{productId: number, quantity: number}>
}
Response: {
  orderId: number,
  totalAmount: number,
  status: "PENDING",
  paymentInfo: {
    qrCodeUrl: string,
    bankId: string,
    accountNo: string,
    accountName: string,
    amount: number,
    description: string,
    status: "PENDING"
  }
}
```

### **2. Lấy Order By ID**
```
GET /api/orders/{orderId}
Response: {
  orderId: number,
  status: string,
  paymentInfo: {
    status: string,
    ...
  }
}
```

### **3. Xác Nhận Thanh Toán**
```
POST /api/orders/{orderId}/confirm-payment
Response: {
  orderId: number,
  status: "PAID",
  paymentInfo: {
    status: "COMPLETED",
    ...
  }
}
```

### **4. Lấy QR Code Mới**
```
GET /api/orders/{orderId}/payment-qr
Response: {
  qrCodeUrl: string,
  bankId: string,
  accountNo: string,
  accountName: string,
  amount: number,
  description: string,
  status: "PENDING"
}
```

---

## 🐛 Debug và Troubleshooting

### **Vấn đề 1: QR Code không hiển thị**

**Nguyên nhân**:
- `paymentInfo.qrCodeUrl` bị null/undefined
- Component remount và state bị reset
- URL không hợp lệ

**Giải pháp**:
```javascript
// Check orderRef.current nếu order state bị reset
const currentOrder = orderRef.current || order;
const qrUrl = currentOrder?.paymentInfo?.qrCodeUrl || '';

// Log để debug
console.log('QR URL:', {
  order: !!order,
  orderRef: !!orderRef.current,
  qrUrl: qrUrl
});
```

### **Vấn đề 2: Polling không dừng**

**Nguyên nhân**:
- `paymentStatus` không được cập nhật đúng
- Interval không được clear

**Giải pháp**:
```javascript
// Đảm bảo clear interval khi unmount
useEffect(() => {
  return () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  };
}, []);
```

### **Vấn đề 3: Cart không được xóa sau thanh toán**

**Nguyên nhân**:
- `paymentStatus` không phải `COMPLETED`
- `clearCart()` không được gọi

**Giải pháp**:
```javascript
// Chỉ xóa cart khi paymentStatus === 'COMPLETED'
const paymentStatus = updatedOrder.paymentInfo?.status;
if (paymentStatus === 'COMPLETED') {
  clearCart();
}
```

---

## 📊 Flow Diagram

```
┌─────────────────┐
│  User Submit    │
│  Checkout Form  │
└────────┬─────────┘
         │
         ▼
┌─────────────────┐
│  POST /orders   │
│  Create Order   │
└────────┬─────────┘
         │
         ▼
┌─────────────────┐
│  Receive Order  │
│  + QR Code URL  │
└────────┬─────────┘
         │
         ▼
┌─────────────────┐
│  Render QR Code │
│  + Start Polling│
└────────┬─────────┘
         │
         ▼
┌─────────────────┐
│  User Scan QR   │
│  & Transfer     │
└────────┬─────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌────────┐ ┌──────────────┐
│ Polling│ │ Manual       │
│ Auto   │ │ Confirm       │
│ Check  │ │ Payment       │
└───┬────┘ └──────┬────────┘
    │             │
    └─────┬───────┘
          │
          ▼
┌─────────────────┐
│ Payment Status  │
│ = COMPLETED     │
└────────┬─────────┘
         │
         ▼
┌─────────────────┐
│ Clear Cart      │
│ Show Success    │
└─────────────────┘
```

---

## ✅ Checklist Test

- [ ] Tạo order thành công
- [ ] QR code hiển thị đúng
- [ ] Thông tin thanh toán đầy đủ (số tiền, tài khoản, nội dung)
- [ ] Polling bắt đầu tự động
- [ ] Polling check trạng thái mỗi 5s
- [ ] Polling dừng khi thanh toán thành công
- [ ] "Tôi đã chuyển khoản" hoạt động đúng
- [ ] Cart được xóa sau thanh toán
- [ ] "Lấy lại mã QR" hoạt động đúng
- [ ] UI cập nhật đúng khi thanh toán thành công

---

## 📝 Notes

1. **Order State Persistence**: Dùng `orderRef` để persist order state khi component remount
2. **Polling Interval**: 5 giây là hợp lý, không quá nhanh (spam server) và không quá chậm (user experience)
3. **Cart Clearing**: Chỉ xóa cart khi `paymentStatus === 'COMPLETED'`, không xóa khi tạo order
4. **Error Handling**: Cần handle các trường hợp:
   - Network error
   - API error (400, 401, 403, 500)
   - QR code không load được
   - Polling timeout

---

**Last Updated**: 2024
**Version**: 1.0

