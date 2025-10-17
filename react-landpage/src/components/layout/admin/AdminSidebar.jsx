import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext'; 
import './AdminSidebar.css';

const AdminSidebar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout(); 
    navigate('/login'); 
  };

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-footer">
        <button onClick={handleLogout} className="logout-button">Sair</button>
      </div>
    </aside>
  );
};

export default AdminSidebar;