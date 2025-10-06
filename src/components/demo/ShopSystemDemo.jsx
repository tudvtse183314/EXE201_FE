import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { mockProducts, getCategories } from '../../data/products';

/**
 * Demo component showing the Shop system
 * Highlights the product structure, mock data, and UI components
 */
export default function ShopSystemDemo() {
  const { user, token } = useAuth();
  const categories = getCategories();

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-4xl font-bold text-center mb-8">🛍️ Shop System Demo</h1>
      
      {/* Shop Overview */}
      <section className="space-y-4">
        <h2 className="text-3xl font-semibold">Shop System Overview</h2>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-4">🛒 Shop Features</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm"><strong>Public Shop:</strong> Accessible to everyone</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm"><strong>User Shop:</strong> Enhanced features for logged-in users</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm"><strong>Product Search:</strong> Real-time search functionality</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm"><strong>Category Filtering:</strong> Products organized by category</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm"><strong>Add to Cart:</strong> Shopping cart functionality</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm"><strong>Wishlist:</strong> Save favorite products</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm"><strong>Authentication:</strong> Login required for purchases</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm"><strong>Mock Data:</strong> Ready for real API integration</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Data Structure */}
      <section className="space-y-4">
        <h2 className="text-3xl font-semibold">Product Data Structure</h2>
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-800 mb-4">📦 API Structure</h3>
          <div className="bg-white rounded-lg p-4 mb-4">
            <h4 className="font-semibold mb-2">API Endpoint: <code className="bg-gray-100 px-2 py-1 rounded">/api/products/getAll</code></h4>
            <pre className="text-xs text-gray-700 bg-gray-50 p-3 rounded overflow-x-auto">
{`[
  {
    "id": 0,
    "name": "string",
    "description": "string", 
    "price": 0,
    "stock": 0,
    "category": {
      "id": 0,
      "name": "string",
      "description": "string"
    }
  }
]`}
            </pre>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Mock Data Features:</h4>
              <ul className="space-y-1 text-sm text-green-700">
                <li>• 24 sample products</li>
                <li>• 9 different categories</li>
                <li>• Price ranges from $9.99 to $120</li>
                <li>• Stock management</li>
                <li>• Discount badges</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Ready for API:</h4>
              <ul className="space-y-1 text-sm text-green-700">
                <li>• Easy to replace mock data</li>
                <li>• Same data structure</li>
                <li>• No UI changes needed</li>
                <li>• Error handling included</li>
                <li>• Loading states ready</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="space-y-4">
        <h2 className="text-3xl font-semibold">Product Categories</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {categories.map(category => (
            <div key={category.id} className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">{category.name}</h3>
              <p className="text-sm text-gray-600 mb-3">{category.description}</p>
              <div className="text-xs text-gray-500">
                {mockProducts.filter(p => p.category.id === category.id).length} products
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sample Products */}
      <section className="space-y-4">
        <h2 className="text-3xl font-semibold">Sample Products</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockProducts.slice(0, 6).map(product => (
            <div key={product.id} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900 text-sm">{product.name}</h3>
                {product.badge && (
                  <span className="bg-pink-500 text-white text-xs px-2 py-1 rounded-full">
                    {product.badge}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-600 mb-2">{product.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</span>
                <span className="text-xs text-gray-500">{product.stock} in stock</span>
              </div>
              <div className="mt-2">
                <span className="text-xs text-gray-500">{product.category.name}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Shop Routes */}
      <section className="space-y-4">
        <h2 className="text-3xl font-semibold">Shop Routes</h2>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-purple-800 mb-4">🛣️ Routing Structure</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-purple-700">Public Shop</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <code className="text-sm bg-white px-2 py-1 rounded">/shop</code>
                  <span className="text-sm text-gray-700">Public Shop (accessible to everyone)</span>
                </div>
                <div className="text-xs text-gray-600 ml-4">
                  • Guest can browse products<br/>
                  • Login required for purchases<br/>
                  • Redirects to login when adding to cart
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-purple-700">User Shop</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <code className="text-sm bg-white px-2 py-1 rounded">/user/shop</code>
                  <span className="text-sm text-gray-700">User Shop (requires authentication)</span>
                </div>
                <div className="text-xs text-gray-600 ml-4">
                  • Enhanced user experience<br/>
                  • Personalized welcome message<br/>
                  • Full shopping functionality<br/>
                  • User-specific features
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Authentication Flow */}
      <section className="space-y-4">
        <h2 className="text-3xl font-semibold">Authentication Flow</h2>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-orange-800 mb-4">🔐 Purchase Flow</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
              <div>
                <h4 className="font-semibold">Browse Products</h4>
                <p className="text-sm text-gray-600">Anyone can browse products in public shop</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
              <div>
                <h4 className="font-semibold">Add to Cart</h4>
                <p className="text-sm text-gray-600">Guest clicks "Add to Cart" → Redirected to login</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
              <div>
                <h4 className="font-semibold">Login/Register</h4>
                <p className="text-sm text-gray-600">User authenticates to access shopping features</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold">4</div>
              <div>
                <h4 className="font-semibold">Complete Purchase</h4>
                <p className="text-sm text-gray-600">Authenticated user can complete purchases</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* UI Components */}
      <section className="space-y-4">
        <h2 className="text-3xl font-semibold">UI Components</h2>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">🎨 Component Features</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-700">ProductCard Component</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Dynamic product display</li>
                <li>• Category-based placeholder images</li>
                <li>• Stock status indicators</li>
                <li>• Discount badges</li>
                <li>• Add to cart/wishlist buttons</li>
                <li>• Authentication-aware actions</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-700">Shop Pages</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Responsive grid layout</li>
                <li>• Search functionality</li>
                <li>• Category-based sections</li>
                <li>• Shuffle animations for headers</li>
                <li>• Consistent color scheme</li>
                <li>• Mobile-friendly design</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Current Status */}
      <section className="space-y-4">
        <h2 className="text-3xl font-semibold">Current Status</h2>
        <div className="bg-gray-100 border border-gray-300 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">📊 Implementation Status</h3>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-white font-bold">✓</span>
              </div>
              <h4 className="font-semibold">Mock Data</h4>
              <p className="text-sm text-gray-600">24 products ready</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-white font-bold">✓</span>
              </div>
              <h4 className="font-semibold">ProductCard</h4>
              <p className="text-sm text-gray-600">Component ready</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-white font-bold">✓</span>
              </div>
              <h4 className="font-semibold">Public Shop</h4>
              <p className="text-sm text-gray-600">Guest accessible</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-white font-bold">✓</span>
              </div>
              <h4 className="font-semibold">User Shop</h4>
              <p className="text-sm text-gray-600">Authenticated users</p>
            </div>
          </div>
        </div>
      </section>

      {/* Next Steps */}
      <section className="space-y-4">
        <h2 className="text-3xl font-semibold">Next Steps</h2>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-4">🚀 Ready for API Integration</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-sm">Replace mock data with real API calls</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-sm">Implement shopping cart functionality</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-sm">Add wishlist persistence</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-sm">Implement checkout process</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-sm">Add product detail pages</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
