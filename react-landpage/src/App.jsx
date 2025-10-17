import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from '@pages/Home';
import NotFound from '@pages/NotFound';
import LoginPage from '@pages/LoginPage';
import RegisterPage from '@pages/RegisterPage';
import MyReservations from '@pages/MyReservations';

import Header from '@components/layout/Header';
import Footer from '@components/layout/Footer';
import AdminDashboard from '@components/layout/admin/AdminDashboard';

import ProtectedRoute from '@components/auth/ProtectedRoute';
import LoginModal from '@components/modals/LoginModal';

const App = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  return (
    <BrowserRouter>
      <Header onLoginClick={openLoginModal} />

      <main className="main-content"> 
        <Routes>
          <Route path="/" element={<Home closeLoginModal={closeLoginModal} />} />

          <Route path="/login" element={<LoginPage />} />

          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/minhas-reservas"
            element={
              <ProtectedRoute>
                <MyReservations />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />

      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
    </BrowserRouter>
  );
};

export default App;