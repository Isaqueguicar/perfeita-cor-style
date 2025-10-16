import React from 'react';
import ProductCard from '@components/cards/ProductCard';
import './NewArrivals.css';

const NewArrivals = ({ categories, onProductSelect }) => {
  // Se não houver categorias ou a lista estiver vazia, não renderiza nada
  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <section id="novidades" className="new-arrivals">
      <div className="container">
        {/* Itera sobre cada categoria recebida do back-end */}
        {categories.map((category) => (
          // Renderiza a seção da categoria apenas se ela tiver produtos
          category.produtos.length > 0 && (
            <div key={category.id} className="category-section">
              <h2 className="section-title">{category.nome}</h2>
              
              <div className="products-grid">
                {/* Itera sobre os produtos de cada categoria */}
                {category.produtos.map((product) => (
                  <ProductCard
                    key={product.id}
                    productId={product.id}
                    onSelect={onProductSelect}
                    images={product.imagens} 
                    title={product.nome}
                    price={product.preco}
                    alt={`Imagem do produto ${product.nome}`}
                  />
                ))}
              </div>
            </div>
          )
        ))}
      </div>
    </section>
  );
};

export default NewArrivals;