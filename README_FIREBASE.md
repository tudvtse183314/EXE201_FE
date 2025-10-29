# 🔥 Firebase Storage Integration - PetVibe

## ⚡ Quick Start

1. **Tạo file `.env.local`** ở root project:
```env
REACT_APP_FB_API_KEY=AIzaSyDFFCmpPlE5xWOn1Zj7YocFfaLCFwdUVMw
```

2. **Kiểm tra Firebase Storage Rules**:
- Vào [Firebase Console](https://console.firebase.google.com/)
- Chọn project `petvibe-f221b`
- Vào Storage → Rules
- Tạm thời dùng rules sau (dev only):
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /products/{allPaths=**} {
      allow read: if true;
      allow write: if true;
    }
  }
}
```

## 📦 Đã tích hợp

### 1. Firebase Configuration
- File: `src/lib/firebase.js`
- Functions:
  - `uploadImage(file, folder)` - Upload ảnh lên Firebase
  - `deleteImageByUrl(url)` - Xóa ảnh từ Firebase

### 2. Admin Upload Form
- File: `src/pages/staff/StaffProductsPage.jsx`
- Tích hợp Ant Design Upload với Firebase
- Auto upload khi chọn file
- Hiển thị preview và loading state

### 3. Frontend Display
- File: `src/components/common/ProductCard.jsx`
- Hiển thị ảnh từ `product.imageUrl` (Firebase URL)
- Fallback sang placeholder nếu không có ảnh

## 🎯 Cách sử dụng

### Admin: Upload ảnh sản phẩm
1. Vào trang quản lý sản phẩm (Staff/Admin)
2. Click "Thêm sản phẩm" hoặc "Chỉnh sửa"
3. Trong form, tìm phần "Hình ảnh sản phẩm"
4. Click vào vùng upload
5. Chọn file ảnh (JPG, PNG, etc., tối đa 5MB)
6. Ảnh tự động upload lên Firebase Storage
7. Xem preview, có thể remove và upload lại
8. Click "Tạo mới" hoặc "Cập nhật"
9. BE sẽ lưu `imageUrl` vào database

### Frontend: Hiển thị ảnh
- Tự động hiển thị ảnh từ `product.imageUrl` ở:
  - Shop page (`/shop`)
  - Product detail page
  - ProductCard component
- Nếu không có ảnh → hiển thị placeholder

## ✅ Checklist test

- [ ] Tạo `.env.local` với Firebase API key
- [ ] Cấu hình Firebase Storage Rules (tạm allow read/write)
- [ ] Test upload ảnh trong Admin form
- [ ] Kiểm tra ảnh hiển thị ở Shop page
- [ ] Test với mạng khác/ẩn danh để đảm bảo URL public

## 🔧 Troubleshooting

### Upload thất bại
- Kiểm tra `.env.local` có đúng format
- Kiểm tra Firebase Storage Rules
- Xem console log để debug

### Ảnh không hiển thị
- Kiểm tra `product.imageUrl` có đúng format
- Kiểm tra CORS của Firebase Storage
- Xem Network tab trong DevTools

### Storage Rules lỗi
- Vào Firebase Console → Storage → Rules
- Kiểm tra syntax
- Dùng Rules Playground để test

## 📚 Files liên quan

- `src/lib/firebase.js` - Firebase config và helpers
- `src/pages/staff/StaffProductsPage.jsx` - Admin upload form
- `src/components/common/ProductCard.jsx` - Product image display
- `.env.local` - Environment variables (không commit)

## 🚀 Next Steps

- [ ] Thiết lập Firebase Authentication để bảo mật upload
- [ ] Thêm App Check để prevent abuse
- [ ] Tối ưu image compression trước khi upload
- [ ] Thêm image cropping/resizing trong form

