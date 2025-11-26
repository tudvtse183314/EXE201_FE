import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import MainLayout from "../components/layout/MainLayout";
import RoleGuard from "./RoleGuard";
import { ROLES, getDashboardPathByRole } from "../constants/roles";

//admin pages - will be created


// Pages
import Home from "../pages/Home";
import Login from "../pages/public/Login";
import Register from "../pages/public/Register.jsx";

// Public Pages
import About from "../pages/public/About";
import Services from "../pages/public/Services";
import Contact from "../pages/public/Contact";


// Customer Pages
import CustomerDashboard from "../pages/customer/Dashboard";
import CustomerProfile from "../pages/customer/Profile";
import CustomerProfilePage from "../pages/customer/CustomerProfilePage";
import PetProfilePage from "../pages/customer/PetProfilePage";

// AI Pages
import SeasonalOutfits from "../pages/ai/SeasonalOutfits";
import ChatBot from "../pages/ai/ChatBot";

// Error Pages
import Unauthorized from "../pages/Unauthorized";

// Admin Pages
import AdminLayout from "../layouts/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import CategoriesPage from "../pages/admin/categories/CategoriesPage";
import ProductsPage from "../pages/admin/products/ProductsPage";
import ChatHistory from "../pages/admin/ChatHistory";
import AdminOrdersPage from "../pages/admin/orders/AdminOrdersPage";
import AdminOrdersDebug from "../pages/admin/orders/AdminOrdersDebug";
import AdminPaymentConfirmationPage from "../pages/admin/orders/AdminPaymentConfirmationPage";
import AdminAccountsPage from "../pages/admin/accounts/AdminAccountsPage";

// Doctor Pages
import DoctorDashboard from "../pages/doctor/DoctorDashboard";
import PetAIAssistant from "../pages/ai/demo.jsx";

import Shop from "../pages/public/Shop.jsx";
import ProductDetail from "../pages/public/ProductDetail";
import Wishlist from "../pages/public/Wishlist";
import Cart from "../pages/public/Cart.jsx";
import Checkout from "../pages/public/Checkout.jsx";
import UserOrders from "../pages/customer/Orders.jsx";
import OrderDetail from "../pages/customer/OrderDetail.jsx";
import PaymentPage from "../pages/customer/PaymentPage.jsx";
import Premium from "../pages/public/Premium";
import ProductCardDemo from "../pages/public/ProductCardDemo";



// Private Route Component
const PrivateRoute = ({ children, roles = [] }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Chuẩn hoá role về UPPERCASE
  const userRole = (user.role || "").toUpperCase();

  // Nếu route yêu cầu role cụ thể và user không thuộc role đó
  if (roles.length > 0 && !roles.map(r => r.toUpperCase()).includes(userRole)) {
    const fallback = getDashboardPathByRole(userRole) || "/unauthorized";
    return <Navigate to={fallback} replace />;
  }

  return children;
};

// Dashboard Redirect Component
function DashboardRedirect() {
  const { user } = useAuth();
  const to = getDashboardPathByRole(user?.role) || "/";
  return <Navigate to={to} replace />;
}

export default function AppRoutes() {
  return (
    <Routes>
        {/* Public Routes */}
        <Route path="/" element={
          <MainLayout>
            <Home />
          </MainLayout>
          } />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Public Navigation Routes */}
        <Route path="/about" element={
          <MainLayout>
            <About />
          </MainLayout>
        } />
        <Route path="/services" element={
          <MainLayout>
            <Services />
          </MainLayout>
        } />
        <Route path="/contact" element={
          <MainLayout>
            <Contact />
          </MainLayout>
        } />
        <Route path="/demo" element={
          <MainLayout>
            <PetAIAssistant/>
          </MainLayout>
        } />
        <Route path="/shop" element={
          <MainLayout>
            <Shop key="shop" />
          </MainLayout>
        } />
        <Route path="/product/:id" element={
          <MainLayout>
            <ProductDetail/>
          </MainLayout>
        } />
        {/* Public routes */}
        <Route path="/premium" element={
          <MainLayout>
            <Premium/>
          </MainLayout>
        } />
        <Route path="/product-card-demo" element={
          <MainLayout>
            <ProductCardDemo/>
          </MainLayout>
        } />

        {/* ============================================ */}
        {/* CUSTOMER ROUTES - Tất cả dưới prefix /customer/ */}
        {/* ============================================ */}
        
        {/* My Pets - Trang mặc định sau login CUSTOMER */}
        <Route
          path="/customer/my-pets"
          element={
            <RoleGuard roles={[ROLES.CUSTOMER]}>
              <MainLayout>
                <PetProfilePage />
              </MainLayout>
            </RoleGuard>
          }
        />
        
        {/* Cart */}
        <Route
          path="/customer/cart"
          element={
            <RoleGuard roles={[ROLES.CUSTOMER]}>
              <MainLayout>
                <Cart/>
              </MainLayout>
            </RoleGuard>
          }
        />
        
        {/* Wishlist */}
        <Route
          path="/customer/wishlist"
          element={
            <RoleGuard roles={[ROLES.CUSTOMER]}>
              <MainLayout>
                <Wishlist/>
              </MainLayout>
            </RoleGuard>
          }
        />
        
        {/* Checkout */}
        <Route
          path="/customer/checkout"
          element={
            <RoleGuard roles={[ROLES.CUSTOMER]}>
              <MainLayout>
                <Checkout/>
              </MainLayout>
            </RoleGuard>
          }
        />
        
        {/* AI Chatbot */}
        <Route
          path="/customer/ai"
          element={
            <RoleGuard roles={[ROLES.CUSTOMER]}>
              <MainLayout>
                <ChatBot />
              </MainLayout>
            </RoleGuard>
          }
        />
        
        {/* Orders - List */}
        <Route
          path="/customer/orders"
          element={
            <RoleGuard roles={[ROLES.CUSTOMER]}>
              <MainLayout>
                <UserOrders />
              </MainLayout>
            </RoleGuard>
          }
        />
        
        {/* Orders - Detail */}
        <Route
          path="/customer/orders/:id"
          element={
            <RoleGuard roles={[ROLES.CUSTOMER]}>
              <MainLayout>
                <OrderDetail />
              </MainLayout>
            </RoleGuard>
          }
        />
        
        {/* Payment Page */}
        <Route
          path="/customer/payment/:orderId"
          element={
            <RoleGuard roles={[ROLES.CUSTOMER]}>
              <MainLayout>
                <PaymentPage />
              </MainLayout>
            </RoleGuard>
          }
        />
        
        {/* Profile - New version with sidebar menu */}
        <Route
          path="/customer/profile"
          element={
            <RoleGuard roles={[ROLES.CUSTOMER]}>
              <MainLayout>
                <CustomerProfilePage />
              </MainLayout>
            </RoleGuard>
          }
        />
        
        {/* Dashboard (optional) */}
        <Route
          path="/customer/dashboard"
          element={
            <RoleGuard roles={[ROLES.CUSTOMER]}>
              <MainLayout>
                <CustomerDashboard />
              </MainLayout>
            </RoleGuard>
          }
        />
        
        {/* ============================================ */}
        {/* LEGACY ROUTES - Redirect to /customer/* */}
        {/* ============================================ */}
        
        {/* Redirect old paths to new /customer/* paths */}
        <Route
          path="/my-pets"
          element={<Navigate to="/customer/my-pets" replace />}
        />
        <Route
          path="/cart"
          element={<Navigate to="/customer/cart" replace />}
        />
        <Route
          path="/wishlist"
          element={<Navigate to="/customer/wishlist" replace />}
        />
        <Route
          path="/checkout"
          element={<Navigate to="/customer/checkout" replace />}
        />
        <Route
          path="/orders"
          element={<Navigate to="/customer/orders" replace />}
        />
        {/* Redirect /orders/:id to /customer/orders/:id */}
        <Route
          path="/orders/:id"
          element={
            <RoleGuard roles={[ROLES.CUSTOMER]}>
              <MainLayout>
                <OrderDetail />
              </MainLayout>
            </RoleGuard>
          }
        />
        <Route
          path="/profile"
          element={<Navigate to="/customer/profile" replace />}
        />
        <Route
          path="/ai-analysis"
          element={<Navigate to="/customer/ai" replace />}
        />
        <Route
          path="/ai/chat"
          element={<Navigate to="/customer/ai" replace />}
        />
        <Route
          path="/ai/analysis"
          element={<Navigate to="/customer/ai" replace />}
        />
        
        {/* Keep other AI routes for backward compatibility */}
        <Route
          path="/ai/seasonal-outfits"
          element={
            <RoleGuard roles={[ROLES.CUSTOMER]}>
              <MainLayout>
                <SeasonalOutfits />
              </MainLayout>
            </RoleGuard>
          }
        />
        
        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute roles={[ROLES.ADMIN]}>
              <AdminDashboard/>
            </PrivateRoute>
          }
        />
        
        {/* Error Routes */}
        <Route path="/unauthorized" element={<Unauthorized />} />
        
        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <PrivateRoute roles={[ROLES.ADMIN]}>
              <AdminLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="orders-debug" element={<AdminOrdersDebug />} />
          <Route path="payment-confirmation" element={<AdminPaymentConfirmationPage />} />
          <Route path="chat-history" element={<ChatHistory />} />
          <Route path="accounts" element={<AdminAccountsPage />} />
        </Route>
        
        {/* Doctor Routes */}
        <Route
          path="/doctor/dashboard"
          element={
            <PrivateRoute roles={[ROLES.DOCTOR]}>
              <DoctorDashboard />
            </PrivateRoute>
          }
        />
        
        
        {/* Legacy Routes - Redirect to appropriate dashboard */}
        <Route path="/dashboard" element={<DashboardRedirect />} />
        

        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
  );
}
