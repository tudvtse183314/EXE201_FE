import { createContext, useState, useContext, useEffect } from 'react';
import { fetchUserAccount } from '../api/publicApi';

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

  // Auto-fetch user data if we have token but no user
  useEffect(() => {
    const fetchUserData = async () => {
      if (token && !user) {
        console.log('🔑 AuthContext: Token exists but no user data, fetching user account...');
        try {
          const userData = await fetchUserAccount(token);
          console.log('🔑 AuthContext: User data fetched successfully:', userData);
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
        } catch (error) {
          console.error('🔑 AuthContext: Failed to fetch user data:', error);
          // If we can't fetch user data, clear the token
          setToken(null);
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
        }
      }
    };

    fetchUserData();
  }, [token, user]);

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
