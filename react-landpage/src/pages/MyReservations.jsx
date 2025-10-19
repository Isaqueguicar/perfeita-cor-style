import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../components/auth/AuthContext';
import { fetchMyReservations, cancelMyReservation, getImageUrl } from '../services/api';
import './MyReservations.css';

const statusMap = {
  AGUARDANDO_APROVACAO: { text: 'Aguardando Aprovação', className: 'status-aguardando' },
  CONFIRMADA: { text: 'Confirmada', className: 'status-confirmada' },
  CANCELADA_PELO_CLIENTE: { text: 'Cancelada por Você', className: 'status-cancelado' },
  CANCELADA_PELO_ADMIN: { text: 'Cancelada pela Loja', className: 'status-cancelado-admin' },
  RETIRADO: { text: 'Retirado', className: 'status-retirado' },
  NAO_COMPARECEU: { text: 'Não Compareceu', className: 'status-naocompareceu' },
};

const MyReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelingId, setCancelingId] = useState(null); 
  const { token, isAuthenticated } = useAuth(); 

  const loadReservations = useCallback(async () => {
    if (!token || !isAuthenticated) {
      setLoading(false);
      setReservations([]); 
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await fetchMyReservations(token);
      setReservations(data);
    } catch (err) {
      console.error("Erro ao buscar reservas:", err);
      setError("Falha ao carregar suas reservas. Tente atualizar a página.");
      setReservations([]);
    } finally {
      setLoading(false);
    }
  }, [token, isAuthenticated]); 

  useEffect(() => {
    loadReservations();
  }, [loadReservations]);

  const getStatusInfo = (status) => {
    return statusMap[status] || { text: status, className: 'status-desconhecido' }; 
  };

  const handleCancelReservation = async (reservationId) => {
    if (cancelingId) return; 

    const confirmCancel = window.confirm("Tem certeza que deseja cancelar esta reserva?");
    if (!confirmCancel) return;

    setCancelingId(reservationId); 
    setError('');
    try {
      await cancelMyReservation(reservationId, token);
      loadReservations();
    } catch (err) {
      console.error(`Erro ao cancelar reserva ID ${reservationId}:`, err);
      setError(err.message || 'Falha ao cancelar a reserva. Tente novamente.');
    } finally {
      setCancelingId(null); 
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (e) {
      console.warn("Erro ao formatar data:", dateString, e);
      return dateString; 
    }
  };

  if (loading && isAuthenticated) { 
    return (
        <main className="reservations-page">
            <div className="container">
                <h1 className="page-title">Minhas Reservas</h1>
                <p>Carregando suas reservas...</p>
            </div>
        </main>
    );
  }

  if (!isAuthenticated && !loading) {
     return (
        <main className="reservations-page">
            <div className="container">
                <h1 className="page-title">Minhas Reservas</h1>
                <p>Você precisa estar <a href="/login">logado</a> para ver suas reservas.</p>
            </div>
        </main>
     );
  }

  return (
    <main className="reservations-page">
      <div className="container">
        <h1 className="page-title">Minhas Reservas</h1>

        {error && <p className="error-message" style={{ color: 'red', textAlign: 'center', marginBottom: '1rem' }}>{error}</p>}

        {!loading && reservations.length === 0 && !error ? (
          <p style={{ textAlign: 'center' }}>Você ainda não possui nenhuma reserva.</p>
        ) : (
          <div className="reservations-list">
            {reservations.map((reserva) => {
              const statusInfo = getStatusInfo(reserva.status);
              const isCancelable = reserva.status === 'AGUARDANDO_APROVACAO' || reserva.status === 'CONFIRMADA';

              return (
                <div key={reserva.id} className="reservation-item">
                  <img
                    src={getImageUrl(reserva.imagemUrl)}
                    alt={`Produto ${reserva.nomeProduto}`}
                    className="product-image-placeholder" 
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/80x80/f0f5f1/0a4028?text=Img'; }}
                  />
                  <div className="reservation-details">
                    <h2 className="product-name">{`${reserva.nomeProduto || 'Produto não encontrado'} (${reserva.tamanho || 'N/A'})`}</h2>
                    <p className="product-code">Cor(es): {reserva.cor || 'N/A'}</p>
                    <p className="reservation-date">Data da Reserva: {formatDate(reserva.dataReserva)}</p>
                    {reserva.observacaoAdmin && <p className="admin-observation">Observação: {reserva.observacaoAdmin}</p>}
                  </div>
                  <div className="reservation-status-action">
                    <span className={`status-badge ${statusInfo.className}`}>
                      {statusInfo.text}
                    </span>
                    {isCancelable && (
                      <button
                        className="cancel-button"
                        onClick={() => handleCancelReservation(reserva.id)}
                        disabled={cancelingId === reserva.id} 
                      >
                        {cancelingId === reserva.id ? 'Cancelando...' : 'Cancelar Reserva'}
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