import React, { useState, useEffect } from 'react';
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
import CreateProduct from './pages/admin/CreateProduct';
import EditProduct from './pages/admin/EditProduct';
import ManageReservations from './pages/admin/ManageReservations'; 

import NotificationModal from './components/modals/NotificationModal'; 
import { useAuth } from './components/auth/AuthContext'; 
import { fetchMyPendingNotifications } from './services/api'; 

const AppContent = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  const location = useLocation();
  const isInsideAdmin = location.pathname.startsWith('/admin');
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  const { token, isAuthenticated, userRole } = useAuth(); 
  const [pendingNotifications, setPendingNotifications] = useState([]);
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  useEffect(() => {
    const checkForNotifications = async () => {
      if (isAuthenticated && token && userRole === 'CLIENTE') {
        try {
          const notifications = await fetchMyPendingNotifications(token);
          if (notifications && notifications.length > 0) {
            setPendingNotifications(notifications);
            setShowNotificationModal(true); 
          } else {
            setPendingNotifications([]); 
            setShowNotificationModal(false); 
          }
        } catch (error) {
          console.error("Erro ao verificar notificações:", error);
          setShowNotificationModal(false);
        }
      } else {
         setPendingNotifications([]);
         setShowNotificationModal(false);
      }
    };

    checkForNotifications(); 

  }, [isAuthenticated, token, userRole]);

  const handleCloseNotificationModal = () => {
      setShowNotificationModal(false);
      setPendingNotifications([]);
  };

  return (
    <>
      {!isInsideAdmin && !isAuthPage && <Header onLoginClick={openLoginModal} />}

      <main className="main-content"> 
        <Routes>
          <Route path="/" element={<Home closeLoginModal={closeLoginModal} />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/minhas-reservas"
            element={
              <ProtectedRoute> 
                <MyReservations />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminLayout /> 
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="produtos" element={<ManageProducts />} />
            <Route path="produtos/novo" element={<CreateProduct />} />
            <Route path="produtos/editar/:id" element={<EditProduct />} />
            <Route path="reservas" element={<ManageReservations />} />

          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {!isInsideAdmin && !isAuthPage && <Footer />}

      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />

      {showNotificationModal && (
          <NotificationModal
             notifications={pendingNotifications}
             onClose={handleCloseNotificationModal} 
           />
       )}
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