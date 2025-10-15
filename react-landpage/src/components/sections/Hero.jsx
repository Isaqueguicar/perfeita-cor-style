import React from 'react';
import heroImage from '@assets/images/hero-fashion.jpg';
import './Hero.css';

const Hero = () => {
  const scrollToNewArrivals = () => {
    const element = document.getElementById('novidades');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="hero">
      <div className="container">
        <div className="hero-content">
          <div className="hero-text animate-fade-in">
            <h1 className="hero-title">
              Vista a sua melhor versão
            </h1>
            <p className="hero-description">
              Descubra a coleção que celebra sua essência.
            </p>
            <button 
              className="hero-button"
              onClick={scrollToNewArrivals}
            >
              Explorar Coleção
            </button>
          </div>

          <div className="hero-image animate-fade-in">
            <img 
              src={heroImage}
              alt="Modelo vestindo roupas elegantes da Perfeita Cor" 
              loading="eager"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;