import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaCalendarAlt,
  FaCheckCircle,
  FaBookOpen,
  FaClock,
  FaLaptop,
  FaCertificate
} from 'react-icons/fa';

const apiUrl = process.env.REACT_APP_API_URL;

const CursoCard = ({ curso }) => {
  const {
    id,
    name,
    description,
    status = 'activo',
    progreso = 0,
    progreso_max = 100,
    fecha_inicio,
    fecha_fin,
    duracion,
    modalidad,
    certificado_disponible,
    image
  } = curso;

  // Mapeo de estado real de la BD a un texto visible
  const estadoTexto = {
    activo: 'En progreso',
    inactivo: 'No disponible',
    finalizado: 'Finalizado'
  };

  const estadoColor = {
    'En progreso': 'text-warning',
    'Finalizado': 'text-success',
    'No disponible': 'text-muted'
  };

  const estadoLegible = estadoTexto[status] || 'Sin estado';

  const progresoPorcentaje = Math.min(Math.round((progreso / progreso_max) * 100), 100);

  return (
    <div className="card shadow-sm h-100" style={{ width: '22rem' }}>
      <img
        src={`${apiUrl}/uploads/${image}`}
        className="card-img-top"
        alt={name}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = '/image_not_found.png';
        }}
        style={{ height: '160px', objectFit: 'cover' }}
        loading="lazy"
      />

      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{name}</h5>
        <p className="card-text text-muted small">{description?.slice(0, 100)}...</p>

        {/* Estado del curso */}
        <div className="mb-2">
          <span className={`fw-medium ${estadoColor[estadoLegible] || 'text-secondary'}`}>
            <FaCheckCircle className="me-1" />
            {estadoLegible}
          </span>
        </div>

        {/* Barra de progreso */}
        <div className="mb-2">
          <div className="progress" style={{ height: '8px' }}>
            <div
              className="progress-bar bg-primary"
              role="progressbar"
              style={{ width: `${progresoPorcentaje}%` }}
              aria-valuenow={progresoPorcentaje}
              aria-valuemin="0"
              aria-valuemax="100"
            />
          </div>
          <small className="text-muted">{progresoPorcentaje}% completado</small>
        </div>

        {/* Información adicional */}
        <div className="text-muted small mb-2">
          <p className="mb-1">
            <FaCalendarAlt className="me-1" />
            Inicio: {fecha_inicio ? new Date(fecha_inicio).toLocaleDateString() : '—'}
          </p>
          <p className="mb-1">
            <FaCalendarAlt className="me-1" />
            Fin: {fecha_fin ? new Date(fecha_fin).toLocaleDateString() : '—'}
          </p>
          <p className="mb-1">
            <FaClock className="me-1" />
            Duración: {duracion || 'N/A'}
          </p>
          <p className="mb-1">
            <FaLaptop className="me-1" />
            Modalidad: {modalidad}
          </p>
          {certificado_disponible && (
            <p className="mb-0 text-success">
              <FaCertificate className="me-1" />
              Certificado disponible
            </p>
          )}
        </div>

        {/* Botón para ver el curso */}
        <Link to={`/cursos/${id}/temas`} className="btn btn-outline-primary mt-auto w-100">
          <FaBookOpen className="me-2" />
          Ver curso
        </Link>
      </div>
    </div>
  );
};

export default CursoCard;
