# API & Routing Flow Diagram

## 🔄 Complete Application Flow

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User Action   │───▶│   React Router  │───▶│   Component     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │                        │
                                ▼                        ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │  Route Config   │    │  API Call       │
                       │  (src/routes)   │    │  (authApi.js)   │
                       └─────────────────┘    └─────────────────┘
                                                        │
                                                        ▼
                                               ┌─────────────────┐
                                               │ Axios Instance  │
                                               │ (axiosInstance) │
                                               └─────────────────┘
                                                        │
                                                        ▼
                                               ┌─────────────────┐
                                               │   Backend API   │
                                               │ (onrender.com)  │
                                               └─────────────────┘
```

## 🛡️ Authentication Flow

```
┌─────────────────┐
│  User Login     │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Login Form     │───▶│  authApi.login  │───▶│  POST /login    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │                        │
                                ▼                        ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │ Store Token     │    │ Return Token    │
                       │ localStorage    │    │ & User Data     │
                       └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │ Navigate to     │
                       │ /user/home      │
                       └─────────────────┘
```

## 🔐 Route Protection Flow

```
┌─────────────────┐
│  User Navigates │
│  to /user/profile│
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  PrivateRoute   │
│  Component      │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐    ┌─────────────────┐
│ Check Auth      │───▶│ Is Authenticated│
│ Status          │    │ ?               │
└─────────────────┘    └─────────┬───────┘
                                 │
                    ┌────────────┴────────────┐
                    │                         │
                    ▼                         ▼
          ┌─────────────────┐    ┌─────────────────┐
          │ Redirect to     │    │ Check User Role │
          │ /login          │    │                 │
          └─────────────────┘    └─────────┬───────┘
                                           │
                              ┌────────────┴────────────┐
                              │                         │
                              ▼                         ▼
                    ┌─────────────────┐    ┌─────────────────┐
                    │ Redirect to     │    │ Allow Access    │
                    │ /user/home      │    │ to Component    │
                    └─────────────────┘    └─────────────────┘
```

## 📱 Component Communication Flow

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Header        │    │   Sidebar       │    │   Main Content  │
│   Component     │    │   Component     │    │   Component     │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          ▼                      ▼                      ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ useAppNavigation│    │ NavigationMenu  │    │ useAuth         │
│ Hook            │    │ Component       │    │ Context         │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          ▼                      ▼                      ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Route Config    │    │ Route Config    │    │ User State      │
│ (src/routes)    │    │ (src/routes)    │    │ & Permissions   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🔄 API Request/Response Flow

```
┌─────────────────┐
│  Component      │
│  Makes API Call │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ authApi.login() │───▶│ axiosInstance   │───▶│ Request         │
│                 │    │ Interceptor     │    │ Interceptor     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │                        │
                                ▼                        ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │ Add Auth Header │    │ Add Base URL    │
                       │ Authorization   │    │ & Timeout       │
                       └─────────────────┘    └─────────────────┘
                                                        │
                                                        ▼
                                               ┌─────────────────┐
                                               │ Send Request    │
                                               │ to Backend      │
                                               └─────────────────┘
                                                        │
                                                        ▼
                                               ┌─────────────────┐
                                               │ Response        │
                                               │ Interceptor     │
                                               └─────────────────┘
                                                        │
                                                        ▼
                                               ┌─────────────────┐
                                               │ Handle 401      │
                                               │ & Other Errors  │
                                               └─────────────────┘
                                                        │
                                                        ▼
                                               ┌─────────────────┐
                                               │ Return Data     │
                                               │ to Component    │
                                               └─────────────────┘
```

## 🗂️ File Structure Flow

```
src/
├── App.js                    # Main app with BrowserRouter
├── routes/
│   └── index.js             # Centralized route configuration
├── hooks/
│   └── useNavigation.js     # Navigation utilities
├── components/
│   ├── auth/
│   │   └── PrivateRoute.jsx # Route protection
│   └── common/
│       ├── Breadcrumbs.jsx  # Navigation breadcrumbs
│       └── NavigationMenu.jsx # Dynamic menu
├── config/
│   └── api.js              # API configuration
├── api/
│   ├── axiosInstance.js    # Axios setup
│   ├── authApi.js         # Authentication API
│   └── publicApi.js       # Public API calls
└── context/
    └── AuthContext.jsx     # Global auth state
```

## 🎯 Key Benefits

### 1. **Centralized Management**
- All routes defined in one place
- Easy to add/remove routes
- Consistent route structure

### 2. **Type Safety**
- Route validation
- Consistent navigation patterns
- Error prevention

### 3. **Security**
- Route protection
- Role-based access
- Automatic redirects

### 4. **Developer Experience**
- Easy navigation hooks
- Automatic breadcrumbs
- Route information utilities

### 5. **Maintainability**
- Clear separation of concerns
- Reusable components
- Easy testing

## 🚀 Usage Examples

### Navigation
```javascript
const { goToUser, goToAdmin } = useAppNavigation();
goToUser('profile');  // → /user/profile
goToAdmin('reports'); // → /admin/reports
```

### Route Protection
```javascript
<PrivateRoute roles={['admin']}>
  <AdminDashboard />
</PrivateRoute>
```

### Breadcrumbs
```javascript
<Breadcrumbs /> // Auto-generated from current route
```

### Dynamic Menu
```javascript
<NavigationMenu showPublicRoutes={false} />
```

Hệ thống này đảm bảo:
- **Scalable architecture**
- **Secure routing**
- **Easy maintenance**
- **Great developer experience**
