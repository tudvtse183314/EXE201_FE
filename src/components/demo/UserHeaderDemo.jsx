import React from 'react';
import UserHeader from '../layout/UserHeader';
import Shuffle from '../effects/Shuffle';

/**
 * Demo component showing the enhanced UserHeader with Shuffle animations
 * Highlights the new animated header features
 */
export default function UserHeaderDemo() {
  return (
    <div className="min-h-screen bg-gray-900">
      {/* UserHeader Demo */}
      <UserHeader />
      
      {/* Demo Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Enhanced User Header Demo
          </h2>
          
          {/* Features Showcase */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-gray-800 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-cyan-400 mb-4">🎨 Shuffle Animation</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-300 mb-2">Welcome Text:</h4>
                  <div className="text-lg">
                    <Shuffle
                      text="WELCOME! USERNAME"
                      shuffleDirection="up"
                      duration={0.6}
                      stagger={0.05}
                      glowColor="#22d3ee"
                    />
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-300 mb-2">Different Directions:</h4>
                  <div className="space-y-2">
                    <div className="text-sm">
                      <Shuffle
                        text="UP DIRECTION"
                        shuffleDirection="up"
                        duration={0.4}
                        stagger={0.03}
                        glowColor="#10b981"
                      />
                    </div>
                    <div className="text-sm">
                      <Shuffle
                        text="DOWN DIRECTION"
                        shuffleDirection="down"
                        duration={0.4}
                        stagger={0.03}
                        glowColor="#f59e0b"
                      />
                    </div>
                    <div className="text-sm">
                      <Shuffle
                        text="LEFT DIRECTION"
                        shuffleDirection="left"
                        duration={0.4}
                        stagger={0.03}
                        glowColor="#ef4444"
                      />
                    </div>
                    <div className="text-sm">
                      <Shuffle
                        text="RIGHT DIRECTION"
                        shuffleDirection="right"
                        duration={0.4}
                        stagger={0.03}
                        glowColor="#8b5cf6"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-cyan-400 mb-4">🚀 Header Features</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  <span className="text-gray-300">Animated welcome message with user's name</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  <span className="text-gray-300">Cyan neon glow effect on text</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  <span className="text-gray-300">Smooth navigation with hover effects</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  <span className="text-gray-300">Animated background particles</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  <span className="text-gray-300">Mobile-responsive design</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  <span className="text-gray-300">Animated hamburger menu</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  <span className="text-gray-300">Interactive icon buttons</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Animation Showcase */}
          <div className="bg-gray-800 rounded-2xl p-6 mb-8">
            <h3 className="text-xl font-bold text-cyan-400 mb-4">✨ Animation Showcase</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <h4 className="text-sm font-semibold text-gray-300 mb-3">Different Glow Colors</h4>
                <div className="space-y-2">
                  <div className="text-lg">
                    <Shuffle
                      text="CYAN GLOW"
                      shuffleDirection="up"
                      duration={0.5}
                      stagger={0.04}
                      glowColor="#22d3ee"
                    />
                  </div>
                  <div className="text-lg">
                    <Shuffle
                      text="PURPLE GLOW"
                      shuffleDirection="up"
                      duration={0.5}
                      stagger={0.04}
                      glowColor="#a855f7"
                    />
                  </div>
                  <div className="text-lg">
                    <Shuffle
                      text="GREEN GLOW"
                      shuffleDirection="up"
                      duration={0.5}
                      stagger={0.04}
                      glowColor="#10b981"
                    />
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <h4 className="text-sm font-semibold text-gray-300 mb-3">Different Speeds</h4>
                <div className="space-y-2">
                  <div className="text-lg">
                    <Shuffle
                      text="FAST"
                      shuffleDirection="up"
                      duration={0.3}
                      stagger={0.02}
                      glowColor="#f59e0b"
                    />
                  </div>
                  <div className="text-lg">
                    <Shuffle
                      text="MEDIUM"
                      shuffleDirection="up"
                      duration={0.5}
                      stagger={0.04}
                      glowColor="#ef4444"
                    />
                  </div>
                  <div className="text-lg">
                    <Shuffle
                      text="SLOW"
                      shuffleDirection="up"
                      duration={0.8}
                      stagger={0.06}
                      glowColor="#8b5cf6"
                    />
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <h4 className="text-sm font-semibold text-gray-300 mb-3">Different Stagger</h4>
                <div className="space-y-2">
                  <div className="text-lg">
                    <Shuffle
                      text="TIGHT"
                      shuffleDirection="up"
                      duration={0.5}
                      stagger={0.02}
                      glowColor="#06b6d4"
                    />
                  </div>
                  <div className="text-lg">
                    <Shuffle
                      text="NORMAL"
                      shuffleDirection="up"
                      duration={0.5}
                      stagger={0.04}
                      glowColor="#8b5cf6"
                    />
                  </div>
                  <div className="text-lg">
                    <Shuffle
                      text="LOOSE"
                      shuffleDirection="up"
                      duration={0.5}
                      stagger={0.08}
                      glowColor="#10b981"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Technical Details */}
          <div className="bg-gray-800 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-cyan-400 mb-4">🔧 Technical Implementation</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-semibold text-gray-300 mb-3">Dependencies:</h4>
                <div className="space-y-2 text-sm text-gray-400">
                  <div>• GSAP - Animation library</div>
                  <div>• @gsap/react - React integration</div>
                  <div>• Framer Motion - UI animations</div>
                  <div>• React Router - Navigation</div>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-300 mb-3">Features:</h4>
                <div className="space-y-2 text-sm text-gray-400">
                  <div>• Shuffle text animation with GSAP</div>
                  <div>• Neon glow effects with CSS text-shadow</div>
                  <div>• Smooth hover animations with Framer Motion</div>
                  <div>• Responsive mobile menu with animations</div>
                  <div>• Maintains original navigation logic</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
