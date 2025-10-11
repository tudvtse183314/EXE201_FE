import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppRoutes } from './routes';
import DebugPanel from './components/debug/DebugPanel';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
        
        {/* Debug Panel - Only shows in development */}
        <DebugPanel />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
