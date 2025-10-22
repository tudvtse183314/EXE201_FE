import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import MainLayout from "../components/layout/MainLayout";
import { ROLES, getDashboardPathByRole } from "../constants/roles";
import RequireAuth from "../components/auth/RequireAuth";
import AdminLayout from "../layouts/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import CategoriesPage from "../pages/admin/categories/CategoriesPage";
import ProductsPage from "../pages/admin/products/ProductsPage";


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
import CustomerOrders from "../pages/customer/Orders";
import PetProfilePage from "../pages/customer/PetProfilePage";
import AccountProfilePage from "../pages/customer/AccountProfilePage";

// User Pages
import CreatePetProfile from "../pages/user/CreatePetProfile";
import AIAnalysis from "../pages/AIAnalysis";

// AI Pages
import AIAnalysisNew from "../pages/ai/AIAnalysis";
import SeasonalOutfits from "../pages/ai/SeasonalOutfits";

// Error Pages
import Unauthorized from "../pages/Unauthorized";

// Staff Pages
import StaffDashboard from "../pages/staff/Dashboard";

// Manager Pages
import ManagerDashboard from "../pages/manager/ManagerDashboard";
import AccountListPage from "../pages/manager/AccountListPage";

// Doctor Pages
import DoctorDashboard from "../pages/doctor/DoctorDashboard";
import PetAIAssistant from "../pages/ai/demo.jsx";

import Shop from "../pages/public/Shop.jsx";



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
                <CustomerOrders />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/customer/pet-profiles"
          element={
            <PrivateRoute roles={['CUSTOMER']}>
              <MainLayout>
                <PetProfilePage />
              </MainLayout>
            </PrivateRoute>
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
        
        {/* User Routes */}
        <Route
          path="/create-pet-profile"
          element={
            <PrivateRoute roles={[ROLES.CUSTOMER]}>
              <MainLayout>
                <CreatePetProfile />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/ai-analysis"
          element={
            <PrivateRoute roles={[ROLES.CUSTOMER]}>
              <MainLayout>
                <AIAnalysis />
              </MainLayout>
            </PrivateRoute>
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
          path="/staff/dashboard"
          element={
            <PrivateRoute roles={[ROLES.STAFF, ROLES.MANAGER]}>
              <StaffDashboard />
            </PrivateRoute>
          }
        />
        
        {/* Manager Routes */}
        <Route
          path="/manager/dashboard"
          element={
            <PrivateRoute roles={[ROLES.MANAGER]}>
              <ManagerDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/manager/accounts"
          element={
            <PrivateRoute roles={['MANAGER']}>
              <MainLayout>
                <AccountListPage />
              </MainLayout>
            </PrivateRoute>
          }
        />
        
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
        
        {/* ADMIN (bảo vệ theo role) */}
        <Route
          path="/admin"
          element={
            <RequireAuth roles={['ADMIN', 'MANAGER']}>
              <AdminLayout />
            </RequireAuth>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="products" element={<ProductsPage />} />
          
          {/* placeholders */}
          <Route path="orders" element={<div>Orders (coming soon)</div>} />
          <Route path="accounts" element={<div>Accounts (coming soon)</div>} />
        </Route>
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
  );
}
