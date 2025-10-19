import React, { useState, useEffect } from 'react';
import { getImageUrl, createReservation } from '../../services/api'; 
import { useAuth } from '../auth/AuthContext'; 
import './ProductDetailModal.css';

const feedbackStyle = {
  textAlign: 'center',
  marginBottom: '1rem',
  fontWeight: 500,
};
const successStyle = { ...feedbackStyle, color: 'green' };
const errorStyle = { ...feedbackStyle, color: 'red' };

const ProductDetailModal = ({ product, onClose }) => {
  const firstActiveCustomization = product.customizacoes?.find(c => c.situacao === 'ATIVO');
  const [selectedCustomizationId, setSelectedCustomizationId] = useState(firstActiveCustomization?.id || null);
  const [selectedTamanho, setSelectedTamanho] = useState('');
  const [isReserving, setIsReserving] = useState(false); 
  const [reservationMessage, setReservationMessage] = useState(''); 
  const { token, isAuthenticated, login } = useAuth(); 


  const selectedCustomization = product.customizacoes?.find(c => c.id === selectedCustomizationId);

  const stockInfo = selectedCustomization?.estoque?.find(e => e.tamanho === selectedTamanho);

  useEffect(() => {
    if (selectedCustomization?.estoque?.length > 0) {
      const firstAvailable = selectedCustomization.estoque.find(e => e.quantidade > 0);
      setSelectedTamanho(firstAvailable?.tamanho || ''); 
    } else {
      setSelectedTamanho('');
    }
    setReservationMessage(''); 
  }, [selectedCustomizationId, selectedCustomization]); 

  
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27 && !isReserving) onClose(); 
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc); 
  }, [onClose, isReserving]);

  const handleBackdropClick = (e) => {
    if (e.target.id === 'modal-backdrop' && !isReserving) { 
      onClose();
    }
  };

  const handleReserveClick = async () => {
    if (!isAuthenticated) {
      setReservationMessage('Você precisa estar logado para reservar.');
      return;
    }

    if (!selectedTamanho) {
      setReservationMessage('Por favor, selecione um tamanho.');
      return;
    }

    if (!stockInfo || stockInfo.quantidade <= 0) {
      setReservationMessage('Tamanho esgotado ou indisponível.');
      return;
    }

    setIsReserving(true);
    setReservationMessage(''); 

    try {
      const reservationData = {
        produtoCustomId: selectedCustomizationId,
        tamanho: selectedTamanho,
      };
      await createReservation(reservationData, token);
      setReservationMessage('Reserva solicitada com sucesso! Verifique "Minhas Reservas".');
    } catch (error) {
      console.error("Erro ao reservar:", error);
      setReservationMessage(error.message || 'Falha ao solicitar reserva. Tente novamente.');
    } finally {
      setIsReserving(false);
    }
  };

  if (!selectedCustomization) {
    return (
        <div id="modal-backdrop" className="modal-backdrop" onClick={handleBackdropClick}>
            <div className="modal-content">
                <button className="modal-close-btn" onClick={onClose}>&times;</button>
                <p>Este produto não possui variações ativas disponíveis no momento.</p>
            </div>
        </div>
    );
  }

  const mainImageUrl = selectedCustomization.imagem ? getImageUrl(selectedCustomization.imagem) : 'https://placehold.co/400x600/f0f5f1/0a4028?text=Imagem...';

  return (
    <div id="modal-backdrop" className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content">
        <button className="modal-close-btn" onClick={onClose} disabled={isReserving}>&times;</button>

        <div className="modal-image-section">
          <img
            src={mainImageUrl}
            alt={product.nome}
            className="modal-product-image"
            onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/400x600/f0f5f1/0a4028?text=Erro';}} // Fallback de erro
          />
        </div>

        <div className="modal-info-section">
          <h1 className="modal-product-title">{product.nome}</h1>
          <p className="modal-product-price">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.preco || 0)}
          </p>
          <p className="modal-product-description">{product.descricao || 'Sem descrição disponível.'}</p>

          {product.customizacoes?.filter(c => c.situacao === 'ATIVO').length > 1 && (
              <div className="customization-thumbnails">
                <label>Modelos:</label>
                <div className="thumbnails-container">
                  {product.customizacoes
                    .filter(cust => cust.situacao === 'ATIVO' && cust.imagem) 
                    .map(cust => (
                    <img
                      key={cust.id}
                      src={getImageUrl(cust.imagem)}
                      alt={`Variação ${cust.id}`}
                      className={`thumbnail ${cust.id === selectedCustomizationId ? 'active' : ''}`}
                      onClick={() => !isReserving && setSelectedCustomizationId(cust.id)} 
                      onError={(e) => { e.target.style.display='none';}} 
                    />
                  ))}
                </div>
              </div>
          )}

          <div className="modal-selectors">
            <div className="selector-group">
              <label htmlFor="tamanho">Tamanho:</label>
              <select
                 id="tamanho"
                 value={selectedTamanho}
                 onChange={(e) => setSelectedTamanho(e.target.value)}
                 disabled={isReserving || !selectedCustomization?.estoque?.some(e => e.quantidade > 0)}
              >
                <option value="">Selecione</option>
                {selectedCustomization?.estoque
                  ?.filter(e => e.quantidade > 0)
                  .map(e => (
                    <option key={e.tamanho} value={e.tamanho}>{e.tamanho}</option>
                  ))}
                   {selectedCustomization?.estoque
                     ?.filter(e => e.quantidade <= 0)
                     .map(e => (
                       <option key={e.tamanho} value={e.tamanho} disabled>{e.tamanho} (Esgotado)</option>
                   ))}
              </select>
            </div>

            <div className="selector-group">
                <label>Estoque:</label>
                <p className="stock-info">
                    {selectedTamanho
                        ? (stockInfo && stockInfo.quantidade > 0 ? `${stockInfo.quantidade} disponíveis` : 'Esgotado')
                        : '-'
                    }
                </p>
            </div>

             <div className="selector-group">
              <label>Cor(es):</label>
              <div className="color-swatches">
                {selectedCustomization?.cores?.length > 0
                  ? selectedCustomization.cores.map((cor, index) => (
                      <div key={index} className="color-swatch" style={{ backgroundColor: cor }} title={cor}></div>
                    ))
                  : <span style={{fontSize: '0.9em', color: '#666'}}>N/A</span>
                }
              </div>
            </div>
          </div>

          {reservationMessage && (
            <p style={reservationMessage.includes('sucesso') ? successStyle : errorStyle}>
              {reservationMessage}
            </p>
          )}

          <button
            className="modal-reserve-btn"
            onClick={handleReserveClick}
            disabled={
              !isAuthenticated || 
              !selectedTamanho || 
              !stockInfo || stockInfo.quantidade <= 0 || 
              isReserving || 
              reservationMessage.includes('sucesso') 
            }
          >
            {isReserving ? 'Reservando...' : 'Reservar para buscar na loja'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;