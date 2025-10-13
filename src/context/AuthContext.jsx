import { createContext, useState, useContext } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser && storedUser !== 'undefined' && storedUser !== 'null') {
        return JSON.parse(storedUser);
      }
      return null;
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      localStorage.removeItem('user');
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    try {
      const storedToken = localStorage.getItem('authToken');
      if (storedToken && storedToken !== 'undefined' && storedToken !== 'null' && storedToken.trim() !== '') {
        console.log('🔑 AuthContext: Token loaded from localStorage:', storedToken.substring(0, 10) + '...');
        return storedToken;
      }
      console.log('🔑 AuthContext: No valid token found in localStorage');
      return null;
    } catch (error) {
      console.error('Error getting token from localStorage:', error);
      localStorage.removeItem('authToken');
      return null;
    }
  });

  // Simplified - no auto-fetch to reduce API calls

  const login = (userData, tokenValue) => {
    console.log('🔑 AuthContext: Login called with:', {
      user: userData?.fullName || userData?.email,
      token: tokenValue ? `${tokenValue.substring(0, 10)}...` : 'null'
    });
    
    setUser(userData);
    setToken(tokenValue);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('authToken', tokenValue);
    
    console.log('🔑 AuthContext: Login data saved to localStorage');
  };

  const logout = () => {
    console.log('🔑 AuthContext: Logout called');
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    console.log('🔑 AuthContext: Logout data cleared from localStorage');
  };

  const hasRole = (role) => {
    if (!user) return false;
    if (Array.isArray(role)) {
      return role.includes(user.role);
    }
    return user.role === role;
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
