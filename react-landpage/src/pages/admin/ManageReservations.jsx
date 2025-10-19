import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../components/auth/AuthContext';
import { fetchAllReservationsAdmin, updateReservationAdmin, getImageUrl } from '../../services/api';
import './ManageReservations.css';

const statusMap = {
  AGUARDANDO_APROVACAO: { text: 'Aguardando', className: 'status-aguardando' },
  CONFIRMADA: { text: 'Confirmada', className: 'status-confirmada' },
  CANCELADA_PELO_CLIENTE: { text: 'Cancelada (Cliente)', className: 'status-cancelado' },
  CANCELADA_PELO_ADMIN: { text: 'Cancelada (Admin)', className: 'status-cancelado-admin' }, 
  RETIRADO: { text: 'Retirado', className: 'status-retirado' },
  NAO_COMPARECEU: { text: 'Não Compareceu', className: 'status-naocompareceu' },
};

const adminActionsMap = {
    AGUARDANDO_APROVACAO: ['CONFIRMADA', 'CANCELADA_PELO_ADMIN'],
    CONFIRMADA: ['RETIRADO', 'NAO_COMPARECEU', 'CANCELADA_PELO_ADMIN'],
    CANCELADA_PELO_CLIENTE: [],
    CANCELADA_PELO_ADMIN: [],
    RETIRADO: [],
    NAO_COMPARECEU: [],
};

const ManageReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null); 
  const [editingObsId, setEditingObsId] = useState(null); 
  const [currentObs, setCurrentObs] = useState(''); 
  const { token } = useAuth(); 

  const loadReservations = useCallback(async () => {
    if (!token) return; 
    setLoading(true);
    setError(''); 
    try {
      const data = await fetchAllReservationsAdmin(token);
      setReservations(data); 
    } catch (err) {
      setError('Falha ao carregar reservas. Verifique a conexão ou tente novamente.');
      console.error("Erro em loadReservations (Admin):", err);
    } finally {
      setLoading(false); 
    }
  }, [token]); 

  useEffect(() => {
    loadReservations();
  }, [loadReservations]);

  const handleStatusChange = async (reservationId, newStatus) => {
    if (updatingId) return; 
    setUpdatingId(reservationId); 
    setError(''); 

    const currentReservation = reservations.find(r => r.id === reservationId);
    let obsToSend = currentReservation?.observacaoAdmin || '';

    if (newStatus === 'CANCELADA_PELO_ADMIN') {
        const reason = prompt("Opcional: Insira o motivo do cancelamento:");
        if (reason === null) {
             setUpdatingId(null);
             return;
        }
        obsToSend = reason || ''; 
    }

    try {
      await updateReservationAdmin(reservationId, { status: newStatus, observacaoAdmin: obsToSend }, token);
      loadReservations(); 
    } catch (err) {
      setError(err.message || 'Falha ao atualizar status da reserva.');
      console.error("Erro em handleStatusChange (Admin):", err);
    } finally {
      setUpdatingId(null); 
    }
  };

  const handleEditObservation = (reserva) => {
      setEditingObsId(reserva.id); 
      setCurrentObs(reserva.observacaoAdmin || ''); 
  }

  const handleCancelEditObservation = () => {
      setEditingObsId(null);
      setCurrentObs('');
  }

  const handleSaveObservation = async (reservationId) => {
      if (updatingId) return; 
      setUpdatingId(reservationId); 
      setError('');
      try {
          const reservaAtual = reservations.find(r => r.id === reservationId);
          if (!reservaAtual) throw new Error("Reserva não encontrada para salvar observação.");

          await updateReservationAdmin(reservationId, { status: reservaAtual.status, observacaoAdmin: currentObs }, token);
          setEditingObsId(null); 
          setReservations(prev => prev.map(r => r.id === reservationId ? {...r, observacaoAdmin: currentObs} : r));
      } catch (err) {
          setError(err.message || 'Falha ao salvar observação.');
          console.error("Erro em handleSaveObservation (Admin):", err);
      } finally {
          setUpdatingId(null); 
      }
  }

  const formatDate = (dateString) => {
     if (!dateString) return '-';
     try {
       return new Date(dateString).toLocaleDateString('pt-BR', {
         day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
       });
     } catch (e) { return dateString; }
  };

  const getStatusInfo = (status) => {
    return statusMap[status] || { text: status, className: 'status-desconhecido' }; 
  };

  return (
    <div className="manage-reservations-page">
      <h1>Gerenciar Reservas</h1>

      {error && <p className="error-message">{error}</p>}

      <div className="admin-reservations-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Produto</th>
              <th>Data Reserva</th>
              <th>Status</th>
              <th>Observação</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" style={{ textAlign: 'center' }}>Carregando reservas...</td></tr>
            ) : reservations.length === 0 ? (
              <tr><td colSpan="7" style={{ textAlign: 'center' }}>Nenhuma reserva encontrada.</td></tr>
            ) : (
              reservations.map((reserva) => {
                const statusInfo = getStatusInfo(reserva.status);
                const possibleActions = adminActionsMap[reserva.status] || [];
                const isEditingObs = editingObsId === reserva.id;

                return (
                  <tr key={reserva.id}>
                    <td>{reserva.id}</td>
                    <td>{reserva.nomeCliente || 'Cliente não encontrado'}</td>
                    <td>
                      <div className="product-info-cell">
                        <img
                            src={getImageUrl(reserva.imagemUrl)}
                            alt=""
                            className="product-thumbnail"
                             onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/40x40/f0f5f1/0a4028?text=Img';}}
                        />
                        <span>{`${reserva.nomeProduto || '?'} (${reserva.tamanho || '?'})`}</span>
                      </div>
                    </td>
                    <td>{formatDate(reserva.dataReserva)}</td>
                    <td>
                      <span className={`status-badge ${statusInfo.className}`}>
                        {statusInfo.text}
                      </span>
                    </td>
                    <td>
                        {isEditingObs ? (
                            <textarea
                                value={currentObs}
                                onChange={(e) => setCurrentObs(e.target.value)}
                                rows={2}
                                className="obs-edit-area"
                                placeholder="Digite a observação..."
                            />
                        ) : (
                            <span className="obs-text" title={reserva.observacaoAdmin || ''}>
                                {reserva.observacaoAdmin || '-'}
                            </span>
                        )}
                    </td>
                    <td className="actions-cell">
                        {isEditingObs ? (
                            <>
                                <button
                                    onClick={() => handleSaveObservation(reserva.id)}
                                    className="action-btn save-obs-btn"
                                    disabled={updatingId === reserva.id}
                                >
                                     {updatingId === reserva.id ? 'Salvando...' : 'Salvar'}
                                </button>
                                <button
                                    onClick={handleCancelEditObservation}
                                    className="action-btn cancel-obs-btn"
                                    disabled={updatingId === reserva.id}
                                >
                                    Cancelar
                                 </button>
                            </>
                        ) : (
                             <button
                                 onClick={() => handleEditObservation(reserva)}
                                 className="action-btn edit-obs-btn"
                                 disabled={!!updatingId} 
                              >
                                  {reserva.observacaoAdmin ? 'Editar Obs' : 'Adic. Obs'}
                              </button>
                        )}

                        {!isEditingObs && possibleActions.map(actionStatus => (
                            <button
                                key={actionStatus}
                                onClick={() => handleStatusChange(reserva.id, actionStatus)}
                                className={`action-btn status-btn-${actionStatus.toLowerCase().replace(/_/g, '-')}`}
                                disabled={updatingId === reserva.id}
                            >
                                {updatingId === reserva.id ? '...' : (statusMap[actionStatus]?.text || actionStatus)}
                            </button>
                        ))}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageReservations;