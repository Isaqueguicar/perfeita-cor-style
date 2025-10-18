import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [userRole, setUserRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false); 
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      try {
        const decodedToken = jwtDecode(storedToken);
        const roles = decodedToken.authorities || [];
        const isAdmin = roles.includes('ROLE_ADMIN');
        
        setUserRole(isAdmin ? 'ADMIN' : 'CLIENTE');
        setIsAuthenticated(true);
        setToken(storedToken);
      } catch (error) {
        console.error("Token inválido ou expirado:", error);
        logout();
      }
    }
    setIsLoading(false);
  }, []);

  const login = (newToken) => {
    localStorage.setItem('authToken', newToken);
    try {
      const decodedToken = jwtDecode(newToken);
      const roles = decodedToken.authorities || [];
      const isAdmin = roles.includes('ROLE_ADMIN');

      setUserRole(isAdmin ? 'ADMIN' : 'CLIENTE');
      setIsAuthenticated(true);
      setToken(newToken);
    } catch (error) {
      console.error("Erro ao fazer login com novo token:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setUserRole(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, userRole, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
