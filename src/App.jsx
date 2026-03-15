import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router';
import './App.css';
import Header from './components/ui/Header';
import Footer from './components/ui/Footer';
import Home from './pages/Home';
import Contact from './pages/Contact';
import LegalNotice from './pages/LegalNotice';
import MovieDetail from './pages/MovieDetail';
import ErrorPage from './pages/ErrorPage';
import AuthContext from './store/AuthContext';
import Register from './pages/Register';
import Login from './pages/Login';
import Favorites from './pages/Favorites';

const PELICULAS_MOCK = [
  {
    id: '1',
    titulo: 'El Caballero Oscuro',
    categoria: 'Acción',
    nota: 4.8,
    descripcion: 'Con la ayuda del teniente Jim Gordon y del nuevo y comprometido Fiscal del Distrito, Harvey Dent, Batman se propone destruir para siempre el crimen organizado en Gotham City.',
    imagen: 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg'
  },
  {
    id: '2',
    titulo: 'Inception',
    categoria: 'Ciencia Ficción',
    nota: 4.7,
    descripcion: 'Dom Cobb es un ladrón hábil, el mejor de todos en el peligroso arte de la extracción: robar valiosos secretos de lo profundo del subconsciente durante el estado de sueño.',
    imagen: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg'
  },
  {
    id: '3',
    titulo: 'Cadena Perpetua',
    categoria: 'Drama',
    nota: 4.9,
    descripcion: 'Acusado del asesinato de su mujer, el banquero de éxito Andy Dufresne es condenado a cadena perpetua en la prisión de Shawshank.',
    imagen: 'https://upload.wikimedia.org/wikipedia/en/8/81/ShawshankRedemptionMoviePoster.jpg'
  },
  {
    id: '4',
    titulo: 'Interstellar',
    categoria: 'Ciencia Ficción',
    nota: 4.6,
    descripcion: 'Al ver que la vida en la Tierra está llegando a su fin, un grupo de exploradores liderados por el piloto Cooper y la científica Amelia emprenden una misión que puede ser la más importante de la historia de la humanidad.',
    imagen: 'https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg'
  },
  {
    id: '5',
    titulo: 'Dune: Parte Dos',
    categoria: 'Ciencia Ficción',
    nota: 4.5,
    descripcion: 'Paul Atreides se une a Chani y a los Fremen mientras planea la venganza contra los conspiradores que destruyeron a su familia.',
    imagen: 'https://m.media-amazon.com/images/M/MV5BNThiOTM4NTAtMDczNy00YzlkLWJhNTEtZTZhNDVmYzlkZWI0XkEyXkFqcGdeQXVyMTEyMjM2NDc2._V1_.jpg'
  },
  {
    id: '6',
    titulo: 'Parásitos',
    categoria: 'Suspense',
    nota: 4.8,
    descripcion: 'Toda la familia de Ki-taek está en el paro. Su hijo mayor, Ki-woo, empieza a dar clases particulares en casa de Park, un empresario adinerado.',
    imagen: 'https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_.jpg'
  },
  {
    id: '7',
    titulo: 'Gladiator',
    categoria: 'Acción',
    nota: 4.7,
    descripcion: 'En el año 180, el Imperio Romano domina todo el mundo conocido. Tras una gran victoria, el anciano emperador Marco Aurelio decide transferir el poder a Máximo, bravo general de sus ejércitos.',
    imagen: 'https://m.media-amazon.com/images/I/91sdz07c9FL._AC_UF1000,1000_QL80_.jpg'
  },
  {
    id: '8',
    titulo: 'Del Revés 2 (Inside Out 2)',
    categoria: 'Animación',
    nota: 4.4,
    descripcion: 'Las voces de la Central se ven sorprendidas ante la llegada de Riley al campamento de hockey. Alegría, Tristeza, Ira, Miedo y Asco llevan mucho tiempo al mando, pero no saben cómo reaccionar cuando aparecen nuevas emociones.',
    imagen: 'https://upload.wikimedia.org/wikipedia/en/f/f7/Inside_Out_2_poster.jpg'
  }
];

function App() {
  const [login, setLogin] = useState(false);
  const [username, setUsername] = useState('');
  const [idToken, setIdToken] = useState('');
  const [peliculas, setPeliculas] = useState(PELICULAS_MOCK);

  // Cargar sesión al iniciar la aplicación
  useEffect(() => {
    const savedUsername = localStorage.getItem('username');
    const savedToken = localStorage.getItem('idToken');
    
    if (savedUsername && savedToken) {
      setLogin(true);
      setUsername(savedUsername);
      setIdToken(savedToken);
    }
  }, []);

  const handleLogin = (userData) => {
    const name = userData.email.split('@')[0];
    const token = 'token-falso-123';
    
    setLogin(true);
    setUsername(name);
    setIdToken(token);
    
    // Guardar en localStorage
    localStorage.setItem('username', name);
    localStorage.setItem('idToken', token);
  };

  const handleLogout = () => {
    setLogin(false);
    setUsername('');
    setIdToken('');
    
    // Limpiar localStorage
    localStorage.removeItem('username');
    localStorage.removeItem('idToken');
  };

  return (
    <AuthContext.Provider value={{ login, username, idToken, language: 'es-ES', onLogout: handleLogout }}>
      <Header />
      <main className="main-container">
        <Routes>
          <Route path="/" element={<Home peliculas={peliculas} />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/legal" element={<LegalNotice />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/movie/:id" element={<MovieDetail peliculas={peliculas} />} />
          
          <Route path="/favorites" element={<Favorites peliculas={peliculas} />} />
          
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </main>
      <Footer />
    </AuthContext.Provider>
  );
}

export default App;
