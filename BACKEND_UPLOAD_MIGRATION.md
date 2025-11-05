# ✅ Migration từ Firebase Storage sang Backend Upload (MySQL BLOB)

## 📋 Tổng quan

Đã chuyển đổi hoàn toàn hệ thống upload ảnh từ Firebase Storage sang Backend (Spring Boot), lưu ảnh dưới dạng BLOB trong MySQL. Frontend giờ upload trực tiếp lên BE và render ảnh từ URL của BE.

---

## ✅ Các thay đổi đã thực hiện

### 1. **Service Upload mới** (`src/services/uploads.js`)
- ✅ Tạo `uploadImageToBE()`: Upload ảnh lên BE qua `POST /api/uploads`
- ✅ Tạo `deleteImageFromBE()`: Xóa ảnh từ BE (optional)
- ✅ Validate file type và size (max 5MB)
- ✅ Trả về relative URL: `/api/uploads/{id}`

### 2. **Normalize Product Data** (`src/services/products.js`)
- ✅ Tạo hàm `normalizeProduct()` để chuẩn hóa product data
- ✅ Đảm bảo luôn có field `imageUrl` (từ `imageUrl` > `image_url` > `image`)
- ✅ Normalize category data
- ✅ Áp dụng normalize cho tất cả functions: `getAllProducts()`, `getProductById()`, `getProductsByCategory()`

### 3. **Admin Products Page** (`src/pages/admin/products/ProductsPage.jsx`)
- ✅ Thay `uploadImage` (Firebase) → `uploadImageToBE` (Backend)
- ✅ Thay `deleteImageByUrl` (Firebase) → `deleteImageFromBE` (Backend)
- ✅ Sửa `handleImageUpload()`: Upload lên BE, build full URL cho preview
- ✅ Sửa `handleRemoveImage()`: Xóa từ BE nếu cần
- ✅ Sửa `customRequest()`: Dùng BE upload
- ✅ Sửa `handleSubmit()`: Gửi cả `imageUrl` và `image_url` (để BE nào cũng nhận), normalize URL
- ✅ Sửa `handleEdit()`: Build full URL cho preview khi edit
- ✅ Sửa cột image: Dùng `record.imageUrl` (đã normalize), build full URL, có fallback

### 4. **Staff Products Page** (`src/pages/staff/StaffProductsPage.jsx`)
- ✅ Tương tự Admin Page: Thay Firebase → Backend upload
- ✅ Tất cả upload/delete/render đều dùng BE

### 5. **Shop Page** (`src/pages/public/Shop.jsx`)
- ✅ Sửa render ảnh: Dùng `product.imageUrl` (đã normalize)
- ✅ Build full URL từ relative path `/api/uploads/{id}` nếu cần
- ✅ Có fallback image nếu không có ảnh

### 6. **ProductCard Component** (`src/components/common/ProductCard.jsx`)
- ✅ Sửa render ảnh: Dùng `product.imageUrl` (đã normalize)
- ✅ Build full URL từ relative path nếu cần
- ✅ Có placeholder fallback

---

## 🔧 Luồng hoạt động

### Upload Flow:
1. Admin/Staff chọn ảnh → `handleImageUpload()` hoặc `customRequest()`
2. Validate: Type (jpg/png/webp/avif), Size (max 5MB)
3. Upload lên BE: `POST /api/uploads` (multipart/form-data)
4. BE trả về: `{ id, url: "/api/uploads/{id}", contentType, size }`
5. FE lưu relative URL vào form: `/api/uploads/{id}`
6. Khi submit: Gửi `imageUrl` và `image_url` (cả 2 field) → BE lưu vào MySQL
7. Preview: Build full URL cho Ant Design Upload component

### Render Flow:
1. `getAllProducts()` từ BE → Normalize → `product.imageUrl` luôn có
2. Nếu `imageUrl` là relative path (`/api/uploads/{id}`):
   - Build full URL: `{baseURL}/api/uploads/{id}`
3. Render: `<img src={fullUrl} />` hoặc `<LazyLoadImage>`
4. Fallback nếu không có ảnh hoặc lỗi load

---

## 📝 Files đã thay đổi

### Mới tạo:
- ✅ `src/services/uploads.js` - Service upload lên BE

### Đã sửa:
- ✅ `src/services/products.js` - Normalize product data
- ✅ `src/pages/admin/products/ProductsPage.jsx` - Thay Firebase → BE
- ✅ `src/pages/staff/StaffProductsPage.jsx` - Thay Firebase → BE
- ✅ `src/pages/public/Shop.jsx` - Render từ BE URL
- ✅ `src/components/common/ProductCard.jsx` - Render từ BE URL

### Không cần dùng nữa (có thể xóa sau):
- ⚠️ `src/lib/firebase.js` - Không còn dùng cho upload (có thể giữ lại nếu cần cho tính năng khác)

---

## 🔍 URL Format

### Backend trả về (relative):
```
/api/uploads/123
```

### Frontend build full URL để render:
```
https://exe201-be-uhno.onrender.com/api/uploads/123
```

### Lưu vào database:
- `imageUrl`: `/api/uploads/123`
- `image_url`: `/api/uploads/123` (backup field)

---

## ✅ Checklist Test

- [ ] Upload ảnh từ Admin → Kiểm tra BE có nhận file không
- [ ] Upload ảnh từ Staff → Tương tự
- [ ] Submit product → Kiểm tra `imageUrl` có được lưu vào DB không
- [ ] Admin list → Ảnh hiển thị đúng không
- [ ] Staff list → Ảnh hiển thị đúng không
- [ ] Shop page → Ảnh hiển thị đúng không
- [ ] ProductCard → Ảnh hiển thị đúng không
- [ ] Edit product → Preview ảnh cũ hiển thị đúng không
- [ ] Delete product → (Optional) Kiểm tra có xóa file từ BE không
- [ ] Network tab → Kiểm tra GET `/api/uploads/{id}` trả 200 + đúng Content-Type

---

## 🎯 Lưu ý

1. **Backend cần implement** (theo prompt user đã cung cấp):
   - Entity `FileObject` với `LONGBLOB`
   - Repository, Service, Controller `/api/uploads`
   - CORS config cho frontend

2. **URL Handling**:
   - FE lưu relative URL: `/api/uploads/{id}`
   - Khi render: Build full URL nếu cần
   - BE stream ảnh qua GET `/api/uploads/{id}`

3. **Performance**:
   - BLOB trong MySQL phù hợp cho demo/đồ án (max 5MB/file)
   - Cache-control: 30 days (đã set trong BE controller)

4. **Compatibility**:
   - Gửi cả `imageUrl` và `image_url` để BE nào cũng nhận
   - Normalize sẵn ở service layer → FE luôn dùng `product.imageUrl`

---

## 🚀 Next Steps

1. **Backend Implementation**: Implement các file BE theo prompt user đã cung cấp
2. **Test toàn bộ flow**: Upload → Save → Render
3. **Optional Cleanup**: Xóa Firebase code nếu không còn dùng cho tính năng khác

