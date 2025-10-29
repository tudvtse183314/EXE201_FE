# Firebase Storage Setup Guide - PetVibe

## ✅ Đã hoàn thành

### 1. Cài đặt và cấu hình Firebase
- ✅ Đã cài `firebase` package
- ✅ Tạo file `src/lib/firebase.js` với:
  - Firebase configuration
  - `uploadImage()` function
  - `deleteImageByUrl()` function

### 2. Tích hợp với Admin Form
- ✅ Cập nhật `src/pages/staff/StaffProductsPage.jsx`:
  - Import Firebase functions
  - Thay thế base64 upload bằng Firebase upload
  - Thêm `fileList` state cho Ant Design Upload
  - Thêm `uploading` state
  - Custom request handler
  - Auto-delete old image khi remove hoặc update

### 3. Hiển thị ảnh ở Frontend
- ✅ Cập nhật `src/components/common/ProductCard.jsx`:
  - Hiển thị ảnh từ `product.imageUrl` (Firebase URL)
  - Fallback sang placeholder nếu không có ảnh
  - Sử dụng LazyLoadImage để tối ưu

- ✅ `src/pages/public/Shop.jsx` đã hỗ trợ `product.imageUrl`

## 📝 Cấu hình môi trường

### Tạo file `.env.local` (không commit)

```env
VITE_FB_API_KEY=AIzaSyDFFCmpPlE5xWOn1Zj7YocFfaLCFwdUVMw
REACT_APP_API_BASE_URL=https://exe201-be-uhno.onrender.com/api
```

### Firebase Configuration

Đã cấu hình trong `src/lib/firebase.js`:
- **Storage Bucket**: `petvibe-f221b.firebasestorage.app`
- **Project ID**: `petvibe-f221b`
- **Auth Domain**: `petvibe-f221b.firebaseapp.com`

## 🔧 Luồng hoạt động

### Upload ảnh sản phẩm (Admin):
1. Admin mở form tạo/cập nhật sản phẩm
2. Chọn file ảnh (< 5MB, image/*)
3. File được upload lên Firebase Storage trong folder `products/`
4. Nhận `downloadURL` từ Firebase
5. URL được lưu vào form field `imageUrl`
6. Submit form → gọi API BE (POST/PUT `/products`) với `imageUrl`
7. BE lưu `imageUrl` vào database

### Hiển thị ảnh (Frontend):
1. Fetch products từ BE (đã có `imageUrl`)
2. Render `<img src={product.imageUrl} />` hoặc `<LazyLoadImage>`
3. Nếu `imageUrl` rỗng → hiển thị placeholder

### Xóa ảnh:
- Khi remove ảnh trong form → gọi `deleteImageByUrl()` để dọn Storage
- Khi xóa sản phẩm → cũng có thể gọi để dọn Storage (tùy chọn)

## 🔒 Firebase Storage Rules (Cần thiết lập)

### Development (tạm thời - dễ test):
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```

### Production (nên siết chặt sau):
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /products/{allPaths=**} {
      allow read: if true;  // Public read
      allow write: if request.auth != null;  // Require auth
      // Hoặc dùng App Check
      // allow write: if request.resource.size < 5242880;  // Max 5MB
    }
  }
}
```

## 📱 Cách sử dụng

### Upload ảnh trong Admin Form:
1. Click "Thêm sản phẩm" hoặc "Chỉnh sửa"
2. Trong phần "Hình ảnh sản phẩm", click vào vùng upload
3. Chọn file ảnh (JPG, PNG, etc., < 5MB)
4. Ảnh sẽ tự động upload lên Firebase
5. Xem preview, có thể remove và upload lại
6. Submit form → lưu `imageUrl` vào BE

### Kiểm tra:
- ✅ Tạo sản phẩm mới với ảnh → kiểm tra `imageUrl` trong database
- ✅ Mở trang Shop/Home → ảnh hiển thị từ Firebase URL
- ✅ Test với mạng khác/ẩn danh → URL vẫn hoạt động

## ⚠️ Lưu ý quan trọng

1. **API Key**: Không commit `.env.local` vào git
2. **Storage Bucket**: Nếu Firebase Console hiển thị `.appspot.com` thay vì `.firebasestorage.app`, cần update trong `firebase.js`
3. **File Size**: Giới hạn 5MB, có thể điều chỉnh
4. **Error Handling**: Đã có fallback image nếu upload fail hoặc URL lỗi
5. **Performance**: Sử dụng LazyLoadImage để tối ưu loading

## 🐛 Troubleshooting

### Upload thất bại:
- Kiểm tra `.env.local` có đúng API key
- Kiểm tra Firebase Storage Rules
- Kiểm tra network connection
- Xem console log để debug

### Ảnh không hiển thị:
- Kiểm tra `product.imageUrl` có đúng format URL
- Kiểm tra CORS của Firebase Storage
- Xem Network tab trong DevTools

### Storage Rules lỗi:
- Vào Firebase Console → Storage → Rules
- Kiểm tra syntax của rules
- Test với Firebase Rules Playground

## 📚 Tài liệu tham khảo

- [Firebase Storage Docs](https://firebase.google.com/docs/storage)
- [Ant Design Upload](https://ant.design/components/upload/)
- [React Lazy Load Image](https://www.npmjs.com/package/react-lazy-load-image-component)

