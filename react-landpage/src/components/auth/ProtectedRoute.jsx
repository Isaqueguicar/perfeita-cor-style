import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, userRole, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div>A verificar autenticação...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    console.warn(`Acesso negado à rota ${location.pathname}. Requer: ${requiredRole}, Utilizador tem: ${userRole}`);
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
