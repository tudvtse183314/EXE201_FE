import React from 'react';
import BgAnimateButton, { PrimaryButton, SecondaryButton, CTAButton, SoftButton, SocialButton } from '../effects/BgAnimateButton';
import BackgroundAnimate, { HeroBackground, NaturalBackground, OceanBackground, SoftBackground, SunsetBackground } from '../effects/BackgroundAnimate';
import { bgAnimatePresets, getAnimationPreset, getPageAnimations, animationVariants } from '../effects/animationsConfig';

/**
 * Demo component showing the Animation Management System
 * Demonstrates all available animation presets and components
 */
export default function AnimationSystemDemo() {
  return (
    <div className="p-8 space-y-12">
      <h1 className="text-4xl font-bold text-center mb-8">🎨 Animation Management System Demo</h1>
      
      {/* Animation Presets Overview */}
      <section className="space-y-4">
        <h2 className="text-3xl font-semibold">Animation Presets</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(bgAnimatePresets).map(([name, config]) => (
            <div key={name} className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-3 capitalize">{name}</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-semibold">Gradient:</span> {config.gradient}</p>
                <p><span className="font-semibold">Animation:</span> {config.animation}</p>
                {config.rounded && <p><span className="font-semibold">Rounded:</span> {config.rounded}</p>}
              </div>
              <div className="mt-4">
                <BgAnimateButton
                  gradient={config.gradient}
                  animation={config.animation}
                  rounded={config.rounded}
                  className="text-sm"
                >
                  {name} Button
                </BgAnimateButton>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pre-configured Button Variants */}
      <section className="space-y-4">
        <h2 className="text-3xl font-semibold">Pre-configured Button Variants</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="text-center">
            <PrimaryButton className="mb-2">Primary Button</PrimaryButton>
            <p className="text-sm text-gray-600">Sunrise gradient with pulse</p>
          </div>
          <div className="text-center">
            <SecondaryButton className="mb-2">Secondary Button</SecondaryButton>
            <p className="text-sm text-gray-600">Ocean gradient with slow spin</p>
          </div>
          <div className="text-center">
            <CTAButton className="mb-2">CTA Button</CTAButton>
            <p className="text-sm text-gray-600">Sunset gradient with fast spin</p>
          </div>
          <div className="text-center">
            <SoftButton className="mb-2">Soft Button</SoftButton>
            <p className="text-sm text-gray-600">Candy gradient with pulse</p>
          </div>
          <div className="text-center">
            <SocialButton className="mb-2">Social Button</SocialButton>
            <p className="text-sm text-gray-600">Default gradient with slow spin</p>
          </div>
        </div>
      </section>

      {/* Background Animation Components */}
      <section className="space-y-4">
        <h2 className="text-3xl font-semibold">Background Animation Components</h2>
        <div className="space-y-6">
          <div className="rounded-2xl overflow-hidden">
            <HeroBackground className="p-8">
              <div className="text-center text-white">
                <h3 className="text-2xl font-bold mb-2">Hero Background</h3>
                <p className="text-lg">Nebula gradient with slow spin animation</p>
              </div>
            </HeroBackground>
          </div>
          
          <div className="rounded-2xl overflow-hidden">
            <NaturalBackground className="p-8">
              <div className="text-center text-white">
                <h3 className="text-2xl font-bold mb-2">Natural Background</h3>
                <p className="text-lg">Forest gradient with slow spin animation</p>
              </div>
            </NaturalBackground>
          </div>
          
          <div className="rounded-2xl overflow-hidden">
            <OceanBackground className="p-8">
              <div className="text-center text-white">
                <h3 className="text-2xl font-bold mb-2">Ocean Background</h3>
                <p className="text-lg">Ocean gradient with slow spin animation</p>
              </div>
            </OceanBackground>
          </div>
          
          <div className="rounded-2xl overflow-hidden">
            <SoftBackground className="p-8">
              <div className="text-center text-white">
                <h3 className="text-2xl font-bold mb-2">Soft Background</h3>
                <p className="text-lg">Candy gradient with pulse animation</p>
              </div>
            </SoftBackground>
          </div>
          
          <div className="rounded-2xl overflow-hidden">
            <SunsetBackground className="p-8">
              <div className="text-center text-white">
                <h3 className="text-2xl font-bold mb-2">Sunset Background</h3>
                <p className="text-lg">Sunset gradient with pulse animation</p>
              </div>
            </SunsetBackground>
          </div>
        </div>
      </section>

      {/* Page-specific Animations */}
      <section className="space-y-4">
        <h2 className="text-3xl font-semibold">Page-specific Animation Configurations</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {Object.entries(pageAnimations).map(([pageName, animations]) => (
            <div key={pageName} className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4 capitalize">{pageName} Page</h3>
              <div className="space-y-3">
                {Object.entries(animations).map(([element, config]) => (
                  <div key={element} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium capitalize">{element}</span>
                    <div className="text-sm text-gray-600">
                      {config.gradient} + {config.animation}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Animation Variants */}
      <section className="space-y-4">
        <h2 className="text-3xl font-semibold">Animation Variants by Context</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {Object.entries(animationVariants).map(([category, variants]) => (
            <div key={category} className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4 capitalize">{category}</h3>
              <div className="space-y-3">
                {Object.entries(variants).map(([variant, config]) => (
                  <div key={variant} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium capitalize">{variant}</span>
                    <div className="text-sm text-gray-600">
                      {config.gradient} + {config.animation}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Usage Examples */}
      <section className="space-y-4">
        <h2 className="text-3xl font-semibold">Usage Examples</h2>
        <div className="bg-gray-100 p-6 rounded-lg">
          <h3 className="text-lg font-medium mb-4">Code Examples:</h3>
          <pre className="text-sm bg-white p-4 rounded border overflow-x-auto">
{`// Import animation components
import { PrimaryButton, CTAButton } from '../components/effects/BgAnimateButton';
import { HeroBackground, NaturalBackground } from '../components/effects/BackgroundAnimate';
import { getPageAnimations } from '../components/effects/animationsConfig';

// Use pre-configured buttons
<PrimaryButton onClick={handleClick}>
  Primary Action
</PrimaryButton>

<CTAButton onClick={handleCTA}>
  Call to Action
</CTAButton>

// Use background animations
<HeroBackground className="py-20">
  <div className="text-center text-white">
    <h1>Hero Section</h1>
  </div>
</HeroBackground>

// Get page-specific animations
const homepageAnimations = getPageAnimations('homepage');
const { hero, cta, serviceCards } = homepageAnimations;

// Use custom configurations
<BgAnimateButton
  gradient="sunset"
  animation="spin-fast"
  rounded="full"
>
  Custom Button
</BgAnimateButton>`}
          </pre>
        </div>
      </section>

      {/* Benefits */}
      <section className="space-y-4">
        <h2 className="text-3xl font-semibold">System Benefits</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">🎯 Consistency</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Unified animation system across all pages</li>
              <li>• Pre-defined presets for common use cases</li>
              <li>• Consistent visual language</li>
              <li>• Easy to maintain and update</li>
            </ul>
          </div>
          
          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">⚡ Performance</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Optimized CSS animations</li>
              <li>• Reusable components</li>
              <li>• Minimal bundle size impact</li>
              <li>• Smooth transitions</li>
            </ul>
          </div>
          
          <div className="bg-purple-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">🛠️ Developer Experience</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• TypeScript support</li>
              <li>• IntelliSense autocomplete</li>
              <li>• Easy to customize</li>
              <li>• Clear documentation</li>
            </ul>
          </div>
          
          <div className="bg-orange-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">🎨 Design Flexibility</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Multiple gradient options</li>
              <li>• Various animation types</li>
              <li>• Different border radius options</li>
              <li>• Context-specific variants</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
