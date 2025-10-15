import React from 'react';
import CategoryCard from '@components/cards/CategoryCard';
import categoryCasual from '@assets/images/category-casual.jpg';
import categoryElegant from '@assets/images/category-elegant.jpg';
import './FeaturedCategories.css';

const categories = [
  {
    id: 'casual',
    image: categoryCasual,
    title: 'Casual',
    alt: 'Categoria de roupas casuais femininas'
  },
  {
    id: 'elegante',
    image: categoryElegant,
    title: 'Elegante',
    alt: 'Categoria de roupas elegantes femininas'
  }
];

const FeaturedCategories = () => {
  return (
    <section className="featured-categories">
      <div className="container">
        <h2 className="section-title-light">Categorias em Destaque</h2>
        
        <div className="categories-grid">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              image={category.image}
              title={category.title}
              alt={category.alt}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;