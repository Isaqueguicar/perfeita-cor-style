import React from 'react';
import './ProductCard.css';

const ProductCard = ({ image, title, alt }) => {
  const handleViewDetails = (e) => {
    e.preventDefault();
    console.log(`Visualizando detalhes de: ${title}`);
  };

  return (
    <article className="product-card">
      <div className="product-image-wrapper">
        <img 
          src={image} 
          alt={alt}
          className="product-image"
          loading="lazy"
        />
      </div>
      
      <div className="product-info">
        <h3 className="product-title">{title}</h3>
        <button 
          className="product-link"
          onClick={handleViewDetails}
        >
          Ver Detalhes
        </button>
      </div>
    </article>
  );
};

export default ProductCard;