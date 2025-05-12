import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaClock,
  FaLaptop,
  FaCalendarAlt,
  FaCertificate,
  FaEuroSign
} from 'react-icons/fa';

const apiUrl = process.env.REACT_APP_API_URL;

const Courses = () => {
  const [cursos, setCursos] = useState([]);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetch(`${apiUrl}/api/cursos`)
      .then(res => res.json())
      .then(data => {
        setCursos(data.cursos);
        setMessage({ text: '', type: '' });
      })
      .catch(error => {
        console.error('Error al cargar cursos:', error);
        setMessage({ text: 'Error al cargar cursos.', type: 'danger' });
      });
  }, []);

  return (
    <section className="container py-5">
      <h1 className="mb-4 fs-2 text-center text-primary fw-bold">Catálogo de Cursos</h1>

      {message.text && (
        <div className={`alert alert-${message.type} alert-dismissible fade show`} role="alert">
          {message.text}
          <button type="button" className="btn-close" onClick={() => setMessage({ text: '', type: '' })}></button>
        </div>
      )}

      <div className="row g-4">
        {cursos.length > 0 ? (
          cursos.map((curso) => (
            <div key={curso.id} className="col-md-6 col-lg-4">
              <div className="card h-100 shadow-sm border-0">
                <img
                  src={`${apiUrl}/uploads/${curso.image}`}
                  className="card-img-top"
                  alt={curso.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/image_not_found.png';
                  }}
                  style={{ height: '180px', objectFit: 'cover' }}
                />

                <div className="card-body d-flex flex-column">
                  <h5 className="card-title text-dark fw-semibold">{curso.name}</h5>
                  <p className="card-text text-muted small">{curso.description?.slice(0, 100)}...</p>

                  <ul className="list-unstyled small mb-3">
                    <li><FaLaptop className="me-2 text-secondary" /> Modalidad: <strong>{curso.modalidad}</strong></li>
                    <li><FaClock className="me-2 text-secondary" /> Duración: <strong>{curso.duracion || '—'}</strong></li>
                    <li><FaCalendarAlt className="me-2 text-secondary" /> Inicio: {curso.fecha_inicio ? new Date(curso.fecha_inicio).toLocaleDateString() : '—'}</li>
                    <li><FaCalendarAlt className="me-2 text-secondary" /> Fin: {curso.fecha_fin ? new Date(curso.fecha_fin).toLocaleDateString() : '—'}</li>
                    <li><FaEuroSign className="me-2 text-secondary" /> Precio: <strong>{curso.precio} €</strong></li>
                    {Boolean(curso.certificado_disponible) && (
                      <li className="text-success">
                        <FaCertificate className="me-2" /> Certificado incluido
                      </li>
                    )}
                  </ul>

                  <Link to={`/curso/${curso.id}`} className="btn btn-outline-primary mt-auto w-100">
                    Ver Detalles
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center">No hay cursos disponibles en este momento.</p>
        )}
      </div>
    </section>
  );
};

export default Courses;
