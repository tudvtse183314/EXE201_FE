# 🖼️ Hướng dẫn Flow chèn ảnh - Đơn giản 3 bước

## 🎯 **Flow 3 bước:**

### **Bước 1: Thêm ảnh vào thư mục**
```
src/assets/images/
├── logo.svg
├── backgrounds.jpg          # ← Thêm ảnh vào đây
├── pet1.jpg
├── pet2.jpg
└── index.js
```

### **Bước 2: Export trong index.js**
```javascript
// src/assets/images/index.js
export { default as logo } from './logo.svg';
export { default as backgrounds } from './backgrounds.jpg';  // ← Thêm dòng này
export { default as pet1 } from './pet1.jpg';
export { default as pet2 } from './pet2.jpg';
```

### **Bước 3: Import và sử dụng**
```javascript
// Trong component
import { backgrounds, pet1, pet2 } from '../../assets/images';

function MyComponent() {
  return (
    <div>
      <img src={backgrounds} alt="Background" />
      <img src={pet1} alt="Pet 1" />
      <img src={pet2} alt="Pet 2" />
    </div>
  );
}
```

## 🚀 **Ví dụ thực tế:**

### **Thêm ảnh mới:**
1. Copy file `new_image.jpg` vào `src/assets/images/`
2. Thêm vào `index.js`: `export { default as newImage } from './new_image.jpg';`
3. Sử dụng: `import { newImage } from '../../assets/images';`

### **Sử dụng trong component:**
```javascript
import { backgrounds, pet1 } from '../../assets/images';

function HomePage() {
  return (
    <div 
      style={{ backgroundImage: `url(${backgrounds})` }}
      className="bg-cover bg-center"
    >
      <img src={pet1} alt="Pet" className="w-32 h-32" />
    </div>
  );
}
```

## ✅ **Lưu ý:**
- Đặt tên file không dấu, không khoảng trắng
- Sử dụng `.jpg`, `.png`, `.svg`
- Luôn export trong `index.js`
- Import từ `../../assets/images`
