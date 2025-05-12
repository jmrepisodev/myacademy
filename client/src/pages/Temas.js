import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { useParams, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import 'bootstrap-icons/font/bootstrap-icons.css';

const apiUrl = process.env.REACT_APP_API_URL;

const Temas = () => {
  const { cursoId } = useParams();
  const [temas, setTemas] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    API.get(`/temas/curso/${cursoId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        console.log(res.data)
        setTemas(res.data);
        setError(null);
      })
      .catch(err => {
        console.error(err);
        setError('Error al cargar los temas');
      });
  }, [cursoId]);

  const marcarComoCompletado = async (temaId) => {
    const token = localStorage.getItem('token');
    try {
      await API.put(`/temas/${temaId}/completar`, null, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Actualiza estado local después de marcar
      setTemas((prevTemas) =>
        prevTemas.map((tema) =>
          tema.id === temaId ? { ...tema, completado: true } : tema
        )
      );
    } catch (err) {
      console.error('Error al marcar como completado:', err);
      setError('Error al marcar el tema como completado');
    }
  };

  const temasCompletados = temas.filter((tema) => tema.completado).length;
  const progresoPorcentaje = temas.length > 0 ? Math.round((temasCompletados / temas.length) * 100) : 0;

  if (error) {
    return (
      <div className="alert alert-danger text-center m-3" role="alert">
        {error}
      </div>
    );
  }

  if (!temas || temas.length === 0) {
    return (
      <div className="container-fluid min-vh-100 d-flex p-0">
        {/* Sidebar */}
        <aside className="col-md-2 bg-dark text-white p-0">
          <Sidebar />
        </aside>
        <main>
            <div className="container text-center m-3">
              <h5 className="text-muted my-5">No hay temas disponibles para este curso.</h5>
            </div>
        </main>
      </div>
      
    );
  }

  return (
    <div className="container-fluid min-vh-100 d-flex p-0">
      {/* Sidebar */}
      <aside className="col-md-2 bg-dark text-white p-0">
        <Sidebar />
      </aside>

      {/* Main content */}
      <main className="col-md-10 p-4 bg-light">
          <div className='container'>
               <div className="mb-4">
                  <h2 className="fw-bold text-primary">Contenido del Curso</h2>
                  <p className="text-muted mb-1">Progreso general del curso:</p>
                  <div className="progress mb-4" style={{ height: '20px' }}>
                    <div
                      className="progress-bar bg-success"
                      role="progressbar"
                      style={{ width: `${progresoPorcentaje}%` }}
                      aria-valuenow={progresoPorcentaje}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      {progresoPorcentaje}%
                    </div>
                  </div>
                </div>

                <div className="row g-4">
                  {temas
                    .sort((a, b) => a.orden - b.orden)
                    .map((tema) => (
                      <div className="col-md-6 col-lg-4" key={tema.id}>
                        <div className={`card shadow h-100 border-${tema.completado ? 'success' : 'secondary'}`}>
                          <img
                            src={`${apiUrl}/uploads/${tema.image}`}
                            className="card-img-top"
                            alt={tema.name}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/image_not_found.png";
                            }}
                            style={{ objectFit: 'cover', height: '180px' }}
                          />
                          <div className="card-body d-flex flex-column">
                            <h5 className="card-title text-primary d-flex justify-content-between align-items-center">
                              {tema.name}
                              {tema.completado && (
                                <i className="bi bi-check-circle-fill text-success fs-5" title="Completado"></i>
                              )}
                            </h5>
                            <p className="card-text text-muted small mb-1">{tema.description}</p>

                            {tema.duracion_estimada && (
                              <p className="text-secondary small">
                                <i className="bi bi-clock me-1"></i> {tema.duracion_estimada}
                              </p>
                            )}

                            {/* Barra de progreso individual (opcional) */}
                            {typeof tema.progreso === 'number' && (
                              <div className="progress mb-2" style={{ height: '8px' }}>
                                <div
                                  className={`progress-bar ${tema.progreso === 100 ? 'bg-success' : 'bg-info'}`}
                                  role="progressbar"
                                  style={{ width: `${tema.progreso}%` }}
                                  aria-valuenow={tema.progreso}
                                  aria-valuemin="0"
                                  aria-valuemax="100"
                                ></div>
                              </div>
                            )}

                            <div className="mt-auto d-grid gap-2">
                              <Link to={`/temas/${tema.id}/tests`} className="btn btn-outline-primary btn-sm">
                                <i className="bi bi-patch-question-fill me-1"></i> Ver Tests
                              </Link>
                              {tema.pdf_url && (
                                <a
                                  href={`${apiUrl}/uploads/${tema.pdf_url}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn btn-outline-secondary btn-sm"
                                >
                                  <i className="bi bi-file-earmark-pdf-fill me-1"></i> Ver PDF
                                </a>
                              )}
                              <Link to={`/temas/${tema.id}/videoclase`} className="btn btn-outline-info btn-sm text-white bg-info">
                                <i className="bi bi-play-circle-fill me-1"></i> Ver Videoclase
                              </Link>
                              {tema.material_adicional && (
                                <a
                                  href={tema.material_adicional}
                                  className="btn btn-outline-success btn-sm"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <i className="bi bi-link-45deg me-1"></i> Material adicional
                                </a>
                              )}

                              <button
                                className="btn btn-success btn-sm"
                                onClick={() => marcarComoCompletado(tema.id)}
                                disabled={tema.completado}
                              >
                                <i className="bi bi-check2-circle me-1"></i>
                                {tema.completado ? 'Completado' : 'Marcar como Completado'}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
          </div>
      </main>
    </div>
  );
};

export default Temas;

