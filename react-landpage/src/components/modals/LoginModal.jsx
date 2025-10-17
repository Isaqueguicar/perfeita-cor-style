import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import './LoginModal.css';

const LoginModal = ({ isOpen, onClose }) => {
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const auth = useAuth();
  const navigate = useNavigate();

  const handleBackdropClick = (e) => {
    if (e.target.id === 'login-modal-backdrop') {
      onClose();
    }
  };

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
    }
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      setLogin('');
      setSenha('');
      setError('');
    }
  }, [isOpen]);


  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, senha }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null); 
        throw new Error(errorData?.message || 'Credenciais inválidas');
      }

      const data = await response.json();
      auth.login(data.token); 
      onClose();
      
    } catch (err) {
      setError(err.message || 'Falha no login. Verifique seu e-mail e senha.');
      console.error(err);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div id="login-modal-backdrop" className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="login-modal-content">
        <button className="modal-close-btn" onClick={onClose}>&times;</button>
        <h1>Entrar</h1>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="login-email">E-mail</label>
            <input
              type="email"
              id="login-email"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="login-senha">Senha</label>
            <input
              type="password"
              id="login-senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="login-button">Entrar</button>
        </form>
        <p className="register-link">
          Não tem uma conta? <Link to="/register" onClick={onClose}>Cadastre-se</Link> 
        </p>
      </div>
    </div>
  );
};

export default LoginModal;