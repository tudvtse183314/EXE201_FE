# 🎨 PetVibe Old Copper Style Guide

## 🌟 Overview

The PetVibe application now uses a unified "Old Copper" color theme that creates a warm, friendly, and professional pet care aesthetic. This style guide ensures consistency across all components and pages.

## 🎨 Color Palette

### Primary Old Copper Colors
```css
:root {
  --old-copper-50: #ffffff;      /* Pure white */
  --old-copper-100: #ffeadd;     /* Soft cream background */
  --old-copper-200: #ffc8aa;     /* Light peach */
  --old-copper-300: #ffb07c;     /* Warm orange (accent) */
  --old-copper-400: #eda274;     /* Primary brand color */
  --old-copper-500: #d5956d;     /* Secondary brand color */
  --old-copper-600: #bd8664;     /* Medium brown */
  --old-copper-700: #a6775b;     /* Darker brown */
  --old-copper-800: #9e7359;     /* Deep brown */
  --old-copper-900: #916a53;     /* Muted brown */
  --old-copper-1000: #88634e;    /* Dark muted */
  --old-copper-1100: #7e5c48;    /* Darker muted */
  --old-copper-1200: #715340;    /* Very dark */
  --old-copper-1300: #644837;    /* Body text */
  --old-copper-1400: #553d2d;    /* Darker text */
  --old-copper-1500: #463023;    /* Very dark text */
  --old-copper-1600: #362319;    /* Heading text */
  --old-copper-1700: #2a1a10;    /* Darkest */
}
```

### Semantic Color Mapping
- **Primary**: `#eda274` (oldCopper-400) - Main brand color
- **Secondary**: `#d5956d` (oldCopper-500) - Secondary actions
- **Accent**: `#ffb07c` (oldCopper-300) - Highlights and CTAs
- **Dark**: `#362319` (oldCopper-1600) - Text and headers
- **Light**: `#ffeadd` (oldCopper-100) - Backgrounds

## 🎯 Usage Guidelines

### 1. Background Colors
```html
<!-- Page backgrounds -->
<div class="bg-oldCopper-50">   <!-- Pure white -->
<div class="bg-oldCopper-100">  <!-- Soft cream (recommended) -->

<!-- Section backgrounds -->
<section class="bg-oldCopper-100">  <!-- Light sections -->
<section class="bg-white">          <!-- Card backgrounds -->
```

### 2. Text Colors
```html
<!-- Headings -->
<h1 class="text-oldCopper-1600">Main Heading</h1>
<h2 class="text-oldCopper-1500">Section Heading</h2>

<!-- Body text -->
<p class="text-oldCopper-1300">Body text content</p>
<p class="text-oldCopper-900">Muted/secondary text</p>

<!-- Links -->
<a class="text-oldCopper-300 hover:text-oldCopper-400">Link text</a>
```

### 3. Button Styles
```html
<!-- Primary Button -->
<button class="bg-oldCopper-400 hover:bg-oldCopper-500 text-white px-6 py-3 rounded-lg font-semibold shadow-old-copper-warm transition-all duration-300">
  Primary Action
</button>

<!-- Secondary Button -->
<button class="bg-oldCopper-500 hover:bg-oldCopper-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300">
  Secondary Action
</button>

<!-- Accent Button -->
<button class="bg-oldCopper-300 hover:bg-oldCopper-400 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300">
  Accent Action
</button>

<!-- Outline Button -->
<button class="border-2 border-oldCopper-400 text-oldCopper-400 hover:bg-oldCopper-400 hover:text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300">
  Outline Button
</button>
```

### 4. Card Components
```html
<div class="bg-white rounded-xl shadow-old-copper-card p-6 border border-oldCopper-200 hover:shadow-old-copper-glow transition-all duration-300">
  <h3 class="text-oldCopper-1600 font-bold mb-3">Card Title</h3>
  <p class="text-oldCopper-1300">Card content goes here...</p>
</div>
```

### 5. Form Elements
```html
<!-- Input Fields -->
<input class="w-full px-4 py-3 border-2 border-oldCopper-300 rounded-lg focus:border-oldCopper-400 focus:outline-none transition-colors duration-300" 
       placeholder="Enter text..." />

<!-- Select Dropdown -->
<select class="w-full px-4 py-3 border-2 border-oldCopper-300 rounded-lg focus:border-oldCopper-400 focus:outline-none transition-colors duration-300">
  <option>Select option...</option>
</select>
```

## 🌈 Gradients

### Available Gradients
```css
/* Warm Glow - Primary gradient */
bg-gradient-to-r from-oldCopper-300 to-oldCopper-400

/* Soft Sun - Background gradient */
bg-gradient-to-b from-oldCopper-100 to-oldCopper-300

/* Sunset - Full spectrum */
bg-gradient-to-br from-oldCopper-300 via-oldCopper-500 to-oldCopper-700

/* Hero Gradient */
bg-gradient-to-r from-oldCopper-300 to-oldCopper-400
```

### Usage Examples
```html
<!-- Hero Section -->
<section class="bg-gradient-to-r from-oldCopper-300 to-oldCopper-500 text-white py-20">
  <h1 class="text-5xl font-bold mb-4">Welcome to PetVibe</h1>
  <p class="text-oldCopper-100 text-lg">Discover your pet's perfect match!</p>
</section>

<!-- Text Gradient -->
<h1 class="bg-gradient-to-r from-oldCopper-400 to-oldCopper-700 bg-clip-text text-transparent">
  Gradient Text
</h1>
```

## 🎭 Shadows

### Shadow Classes
```html
<!-- Card Shadow -->
<div class="shadow-old-copper-card">Card content</div>

<!-- Warm Shadow -->
<div class="shadow-old-copper-warm">Warm glow effect</div>

<!-- Glow Shadow -->
<div class="shadow-old-copper-glow">Glowing effect</div>

<!-- Large Glow -->
<div class="shadow-old-copper-glow-lg">Large glowing effect</div>
```

## 🎨 Component Examples

### 1. Hero Section
```html
<section class="bg-gradient-to-r from-oldCopper-300 to-oldCopper-500 text-white py-20 text-center">
  <div class="max-w-4xl mx-auto px-4">
    <h1 class="text-5xl font-bold mb-4">Welcome to PetVibe</h1>
    <p class="text-oldCopper-100 text-lg mb-8">Discover your pet's perfect match!</p>
    <button class="mt-6 px-6 py-3 bg-oldCopper-700 hover:bg-oldCopper-800 rounded-xl text-oldCopper-50 font-semibold shadow-md transition">
      Get Started
    </button>
  </div>
</section>
```

### 2. Feature Card
```html
<div class="bg-white rounded-2xl shadow-old-copper-card p-8 hover:shadow-old-copper-glow transition-all duration-300 group">
  <div class="w-16 h-16 bg-gradient-to-br from-oldCopper-100 to-oldCopper-200 rounded-full flex items-center justify-center mb-6 group-hover:from-oldCopper-200 group-hover:to-oldCopper-300 transition-all duration-300">
    <Icon className="w-8 h-8 text-oldCopper-400" />
  </div>
  <h3 class="text-xl font-bold text-oldCopper-1600 mb-4">Feature Title</h3>
  <p class="text-oldCopper-1300 leading-relaxed">Feature description goes here...</p>
</div>
```

### 3. Navigation
```html
<nav class="bg-white shadow-old-copper-card">
  <div class="max-w-7xl mx-auto px-4">
    <div class="flex justify-between items-center h-16">
      <span class="text-xl font-bold text-oldCopper-1600">PetVibe</span>
      <div class="flex space-x-6">
        <a class="text-oldCopper-1300 hover:text-oldCopper-400 transition-colors duration-300">Home</a>
        <a class="text-oldCopper-1300 hover:text-oldCopper-400 transition-colors duration-300">About</a>
        <a class="text-oldCopper-1300 hover:text-oldCopper-400 transition-colors duration-300">Shop</a>
      </div>
    </div>
  </div>
</nav>
```

### 4. Footer
```html
<footer class="bg-oldCopper-1600 text-oldCopper-100 py-12">
  <div class="max-w-7xl mx-auto px-4">
    <div class="grid md:grid-cols-4 gap-8">
      <div>
        <h3 class="text-2xl font-bold mb-4">PetVibe</h3>
        <p class="text-oldCopper-200">Your pet's perfect match awaits.</p>
      </div>
      <!-- More footer content -->
    </div>
  </div>
</footer>
```

## 🎯 Animation Guidelines

### Hover Effects
```html
<!-- Scale on hover -->
<div class="hover:scale-105 transition-transform duration-300">Content</div>

<!-- Color transition -->
<button class="text-oldCopper-400 hover:text-oldCopper-500 transition-colors duration-300">Button</button>

<!-- Shadow transition -->
<div class="shadow-old-copper-card hover:shadow-old-copper-glow transition-shadow duration-300">Card</div>
```

### Loading States
```html
<!-- Pulse animation -->
<div class="animate-pulse bg-oldCopper-200 rounded-lg h-4 w-full"></div>

<!-- Bounce animation -->
<div class="animate-bounce bg-oldCopper-400 rounded-full w-4 h-4"></div>
```

## 📱 Responsive Design

### Breakpoints
- **Mobile**: Default (up to 640px)
- **Tablet**: `md:` (640px and up)
- **Desktop**: `lg:` (1024px and up)
- **Large**: `xl:` (1280px and up)

### Responsive Examples
```html
<!-- Responsive grid -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <!-- Cards -->
</div>

<!-- Responsive text -->
<h1 class="text-3xl md:text-4xl lg:text-5xl font-bold text-oldCopper-1600">
  Responsive Heading
</h1>

<!-- Responsive spacing -->
<div class="py-8 md:py-12 lg:py-16">
  <!-- Content -->
</div>
```

## 🎨 Typography

### Font Family
- **Primary**: Poppins (Google Fonts)
- **Fallback**: Inter, system-ui, sans-serif

### Font Weights
- **Light**: 300
- **Regular**: 400
- **Medium**: 500
- **Semibold**: 600
- **Bold**: 700
- **Extrabold**: 800

### Text Sizes
```html
<h1 class="text-5xl font-bold text-oldCopper-1600">Main Heading</h1>
<h2 class="text-4xl font-semibold text-oldCopper-1500">Section Heading</h2>
<h3 class="text-2xl font-medium text-oldCopper-1600">Subsection</h3>
<p class="text-lg text-oldCopper-1300">Large body text</p>
<p class="text-base text-oldCopper-1300">Regular body text</p>
<p class="text-sm text-oldCopper-900">Small text</p>
```

## 🎯 Best Practices

### 1. Color Usage
- Use `oldCopper-1600` for main headings
- Use `oldCopper-1300` for body text
- Use `oldCopper-400` for primary actions
- Use `oldCopper-300` for accents and highlights
- Use `oldCopper-100` for light backgrounds

### 2. Spacing
- Use consistent spacing scale (4, 8, 12, 16, 24, 32, 48, 64px)
- Maintain proper padding and margins
- Use `gap-6` or `gap-8` for grid layouts

### 3. Shadows
- Use `shadow-old-copper-card` for standard cards
- Use `shadow-old-copper-glow` for hover effects
- Use `shadow-old-copper-warm` for buttons

### 4. Transitions
- Always include `transition-all duration-300` for smooth animations
- Use `hover:` prefixes for interactive elements
- Maintain consistent timing across components

## 🚀 Implementation Checklist

- [x] Update Tailwind config with Old Copper colors
- [x] Update CSS variables
- [x] Update theme.js with new colors
- [x] Apply to Header component
- [x] Apply to Homepage sections
- [x] Update button styles
- [x] Update card components
- [x] Update form elements
- [x] Test responsive design
- [x] Verify accessibility contrast ratios

## 🎉 Result

The PetVibe application now has a unified, warm, and professional Old Copper theme that:
- ✅ Creates a consistent visual identity
- ✅ Maintains excellent readability and accessibility
- ✅ Provides a warm, pet-friendly aesthetic
- ✅ Works seamlessly across all devices
- ✅ Supports easy maintenance and updates

The Old Copper theme perfectly captures the warm, friendly, and professional nature of pet care services while maintaining modern design standards and excellent user experience! 🐾✨
