import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Container, Button, Badge, Row, Col } from 'react-bootstrap';
import AuthContext from '../store/AuthContext';
import './MovieDetail.css';

function MovieDetail({ peliculas }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { login, username } = useContext(AuthContext);
  const [movie, setMovie] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const foundMovie = peliculas.find((p) => p.id === id);
    if (foundMovie) {
      setMovie(foundMovie);
      
      // Comprobar si ya es favorita si hay sesión
      if (login && username) {
        const favorites = JSON.parse(localStorage.getItem(`favorites_${username}`) || '[]');
        setIsFavorite(favorites.includes(id));
      }
    }
  }, [id, peliculas, login, username]);

  const toggleFavorite = () => {
    if (!login) {
      navigate('/login');
      return;
    }

    const storageKey = `favorites_${username}`;
    let favorites = JSON.parse(localStorage.getItem(storageKey) || '[]');

    if (isFavorite) {
      // Quitar de favoritos
      favorites = favorites.filter(favId => favId !== id);
    } else {
      // Añadir a favoritos
      favorites.push(id);
    }

    localStorage.setItem(storageKey, JSON.stringify(favorites));
    setIsFavorite(!isFavorite);
  };

  if (!movie) {
    return (
      <Container className="mt-5 text-center">
        <h3>Cargando película...</h3>
        <Button variant="primary" onClick={() => navigate('/')}>Volver al inicio</Button>
      </Container>
    );
  }

  return (
    <div className="movie-detail-wrapper">
      {/* Hero Section */}
      <div 
        className="movie-hero" 
        style={{ backgroundImage: `url(${movie.imagen})` }}
      >
        <div className="hero-overlay">
          <Container className="hero-content">
            <h1 className="movie-hero-title">{movie.titulo}</h1>
            <div className="movie-hero-meta mb-3">
              <Badge bg="warning" text="dark" className="me-2">⭐ -</Badge>
              <Badge bg="info" className="me-2">{movie.categoria}</Badge>
              <span className="text-light">2024</span>
            </div>
            <div className="hero-buttons mb-4">
              <Button variant="light" className="me-2 px-4 py-2 fw-bold">
                ▶ Reproducir
              </Button>
              <Button 
                variant={isFavorite ? "warning" : "secondary"} 
                className={`px-4 py-2 fw-bold ${!isFavorite ? 'bg-opacity-50' : ''} border-0`}
                onClick={toggleFavorite}
              >
                {isFavorite ? '❤️ En favoritos' : '⭐ Añadir a favoritos'}
              </Button>
            </div>
            <p className="movie-hero-description">
              {movie.descripcion}
            </p>
          </Container>
        </div>
      </div>

      {/* Additional Info Section */}
      <Container className="py-5">
        <Row>
          <Col md={8}>
            <h3>Sinopsis completa</h3>
            <p className="lead text-light">{movie.descripcion}</p>
            <hr className="bg-secondary" />
            <div className="mt-4">
              <h5>Comentarios</h5>
              <p className="text-muted italic">Próximamente: Implementación de comentarios de usuarios.</p>
            </div>
          </Col>
          <Col md={4} className="ps-md-5">
            <div className="movie-detail-sidebar">
              <h5>Detalles</h5>
              <ul className="list-unstyled text-secondary">
                <li className="mb-2"><strong>Género:</strong> {movie.categoria}</li>
                <li className="mb-2"><strong>Calificación:</strong> ⭐ -</li>
                <li className="mb-2"><strong>Año:</strong> 2024</li>
                <li className="mb-2"><strong>Duración:</strong> 2h 15m (Aprox)</li>
              </ul>
              <Button 
                variant="outline-secondary" 
                className="w-100 mt-3"
                onClick={() => navigate(-1)}
              >
                ← Volver atrás
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default MovieDetail;
