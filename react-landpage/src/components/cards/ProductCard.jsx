import React from 'react';
import { getImageUrl } from '../../services/api';

// Importações do Swiper para o carrossel de imagens
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, EffectFade, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation'; // Importa o CSS das setas

import './ProductCard.css';

const ProductCard = ({ images, title, alt, price, productId, onSelect }) => {
  const handleViewDetails = (e) => {
    e.preventDefault();
    onSelect(productId);
  };

  // Formata o preço para o padrão brasileiro (ex: R$ 89,90)
  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price || 0);

  return (
    <article className="product-card">
      <div className="product-image-wrapper">
        {/* Se houver mais de uma imagem, cria um carrossel */}
        {images && images.length > 1 ? (
          <Swiper
            modules={[Pagination, Autoplay, EffectFade, Navigation]}
            loop={true}
            pagination={{ clickable: true }}
            autoplay={{
              delay: 2000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true, // Pausa o carrossel ao passar o mouse
            }}
            effect="fade"
            navigation={true} // Habilita as setas de navegação
            className="product-image-carousel"
          >
            {images.map((imagePath, index) => (
              <SwiperSlide key={index}>
                <img
                  src={getImageUrl(imagePath)}
                  alt={`${alt} - variação ${index + 1}`}
                  className="product-image"
                  loading="lazy"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          // Caso contrário, mostra apenas a primeira (ou única) imagem
          <img
            src={getImageUrl(images?.[0])}
            alt={alt}
            className="product-image"
            loading="lazy"
          />
        )}
      </div>
      
      <div className="product-info">
        <h3 className="product-title">{title}</h3>
        <p className="product-price">{formattedPrice}</p>
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