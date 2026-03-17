import React from 'react';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router';

function Footer() {
  return (
    <footer className="bg-dark text-white mt-auto py-3">
      <Container className="text-center">
        <p className="mb-1">© 2026 CineApp DSM - Proyecto Académico - Yoel Agirretxe y Juan Lacosta</p>
        <div className="small">
          <Link to="/legal" className="text-secondary text-decoration-none mx-2">Aviso Legal</Link>
          <span className="text-secondary">|</span>
          <Link to="/contact" className="text-secondary text-decoration-none mx-2">Contacto</Link>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
