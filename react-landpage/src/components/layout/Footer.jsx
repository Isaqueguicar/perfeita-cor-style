import React from 'react';
import './Footer.css';

const footerLinks = {
  left: [
    { label: 'Sobre Nós', href: '#sobre' },
    { label: 'Atendimento', href: '#atendimento' }
  ],
  right: [
    { label: 'Redes Sociais', href: '#redes' },
    { label: 'Política de Privacidade', href: '#privacidade' }
  ]
};

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <nav className="footer-links footer-links-left">
            {footerLinks.left.map((link) => (
              <a 
                key={link.label}
                href={link.href}
                className="footer-link"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="footer-brand">
            <h2>Perfeita Cor</h2>
          </div>

          <nav className="footer-links footer-links-right">
            {footerLinks.right.map((link) => (
              <a 
                key={link.label}
                href={link.href}
                className="footer-link"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            &copy; {currentYear} Perfeita Cor. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;