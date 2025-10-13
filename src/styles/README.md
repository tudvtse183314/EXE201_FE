# PetVibe Theme System

A unified color palette and design system for the PetVibe application, based on warm, friendly pet care aesthetics with brown-orange-cream colors.

## 🎨 Color Palette

### Primary Colors
- **PV-Primary**: `#F6A623` - Bright orange-yellow (main brand color)
- **PV-Secondary**: `#D97B29` - Warm orange-brown (natural, friendly feel)
- **PV-Dark**: `#4B2E05` - Deep brown (text/headers, like pet collar)
- **PV-Light**: `#FFF8E7` - Soft cream background (warm, neutral)
- **PV-Accent**: `#E86100` - Vivid orange (CTA buttons, highlights)

### Extended Palette
- **PV-Primary Light**: `#F8B84D` - Lighter version of primary
- **PV-Primary Dark**: `#E8951A` - Darker version of primary
- **PV-Secondary Light**: `#E89B4A` - Lighter version of secondary
- **PV-Secondary Dark**: `#C66B1F` - Darker version of secondary

## 🚀 Usage

### 1. JavaScript/React Usage

```javascript
import { PetVibeTheme, usePetVibeTheme } from './styles';

// Using the theme object directly
const MyComponent = () => {
  return (
    <div style={{ 
      backgroundColor: PetVibeTheme.colors.primary,
      color: PetVibeTheme.colors.white 
    }}>
      Hello PetVibe!
    </div>
  );
};

// Using the custom hook
const MyComponent = () => {
  const theme = usePetVibeTheme();
  
  return (
    <div style={{ 
      backgroundColor: theme.colors.primary,
      color: theme.colors.white 
    }}>
      Hello PetVibe!
    </div>
  );
};
```

### 2. Styled Components Usage

```javascript
import { PetVibeButton, PetVibeCard, PetVibeInput } from './styles/styledComponents';

const MyComponent = () => {
  return (
    <PetVibeCard hoverable>
      <PetVibeButton variant="primary">
        Click me!
      </PetVibeButton>
      <PetVibeInput placeholder="Enter text..." />
    </PetVibeCard>
  );
};
```

### 3. Tailwind CSS Usage

```html
<!-- Using custom PetVibe classes -->
<div class="bg-pv-primary text-white p-4 rounded-lg">
  <h1 class="text-pv-gradient">PetVibe Title</h1>
  <button class="bg-pv-gradient-primary-btn text-white px-4 py-2 rounded-lg">
    Primary Button
  </button>
</div>
```

### 4. CSS Variables Usage

```css
.my-component {
  background-color: var(--pv-primary);
  color: var(--pv-text-white);
  border-radius: var(--pv-radius-lg);
  padding: var(--pv-spacing-md);
  box-shadow: var(--pv-shadow-warm);
}

.my-button {
  background: var(--pv-gradient-primary-btn);
  transition: all var(--pv-duration-normal) var(--pv-easing-ease);
}
```

## 📁 File Structure

```
src/styles/
├── theme.js              # Main theme object with all colors, gradients, and utilities
├── petvibe.css           # CSS variables and utility classes
├── styledComponents.js   # Styled-components for React
├── index.js              # Main export file
└── README.md             # This documentation
```

## 🎯 Key Features

### 1. **Unified Color System**
- Consistent color palette across all components
- Semantic color naming (primary, secondary, accent)
- Extended palette for flexibility

### 2. **Gradient System**
- Pre-defined gradients for backgrounds and buttons
- Warm, friendly color combinations
- Easy to use and customize

### 3. **Typography**
- Inter font family for modern, clean look
- Consistent font sizes and weights
- Proper line heights and spacing

### 4. **Spacing System**
- Consistent spacing scale (xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl)
- Easy to maintain and scale

### 5. **Animation System**
- Smooth transitions and animations
- Consistent timing and easing
- Performance-optimized

### 6. **Responsive Design**
- Mobile-first approach
- Consistent breakpoints
- Flexible grid system

## 🛠️ Available Components

### Styled Components
- `PetVibeButton` - Various button variants
- `PetVibeCard` - Card components with hover effects
- `PetVibeInput` - Form input fields
- `PetVibeContainer` - Responsive container
- `PetVibeSection` - Section wrapper
- `PetVibeHeading` - Typography headings
- `PetVibeText` - Text components
- `PetVibeFlex` - Flexbox layout
- `PetVibeGrid` - Grid layout
- `PetVibeSpacer` - Spacing component
- `PetVibeDivider` - Section dividers

### CSS Classes
- `.pv-bg-primary`, `.pv-bg-secondary`, etc. - Background colors
- `.pv-text-primary`, `.pv-text-secondary`, etc. - Text colors
- `.pv-bg-gradient-*` - Gradient backgrounds
- `.pv-shadow-warm`, `.pv-shadow-glow` - Custom shadows
- `.pv-animate-*` - Animation classes

### Tailwind Classes
- `bg-pv-primary`, `text-pv-primary` - Color utilities
- `bg-pv-gradient-*` - Gradient utilities
- `shadow-pv-warm`, `shadow-pv-glow` - Shadow utilities

## 🎨 Design Principles

### 1. **Warm & Friendly**
- Orange and brown tones create a welcoming atmosphere
- Soft gradients and rounded corners feel approachable
- Cream backgrounds are easy on the eyes

### 2. **Pet-Focused**
- Colors inspired by natural pet elements (fur, collars, warmth)
- Friendly, non-intimidating color choices
- Professional yet playful aesthetic

### 3. **Consistent**
- All components follow the same design language
- Predictable spacing and typography
- Unified interaction patterns

### 4. **Accessible**
- High contrast ratios for readability
- Clear visual hierarchy
- Keyboard and screen reader friendly

## 🔧 Customization

### Adding New Colors
```javascript
// In theme.js
export const PetVibeTheme = {
  colors: {
    // ... existing colors
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
  }
};
```

### Creating New Gradients
```javascript
// In theme.js
export const PetVibeTheme = {
  gradients: {
    // ... existing gradients
    newGradient: 'linear-gradient(45deg, #F6A623 0%, #10B981 100%)',
  }
};
```

### Adding New Components
```javascript
// In styledComponents.js
export const PetVibeNewComponent = styled.div`
  background: ${PetVibeTheme.colors.primary};
  border-radius: ${PetVibeTheme.borderRadius.lg};
  padding: ${PetVibeTheme.spacing.md};
`;
```

## 📱 Responsive Design

The theme includes responsive breakpoints:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

## 🌙 Dark Mode (Future Enhancement)

The theme is prepared for dark mode with CSS variables that can be overridden:

```css
@media (prefers-color-scheme: dark) {
  :root {
    --pv-light: #1F2937;
    --pv-text-heading: #F9FAFB;
    --pv-text-body: #E5E7EB;
  }
}
```

## 🚀 Getting Started

1. Import the theme in your main CSS file:
```css
@import './styles/petvibe.css';
```

2. Use the theme in your React components:
```javascript
import { usePetVibeTheme } from './hooks/usePetVibeTheme';
```

3. Apply PetVibe classes in your HTML:
```html
<div class="pv-bg-primary pv-text-white p-4 rounded-lg">
  PetVibe Content
</div>
```

## 📚 Examples

Check out the `ThemeDemo.jsx` component for a comprehensive showcase of all theme features and components.

## 🤝 Contributing

When adding new features to the theme:
1. Follow the existing naming conventions
2. Add documentation for new components
3. Update the demo component
4. Test across different screen sizes
5. Ensure accessibility standards

---

**PetVibe Theme** - Making pet care applications beautiful, warm, and user-friendly! 🐾
