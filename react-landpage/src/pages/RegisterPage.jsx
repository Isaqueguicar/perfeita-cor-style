import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './RegisterPage.css'; 

const RegisterPage = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [temWhatsapp, setTemWhatsapp] = useState(false);
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (senha !== confirmarSenha) {
      setError('As senhas não coincidem.');
      return;
    }
    if (senha.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/auth/register/cliente', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome,
          email,
          telefone,
          temWhatsapp,
          senha,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null); 
        throw new Error(errorData?.message || 'Falha ao registrar. Verifique os dados.');
      }

      setSuccessMessage('Cadastro realizado com sucesso! Você já pode fazer login.');
      setNome('');
      setEmail('');
      setTelefone('');
      setTemWhatsapp(false);
      setSenha('');
      setConfirmarSenha('');

      setTimeout(() => {
        navigate('/login'); 
      }, 3000); 

    } catch (err) {
      setError(err.message || 'Ocorreu um erro inesperado.');
      console.error(err);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <h1>Crie sua Conta</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nome">Nome Completo</label>
            <input
              type="text"
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              placeholder="Seu nome completo"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="seu.email@exemplo.com"
            />
          </div>
          <div className="form-group">
            <label htmlFor="telefone">Telefone</label>
            <input
              type="tel"
              id="telefone"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              required
              placeholder="(00) 90000-0000"
            />
          </div>
          <div className="form-group checkbox-group">
            <input
              type="checkbox"
              id="temWhatsapp"
              checked={temWhatsapp}
              onChange={(e) => setTemWhatsapp(e.target.checked)}
            />
            <label htmlFor="temWhatsapp">Este número tem WhatsApp</label>
          </div>
          <div className="form-group">
            <label htmlFor="senha">Senha</label>
            <input
              type="password"
              id="senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              placeholder="Mínimo 6 caracteres"
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmarSenha">Confirmar Senha</label>
            <input
              type="password"
              id="confirmarSenha"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              required
              placeholder="Repita a senha"
            />
          </div>
          
          {error && <p className="error-message">{error}</p>}
          {successMessage && <p className="success-message">{successMessage}</p>}

          <button type="submit" className="register-button">Cadastrar</button>
        </form>
        <p className="login-link">
          Já tem uma conta? <Link to="/login">Faça login</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;