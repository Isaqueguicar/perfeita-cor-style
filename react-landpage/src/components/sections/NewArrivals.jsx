import React from 'react';
import ProductCard from '@components/cards/ProductCard';
import './NewArrivals.css';

const NewArrivals = ({ categories, onProductSelect, onOpenFilterModal }) => {
  
  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <section id="novidades" className="new-arrivals">
      <div className="container">
        
        <div className="section-header">
          <h2 className="section-title">Novidades</h2>
          <button className="filter-button" onClick={onOpenFilterModal}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
            Filtrar
          </button>
        </div>

        {categories.map((category) => (
          category.produtos.length > 0 && (
            <div key={category.id} className="category-section">
              
              <h3 className="arrivals-category-title">{category.nome}</h3>
              
              <div className="products-grid">
                {category.produtos.map((product) => {
                  const images = (product.imagens ?? []);

                  return (
                    <ProductCard
                      key={product.id}
                      productId={product.id}
                      onSelect={onProductSelect}
                      images={images} 
                      title={product.nome}
                      price={product.preco}
                      alt={`Imagem do produto ${product.nome}`}
                    />
                  );
                })}
              </div>
            </div>
          )
        ))}
      </div>
    </section>
  );
};

export default NewArrivals;
