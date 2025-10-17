import React, { useState, useEffect } from 'react';
import AdminSidebar from '@components/layout/admin/AdminSidebar';
import { useAuth } from '../../../components/auth/AuthContext'; 
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { token } = useAuth(); 
  const [stats, setStats] = useState({ totalProdutos: 0, reservasAtivas: 0, vendasMes: 0 });
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const headers = { 'Authorization': `Bearer ${token}` };
        

        setStats({ totalProdutos: 152, reservasAtivas: 18, vendasMes: 7850.00 });
        setReservas([
          { id: 1, cliente: 'Ana Silva', produto: 'Vestido Verde (M)', data: '13/10/2025', status: 'Aguardando'},
          { id: 2, cliente: 'Carlos Souza', produto: 'Camisa Linho (G)', data: '12/10/2025', status: 'Retirado'},
          { id: 3, cliente: 'Mariana Costa', produto: 'Romper Florido (P)', data: '12/10/2025', status: 'Cancelado'},
        ]);

      } catch (error) {
        console.error("Erro ao buscar dados do dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchData();
    }
  }, [token]);

  if (loading) return <div>Carregando dashboard...</div>;

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main-content">
        <h1>Dashboard</h1>
        
        <section className="admin-summary-cards">
          <div className="summary-card">
            <h2>Total de Produtos</h2>
            <p>{stats.totalProdutos}</p> 
          </div>
          <div className="summary-card">
            <h2>Reservas Ativas</h2>
            <p>{stats.reservasAtivas}</p>
          </div>
           <div className="summary-card">
            <h2>Vendas do Mês</h2>
             <p>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.vendasMes)}</p>
          </div>
        </section>

        <section className="admin-recent-reservations">
          <h2>Últimas Reservas</h2>
          <table>
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Produto</th>
                <th>Data</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {reservas.map(reserva => (
                <tr key={reserva.id}>
                  <td>{reserva.cliente}</td>
                  <td>{reserva.produto}</td>
                  <td>{reserva.data}</td>
                  <td><span className={`status status-${reserva.status.toLowerCase()}`}>{reserva.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        
      </main>
    </div>
  );
};

export default AdminDashboard;