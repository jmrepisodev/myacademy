import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { useParams, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const apiUrl = process.env.REACT_APP_API_URL;

const Temas = () => {
  const { cursoId } = useParams();
  const [temas, setTemas] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
  
    API.get(`/temas/curso/${cursoId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        console.log('Dashboard data:', res.data); 
        setTemas(res.data);
      })
      .catch(err => {
        console.error(err);
        if (err.response?.status === 401 || err.response?.status === 403) {
          alert('Sesión expirada. Inicia sesión nuevamente.');
        }
      });
  }, [cursoId]);

  if (!temas) return <p>No hay temas disponibles</p>;

  return (
    <div className="container-fluid p-0 min-vh-100 d-flex">
      {/* Sidebar izquierda */}
      <aside className="bg-dark text-white p-0 col-md-2 col-lg-2">
        <Sidebar />
      </aside>
  
      {/* Contenido principal */}
      <main className="col p-4">
        <div className="row g-4">
          {temas.map((tema) => (
            <div className="col-md-4 col-lg-3" key={tema.id}>
              <div className="card h-100 shadow-sm">
                  <img 
                    src={`${apiUrl}/uploads/${tema.image}`}
                    className="card-img-top"
                    alt={tema.name}
                    onError={(e) => {
                      e.target.onerror = null; // evita bucle si la imagen por defecto también falla
                      e.target.src = "/image_not_found.png"; // ruta de imagen por defecto (public/)
                    }}
                  />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{tema.name}</h5>
                  <p className="card-text flex-grow-1">{tema.description}</p>
                  <div className="d-grid gap-2">
                    <Link to={`/temas/${tema.id}/tests`} className="btn btn-primary mt-3">
                      Ver Tests
                    </Link>
                    <a
                      href={`${apiUrl}/uploads/${tema.pdf_url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline-primary"
                    >
                      Ver PDF
                    </a>
                    <Link to={`/temas/${tema.id}/videoclase`} className="btn btn-info text-white">
                      Ver Videoclase
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
  
};

export default Temas;