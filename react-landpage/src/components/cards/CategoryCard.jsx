import React from 'react';
import './CategoryCard.css';

const CategoryCard = ({ image, title, alt }) => {
  const handleCategoryClick = () => {
    console.log(`Categoria selecionada: ${title}`);
  };

  return (
    <article 
      className="category-card"
      onClick={handleCategoryClick}
    >
      <div className="category-image-wrapper">
        <img 
          src={image} 
          alt={alt}
          className="category-image"
          loading="lazy"
        />
      </div>
      
      <div className="category-overlay">
        <h3 className="category-title">{title}</h3>
      </div>
    </article>
  );
};

export default CategoryCard;