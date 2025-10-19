import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

import Home from './pages/Home';
import NotFound from './pages/NotFound';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MyReservations from './pages/MyReservations';

import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import LoginModal from './components/modals/LoginModal';
import ProtectedRoute from './components/auth/ProtectedRoute';

import AdminLayout from './components/layout/admin/AdminLayout';
import AdminDashboard from './components/layout/admin/AdminDashboard';
import ManageProducts from './pages/admin/ManageProducts';
// --- 1. IMPORTAR O NOVO COMPONENTE ---
import CreateProduct from './pages/admin/CreateProduct';

const AppContent = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  const location = useLocation();
  const isInsideAdmin = location.pathname.startsWith('/admin');

  return (
    <>
      {!isInsideAdmin && <Header onLoginClick={openLoginModal} />}

      <main className="main-content"> 
        <Routes>
          {/* Rotas Públicas */}
          <Route path="/" element={<Home closeLoginModal={closeLoginModal} />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/minhas-reservas" element={<ProtectedRoute><MyReservations /></ProtectedRoute>} />

          {/* Rotas Protegidas de Admin */}
          <Route 
            path="/admin" 
            element={<ProtectedRoute requiredRole="ADMIN"><AdminLayout /></ProtectedRoute>}
          >
            <Route index element={<AdminDashboard />} />
            <Route path="produtos" element={<ManageProducts />} />
            {/* --- 2. ADICIONAR A NOVA ROTA DE CADASTRO --- */}
            <Route path="produtos/novo" element={<CreateProduct />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {!isInsideAdmin && <Footer />}

      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
    </>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;

