import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, userRole } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    console.warn(`Acesso negado: Rota requer ${requiredRole}, usuário tem ${userRole}`);
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;