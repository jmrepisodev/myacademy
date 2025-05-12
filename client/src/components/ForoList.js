import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { Link } from 'react-router-dom';
import { FaComments } from 'react-icons/fa';
import Sidebar from '../components/Sidebar';

const ForoList = () => {
  const [foros, setForos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    API.get('/foros')
      .then(response => {
        setForos(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error al cargar los foros:', error);
        setError('No se pudo cargar la lista de foros. Inténtalo más tarde.');
        setLoading(false);
      });
  }, []);

  return (
    <div className="container-fluid p-0 min-vh-100 d-flex">
        {/* Sidebar izquierda */}
        <aside className="col-md-2 col-lg-2 p-0 bg-dark">
          <Sidebar/>
        </aside>
        {/* Contenido principal derecha */}
        <main className="col-md-8 col-lg-8 p-3">
             <div className="container my-5">
            <h2 className="mb-4 text-primary text-center">
              <FaComments className="me-2" />
              Foros de Discusión
            </h2>

            {loading && <div className="alert alert-info text-center">Cargando foros...</div>}

            {error && <div className="alert alert-danger text-center">{error}</div>}

            {!loading && !error && (
              <div className="row row-cols-1 row-cols-md-2 g-4">
                {foros.length > 0 ? (
                  foros.map((foro) => (
                    <div className="col" key={foro.id}>
                      <div className="card h-100 shadow-sm border-0">
                        <div className="card-body">
                          <h5 className="card-title text-primary">{foro.name}</h5>
                          <p className="card-text text-muted">{foro.description || 'Sin descripción.'}</p>
                          <Link to={`/foro/${foro.slug}`} className="btn btn-outline-primary mt-2">
                            Ver hilos
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))
                  ) : (
                  <p className="text-center">No hay foros disponibles en este momento.</p>
                )}
              </div>
            )}

            {!loading && !error && foros.length === 0 && (
              <div className="alert alert-warning text-center">No hay foros disponibles actualmente.</div>
            )}
          </div>
        </main>
    </div>
   
  );
};

export default ForoList;

