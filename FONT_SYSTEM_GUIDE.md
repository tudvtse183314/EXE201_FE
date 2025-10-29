# PetVibe Font System - Hướng dẫn sử dụng

## 📋 Tổng quan
Hệ thống font PetVibe đã được chuẩn hóa với 3 font chính:
- **Primary (Body/UI)**: Poppins (400, 500, 600)
- **Display (Heading/Logo/CTA)**: Baloo 2 (600, 700)
- **Accent (Quote/Handwritten)**: Caveat (600) - dùng tiết kiệm

## 🎨 Cách sử dụng

### 1. Utility Classes (Ưu tiên sử dụng)

```jsx
// Headings
<h1 className="pv-h1">Tiêu đề H1 - Baloo 2, đậm</h1>
<h2 className="pv-h2">Tiêu đề H2 - Baloo 2, semibold</h2>
<h3 className="pv-h3">Tiêu đề H3 - Baloo 2, semibold</h3>

// Body text
<p className="pv-body">Nội dung chính - Poppins, leading-7</p>
<span className="pv-small">Text nhỏ - Poppins, leading-6, muted color</span>

// CTA & Price
<button className="pv-cta">Nút CTA - Baloo 2, bold, tracking-wide</button>
<span className="pv-price">100.000₫</span>

// Accent (dùng ít)
<p className="pv-accent-text">Quote hoặc tagline ngắn - Caveat</p>

// Badge
<span className="pv-badge">BADGE</span>
```

### 2. Tailwind Classes

```jsx
// Font families
<div className="font-sans">Poppins (mặc định)</div>
<div className="font-display">Baloo 2 (heading, CTA)</div>
<div className="font-accent">Caveat (điểm nhấn)</div>

// Kết hợp
<h2 className="font-display text-4xl font-bold text-pv-text-heading">
  Tiêu đề với Baloo 2
</h2>
```

### 3. React Components

```jsx
import { Heading, PriceTag, Badge, Body, Small } from '@/components';

// Sử dụng
<Heading level={1}>Tiêu đề chính</Heading>
<Heading level={2}>Tiêu đề phụ</Heading>

<PriceTag value={100000} currency="₫" />

<Badge variant="success">Thành công</Badge>
<Badge variant="warning">Cảnh báo</Badge>

<Body>Nội dung chính của phần</Body>
<Small>Ghi chú nhỏ</Small>
```

## 📍 Áp dụng theo khu vực

### Homepage / Hero
- Tiêu đề chính: `pv-h1` hoặc `<Heading level={1} />`
- CTA buttons: `pv-cta` hoặc className `font-display font-bold`
- Mô tả: `pv-body`

### Shop / Product Card
- Tên sản phẩm: `pv-h3` hoặc `font-display text-xl font-semibold`
- Mô tả: `pv-body`
- Giá: `pv-price`
- Badge: `pv-badge`

### Admin (Bảng, Form, Sidebar)
- Toàn bộ dùng: `font-sans` (Poppins) để đảm bảo dễ đọc
- Chỉ title trang: `font-display` (Baloo 2)
- Không dùng Caveat trong admin

### AI Analysis & Diary
- Có thể chấm phá `pv-accent-text` cho câu trích ngắn
- Phần lớn vẫn dùng `pv-body`

## 🔧 Cấu hình Ant Design

Đã cấu hình trong `src/App.js`:
- Tất cả Ant Design components dùng **Poppins**
- Typography.Title tự động có font-balance
- Button có fontWeight: 600

## ⚠️ Quy tắc vàng

1. **Tối đa 3 font trên 1 trang**: Poppins + Baloo 2 (+ Caveat nếu cần)
2. **Ưu tiên utility classes**: `.pv-h1`, `.pv-body`, `.pv-price`, etc.
3. **Heading luôn Baloo 2**: Giúp brand identity rõ ràng
4. **Body luôn Poppins**: Đảm bảo readability
5. **Caveat dùng ít**: Chỉ cho quotes, taglines ngắn
6. **Text size tối thiểu**: `text-base` (16px)
7. **Line height**: `leading-7` cho body (1.75)
8. **Letter-spacing**: 0 (tối ưu cho tiếng Việt)

## 🎯 Checklist kiểm tra

- [x] Import fonts với Vietnamese subset
- [x] Cấu hình Tailwind fontFamily
- [x] Thêm PetVibe utility classes
- [x] Cấu hình Ant Design ConfigProvider
- [x] Tạo Typography components
- [ ] Áp dụng cho các components chính
- [ ] Test hiển thị dấu tiếng Việt
- [ ] Kiểm tra performance (chỉ load weights cần thiết)

## 📱 Tối ưu Performance

Fonts được load với subset Vietnamese và display=swap:
- Poppins: 400, 500, 600
- Baloo 2: 600, 700
- Caveat: 600

Giúp giảm thiểu FOUT (Flash of Unstyled Text) và CLS (Cumulative Layout Shift).

