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
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [hasVoted, setHasVoted] = useState(false);

  const loadRatings = () => {
    const allRatings = JSON.parse(localStorage.getItem('ratings') || '{}');
    const movieRatings = allRatings[id] || {};
    const values = Object.values(movieRatings);
    
    if (login && username && movieRatings[username]) {
      setHasVoted(true);
    } else {
      setHasVoted(false);
    }
    
    if (values.length > 0) {
      const sum = values.reduce((a, b) => a + b, 0);
      setAverageRating(sum / values.length);
      setTotalRatings(values.length);
    } else {
      setAverageRating(0);
      setTotalRatings(0);
    }
  };

  useEffect(() => {
    const foundMovie = peliculas.find((p) => p.id === id);
    if (foundMovie) {
      setMovie(foundMovie);
      
      // Comprobar si ya es favorita si hay sesión
      if (login && username) {
        const favorites = JSON.parse(localStorage.getItem(`favorites_${username}`) || '[]');
        setIsFavorite(favorites.includes(id));
      }

      loadRatings();
    }
  }, [id, peliculas, login, username]);

  const handleVote = (rating) => {
    if (!login) {
      navigate('/login');
      return;
    }

    if (hasVoted) return;

    const allRatings = JSON.parse(localStorage.getItem('ratings') || '{}');
    if (!allRatings[id]) allRatings[id] = {};
    
    allRatings[id][username] = rating;
    localStorage.setItem('ratings', JSON.stringify(allRatings));
    
    loadRatings();
  };

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
            <div className="movie-hero-meta mb-3 d-flex align-items-center flex-wrap">
              <div className="stars-container me-2" onMouseLeave={() => setHoverRating(0)}>
                {[1, 2, 3, 4, 5].map((star) => {
                  const isActive = (hoverRating || averageRating) >= star;
                  return (
                    <span 
                      key={star} 
                      className={`star-ui fs-4 ${isActive ? 'active' : 'text-muted'} ${hasVoted ? 'voted' : ''}`}
                      onMouseEnter={() => !hasVoted && setHoverRating(star)}
                      onClick={() => handleVote(star)}
                      style={{ cursor: hasVoted ? 'default' : 'pointer' }}
                      title={hasVoted ? 'Ya has valorado esta película' : `Puntuar con ${star} estrellas`}
                    >
                      {isActive ? '★' : '☆'}
                    </span>
                  );
                })}
              </div>
              <span className="text-warning fw-bold me-3 fs-5">
                {averageRating > 0 ? averageRating.toFixed(1) : '-'}
              </span>
              <span className="text-light me-3 small">({totalRatings} valoraciones)</span>
              {hasVoted && <Badge bg="success" className="me-2 bg-opacity-75">¡Gracias por tu voto!</Badge>}
              <Badge bg="info" className="me-2">{movie.categoria}</Badge>
              <span className="text-light small">2024</span>
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
                <li className="mb-2"><strong>Calificación:</strong> ⭐ {averageRating > 0 ? averageRating.toFixed(1) : '-'}</li>
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
