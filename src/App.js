import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoadingProvider, useLoading } from './context/LoadingContext';
import AppRoutes from './routes/AppRoutes';
import LoadingSpinner from './components/LoadingSpinner';
import { setGlobalLoadingState } from './api/axios';

function AppContent() {
  const [initialLoading, setInitialLoading] = useState(true);
  const { apiLoading } = useAuth();
  const { loading, setLoadingState } = useLoading();

  useEffect(() => {
    // Connect axios loading to global loading state
    setGlobalLoadingState(setLoadingState);
    
    // Simulate initial app loading
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [setLoadingState]);

  if (initialLoading || apiLoading || loading) {
    return <LoadingSpinner />;
  }

  return <AppRoutes />;
}

function App() {
  return (
    <LoadingProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </LoadingProvider>
  );
}

export default App;
