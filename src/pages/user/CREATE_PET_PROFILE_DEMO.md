# 🐾 CreatePetProfile.jsx - Demo Guide

## 📋 **Tổng quan trang CreatePetProfile**

Trang tạo hồ sơ thú cưng với layout 2 cột, sidebar trái hiển thị tiến trình và form bên phải.

## 🎨 **Thiết kế theo yêu cầu**

### **1. Layout 2 cột:**
- ✅ **Sidebar trái**: Profile Setup với stepper
- ✅ **Main content phải**: Form tạo hồ sơ thú cưng
- ✅ **Max-width**: 1200px với padding 2rem
- ✅ **Responsive**: Grid layout với breakpoints

### **2. Tông màu chủ đạo:**
- ✅ **Trắng**: #ffffff (background cards)
- ✅ **Tím nhạt**: #6B4EFF (purple-600, purple-700)
- ✅ **Xám chữ**: #333333, #666666 (text colors)
- ✅ **Font**: Inter, sans-serif (default Tailwind)

### **3. Hiệu ứng:**
- ✅ **Hover mềm**: transition-colors duration-200/300
- ✅ **Bo góc**: rounded-xl, rounded-lg
- ✅ **Đổ bóng**: shadow-md, shadow-sm, shadow-lg
- ✅ **Animations**: Framer Motion với stagger effects

## 🧭 **Sidebar trái - Profile Setup**

### **Card trắng:**
```jsx
<div className="bg-white shadow-md rounded-xl p-6 sticky top-8">
```

### **Tiêu đề:**
- ✅ **Profile Setup**: font-bold text-lg
- ✅ **Phụ đề**: Complete these steps...

### **Vertical Stepper:**
```jsx
✅ Account Created        (CheckCircle - green)
✅ Basic Information      (CheckCircle - green)  
✅ Physical Traits        (CheckCircle - green)
🔵 Behavior & Preferences (Circle - purple, current)
⚪ Dietary Needs          (Circle - gray)
⚪ Review Profile         (Circle - gray)
```

### **Hover effects:**
- ✅ **Hover**: bg-gray-50
- ✅ **Current step**: bg-purple-50
- ✅ **Text colors**: Dynamic based on state

## 🐕‍🦺 **Main Content - Form**

### **Header:**
- ✅ **Title**: "Create Your Pet's Profile" (text-3xl font-bold)
- ✅ **Description**: Personalized recommendations text
- ✅ **Banner image**: 100% width, rounded-xl, shadow-sm

### **Form Structure:**
```jsx
📋 Basic Information Card
├── Pet Name (text input)
├── Species (select dropdown)
├── Breed (text input)
├── Age (number input)
└── Weight (number input)

🧬 Physical Traits Card
├── Overall Size (select)
├── Coat Type (select)
├── Neck Girth (number input)
├── Back Length (number input)
├── Activity Level (radio buttons)
├── Chew Habits (radio buttons)
└── Toy Preferences (checkboxes)
```

## 📋 **Form Fields Chi tiết**

### **Basic Information:**
- ✅ **Grid layout**: 2 cột responsive
- ✅ **Input styling**: Focus ring purple, transitions
- ✅ **Placeholders**: Descriptive text
- ✅ **Validation**: Number inputs với min/max

### **Physical Traits:**
- ✅ **Select dropdowns**: Species, Size, Coat Type
- ✅ **Number inputs**: Age, Weight, Measurements
- ✅ **Radio groups**: Activity Level, Chew Habits
- ✅ **Checkbox groups**: Toy Preferences (multiple)

### **Styling:**
```jsx
// Input fields
className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"

// Checkboxes/Radios
className="accent-purple-600 rounded-md"

// Labels
className="block text-sm font-medium text-gray-700 mb-2"
```

## 💾 **Save Button**

### **Styling:**
```jsx
<button className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold hover:from-purple-700 hover:to-purple-800 transition-all duration-300 shadow-lg hover:shadow-xl">
  Save Profile
</button>
```

### **Features:**
- ✅ **Gradient background**: Purple 600 → 700
- ✅ **Hover effect**: Darker gradient + shadow
- ✅ **Position**: Căn phải (justify-end)
- ✅ **Animation**: Framer Motion với delay

## 🎭 **Animations & Interactions**

### **Framer Motion:**
- ✅ **Sidebar**: Slide in from left
- ✅ **Main content**: Fade in with stagger
- ✅ **Cards**: Individual animations với delays
- ✅ **Stepper items**: Staggered appearance

### **Hover Effects:**
- ✅ **Navigation items**: Color transitions
- ✅ **Form inputs**: Focus rings
- ✅ **Buttons**: Gradient + shadow changes
- ✅ **Cards**: Subtle shadow changes

## 📱 **Responsive Design**

### **Breakpoints:**
- ✅ **Mobile**: Single column layout
- ✅ **Tablet**: 2-column grid
- ✅ **Desktop**: 4-column grid (1 sidebar + 3 main)

### **Grid System:**
```jsx
// Container
<div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

// Sidebar
<div className="lg:col-span-1">

// Main content  
<div className="lg:col-span-3">
```

## 🚀 **Cách sử dụng**

### **1. Truy cập trang:**
```
URL: /create-pet-profile
```

### **2. Điền form:**
- Chọn species → breed → age → weight
- Chọn size → coat type → measurements
- Chọn activity level → chew habits → toy preferences

### **3. Save Profile:**
- Click "Save Profile" button
- Form data được log ra console
- Alert confirmation hiển thị

## 🔧 **Technical Features**

### **State Management:**
- ✅ **useState**: Form data, current step
- ✅ **Controlled inputs**: All form fields
- ✅ **Dynamic updates**: Real-time form changes

### **Form Handling:**
- ✅ **onChange handlers**: Input và checkbox changes
- ✅ **onSubmit**: Form submission với preventDefault
- ✅ **Data structure**: Organized object với nested properties

### **Accessibility:**
- ✅ **Labels**: Proper label associations
- ✅ **Focus management**: Keyboard navigation
- ✅ **Color contrast**: WCAG compliant colors
- ✅ **Screen readers**: Semantic HTML structure

## 📁 **File Structure**

```
src/pages/user/
├── CreatePetProfile.jsx          # Main component
└── CREATE_PET_PROFILE_DEMO.md    # This guide
```

## 🎯 **Next Steps**

1. **Test trang**: Navigate to `/create-pet-profile`
2. **Fill form**: Test all input types
3. **Submit**: Check console logs
4. **Responsive**: Test on different screen sizes
5. **Integration**: Connect với backend API

## ✅ **Completed Features**

- ✅ Layout 2 cột với sidebar stepper
- ✅ Form với Basic Information + Physical Traits
- ✅ Tông màu tím nhạt theo yêu cầu
- ✅ Hover effects và animations
- ✅ Responsive design
- ✅ Form validation và state management
- ✅ Save button với gradient styling
- ✅ Route integration với AppRoutes.jsx
