import React from 'react';
import ShinyText from '../effects/ShinyText';
import GradientText, { HotGradient, DiscountGradient, AIGradient, PremiumGradient, SaleGradient } from '../effects/GradientText';

/**
 * Demo component showcasing ShinyText and GradientText effects
 * Perfect for attention-grabbing text like discounts, hot deals, AI features
 */
export default function TextEffectsDemo() {
  return (
    <div className="p-8 space-y-12">
      <h1 className="text-4xl font-bold text-center mb-8">✨ Text Effects Demo</h1>
      
      {/* ShinyText Effects */}
      <section className="space-y-6">
        <h2 className="text-3xl font-semibold">🌟 ShinyText Effects</h2>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Perfect for attention-grabbing text</h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-700">Basic ShinyText</h4>
              <div className="space-y-3">
                <ShinyText text="🔥 HOT DEAL!" speed={2} size="text-2xl" />
                <ShinyText text="💰 50% OFF!" speed={3} size="text-xl" />
                <ShinyText text="⚡ LIMITED TIME!" speed={4} size="text-lg" />
                <ShinyText text="🎯 AI RECOMMENDED" speed={2.5} size="text-lg" />
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-700">Different Speeds</h4>
              <div className="space-y-3">
                <ShinyText text="Fast Animation" speed={1} size="text-lg" />
                <ShinyText text="Normal Speed" speed={3} size="text-lg" />
                <ShinyText text="Slow Animation" speed={5} size="text-lg" />
                <ShinyText text="Disabled" disabled={true} size="text-lg" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GradientText Effects */}
      <section className="space-y-6">
        <h2 className="text-3xl font-semibold">🌈 GradientText Effects</h2>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Animated gradient text with customizable colors</h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-700">Predefined Gradients</h4>
              <div className="space-y-3">
                <HotGradient size="text-2xl">🔥 HOT DEALS</HotGradient>
                <DiscountGradient size="text-xl">💰 BEST PRICES</DiscountGradient>
                <AIGradient size="text-xl">🤖 AI RECOMMENDED</AIGradient>
                <PremiumGradient size="text-xl">👑 PREMIUM</PremiumGradient>
                <SaleGradient size="text-lg">🏷️ SALE</SaleGradient>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-700">Custom Gradients</h4>
              <div className="space-y-3">
                <GradientText 
                  colors={["#ef4444", "#f59e0b", "#f97316"]} 
                  size="text-xl"
                >
                  🔥 Red-Orange-Yellow
                </GradientText>
                <GradientText 
                  colors={["#3b82f6", "#8b5cf6", "#ec4899"]} 
                  size="text-xl"
                >
                  💙 Blue-Purple-Pink
                </GradientText>
                <GradientText 
                  colors={["#10b981", "#06b6d4", "#3b82f6"]} 
                  size="text-xl"
                >
                  💚 Teal-Cyan-Blue
                </GradientText>
                <GradientText 
                  colors={["#fbbf24", "#f59e0b", "#d97706"]} 
                  size="text-lg"
                >
                  🟡 Gold-Orange
                </GradientText>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Usage Examples */}
      <section className="space-y-6">
        <h2 className="text-3xl font-semibold">💡 Usage Examples</h2>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8">
          <h3 className="text-lg font-semibold text-blue-800 mb-6">Perfect for e-commerce and marketing</h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h4 className="font-semibold text-gray-800 mb-3">Product Badges</h4>
              <div className="space-y-2">
                <div className="bg-gray-100 p-3 rounded">
                  <HotGradient size="text-sm">30% OFF</HotGradient>
                </div>
                <div className="bg-gray-100 p-3 rounded">
                  <DiscountGradient size="text-sm">BEST PRICE</DiscountGradient>
                </div>
                <div className="bg-gray-100 p-3 rounded">
                  <SaleGradient size="text-sm">SALE</SaleGradient>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h4 className="font-semibold text-gray-800 mb-3">Section Headers</h4>
              <div className="space-y-2">
                <div className="bg-gray-100 p-3 rounded">
                  <AIGradient size="text-sm">AI RECOMMENDED</AIGradient>
                </div>
                <div className="bg-gray-100 p-3 rounded">
                  <PremiumGradient size="text-sm">PREMIUM</PremiumGradient>
                </div>
                <div className="bg-gray-100 p-3 rounded">
                  <ShinyText text="HOT DEALS" size="text-sm" speed={3} />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h4 className="font-semibold text-gray-800 mb-3">Call-to-Action</h4>
              <div className="space-y-2">
                <div className="bg-gray-100 p-3 rounded">
                  <HotGradient size="text-sm">BUY NOW</HotGradient>
                </div>
                <div className="bg-gray-100 p-3 rounded">
                  <ShinyText text="LIMITED TIME!" size="text-sm" speed={2} />
                </div>
                <div className="bg-gray-100 p-3 rounded">
                  <DiscountGradient size="text-sm">SAVE 50%</DiscountGradient>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Implementation Guide */}
      <section className="space-y-6">
        <h2 className="text-3xl font-semibold">🛠️ Implementation Guide</h2>
        <div className="bg-green-50 border border-green-200 rounded-lg p-8">
          <h3 className="text-lg font-semibold text-green-800 mb-6">How to use these effects</h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="font-semibold text-green-700">ShinyText Usage</h4>
              <div className="bg-white rounded-lg p-4">
                <pre className="text-xs text-gray-700 overflow-x-auto">
{`import ShinyText from './ShinyText';

<ShinyText 
  text="HOT DEAL!" 
  speed={3} 
  size="text-xl"
  weight="font-bold"
/>`}
                </pre>
              </div>
              <div className="space-y-2 text-sm text-green-700">
                <div><strong>Props:</strong></div>
                <div>• text: string - Text to display</div>
                <div>• speed: number - Animation speed (1-5)</div>
                <div>• size: string - Tailwind text size</div>
                <div>• weight: string - Tailwind font weight</div>
                <div>• disabled: boolean - Disable animation</div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-green-700">GradientText Usage</h4>
              <div className="bg-white rounded-lg p-4">
                <pre className="text-xs text-gray-700 overflow-x-auto">
{`import { HotGradient } from './GradientText';

<HotGradient size="text-xl">
  🔥 HOT DEALS
</HotGradient>

// Or custom colors
<GradientText 
  colors={["#ef4444", "#f59e0b", "#f97316"]}
  size="text-xl"
>
  Custom Gradient
</GradientText>`}
                </pre>
              </div>
              <div className="space-y-2 text-sm text-green-700">
                <div><strong>Props:</strong></div>
                <div>• colors: array - Gradient colors</div>
                <div>• animationSpeed: number - Animation speed</div>
                <div>• size: string - Tailwind text size</div>
                <div>• weight: string - Tailwind font weight</div>
                <div>• showBorder: boolean - Show border</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Color Palettes */}
      <section className="space-y-6">
        <h2 className="text-3xl font-semibold">🎨 Color Palettes</h2>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-8">
          <h3 className="text-lg font-semibold text-purple-800 mb-6">Predefined color combinations</h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h4 className="font-semibold text-gray-800 mb-3">Hot Gradient</h4>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <div className="w-6 h-6 bg-red-500 rounded"></div>
                  <div className="w-6 h-6 bg-orange-500 rounded"></div>
                  <div className="w-6 h-6 bg-yellow-500 rounded"></div>
                </div>
                <HotGradient size="text-sm">Red-Orange-Yellow</HotGradient>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h4 className="font-semibold text-gray-800 mb-3">AI Gradient</h4>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <div className="w-6 h-6 bg-blue-500 rounded"></div>
                  <div className="w-6 h-6 bg-purple-500 rounded"></div>
                  <div className="w-6 h-6 bg-pink-500 rounded"></div>
                </div>
                <AIGradient size="text-sm">Blue-Purple-Pink</AIGradient>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h4 className="font-semibold text-gray-800 mb-3">Premium Gradient</h4>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <div className="w-6 h-6 bg-yellow-400 rounded"></div>
                  <div className="w-6 h-6 bg-orange-500 rounded"></div>
                  <div className="w-6 h-6 bg-amber-600 rounded"></div>
                </div>
                <PremiumGradient size="text-sm">Gold-Orange</PremiumGradient>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h4 className="font-semibold text-gray-800 mb-3">Discount Gradient</h4>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <div className="w-6 h-6 bg-red-600 rounded"></div>
                  <div className="w-6 h-6 bg-yellow-500 rounded"></div>
                  <div className="w-6 h-6 bg-yellow-400 rounded"></div>
                </div>
                <DiscountGradient size="text-sm">Red-Yellow-Gold</DiscountGradient>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h4 className="font-semibold text-gray-800 mb-3">Sale Gradient</h4>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <div className="w-6 h-6 bg-red-500 rounded"></div>
                  <div className="w-6 h-6 bg-red-600 rounded"></div>
                  <div className="w-6 h-6 bg-red-700 rounded"></div>
                </div>
                <SaleGradient size="text-sm">Red Variations</SaleGradient>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h4 className="font-semibold text-gray-800 mb-3">Custom Gradient</h4>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <div className="w-6 h-6 bg-green-500 rounded"></div>
                  <div className="w-6 h-6 bg-cyan-500 rounded"></div>
                  <div className="w-6 h-6 bg-blue-500 rounded"></div>
                </div>
                <GradientText 
                  colors={["#10b981", "#06b6d4", "#3b82f6"]} 
                  size="text-sm"
                >
                  Teal-Cyan-Blue
                </GradientText>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Best Practices */}
      <section className="space-y-6">
        <h2 className="text-3xl font-semibold">✨ Best Practices</h2>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8">
          <h3 className="text-lg font-semibold text-yellow-800 mb-6">Tips for effective use</h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="font-semibold text-yellow-700">Do's</h4>
              <ul className="space-y-2 text-sm text-yellow-700">
                <li>✅ Use for attention-grabbing text only</li>
                <li>✅ Apply to discounts, deals, and promotions</li>
                <li>✅ Use appropriate colors for context</li>
                <li>✅ Keep animation speeds moderate (2-4)</li>
                <li>✅ Use sparingly to maintain impact</li>
                <li>✅ Test on different devices and browsers</li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-yellow-700">Don'ts</h4>
              <ul className="space-y-2 text-sm text-yellow-700">
                <li>❌ Don't overuse - can be distracting</li>
                <li>❌ Don't use for body text or descriptions</li>
                <li>❌ Don't use too many different effects together</li>
                <li>❌ Don't use very fast animations (speed < 1)</li>
                <li>❌ Don't use on important navigation elements</li>
                <li>❌ Don't forget accessibility considerations</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
