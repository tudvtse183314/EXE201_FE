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
import PetProfilePage from "../pages/customer/PetProfilePage";
import AccountProfilePage from "../pages/customer/AccountProfilePage";

// User Pages
import AIAnalysis from "../pages/AIAnalysis";

// AI Pages
import AIAnalysisNew from "../pages/ai/AIAnalysis";
import SeasonalOutfits from "../pages/ai/SeasonalOutfits";
import ChatBot from "../pages/ai/ChatBot";

// Error Pages
import Unauthorized from "../pages/Unauthorized";

// Staff Pages
import StaffLayout from "../layouts/StaffLayout";
import StaffDashboard from "../pages/staff/StaffDashboard";
import StaffCategoriesPage from "../pages/staff/StaffCategoriesPage";
import StaffProductsPage from "../pages/staff/StaffProductsPage";
import StaffOrdersPage from "../pages/staff/StaffOrdersPage";
import StaffReviewsPage from "../pages/staff/StaffReviewsPage";
import StaffProfilePage from "../pages/staff/StaffProfilePage";

// Admin Pages
import AdminLayout from "../layouts/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import CategoriesPage from "../pages/admin/categories/CategoriesPage";
import ProductsPage from "../pages/admin/products/ProductsPage";
import CartsPage from "../pages/admin/carts/CartsPage";
import ChatHistory from "../pages/admin/ChatHistory";
import CategoryTest from "../components/admin/CategoryTest";
import ProductTest from "../components/admin/ProductTest";
import APITestSummary from "../components/admin/APITestSummary";
import OrdersTest from "../components/admin/OrdersTest";

// Doctor Pages
import DoctorDashboard from "../pages/doctor/DoctorDashboard";
import PetAIAssistant from "../pages/ai/demo.jsx";

import Shop from "../pages/public/Shop.jsx";
import ProductDetail from "../pages/public/ProductDetail";
import Wishlist from "../pages/public/Wishlist";
import Cart from "../pages/public/Cart.jsx";
import Checkout from "../pages/public/Checkout.jsx";
import UserOrders from "../pages/customer/Orders.jsx";
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
            <Shop/>
          </MainLayout>
        } />
        <Route path="/product/:id" element={
          <MainLayout>
            <ProductDetail/>
          </MainLayout>
        } />
               {/* Customer routes bắt buộc đăng nhập */}
               <Route path="/cart" element={
                 <RoleGuard roles={[ROLES.CUSTOMER]}>
                   <MainLayout>
                     <Cart/>
                   </MainLayout>
                 </RoleGuard>
               } />
               <Route path="/wishlist" element={
                 <RoleGuard roles={[ROLES.CUSTOMER]}>
                   <MainLayout>
                     <Wishlist/>
                   </MainLayout>
                 </RoleGuard>
               } />
               <Route path="/checkout" element={
                 <RoleGuard roles={[ROLES.CUSTOMER]}>
                   <MainLayout>
                     <Checkout/>
                   </MainLayout>
                 </RoleGuard>
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
  
        <Route
          path="/customer/dashboard"
          element={
            <PrivateRoute roles={[ROLES.CUSTOMER]}>
              <MainLayout>
                <CustomerDashboard />
              </MainLayout>
            </PrivateRoute>
          }
        />
        
        {/* User Routes (CUSTOMER) */}
        <Route
          path="/user/home"
          element={
            <PrivateRoute roles={[ROLES.CUSTOMER]}>
              <MainLayout>
                <CustomerDashboard />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/customer/profile"
          element={
            <PrivateRoute roles={[ROLES.CUSTOMER]}>
              <MainLayout>
                <CustomerProfile />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/customer/orders"
          element={
            <PrivateRoute roles={[ROLES.CUSTOMER]}>
              <MainLayout>
                <UserOrders />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <RoleGuard roles={[ROLES.CUSTOMER]}>
              <MainLayout>
                <UserOrders />
              </MainLayout>
            </RoleGuard>
          }
        />
        <Route
          path="/orders/:id"
          element={
            <RoleGuard roles={[ROLES.CUSTOMER]}>
              <MainLayout>
                <UserOrders />
              </MainLayout>
            </RoleGuard>
          }
        />
        <Route
          path="/my-pets"
          element={
            <RoleGuard roles={[ROLES.CUSTOMER]}>
              <MainLayout>
                <PetProfilePage />
              </MainLayout>
            </RoleGuard>
          }
        />
        <Route
          path="/profile"
          element={
            <RoleGuard roles={[ROLES.CUSTOMER]}>
              <MainLayout>
                <CustomerProfile />
              </MainLayout>
            </RoleGuard>
          }
        />
        <Route
          path="/customer/account-profile"
          element={
            <PrivateRoute roles={['CUSTOMER']}>
              <MainLayout>
                <AccountProfilePage />
              </MainLayout>
            </PrivateRoute>
          }
        />
        
        {/* AI Analysis - Customer only */}
        <Route
          path="/ai-analysis"
          element={
            <RoleGuard roles={[ROLES.CUSTOMER]}>
              <MainLayout>
                <AIAnalysis />
              </MainLayout>
            </RoleGuard>
          }
        />
        
        {/* AI Routes */}
        <Route
          path="/ai/analysis"
          element={
            <PrivateRoute roles={[ROLES.CUSTOMER]}>
              <MainLayout>
                <AIAnalysisNew />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/ai/seasonal-outfits"
          element={
            <PrivateRoute roles={[ROLES.CUSTOMER]}>
              <MainLayout>
                <SeasonalOutfits />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/ai/chat"
          element={
            <PrivateRoute roles={[ROLES.CUSTOMER]}>
              <MainLayout>
                <ChatBot />
              </MainLayout>
            </PrivateRoute>
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
        
        {/* Staff Routes */}
        <Route
          path="/staff"
          element={
            <PrivateRoute roles={[ROLES.STAFF, ROLES.MANAGER]}>
              <StaffLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<StaffDashboard />} />
          <Route path="dashboard" element={<StaffDashboard />} />
          <Route path="categories" element={<StaffCategoriesPage />} />
          <Route path="products" element={<StaffProductsPage />} />
          <Route path="orders" element={<StaffOrdersPage />} />
          <Route path="reviews" element={<StaffReviewsPage />} />
          <Route path="profile" element={<StaffProfilePage />} />
        </Route>
        
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
                 <Route path="orders" element={<div style={{padding: '40px', textAlign: 'center'}}>
                   <h1>📋 Orders Management</h1>
                   <p>Coming soon...</p>
                 </div>} />
                 <Route path="carts" element={<CartsPage />} />
          <Route path="chat-history" element={<ChatHistory />} />
          <Route path="accounts" element={<div style={{padding: '40px', textAlign: 'center'}}>
            <h1>👥 Accounts Management</h1>
            <p>Coming soon...</p>
          </div>} />
          <Route path="test" element={<CategoryTest />} />
          <Route path="test-products" element={<ProductTest />} />
          <Route path="api-summary" element={<APITestSummary />} />
          <Route path="test-orders" element={<OrdersTest />} />
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
