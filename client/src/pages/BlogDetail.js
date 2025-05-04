import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const apiUrl = process.env.REACT_APP_API_URL;

const BlogDetail = () => {
  const { id } = useParams();
  const [entrada, setEntrada] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mensajeError, setMensajeError] = useState('');

  useEffect(() => {
    // Cargar la entrada del blog
    fetch(`${apiUrl}/api/blog/${id}`)
      .then(res => res.json())
      .then(data => {
        setEntrada(data);
        setLoading(false);  
        
      })
      .catch(err => {
        console.error('Error al cargar detalle del blog:', err);
        setMensajeError('No se pudo cargar la entrada del blog.');
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="container py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (mensajeError) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">{mensajeError}</div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h1 className="mb-4">{entrada.titulo}</h1>
      
      {entrada.image && (
        <img
          src={`${apiUrl}/uploads/${entrada.image}`}
          className="img-fluid mb-4"
          alt={entrada.titulo}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/image_not_found.png"; // imagen por defecto
          }}
        />
      )}

      <p className="text-muted small">Publicado el {new Date(entrada.created_at).toLocaleDateString()}</p>
      
      <p className="text-muted small">
          <strong>Autor:</strong> {entrada.autor}
        </p>
      <div className="content">
        <p>{entrada.contenido}</p>
      </div>

      <div className="mt-5">
        <a href="/blog" className="btn btn-outline-secondary">Volver al blog</a>
      </div>
    </div>
  );
};

export default BlogDetail;
