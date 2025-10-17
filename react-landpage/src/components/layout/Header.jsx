import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import '../layout/Header.css';

const Header = ({ onLoginClick }) => { 
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, userRole, logout } = useAuth();

  const hideAuthButtons = location.pathname === '/login' || location.pathname === '/register';

  const handleAccountClick = () => {
    if (isAuthenticated) {
      if (userRole === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/minhas-reservas');
      }
    } else {
      onLoginClick();
    }
  };

  const handleCartClick = () => {
    if (isAuthenticated) {
      navigate('/minhas-reservas');
    } else {
      onLoginClick();
    }
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="header-logo" onClick={() => navigate('/')} style={{cursor: 'pointer'}}>
            <h1>Perfeita Cor</h1>
          </div>

          <nav className="header-nav">
            <button onClick={() => navigate('/')} className="nav-link">
              Novidades
            </button>
            
            {isAuthenticated ? (
              <>
                <button onClick={handleAccountClick} className="nav-link">
                  Minha Conta
                </button>
                <button onClick={logout} className="nav-link nav-link-logout">
                  Sair
                </button>
              </>
            ) : (
              !hideAuthButtons && (
                <button onClick={onLoginClick} className="nav-link">
                  Entrar
                </button>
              )
            )}
          </nav>

          <button 
            className="cart-button" 
            aria-label="Minhas Reservas"
            onClick={handleCartClick}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

