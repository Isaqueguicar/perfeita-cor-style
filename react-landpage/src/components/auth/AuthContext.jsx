import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [userRole, setUserRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const roles = decodedToken.authorities || [];
        const isAdmin = roles.includes('ROLE_ADMIN');
        setUserRole(isAdmin ? 'ADMIN' : 'CLIENTE');
        setIsAuthenticated(true);
        localStorage.setItem('authToken', token); 
      } catch (error) {
        console.error("Token inválido:", error);
        logout();
      }
    } else {
      setUserRole(null);
      setIsAuthenticated(false);
      localStorage.removeItem('authToken');
    }
  }, [token]);

  const login = (newToken) => {
    setToken(newToken);
  };

  const logout = () => {
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};