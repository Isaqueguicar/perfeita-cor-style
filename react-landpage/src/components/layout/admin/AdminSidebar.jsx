import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
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
      <div className="admin-sidebar-header">
        <h2>Perfeita Cor</h2>
        <span>Admin</span>
      </div>
      <nav className="admin-sidebar-nav">
        <NavLink 
          to="/admin" 
          end 
          className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
        >
          Dashboard
        </NavLink>
        <NavLink 
          to="/admin/produtos" 
          className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
        >
          Produtos
        </NavLink>
      </nav>
      <div className="admin-sidebar-footer">
        <button onClick={handleLogout} className="logout-button">Sair</button>
      </div>
    </aside>
  );
};

export default AdminSidebar;

