import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const apiUrl = process.env.REACT_APP_API_URL;

const Blog = () => {
  const [entradas, setEntradas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensajeError, setMensajeError] = useState('');

  useEffect(() => {
    fetch(`${apiUrl}/api/blog`)
      .then(res => res.json())
      .then(data => {
        setEntradas(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error al cargar entradas de blog:', err);
        setMensajeError('No se pudieron cargar las novedades.');
        setLoading(false);
      });
  }, []);

  return (
    <div className="container py-5">
      <h1 className="mb-4 text-primary">Últimas Novedades</h1>

      {loading && <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Cargando...</span></div>}

      {mensajeError && <div className="alert alert-danger">{mensajeError}</div>}

      <div className="row g-4">
        {entradas.map((post) => (
          <div className="col-md-6 col-lg-4" key={post.id}>
            <div className="card h-100 shadow-sm">
              <img
                src={`${apiUrl}/uploads/${post.image || 'default_blog.jpg'}`}
                className="card-img-top"
                alt={post.titulo}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/image_not_found.png";
                }}
              />
              <div className="card-body">
                <h5 className="card-title">{post.titulo}</h5>
                <p className="card-text">{post.contenido.slice(0, 120)}...</p>
                <Link to={`/blog/${post.id}`} className="btn btn-outline-primary btn-sm mt-3">Leer más</Link>
              </div>
              <div className="card-footer text-muted small">
                Publicado el {new Date(post.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blog;
