import React from 'react';
import ProductCard from '@components/cards/ProductCard';
import productDress from '@assets/images/product-dress.jpg';
import productShirt from '@assets/images/product-shirt.jpg';
import productRomper from '@assets/images/product-romper.jpg';
import './NewArrivals.css';

const products = [
  {
    id: 1,
    image: productDress,
    title: 'Vestido Verão',
    alt: 'Vestido de verão elegante em tons pastéis'
  },
  {
    id: 2,
    image: productShirt,
    title: 'Camisa Linho',
    alt: 'Camisa de linho em tons neutros'
  },
  {
    id: 3,
    image: productRomper,
    title: 'Romper Florido',
    alt: 'Romper florido delicado'
  }
];

const NewArrivals = () => {
  return (
    <section id="novidades" className="new-arrivals">
      <div className="container">
        <h2 className="section-title">Novidades</h2>
        
        <div className="products-grid">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              image={product.image}
              title={product.title}
              alt={product.alt}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;