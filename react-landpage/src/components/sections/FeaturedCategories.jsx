import React from 'react';
import CategoryCard from '@components/cards/CategoryCard';
import { getImageUrl } from '../../services/api';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import './FeaturedCategories.css';

const FeaturedCategories = ({ categories, onCategorySelect }) => {
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
            if (category.imagemPath) {
              imageUrl = getImageUrl(category.imagemPath);
            } else if (category.produtos && category.produtos.length > 0 && category.produtos[0].imagens && category.produtos[0].imagens.length > 0) {
              imageUrl = getImageUrl(category.produtos[0].imagens[0]);
            }

            return imageUrl && (
              <SwiperSlide key={category.id}>
                <CategoryCard
                  id={category.id}
                  image={imageUrl}
                  title={category.nome}
                  alt={`Imagem da categoria ${category.nome}`}
                  onClick={onCategorySelect}
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