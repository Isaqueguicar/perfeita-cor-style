import React from 'react';
import CategoryCard from '@components/cards/CategoryCard';
import { getImageUrl } from '../../services/api';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules'; 
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import './FeaturedCategories.css';

const FeaturedCategories = ({ categories }) => {
  if (!categories || categories.length === 0) {
    return null;
  }
  
  return (
    <section className="featured-categories">
      <div className="container">
        <h2 className="section-title-light">Categorias em Destaque</h2>
        
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={30} 
          slidesPerView={1} 
          loop={categories.length > 2} 
          navigation 
          pagination={{ clickable: true }} 
          
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 30,
            },
          }}
          className="categories-carousel"
        >
          {categories.map((category) => (
            (category.produtos && category.produtos.length > 0 && category.produtos[0].imagens.length > 0) && (
              <SwiperSlide key={category.id}>
                <CategoryCard
                  image={getImageUrl(category.produtos[0]?.imagens[0])}
                  title={category.nome}
                  alt={`Categoria de ${category.nome}`}
                />
              </SwiperSlide>
            )
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default FeaturedCategories;
