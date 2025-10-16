import React, { useState, useEffect } from 'react';
import { getImageUrl } from '../../services/api';
import './ProductDetailModal.css';

const ProductDetailModal = ({ product, onClose }) => {
  const [selectedCustomization, setSelectedCustomization] = useState(product.customizacoes[0]);

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

  const handleSizeChange = (e) => {
    const newSize = e.target.value;
    const newCustomization = product.customizacoes.find(c => c.tamanho === newSize);
    if (newCustomization) {
      setSelectedCustomization(newCustomization);
    }
  };

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
          
          <div className="modal-selectors">
            <div className="selector-group">
              <label htmlFor="tamanho">Tamanho:</label>
              <select id="tamanho" value={selectedCustomization.tamanho} onChange={handleSizeChange}>
                {product.customizacoes.map(cust => (
                  <option key={cust.id} value={cust.tamanho}>{cust.tamanho}</option>
                ))}
              </select>
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

          <button className="modal-reserve-btn">Reservar para buscar na loja</button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;