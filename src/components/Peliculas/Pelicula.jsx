import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router';

function Pelicula({ id, titulo, imagen, descripcion, categoria, nota }) {
  return (
    <Card className="h-100 shadow-sm">
      <Card.Img variant="top" src={imagen} alt={titulo} style={{ height: '450px', objectFit: 'cover' }} />
      <Card.Body className="d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <Card.Title className="mb-0">{titulo}</Card.Title>
          <div className="d-flex flex-column align-items-end gap-1">
            <Badge bg="warning" text="dark">⭐ -</Badge>
            <Badge bg="secondary" className="bg-opacity-75">💬 -</Badge>
          </div>
        </div>
        <Badge bg="info" className="mb-3 w-fit-content" style={{ alignSelf: 'start' }}>{categoria}</Badge>
        <Card.Text className="text-muted small">
          {descripcion.length > 150 ? descripcion.substring(0, 150) + "..." : descripcion}
        </Card.Text>
        <Link to={`/movie/${id}`} className="btn btn-primary mt-auto">
          Ver detalles
        </Link>
      </Card.Body>
    </Card>
  );
}

export default Pelicula;
