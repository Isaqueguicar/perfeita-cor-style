import React from 'react';
import CategoryCard from '@components/cards/CategoryCard';
import { getImageUrl } from '../../services/api';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
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
          modules={[Navigation, Pagination, Autoplay]}
          
          spaceBetween={30}
          slidesPerView={1}
          loop={true}
          
          navigation
          
          pagination={{ clickable: true }}

          autoplay={{ 
            delay: 2500, 
            disableOnInteraction: false 
          }}
          
          breakpoints={{
            768: {
              slidesPerView: 2,
              spaceBetween: 30,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 40,
            },
          }}
          className="categories-carousel"
        >
          {categories.map((category) => (
            <SwiperSlide key={category.id}>
              <CategoryCard
                image={getImageUrl(category.produtos[0]?.imagens[0])}
                title={category.nome}
                alt={`Categoria de ${category.nome}`}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default FeaturedCategories;