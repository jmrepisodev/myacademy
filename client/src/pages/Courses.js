import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import API from '../services/api';
import { jwtDecode } from 'jwt-decode';

const apiUrl = process.env.REACT_APP_API_URL;

const Courses = () => {
  const [cursos, setCursos] = useState([]);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedCursoId, setSelectedCursoId] = useState(null);
  const navigate = useNavigate();

  const isTokenValid = (token) => {
    try {
      const { exp } = jwtDecode(token);
      return exp * 1000 > Date.now(); // exp está en segundos, Date.now() en ms
    } catch (e) {
      return false;
    }
  };

  useEffect(() => {
    fetch(`${apiUrl}/api/cursos`)
      .then(res => res.json())
      .then(data => setCursos(data))
      .catch(error => {
        console.error('Error al cargar cursos:', error);
        setMessage({ text: 'Error al cargar cursos.', type: 'danger' });
      });
  }, []);

  const handleEnrollClick = (cursoId) => {
    const token = localStorage.getItem('token');
    const isAuthenticated = token && isTokenValid(token);
  
    setSelectedCursoId(cursoId);
  
    if (isAuthenticated) {
      setShowConfirmModal(true);
    } else {
      setShowLoginModal(true);
    }
  };

  const handleConfirmEnroll = async () => {
    setShowConfirmModal(false);

    try {
      await API.post(`${apiUrl}/api/cursos/matricular`, { cursoId: selectedCursoId});

      setMessage({
        text: 'Te has inscrito correctamente en el curso.',
        type: 'success'
      });

    } catch (err) {
      const errorMsg =
        err.response?.data?.message || 'Ha ocurrido un error inesperado.';
        console.error('Error en inscripción:', err);

      setMessage({
        text: `Error: ${errorMsg}`,
        type: 'danger'
      });
    }

  };

  return (
    <section className="container py-5">
      <h1 className="mb-4 fs-2">Nuestros Cursos</h1>

      {message.text && (
        <div className={`alert alert-${message.type} alert-dismissible fade show`} role="alert">
          {message.text}
          <button type="button" className="btn-close" onClick={() => setMessage({ text: '', type: '' })}></button>
        </div>
      )}

      <div className="row g-4">
        {cursos.map((curso) => (
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
                <h3 className="card-title">{curso.name}</h3>
                <p className="card-text">{curso.description}</p>
                <button className="btn btn-primary mt-2" onClick={() => handleEnrollClick(curso.id)}>
                  Inscribirse
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Confirmación */}
      {showConfirmModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirmar inscripción</h5>
                <button className="btn-close" onClick={() => setShowConfirmModal(false)} />
              </div>
              <div className="modal-body">
                <p>¿Estás seguro de que deseas inscribirte en este curso?</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowConfirmModal(false)}>Cancelar</button>
                <button className="btn btn-primary" onClick={handleConfirmEnroll}>Confirmar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Login */}
      {showLoginModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Login requerido</h5>
                <button className="btn-close" onClick={() => setShowLoginModal(false)} />
              </div>
              <div className="modal-body">
                <p>Debes iniciar sesión para inscribirte en un curso.</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowLoginModal(false)}>Cancelar</button>
                <button className="btn btn-primary" onClick={() => navigate('/login')}>Ir a Login</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};

export default Courses;
