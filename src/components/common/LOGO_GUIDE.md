# 🎯 Hướng dẫn sử dụng Logo

## 📏 **Kích thước logo phù hợp với header:**

### **Header Height: 64px (h-16)**
- **Logo size**: 40px (medium) - **TỐT NHẤT**
- **Logo size**: 32px (small) - Nhỏ
- **Logo size**: 48px (large) - Hơi lớn

## 🎨 **Cách sử dụng:**

### **1. SvgLogo (Khuyến nghị):**
```jsx
// ✅ Tốt nhất cho header
<SvgLogo 
  size="medium"        // 40px - Vừa phải
  variant="default"
  onClick={() => navigate('/')}
/>

// ✅ Nhỏ hơn
<SvgLogo 
  size="small"         // 32px - Nhỏ
  variant="default"
/>

// ✅ Lớn hơn
<SvgLogo 
  size="large"         // 48px - Lớn
  variant="default"
/>
```

### **2. Logo component:**
```jsx
<Logo 
  size="medium"        // 40px
  variant="default"
  onClick={() => navigate('/')}
/>
```

### **3. SimpleLogo component:**
```jsx
<SimpleLogo 
  size="medium"        // 40px
  variant="default"
  onClick={() => navigate('/')}
/>
```

## 📐 **Kích thước chi tiết:**

| Size | Pixels | Tailwind | Phù hợp cho |
|------|--------|----------|-------------|
| small | 32px | w-8 h-8 | Header nhỏ, mobile |
| medium | 40px | w-10 h-10 | **Header chính** ✅ |
| large | 48px | w-12 h-12 | Footer, sidebar |
| xlarge | 56px | w-14 h-14 | Landing page |

## 🎯 **Variant (Kiểu dáng):**

```jsx
// Default - Trắng với border xám
variant="default"

// White - Trắng với border trắng (cho background tối)
variant="white"

// Dark - Trắng với border đen (cho background sáng)
variant="dark"
```

## 📱 **Responsive:**

```jsx
// Tự động điều chỉnh theo màn hình
<SvgLogo 
  size="medium"        // 40px trên desktop
  className="w-8 h-8 md:w-10 md:h-10"  // 32px trên mobile
/>
```

## ✅ **Best Practices:**

1. **Header**: Sử dụng `size="medium"` (40px)
2. **Mobile**: Sử dụng `size="small"` (32px)
3. **Footer**: Sử dụng `size="large"` (48px)
4. **Landing**: Sử dụng `size="xlarge"` (56px)
5. **Border**: Giảm từ `border-2` xuống `border` để nhẹ nhàng hơn
6. **Shadow**: Giảm từ `shadow-lg` xuống `shadow-sm` để tinh tế hơn
