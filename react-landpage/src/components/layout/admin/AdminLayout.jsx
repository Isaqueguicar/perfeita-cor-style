import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import './AdminDashboard.css';

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main-content">
        <Outlet /> 
      </main>
    </div>
  );
};

export default AdminLayout;

