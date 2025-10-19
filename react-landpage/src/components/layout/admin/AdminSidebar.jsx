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

  const getNavLinkClass = ({ isActive }) => isActive ? "nav-item active" : "nav-item";

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-header">
        <h2>Perfeita Cor</h2>
        <span>Admin</span>
      </div>
      <nav className="admin-sidebar-nav">
        <NavLink to="/admin" end className={getNavLinkClass}>Dashboard</NavLink>
        <NavLink to="/admin/produtos" className={getNavLinkClass}>Produtos</NavLink>
        <NavLink to="/admin/categorias" className={getNavLinkClass}>Categorias</NavLink>
        <NavLink to="/admin/reservas" className={getNavLinkClass}>Reservas</NavLink>
      </nav>
      <div className="admin-sidebar-footer">
        <button onClick={handleLogout} className="logout-button">Sair</button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
