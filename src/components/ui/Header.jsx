import React, { useContext } from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { NavLink, Link, useNavigate } from 'react-router';
import AuthContext from '../../store/AuthContext';

function Header() {
  const { login, username, onLogout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    onLogout();
    navigate('/');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top" className="shadow-sm py-3 header-custom">
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center fw-bold fs-3 text-warning">
          <span className="me-2">🎬</span> CineApp DSM
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            <Nav.Link as={Link} to="/" className="mx-2">Inicio</Nav.Link>
            
            {login ? (
              <div className="d-flex align-items-center ms-lg-3">
                <Nav.Link as={Link} to="/favorites" className="mx-2 text-warning fw-bold">⭐ Mis Favoritos</Nav.Link>
                <span className="text-light me-3 fw-medium">Hola, <span className="text-warning">{username}</span></span>
                <Button 
                  variant="outline-danger" 
                  size="sm" 
                  className="rounded-circle shadow-sm p-2 d-flex align-items-center"
                  onClick={handleLogoutClick}
                  title="Cerrar sesión"
                >
                  🚪
                </Button>
              </div>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className="mx-2">Login</Nav.Link>
                <Nav.Link as={Link} to="/register" className="mx-2 border border-primary rounded-pill px-3">Registro</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
