import React, { useEffect, useState} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import API from '../services/api';
import { FaClock, FaCalendarAlt, FaLaptop, FaCheckCircle, FaEuroSign, FaCertificate } from 'react-icons/fa';


const apiUrl = process.env.REACT_APP_API_URL;

const CourseDetail = () => {
  const { id } = useParams();
  const [curso, setCurso] = useState(null);
  const [temas, setTemas] = useState([]);
  const [testimonios, setTestimonios] = useState([]);
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
        const fetchData = async () => {
            try {
              const [cursoRes, temasRes, testimoniosRes] = await Promise.all([
                  fetch(`${apiUrl}/api/cursos/${id}`),
                  fetch(`${apiUrl}/api/temas/curso/${id}`),
                  fetch(`${apiUrl}/api/testimonios/curso/${id}`)
              ]);
          
              const [cursoData, temasData, testimoniosData] = await Promise.all([
                  cursoRes.json(),
                  temasRes.json(),
                  testimoniosRes.json()
              ]);
          
              setCurso(cursoData);
              setTemas(temasData);
              setTestimonios(testimoniosData);
              setMessage({ text: '', type: '' });
            } catch (error) {
              console.error('Error al cargar datos del curso:', error);
              setMessage({
                text: 'Error al cargar los datos del curso',
                type: 'danger'
              });
            }
        };
        
        fetchData();
    }, [id]);

  if (!curso) return <div className="container py-5"><p>Cargando curso...</p></div>;

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
    <div className="container py-5">
         {/* Muestra mensajes de error o de éxito */}
       {message.text && (
        <div className={`alert alert-${message.type} alert-dismissible fade show`} role="alert">
          {message.text}
          <button type="button" className="btn-close" onClick={() => setMessage({ text: '', type: '' })}></button>
        </div>
        )}

      <div className="row g-5">
        {/* Imagen y datos generales */}
        <div className="col-md-6">
          <div className="card shadow-sm">
            <img 
              src={`${apiUrl}/uploads/${curso.image}`}
              className="card-img-top"
              alt={curso.name}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/image_not_found.png";
              }}
            />
            <div className="card-body">
              <h2 className="card-title text-primary fw-bold">{curso.name}</h2>
              <p className="card-text">{curso.description}</p>
              <div className="mt-3">
                <span className="badge bg-secondary me-2">{curso.modalidad}</span>
                <span className="badge bg-success me-2">€ {curso.precio}</span>
                {Boolean(curso.certificado_disponible) && (
                  <span className="badge bg-info text-dark">
                    <FaCertificate className="me-1" />
                    Certificado
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Información adicional */}
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h4 className="card-title mb-3">Detalles del Curso</h4>
              <ul className="list-group list-group-flush small">
                <li className="list-group-item">
                  <FaClock className="me-2 text-primary" />
                  <strong>Duración:</strong> {curso.duracion || '—'}
                </li>
                <li className="list-group-item">
                  <FaCalendarAlt className="me-2 text-primary" />
                  <strong>Inicio:</strong> {curso.fecha_inicio ? new Date(curso.fecha_inicio).toLocaleDateString() : '—'}
                </li>
                <li className="list-group-item">
                  <FaCalendarAlt className="me-2 text-primary" />
                  <strong>Fin:</strong> {curso.fecha_fin ? new Date(curso.fecha_fin).toLocaleDateString() : '—'}
                </li>
                <li className="list-group-item">
                  <FaLaptop className="me-2 text-primary" />
                  <strong>Modalidad:</strong> {curso.modalidad}
                </li>
                <li className="list-group-item">
                  <FaEuroSign className="me-2 text-success" />
                  <strong>Precio:</strong> {curso.precio} €
                </li>
                {curso.certificado_disponible && (
                  <li className="list-group-item text-success">
                    <FaCertificate className="me-2" />
                    Certificado incluido
                  </li>
                )}
                <li className="list-group-item">
                  <FaCheckCircle className="me-2 text-secondary" />
                  <strong>Requisitos:</strong> {curso.requisitos || 'Ninguno'}
                </li>
                <li className="list-group-item">
                  <FaCheckCircle className="me-2 text-secondary" />
                  <strong>Objetivos:</strong> {curso.objetivos || 'Aprender y aprobar'}
                </li>
              </ul>

              <div className="mt-4 d-grid">
                <button className="btn btn-primary mt-2" onClick={() => handleEnrollClick(curso.id)}>
                  Inscribirme
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Temario */}
      <div className="mt-5">
        <h3 className="mb-3">Temario del Curso</h3>
        {temas.length > 0 ? (
          <ul className="list-group">
            {temas.map(t => (
              <li key={t.id} className="list-group-item">
                <strong>{t.indice_tema}.</strong> {t.name}
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay temas disponibles todavía.</p>
        )}
      </div>

      {/* Testimonios */}
      <div className="mt-5">
        <h3 className="mb-3">Testimonios</h3>
        {testimonios.length > 0 ? (
          <div className="row g-4">
            {testimonios.map(test => (
              <div key={test.id} className="col-md-4">
                <div className="card shadow-sm h-100">
                  <div className="card-body">
                    <blockquote className="blockquote mb-0">
                      <p>"{test.contenido}"</p>
                      <footer className="blockquote-footer mt-2">Alumno del curso</footer>
                    </blockquote>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No hay testimonios para este curso aún.</p>
        )}
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

    </div>
  );
};

export default CourseDetail;
