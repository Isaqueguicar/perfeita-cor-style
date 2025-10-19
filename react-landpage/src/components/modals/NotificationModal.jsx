import React from 'react';
import { useAuth } from '../auth/AuthContext';
import { markNotificationAsRead } from '../../services/api';
import './NotificationModal.css'; 

const statusMap = {
  AGUARDANDO_APROVACAO: { text: 'Aguardando Aprovação', className: 'status-aguardando' },
  CONFIRMADA: { text: 'Confirmada', className: 'status-confirmada' },
  CANCELADA_PELO_CLIENTE: { text: 'Cancelada por Você', className: 'status-cancelado' },
  CANCELADA_PELO_ADMIN: { text: 'Cancelada pela Loja', className: 'status-cancelado-admin' },
  RETIRADO: { text: 'Retirado', className: 'status-retirado' },
  NAO_COMPARECEU: { text: 'Não Compareceu', className: 'status-naocompareceu' },
};
const getStatusInfo = (status) => statusMap[status] || { text: status, className: 'status-desconhecido' };

const NotificationModal = ({ notifications, onClose }) => {
  const { token } = useAuth();

  if (!notifications || notifications.length === 0) {
    return null; 
  }

  const handleMarkAllAsRead = async () => {
    if (!token) return;

    const promises = notifications.map(notif => markNotificationAsRead(notif.id, token));
    try {
      await Promise.all(promises);
      onClose(); 
    } catch (error) {
      console.error("Erro ao marcar notificações como lidas:", error);
      alert("Erro ao marcar notificações como lidas. Tente novamente.");
    }
  };

  return (
    <div className="modal-backdrop notification-backdrop"> 
      <div className="notification-modal-content">
        <h2>Atualizações das Reservas</h2>
        <ul className="notification-list">
          {notifications.map(notif => {
            const statusInfo = getStatusInfo(notif.status);
            return (
              <li key={notif.id} className="notification-item">
                Reserva para <strong>{notif.nomeProduto || 'Produto'} ({notif.tamanho || 'N/A'})</strong> foi atualizada para:
                <span className={`status-badge ${statusInfo.className}`} style={{ marginLeft: '8px' }}>
                  {statusInfo.text}
                </span>
                {notif.observacaoAdmin && <p className="notification-obs">Obs: {notif.observacaoAdmin}</p>}
              </li>
            );
          })}
        </ul>
        <button onClick={handleMarkAllAsRead} className="notification-close-btn">
          OK (Marcar como lido)
        </button>
      </div>
    </div>
  );
};

export default NotificationModal;