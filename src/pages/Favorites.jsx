import React, { useContext, useEffect, useState } from 'react';
import { Container, Alert, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import AuthContext from '../store/AuthContext';
import Peliculas from '../components/Peliculas/Peliculas';

function Favorites({ peliculas }) {
  const { login, username } = useContext(AuthContext);
  const [favoritePeliculas, setFavoritePeliculas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!login) {
      navigate('/login');
      return;
    }

    const storageKey = `favorites_${username}`;
    const favoriteIds = JSON.parse(localStorage.getItem(storageKey) || '[]');
    
    const filtered = peliculas.filter(p => favoriteIds.includes(p.id));
    setFavoritePeliculas(filtered);
  }, [login, username, peliculas, navigate]);

  if (!login) return null;

  return (
    <Container className="mt-5 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-primary">⭐ Mis Favoritos</h2>
          <p className="text-muted">Aquí tienes la lista de las películas que más te han gustado, {username}.</p>
        </div>
        <Button variant="outline-primary" onClick={() => navigate('/')} className="rounded-pill px-4">
          Explorar más
        </Button>
      </div>

      {favoritePeliculas.length > 0 ? (
        <Peliculas peliculas={favoritePeliculas} />
      ) : (
        <Alert variant="info" className="text-center py-5 shadow-sm border-0 rounded-4">
          <div className="fs-1 mb-3">🎬</div>
          <h4>Aún no tienes favoritos</h4>
          <p>Explora nuestro catálogo y pulsa en la estrella de las pelis que quieras guardar.</p>
          <Button variant="primary" onClick={() => navigate('/')} className="mt-3 rounded-pill px-4">
            Ir al catálogo
          </Button>
        </Alert>
      )}
    </Container>
  );
}

export default Favorites;
