import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import MainLayout from "../components/layout/MainLayout";

// Pages
import Home from "../pages/Home";
import Login from "../pages/public/Login";
import Register from "../pages/public/Register.jsx";

// Public Pages
import About from "../pages/public/About";
import Services from "../pages/public/Services";
import Contact from "../pages/public/Contact";
import Shop from "../pages/public/Shop";


// Customer Pages
import CustomerDashboard from "../pages/customer/Dashboard";
import CustomerProfile from "../pages/customer/Profile";
import CustomerOrders from "../pages/customer/Orders";

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

// Doctor Pages
import DoctorDashboard from "../pages/doctor/DoctorDashboard";


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
  
  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

export default function AppRoutes() {
  return (
    <BrowserRouter>
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
        <Route path="/shop" element={
          <MainLayout>
            <Shop />
          </MainLayout>
        } />
        
        {/* Customer Routes */}
        <Route
          path="/customer/dashboard"
          element={
            <PrivateRoute roles={['CUSTOMER']}>
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
            <PrivateRoute roles={['CUSTOMER']}>
              <MainLayout>
                <CustomerDashboard />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/customer/profile"
          element={
            <PrivateRoute roles={['CUSTOMER']}>
              <MainLayout>
                <CustomerProfile />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/customer/orders"
          element={
            <PrivateRoute roles={['CUSTOMER']}>
              <MainLayout>
                <CustomerOrders />
              </MainLayout>
            </PrivateRoute>
          }
        />
        
        {/* User Routes */}
        <Route
          path="/create-pet-profile"
          element={
            <PrivateRoute roles={['CUSTOMER']}>
              <MainLayout>
                <CreatePetProfile />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/ai-analysis"
          element={
            <PrivateRoute roles={['CUSTOMER']}>
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
            <PrivateRoute roles={['CUSTOMER']}>
              <MainLayout>
                <AIAnalysisNew />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/ai/seasonal-outfits"
          element={
            <PrivateRoute roles={['CUSTOMER']}>
              <MainLayout>
                <SeasonalOutfits />
              </MainLayout>
            </PrivateRoute>
          }
        />
        
        {/* Error Routes */}
        <Route path="/unauthorized" element={<Unauthorized />} />
        
        {/* Staff Routes */}
        <Route
          path="/staff/dashboard"
          element={
            <PrivateRoute roles={['STAFF', 'MANAGER']}>
              <StaffDashboard />
            </PrivateRoute>
          }
        />
        
        {/* Manager Routes */}
        <Route
          path="/manager/dashboard"
          element={
            <PrivateRoute roles={['MANAGER']}>
              <ManagerDashboard />
            </PrivateRoute>
          }
        />
        
        {/* Doctor Routes */}
        <Route
          path="/doctor/dashboard"
          element={
            <PrivateRoute roles={['DOCTOR']}>
              <DoctorDashboard />
            </PrivateRoute>
          }
        />
        
        
        {/* Legacy Routes - Redirect to appropriate dashboard */}
        <Route
          path="/dashboard"
          element={<Navigate to="/customer/dashboard" replace />}
        />
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
