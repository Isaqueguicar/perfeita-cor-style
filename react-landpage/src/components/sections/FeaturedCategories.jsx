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
          loop={categories.length > 2} 
          navigation
          pagination={{ clickable: true }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true, 
          }}
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
          {categories.map((category) => {
            let imageUrl = null;
            if (category.imagePath) {
              imageUrl = getImageUrl(category.imagePath);
            }

            return imageUrl && (
              <SwiperSlide key={category.id}>
                <CategoryCard
                  image={imageUrl}
                  title={category.nome}
                  alt={`Imagem da categoria ${category.nome}`}
                />
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
};

export default FeaturedCategories;