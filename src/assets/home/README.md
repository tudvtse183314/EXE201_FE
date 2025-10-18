# Homepage Assets

This directory contains all the images used in the homepage components.

## Required Images

Place the following images in this directory:

### Hero Section
- `hero-dogs.png` - Main hero background image with happy dogs

### How It Works Steps
- `step1-create-profile.png` - Step 1: Create pet profile
- `step2-recommendations.png` - Step 2: AI recommendations
- `step3-shop.png` - Step 3: Shopping experience

### Testimonials
- `testimonial-1.png` - Sarah L. customer photo
- `testimonial-2.png` - David K. customer photo
- `testimonial-3.png` - Jessica T. customer photo
- `testimonial-4.png` - Michael B. customer photo

### Partners
- `partner-1.png` - PetCo logo
- `partner-2.png` - Chewy logo
- `partner-3.png` - PetSmart logo
- `partner-4.png` - Royal Canin logo
- `partner-5.png` - Hill's logo

## Fallback Behavior

All components include fallback behavior when images fail to load:
- Hero section falls back to a gradient background
- Step images show emoji placeholders with step titles
- Testimonial images fall back to UI Avatars
- Partner logos fall back to text-based logos

## Image Specifications

- **Hero image**: 1920x1080px minimum, landscape orientation
- **Step images**: 800x600px minimum, can be landscape or portrait
- **Testimonial images**: 400x400px minimum, square format
- **Partner logos**: 200x100px minimum, transparent background preferred

## Usage

Images are referenced in components using the `/src/assets/home/` path. Make sure to place the actual image files in this directory for the best visual experience.
