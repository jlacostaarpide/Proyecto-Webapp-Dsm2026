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
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const loadData = () => {
    // Cargar Ratings
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

    // Cargar Comentarios
    const allComments = JSON.parse(localStorage.getItem('comments') || '{}');
    setComments(allComments[id] || []);
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

      loadData();
    }
  }, [id, peliculas, login, username]);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!login) {
      navigate('/login');
      return;
    }
    if (!newComment.trim()) return;

    const allComments = JSON.parse(localStorage.getItem('comments') || '{}');
    if (!allComments[id]) allComments[id] = [];

    const commentObj = {
      username,
      text: newComment,
      date: new Date().toLocaleDateString()
    };

    allComments[id].push(commentObj);
    localStorage.setItem('comments', JSON.stringify(allComments));
    
    setComments(allComments[id]);
    setNewComment("");
  };

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
    
    loadData();
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
              <h5 className="mb-3 text-warning">Comentarios ({comments.length})</h5>
              
              {login ? (
                <form onSubmit={handleCommentSubmit} className="mb-4">
                  <div className="form-group mb-2">
                    <textarea 
                      className="form-control bg-dark text-white border-secondary" 
                      rows="3" 
                      placeholder="Escribe tu opinión..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                    ></textarea>
                  </div>
                  <Button type="submit" variant="primary" size="sm" className="px-4">Enviar comentario</Button>
                </form>
              ) : (
                <Alert variant="secondary" className="bg-opacity-25 border-secondary text-light">
                  Debes <Link to="/login" className="text-warning">iniciar sesión</Link> para dejar un comentario.
                </Alert>
              )}

              <div className="comments-list">
                {comments.length > 0 ? (
                  comments.slice().reverse().map((c, index) => (
                    <div key={index} className="comment-item p-3 mb-2 rounded-3" style={{ background: '#1c1c1c' }}>
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span className="fw-bold text-info">@{c.username}</span>
                        <span className="text-muted small">{c.date}</span>
                      </div>
                      <p className="mb-0 text-light">{c.text}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-muted italic">Aún no hay comentarios. ¡Sé el primero en opinar!</p>
                )}
              </div>
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
