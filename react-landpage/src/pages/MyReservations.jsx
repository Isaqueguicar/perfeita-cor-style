import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/auth/AuthContext';
import './MyReservations.css';

const mockReservations = [
  {
    id: 1,
    productName: 'Vestido Verde (Verde Água)',
    productCode: 'PC-88307A',
    date: '13/10/2025',
    status: 'AGUARDANDO_RETIRADA',
    imageUrl: null
  },
  {
    id: 2,
    productName: 'Camisa Linho (Branca)',
    productCode: 'PC-7A206F',
    date: '05/09/2025',
    status: 'RETIRADO',
    imageUrl: null
  },
  {
    id: 3,
    productName: 'Romper Florida (Estampado)',
    productCode: 'PC-6F185E',
    date: '18/08/2025',
    status: 'CANCELADO',
    imageUrl: null
  },
];

const MyReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchReservations = async () => {
      setLoading(true);
      setReservations(mockReservations);
      setLoading(false);
    };

    fetchReservations();
  }, [isAuthenticated]);

  const getStatusInfo = (status) => {
    switch (status) {
      case 'AGUARDANDO_RETIRADA':
        return { text: 'Aguardando Retirada', className: 'status-aguardando' };
      case 'RETIRADO':
        return { text: 'Retirado', className: 'status-retirado' };
      case 'CANCELADO':
        return { text: 'Cancelado', className: 'status-cancelado' };
      default:
        return { text: status, className: '' };
    }
  };

  const handleCancelReservation = (reservationId) => {
    console.log(`Cancelar reserva ID: ${reservationId}`);
    alert(`Funcionalidade de cancelamento para reserva ${reservationId} ainda não implementada.`);
  };


  if (loading) {
    return <div>Carregando suas reservas...</div>;
  }

  return (
    <main className="reservations-page">
      <div className="container">
        <h1 className="page-title">Minhas Reservas</h1>

        {reservations.length === 0 ? (
          <p>Você ainda não possui nenhuma reserva.</p>
        ) : (
          <div className="reservations-list">
            {reservations.map((reserva) => {
              const statusInfo = getStatusInfo(reserva.status);
              return (
                <div key={reserva.id} className="reservation-item">
                  <div className="product-image-placeholder">
                    <span>Produto</span>
                  </div>
                  <div className="reservation-details">
                    <h2 className="product-name">{reserva.productName}</h2>
                    <p className="product-code">Código: {reserva.productCode}</p>
                    <p className="reservation-date">Data: {reserva.date}</p>
                  </div>
                  <div className="reservation-status-action">
                    <span className={`status-badge ${statusInfo.className}`}>
                      {statusInfo.text}
                    </span>
                    {reserva.status === 'AGUARDANDO_RETIRADA' && (
                      <button 
                        className="cancel-button"
                        onClick={() => handleCancelReservation(reserva.id)}
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
};

export default MyReservations;

