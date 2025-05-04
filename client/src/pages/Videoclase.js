// src/pages/Videoclase.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../services/api';

const apiUrl = process.env.REACT_APP_API_URL;

function Videoclase() {
  const { temaId } = useParams();
  const [videoclase, setVideoclase] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideoclase = async () => {
      try {
        const res = await API.get(`/videoclases/tema/${temaId}`);
        setVideoclase(res.data);
        setError(null);
      } catch (err) {
        console.error('Error cargando videoclase:', err);
        setError('No se pudo cargar la videoclase.');
      }
    };

    fetchVideoclase();
  }, [temaId]);

  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!videoclase) return <div className="text-center my-5">Cargando videoclase...</div>;

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <h1 className="mb-3">{videoclase.name}</h1>
          <p className="text-muted">
            {videoclase.description}
          </p>

          {videoclase.image && (
            
            <img
              src={`${apiUrl}/uploads/${videoclase.image}`}
              alt={videoclase.name}
              className="img-fluid rounded mb-4"
              loading="lazy"
              onError={(e) => {
                e.target.onerror = null; // evita bucle si la imagen por defecto también falla
                e.target.src = "/image_not_found.png"; // ruta de imagen por defecto (public/)
              }}
            />
          )}

          <div className="card shadow-sm mb-4">
            <div className="ratio ratio-16x9">
              <video
                controls
                width="100%"
                preload="metadata"
                crossOrigin="anonymous"
              >
                <source src={`${apiUrl}/uploads/${videoclase.video_url}`} type="video/mp4" />
                Tu navegador no soporta la reproducción de video.
              </video>
            </div>
          </div>

          {/* Material adicional si existe */}
          {videoclase.material_url && (
            <div className="alert alert-info d-flex align-items-center" role="alert">
              <div>
                <strong>Material complementario disponible: </strong>
                <a href={videoclase.material_url} target="_blank" rel="noopener noreferrer">
                  Descargar PDF
                </a>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default Videoclase;
