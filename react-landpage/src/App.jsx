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
          <Route path="/" element={<Home closeLoginModal={closeLoginModal} />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/minhas-reservas" element={<ProtectedRoute><MyReservations /></ProtectedRoute>} />

          <Route 
            path="/admin" 
            element={<ProtectedRoute requiredRole="ADMIN"><AdminLayout /></ProtectedRoute>}
          >
            <Route index element={<AdminDashboard />} /> 
            <Route path="produtos" element={<ManageProducts />} />
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
