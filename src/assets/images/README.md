# 📁 Images Directory Structure

## 📂 Cấu trúc thư mục

```
src/assets/images/
├── logo.jpg                    # Logo chính của ứng dụng (JPG)
├── logo.svg                    # Logo SVG (backup)
├── pets/                       # Ảnh thú cưng
│   ├── dog1.jpg
│   ├── dog2.jpg
│   ├── cat1.jpg
│   └── cat2.jpg
├── products/                   # Ảnh sản phẩm
│   ├── dog_collar.jpg
│   ├── cat_toy.jpg
│   ├── dog_food.jpg
│   └── pet_bed.jpg
├── banners/                    # Ảnh banner, background
│   ├── hero_banner.jpg
│   ├── login_banner.jpg
│   └── register_banner.jpg
├── icons/                      # Icon, avatar
│   ├── user_avatar.png
│   ├── pet_icon.png
│   └── shopping_cart.png
├── index.js                    # Export tất cả ảnh
└── README.md                   # Hướng dẫn này
```

## 🎯 Quy tắc đặt tên

### ✅ Định dạng file:
- **Logo, icon**: `.png` hoặc `.svg` (trong suốt, rõ nét)
- **Ảnh sản phẩm**: `.jpg` (nhẹ, dễ nén)
- **Ảnh nền, banner**: `.jpg` (chất lượng cao)

### ✅ Quy tắc đặt tên:
- Không dấu, không khoảng trắng
- Chỉ dùng `_` hoặc `-`
- Ví dụ: `dog_food.jpg`, `user_avatar.png`

## 🚀 Cách sử dụng

### 1. Import trực tiếp:
```javascript
import logo from '../../assets/images/logo.jpg';
import dog1 from '../../assets/images/pets/dog1.jpg';

function Component() {
  return (
    <div>
      <img src={logo} alt="Logo" />
      <img src={dog1} alt="Dog" />
    </div>
  );
}
```

### 2. Import từ index.js (Khuyến nghị):
```javascript
import { logo, dog1, cat1 } from '../../assets/images';

function Component() {
  return (
    <div>
      <img src={logo} alt="Logo" />
      <img src={dog1} alt="Dog" />
      <img src={cat1} alt="Cat" />
    </div>
  );
}
```

### 3. Import collections:
```javascript
import { petImages, productImages, backgrounds } from '../../assets/images';

function Component() {
  return (
    <div>
      {/* Pet images */}
      {petImages.dogs.map((dog, index) => (
        <img key={index} src={dog} alt={`Dog ${index + 1}`} />
      ))}
      
      {/* Background */}
      <div style={{ backgroundImage: `url(${backgrounds.login})` }}>
        Login Form
      </div>
    </div>
  );
}
```

## 📝 Lưu ý

1. **Tối ưu ảnh**: Nén ảnh trước khi thêm vào project
2. **Alt text**: Luôn thêm alt text cho accessibility
3. **Responsive**: Sử dụng CSS để responsive images
4. **Lazy loading**: Cân nhắc lazy loading cho ảnh lớn

## 🔄 Thêm ảnh mới

1. Thêm file ảnh vào thư mục phù hợp
2. Export trong `index.js`:
   ```javascript
   export { default as newImage } from './folder/new_image.jpg';
   ```
3. Sử dụng trong component:
   ```javascript
   import { newImage } from '../../assets/images';
   ```