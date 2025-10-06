// src/components/effects/animationsConfig.ts

// 1. Các kiểu có sẵn từ BgAnimateButton
export type GradientType =
  | "sunrise"
  | "ocean"
  | "candy"
  | "forest"
  | "sunset"
  | "default"
  | "nebula"

export type RadiusType = "full" | "xl" | "2xl" | "3xl" | "sm"
export type AnimationType = "spin" | "pulse" | "spin-slow" | "spin-fast"

// 2. Cấu hình preset hiệu ứng (dễ dùng)
export const bgAnimatePresets = {
  primary: {
    gradient: "sunrise" as GradientType,
    animation: "pulse" as AnimationType,
    rounded: "3xl" as RadiusType,
  },
  secondary: {
    gradient: "ocean" as GradientType,
    animation: "spin-slow" as AnimationType,
    rounded: "2xl" as RadiusType,
  },
  cta: {
    gradient: "sunset" as GradientType,
    animation: "spin-fast" as AnimationType,
    rounded: "full" as RadiusType,
  },
  soft: {
    gradient: "candy" as GradientType,
    animation: "pulse" as AnimationType,
    rounded: "xl" as RadiusType,
  },
  heroBackground: {
    gradient: "nebula" as GradientType,
    animation: "spin-slow" as AnimationType,
  },
  naturalBackground: {
    gradient: "forest" as GradientType,
    animation: "spin-slow" as AnimationType,
  },
  petCard: {
    gradient: "candy" as GradientType,
    animation: "pulse" as AnimationType,
    rounded: "2xl" as RadiusType,
  },
  loginButton: {
    gradient: "sunrise" as GradientType,
    animation: "pulse" as AnimationType,
    rounded: "xl" as RadiusType,
  },
  registerButton: {
    gradient: "sunset" as GradientType,
    animation: "spin-slow" as AnimationType,
    rounded: "xl" as RadiusType,
  },
  newsletterButton: {
    gradient: "ocean" as GradientType,
    animation: "pulse" as AnimationType,
    rounded: "lg" as RadiusType,
  },
  socialButton: {
    gradient: "default" as GradientType,
    animation: "spin-slow" as AnimationType,
    rounded: "xl" as RadiusType,
  },
}

// 3. Animation configurations for different page sections
export const pageAnimations = {
  homepage: {
    hero: bgAnimatePresets.heroBackground,
    cta: bgAnimatePresets.cta,
    serviceCards: bgAnimatePresets.petCard,
    newsletter: bgAnimatePresets.newsletterButton,
  },
  login: {
    loginButton: bgAnimatePresets.loginButton,
    socialButtons: bgAnimatePresets.socialButton,
    background: bgAnimatePresets.naturalBackground,
  },
  register: {
    registerButton: bgAnimatePresets.registerButton,
    socialButtons: bgAnimatePresets.socialButton,
    background: bgAnimatePresets.naturalBackground,
  },
  about: {
    cta: bgAnimatePresets.cta,
    cards: bgAnimatePresets.soft,
  },
  services: {
    serviceCards: bgAnimatePresets.petCard,
    cta: bgAnimatePresets.cta,
  },
  contact: {
    submitButton: bgAnimatePresets.primary,
    background: bgAnimatePresets.naturalBackground,
  },
}

// 4. Utility functions for easy access
export const getAnimationPreset = (presetName: keyof typeof bgAnimatePresets) => {
  return bgAnimatePresets[presetName];
};

export const getPageAnimations = (pageName: keyof typeof pageAnimations) => {
  return pageAnimations[pageName];
};

// 5. Animation variants for different contexts
export const animationVariants = {
  // Button animations
  buttons: {
    primary: bgAnimatePresets.primary,
    secondary: bgAnimatePresets.secondary,
    cta: bgAnimatePresets.cta,
    soft: bgAnimatePresets.soft,
  },
  
  // Background animations
  backgrounds: {
    hero: bgAnimatePresets.heroBackground,
    natural: bgAnimatePresets.naturalBackground,
    default: bgAnimatePresets.soft,
  },
  
  // Card animations
  cards: {
    pet: bgAnimatePresets.petCard,
    service: bgAnimatePresets.soft,
    testimonial: bgAnimatePresets.secondary,
  },
  
  // Form animations
  forms: {
    login: bgAnimatePresets.loginButton,
    register: bgAnimatePresets.registerButton,
    newsletter: bgAnimatePresets.newsletterButton,
    social: bgAnimatePresets.socialButton,
  },
};

/**
 * This file defines all reusable background animation presets
 * for BgAnimateButton and background sections.
 * Use `bgAnimatePresets` to quickly apply consistent animation styles.
 * 
 * Example usage:
 *    const { gradient, animation, rounded } = bgAnimatePresets.cta
 *    const pageAnimations = getPageAnimations('homepage')
 *    const buttonAnimations = animationVariants.buttons.primary
 * 
 * Available presets:
 * - primary: Sunrise gradient with pulse animation
 * - secondary: Ocean gradient with slow spin
 * - cta: Sunset gradient with fast spin
 * - soft: Candy gradient with pulse
 * - heroBackground: Nebula gradient with slow spin
 * - naturalBackground: Forest gradient with slow spin
 * - petCard: Candy gradient with pulse for pet-related cards
 * - loginButton: Sunrise gradient for login buttons
 * - registerButton: Sunset gradient for register buttons
 * - newsletterButton: Ocean gradient for newsletter
 * - socialButton: Default gradient for social buttons
 */
