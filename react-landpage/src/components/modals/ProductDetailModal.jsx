import React, { useState, useEffect } from 'react';
import { getImageUrl } from '../../services/api';
import './ProductDetailModal.css';

const ProductDetailModal = ({ product, onClose }) => {
  const [selectedCustomizationId, setSelectedCustomizationId] = useState(product.customizacoes[0]?.id || null);
  const [selectedTamanho, setSelectedTamanho] = useState('');

  const selectedCustomization = product.customizacoes.find(c => c.id === selectedCustomizationId);

  const stockInfo = selectedCustomization?.estoque.find(e => e.tamanho === selectedTamanho);

  useEffect(() => {
    if (selectedCustomization?.estoque?.length > 0) {
      const firstAvailable = selectedCustomization.estoque.find(e => e.quantidade > 0);
      setSelectedTamanho(firstAvailable?.tamanho || '');
    } else {
      setSelectedTamanho('');
    }
  }, [selectedCustomizationId]); 

  const handleBackdropClick = (e) => {
    if (e.target.id === 'modal-backdrop') {
      onClose();
    }
  };

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!selectedCustomization) {
    return (
        <div id="modal-backdrop" className="modal-backdrop" onClick={handleBackdropClick}>
            <div className="modal-content">
                <button className="modal-close-btn" onClick={onClose}>&times;</button>
                <p>Este produto não tem variações disponíveis.</p>
            </div>
        </div>
    );
  }

  return (
    <div id="modal-backdrop" className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content">
        <button className="modal-close-btn" onClick={onClose}>&times;</button>
        
        <div className="modal-image-section">
          <img 
            src={getImageUrl(selectedCustomization.imagem)} 
            alt={product.nome} 
            className="modal-product-image"
          />
        </div>

        <div className="modal-info-section">
          <h1 className="modal-product-title">{product.nome}</h1>
          <p className="modal-product-price">R$ {product.preco.toFixed(2).replace('.', ',')}</p>
          <p className="modal-product-description">{product.descricao}</p>
          <div className="customization-thumbnails">
            <label>Modelos:</label>
            <div className="thumbnails-container">
              {product.customizacoes.map(cust => (
                <img
                  key={cust.id}
                  src={getImageUrl(cust.imagem)}
                  alt={`Variação ${cust.id}`}
                  className={`thumbnail ${cust.id === selectedCustomizationId ? 'active' : ''}`}
                  onClick={() => setSelectedCustomizationId(cust.id)}
                />
              ))}
            </div>
          </div>
          
          <div className="modal-selectors">
            <div className="selector-group">
              <label htmlFor="tamanho">Tamanho:</label>
              <select id="tamanho" value={selectedTamanho} onChange={(e) => setSelectedTamanho(e.target.value)}>
                <option value="">Selecione</option>
                {selectedCustomization.estoque
                  .filter(e => e.quantidade > 0)
                  .map(e => (
                    <option key={e.id} value={e.tamanho}>{e.tamanho}</option>
                  ))}
              </select>
            </div>
            
            <div className="selector-group">
                <label>Estoque:</label>
                <p className="stock-info">{stockInfo ? `${stockInfo.quantidade} disponíveis` : '-'}</p>
            </div>

            <div className="selector-group">
              <label>Cor:</label>
              <div className="color-swatches">
                {selectedCustomization.cores.map((cor, index) => (
                  <div key={index} className="color-swatch" style={{ backgroundColor: cor }}></div>
                ))}
              </div>
            </div>
          </div>

          <button className="modal-reserve-btn" disabled={!selectedTamanho || !stockInfo}>
            Reservar para buscar na loja
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
