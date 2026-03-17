import React, { useState } from 'react';
import { Carousel, Button, ButtonGroup } from 'react-bootstrap';
import { Link } from 'react-router';
import Peliculas from '../components/Peliculas/Peliculas';
import './Home.css';

function Home({ peliculas }) {
  const [categoriaActiva, setCategoriaActiva] = useState('Todas');
  const [searchQuery, setSearchQuery] = useState('');

  // Seleccionamos las 3 primeras películas para el carrusel (independiente del filtro)
  const featuredMovies = peliculas.slice(0, 3);

  // Obtener categorías únicas
  const categorias = ['Todas', ...new Set(peliculas.map(p => p.categoria))];

  // Filtrar películas según categoría activa y texto de búsqueda
  const peliculasFiltradas = peliculas.filter(p => {
    const matchesCategory = categoriaActiva === 'Todas' || p.categoria === categoriaActiva;
    const matchesSearch = p.titulo.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="container-fluid px-0 pb-5">
      <Carousel className="home-carousel" fade>
        {featuredMovies.map((movie) => (
          <Carousel.Item key={movie.id}>
            <img
              className="d-block w-100"
              src={movie.imagen}
              alt={movie.titulo}
            />
            <Carousel.Caption>
              <h3>{movie.titulo}</h3>
              <p>{movie.descripcion.substring(0, 100)}...</p>
              <Link to={`/movie/${movie.id}`} className="btn btn-warning fw-bold px-4 shadow">
                Ver detalles
              </Link>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>

      <div className="container mt-5">
        <div className="catalog-header mb-5 border-bottom pb-4">
          <div className="row align-items-center g-4">
            <div className="col-lg-3">
              <h2 className="text-dark fw-bold mb-0">Catálogo Completo</h2>
            </div>
            <div className="col-lg-4">
              <div className="search-box position-relative shadow-sm">
                <input 
                  type="text" 
                  className="form-control form-control-lg ps-5 border-0 rounded-pill" 
                  placeholder="Buscar película por título..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ background: '#f8f9fa' }}
                />
                <span className="search-icon position-absolute top-50 translate-middle-y ms-3 text-primary">🔍</span>
              </div>
            </div>
            <div className="col-lg-5 d-flex justify-content-lg-end">
              <div className="category-filters d-flex flex-wrap gap-2 justify-content-center justify-content-lg-end">
                {categorias.map(cat => (
                  <Button 
                    key={cat}
                    variant={categoriaActiva === cat ? "primary" : "outline-primary"}
                    onClick={() => setCategoriaActiva(cat)}
                    className="rounded-pill px-4 shadow-sm"
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {peliculasFiltradas.length > 0 ? (
          <Peliculas peliculas={peliculasFiltradas} />
        ) : (
          <div className="text-center py-5 shadow-sm rounded-4 bg-light">
            <h1 className="display-1 mb-4">🎬</h1>
            <h3 className="text-muted">No se han encontrado resultados</h3>
            <p className="text-secondary lead">Prueba con otra categoría o nombre de película.</p>
            <Button variant="outline-primary" onClick={() => { setCategoriaActiva('Todas'); setSearchQuery(''); }}>
              Mostrar todo el catálogo
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
