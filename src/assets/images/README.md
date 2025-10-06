# 🖼️ Image Management System

## 📁 Cấu trúc thư mục

```
src/assets/images/
├── index.js          # Centralized image exports
├── README.md         # Documentation
└── components/       # Reusable image components
    ├── BackgroundImage.jsx
    └── Image.jsx
```

## 🎯 Cách sử dụng

### 1. Import images từ centralized system

```javascript
import { backgrounds, banners, logos, pets } from '../assets/images';

// Sử dụng
<div style={{ backgroundImage: `url(${backgrounds.login})` }}>
```

### 2. Sử dụng BackgroundImage component

```javascript
import { LoginBackground, HeroBackground } from '../components/common/BackgroundImage';

// Login page
<LoginBackground>
  <div className="content">Your content here</div>
</LoginBackground>

// Custom background
<BackgroundImage 
  imagePath={backgrounds.home}
  overlay="rgba(0,0,0,0.3)"
  className="min-h-screen"
>
  <div>Content</div>
</BackgroundImage>
```

### 3. Sử dụng Image component

```javascript
import { Image, Avatar, ProductImage, PetImage } from '../components/common/Image';

// Basic image
<Image 
  src={pets.dog1} 
  alt="Cute dog" 
  className="w-full h-64"
/>

// Avatar
<Avatar 
  src={user.avatar} 
  alt="User avatar" 
  size="lg"
/>

// Product image
<ProductImage 
  src={products.collar} 
  alt="Dog collar"
/>
```

## 🎨 Image Categories

### Backgrounds
- `backgrounds.login` - Login page background
- `backgrounds.register` - Register page background  
- `backgrounds.home` - Home page background
- `backgrounds.dashboard` - Dashboard background

### Banners
- `banners.hero` - Hero section banner
- `banners.about` - About page banner
- `banners.services` - Services page banner
- `banners.contact` - Contact page banner

### Logos
- `logos.main` - Main logo
- `logos.white` - White version logo
- `logos.favicon` - Favicon

### Pets
- `pets.dog1`, `pets.dog2` - Dog images
- `pets.cat1`, `pets.cat2` - Cat images

### Products
- `products.collar` - Dog collar
- `products.leash` - Dog leash
- `products.toy` - Pet toys
- `products.food` - Pet food

## 🔧 Helper Functions

### getImage()
```javascript
import { getImage } from '../assets/images';

const imageUrl = getImage(user.avatar, 'default-avatar.png');
```

### getBackgroundImage()
```javascript
import { getBackgroundImage } from '../assets/images';

const style = getBackgroundImage(backgrounds.login, 'rgba(0,0,0,0.4)');
```

## 📱 Responsive Images

```javascript
// Use different images for different screen sizes
const responsiveImage = {
  mobile: pets.dog1,
  tablet: pets.dog2,
  desktop: pets.cat1
};

<Image 
  src={responsiveImage.mobile}
  alt="Pet"
  className="md:hidden"
/>
<Image 
  src={responsiveImage.tablet}
  alt="Pet"
  className="hidden md:block lg:hidden"
/>
<Image 
  src={responsiveImage.desktop}
  alt="Pet"
  className="hidden lg:block"
/>
```

## 🚀 Best Practices

1. **Always use centralized imports** - Don't hardcode image URLs
2. **Provide alt text** - For accessibility
3. **Use fallback images** - Handle loading errors gracefully
4. **Optimize images** - Use appropriate formats and sizes
5. **Lazy load** - For better performance
6. **Consistent naming** - Use descriptive, consistent names

## 🔄 Adding New Images

1. Add image URL to appropriate category in `src/assets/images/index.js`
2. Export from the category object
3. Use in components with centralized import
4. Update this README if adding new categories

## 🎨 Image Optimization

- Use WebP format when possible
- Provide multiple sizes for responsive design
- Compress images for web use
- Use CDN for better performance
- Consider using Next.js Image component for advanced optimization
