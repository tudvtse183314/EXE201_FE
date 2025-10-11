# Routing Usage Examples

## 🚀 Cách sử dụng hệ thống routing mới

### 1. **Basic Navigation**

```javascript
import { useAppNavigation } from '../hooks/useNavigation';

const MyComponent = () => {
  const { goTo, goToUser, goToAdmin } = useAppNavigation();

  const handleClick = () => {
    // Navigate to specific route
    goTo('/user/profile');
    
    // Navigate to user routes
    goToUser('orders');
    
    // Navigate to admin routes
    goToAdmin('reports');
  };

  return <button onClick={handleClick}>Navigate</button>;
};
```

### 2. **Route Protection**

```javascript
import { PrivateRoute } from '../components/auth/PrivateRoute';

// Protect a route
<PrivateRoute>
  <UserProfile />
</PrivateRoute>

// Protect with specific role
<PrivateRoute roles={['admin']}>
  <AdminDashboard />
</PrivateRoute>

// Protect with multiple roles
<PrivateRoute roles={['admin', 'shop_owner']}>
  <ShopManagement />
</PrivateRoute>
```

### 3. **Breadcrumbs**

```javascript
import { Breadcrumbs } from '../components/common/Breadcrumbs';

const UserProfile = () => {
  return (
    <div>
      <Breadcrumbs className="mb-4" />
      <h1>User Profile</h1>
    </div>
  );
};
```

### 4. **Navigation Menu**

```javascript
import { NavigationMenu } from '../components/common/NavigationMenu';

const Sidebar = () => {
  return (
    <aside className="w-64 bg-gray-100 p-4">
      <NavigationMenu showPublicRoutes={false} />
    </aside>
  );
};
```

### 5. **Route Information**

```javascript
import { useAppNavigation } from '../hooks/useNavigation';

const Header = () => {
  const { 
    currentRoute, 
    isActiveRoute, 
    getBreadcrumbs 
  } = useAppNavigation();

  return (
    <header>
      <h1>{currentRoute?.title || 'Page'}</h1>
      {isActiveRoute('/user/profile') && (
        <span>You are on profile page</span>
      )}
    </header>
  );
};
```

### 6. **Conditional Navigation**

```javascript
import { useAuth } from '../context/AuthContext';
import { useAppNavigation } from '../hooks/useNavigation';

const ConditionalNav = () => {
  const { user } = useAuth();
  const { goToUser, goToAdmin } = useAppNavigation();

  const handleNavigation = () => {
    if (user.role === 'admin') {
      goToAdmin();
    } else {
      goToUser('home');
    }
  };

  return <button onClick={handleNavigation}>Go to Dashboard</button>;
};
```

### 7. **Navigation with State**

```javascript
const ProductList = () => {
  const { goTo } = useAppNavigation();

  const viewProduct = (productId) => {
    goTo(`/user/shop/product/${productId}`, {
      state: { from: 'product-list' }
    });
  };

  return (
    <div>
      {products.map(product => (
        <button 
          key={product.id}
          onClick={() => viewProduct(product.id)}
        >
          View {product.name}
        </button>
      ))}
    </div>
  );
};
```

### 8. **Error Handling & Fallbacks**

```javascript
const ErrorPage = () => {
  const { goBack, goTo } = useAppNavigation();

  return (
    <div>
      <h1>Something went wrong</h1>
      <button onClick={() => goBack('/user/home')}>
        Go Back
      </button>
      <button onClick={() => goTo('/user/home')}>
        Go to Home
      </button>
    </div>
  );
};
```

## 🔧 Advanced Usage

### 1. **Custom Route Guards**

```javascript
// Custom route guard component
const ShopOwnerRoute = ({ children }) => {
  const { user } = useAuth();
  
  if (user.role !== 'shop_owner' && user.role !== 'admin') {
    return <Navigate to="/user/home" replace />;
  }
  
  return children;
};

// Usage
<Route 
  path="/shop/analytics" 
  element={
    <ShopOwnerRoute>
      <ShopAnalytics />
    </ShopOwnerRoute>
  } 
/>
```

### 2. **Dynamic Route Generation**

```javascript
// Generate routes based on user permissions
const generateUserRoutes = (user) => {
  const baseRoutes = ['home', 'profile', 'orders'];
  
  if (user.hasPremium) {
    baseRoutes.push('premium', 'ai-analysis');
  }
  
  if (user.role === 'admin') {
    baseRoutes.push('admin');
  }
  
  return baseRoutes;
};
```

### 3. **Route Analytics**

```javascript
// Track route changes
const useRouteAnalytics = () => {
  const { currentPath } = useAppNavigation();
  
  useEffect(() => {
    // Send analytics event
    analytics.track('page_view', {
      path: currentPath,
      timestamp: Date.now()
    });
  }, [currentPath]);
};
```

## 📱 Mobile Navigation

### 1. **Mobile Menu**

```javascript
const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { goToUser } = useAppNavigation();

  const menuItems = [
    { path: 'home', label: 'Home', icon: Home },
    { path: 'profile', label: 'Profile', icon: User },
    { path: 'orders', label: 'Orders', icon: ShoppingBag },
  ];

  return (
    <div className="md:hidden">
      <button onClick={() => setIsOpen(!isOpen)}>
        <Menu className="w-6 h-6" />
      </button>
      
      {isOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white shadow-lg">
          {menuItems.map(item => (
            <button
              key={item.path}
              onClick={() => {
                goToUser(item.path);
                setIsOpen(false);
              }}
              className="flex items-center w-full p-4 hover:bg-gray-50"
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
```

## 🎯 Best Practices

### 1. **Consistent Navigation**
```javascript
// ✅ Good: Use navigation hook
const { goToUser } = useAppNavigation();
goToUser('profile');

// ❌ Bad: Direct navigate calls
navigate('/user/profile');
```

### 2. **Route Validation**
```javascript
// ✅ Good: Check route exists
const route = getRouteByPath('/user/profile');
if (route) {
  goTo('/user/profile');
}

// ❌ Bad: Hardcoded paths
goTo('/user/profile');
```

### 3. **Error Boundaries**
```javascript
// Wrap routes with error boundaries
<ErrorBoundary>
  <Route path="/user/profile" element={<UserProfile />} />
</ErrorBoundary>
```

### 4. **Lazy Loading**
```javascript
// Lazy load components
const UserProfile = lazy(() => import('../pages/user/Profile'));

<Route 
  path="/user/profile" 
  element={
    <Suspense fallback={<Loading />}>
      <UserProfile />
    </Suspense>
  } 
/>
```

Hệ thống routing mới cung cấp:
- **Centralized route management**
- **Type-safe navigation**
- **Role-based access control**
- **Easy-to-use navigation hooks**
- **Automatic breadcrumbs**
- **Route validation**
- **Better error handling**
