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
      if (storedToken && storedToken !== 'undefined' && storedToken !== 'null') {
        return storedToken;
      }
      return null;
    } catch (error) {
      console.error('Error getting token from localStorage:', error);
      localStorage.removeItem('authToken');
      return null;
    }
  });

  const login = (userData, tokenValue) => {
    setUser(userData);
    setToken(tokenValue);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('authToken', tokenValue);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    // optional: redirect to login handled by components
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
