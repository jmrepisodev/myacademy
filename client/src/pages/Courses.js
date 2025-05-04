import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const apiUrl = process.env.REACT_APP_API_URL;

const Courses = () => {
  const [cursos, setCursos] = useState([]);
  const [message, setMessage] = useState({ text: '', type: '' });
  
 

  useEffect(() => {
    fetch(`${apiUrl}/api/cursos`)
      .then(res => res.json())
      .then(data => setCursos(data))
      .catch(error => {
        console.error('Error al cargar cursos:', error);
        setMessage({ text: 'Error al cargar cursos.', type: 'danger' });
      });
  }, []);

  

  return (
    <section className="container py-5">
      <h1 className="mb-4 fs-2">Nuestros Cursos</h1>

        {/* Muestra mensajes de error o de éxito */}
        {message.text && (
        <div className={`alert alert-${message.type} alert-dismissible fade show`} role="alert">
          {message.text}
          <button type="button" className="btn-close" onClick={() => setMessage({ text: '', type: '' })}></button>
        </div>
        )}

      <div className="row g-4">
      {cursos.length > 0 ? (
          cursos.map((curso, index) => (
          <div key={curso.id} className="col-md-4">
            <div className="card h-100 shadow-sm">
                <img 
                  src={`${apiUrl}/uploads/${curso.image}`}
                  className="card-img-top"
                  alt={curso.name}
                  onError={(e) => {
                    e.target.onerror = null; // evita bucle si la imagen por defecto también falla
                    e.target.src = "/image_not_found.png"; // ruta de imagen por defecto (public/)
                  }}
                />
              <div className="card-body">
                <h5 className="card-title">{curso.name}</h5>
                <p className="card-text">{curso.description?.slice(0, 100)}...</p>
                <p><strong>Modalidad:</strong> {curso.modalidad}</p>
                <p><strong>Precio:</strong> {curso.precio} €</p>
                <Link to={`/curso/${curso.id}`} className="btn btn-primary mt-3">Ver Detalles</Link>

                
              </div>
            </div>
          </div>
        ))
        ) : (
          <p>No hay cursos disponibles en este momento.</p>
        )}
      </div>

     
    </section>
  );
};

export default Courses;
