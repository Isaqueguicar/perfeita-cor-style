import React from 'react';
import './Header.css';

const navigation = [
  { id: 'novidades', label: 'Novidades' },
  { id: 'casual', label: 'Casual' },
  { id: 'elegante', label: 'Elegante' }
];

const Header = () => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="header-logo">
            <h1>Perfeita Cor</h1>
          </div>

          <nav className="header-nav">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="nav-link"
              >
                {item.label}
              </button>
            ))}
          </nav>

          <button className="cart-button" aria-label="Carrinho de compras">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 2L7 7H21L19 2H9Z"/>
              <path d="M7 7L5 17H19L21 7"/>
              <circle cx="9" cy="20" r="1"/>
              <circle cx="17" cy="20" r="1"/>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;