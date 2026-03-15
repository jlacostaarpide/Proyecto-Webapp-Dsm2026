import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router';
import './Register.css';

function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validaciones básicas
    if (formData.password !== formData.confirmPassword) {
      return setError('Las contraseñas no coinciden');
    }

    if (formData.password.length < 6) {
      return setError('La contraseña debe tener al menos 6 caracteres');
    }

    setLoading(true);

    // Simular retraso de red
    setTimeout(() => {
      // 1. Obtener lista de usuarios actual o crear una nueva
      const users = JSON.parse(localStorage.getItem('users') || '[]');

      // 2. Verificar si el email ya está registrado
      const userExists = users.some(u => u.email === formData.email);

      if (userExists) {
        setError('Este correo electrónico ya está registrado.');
        setLoading(false);
        return;
      }

      // 3. Añadir nuevo usuario
      const newUser = {
        email: formData.email,
        password: formData.password // Nota: En producción nunca guardar de forma plana
      };
      
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));

      setLoading(false);
      setSuccess(true);
      setFormData({ email: '', password: '', confirmPassword: '' });
    }, 1500);
  };

  if (success) {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6 text-center">
            <div className="card shadow-lg p-5 register-card border-success">
              <h2 className="text-success mb-4">🎉 ¡Cuenta Creada!</h2>
              <p className="lead">Tu registro se ha completado con éxito.</p>
              <p className="text-muted">Ahora puedes iniciar sesión para disfrutar de CineApp DSM.</p>
              <Link to="/login" className="btn btn-primary mt-4 px-5 rounded-pill shadow">
                Ir al Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5 mb-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-lg p-4 register-card border-0">
            <h2 className="text-center mb-4 text-primary fw-bold">📝 Crear Cuenta</h2>
            <p className="text-center text-muted mb-4">Regístrate para guardar tus favoritos y puntuar películas.</p>
            
            {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label className="fw-bold small">Correo Electrónico</Form.Label>
                <Form.Control 
                  type="email" 
                  name="email"
                  placeholder="ejemplo@correo.com" 
                  className="rounded-pill px-3 py-2"
                  value={formData.email}
                  onChange={handleChange}
                  required 
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label className="fw-bold small">Contraseña</Form.Label>
                <Form.Control 
                  type="password" 
                  name="password"
                  placeholder="Mínimo 6 caracteres" 
                  className="rounded-pill px-3 py-2"
                  value={formData.password}
                  onChange={handleChange}
                  required 
                />
              </Form.Group>

              <Form.Group className="mb-4" controlId="formConfirmPassword">
                <Form.Label className="fw-bold small">Confirmar Contraseña</Form.Label>
                <Form.Control 
                  type="password" 
                  name="confirmPassword"
                  placeholder="Repite tu contraseña" 
                  className="rounded-pill px-3 py-2"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required 
                />
              </Form.Group>

              <div className="d-grid gap-2">
                <Button 
                  variant="primary" 
                  type="submit" 
                  className="rounded-pill py-2 fw-bold shadow-sm"
                  disabled={loading}
                >
                  {loading ? 'Creando cuenta...' : 'Registrarse'}
                </Button>
              </div>
            </Form>

            <div className="text-center mt-4 border-top pt-3">
              <p className="small text-muted">¿Ya tienes cuenta? <a href="/login" className="text-primary text-decoration-none fw-bold">Inicia Sesión</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
