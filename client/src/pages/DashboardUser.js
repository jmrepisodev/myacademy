// src/pages/PerfilUsuario.jsx
import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { FaEnvelope, FaLock, FaGraduationCap, FaFileAlt, FaChartBar } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import ModalActualizarPerfil from '../components/ModalActualizarPerfil';

const apiUrl = process.env.REACT_APP_API_URL;

function PerfilUsuario() {
  const [usuario, setUsuario] = useState(null);
  const [resultados, setResultados] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const [userRes, resultadosRes, cursosRes] = await Promise.all([
          API.get('/usuarios/perfil'),
          API.get('/usuarios/resultados'), // resultado histórico
          API.get('/usuarios/cursos')     // cursos en los que está inscrito
        ]);

        setUsuario(userRes.data);
        setResultados(resultadosRes.data);
        setCursos(cursosRes.data);
      } catch (err) {
        console.error(err);
        setError('Error al cargar el perfil del usuario. Inténtalo de nuevo más tarde');
      }
    };

    fetchPerfil();
  }, []);

  const handleGuardarPerfil = async (datosActualizados) => {
    try {
      const res = await API.put('/usuarios/actualizarPerfil', datosActualizados);
        setUsuario(res.data);
        alert('Perfil actualizado exitosamente.');
        setShowModal(false);
    } catch (err) {
        alert('Error al actualizar el perfil.');
        console.error(err);
    }
  };

  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!usuario) return <div className="text-center my-5">Cargando perfil...</div>;

 
  // 📈 Cálculo de estadísticas
  const totalTests = resultados.length;
  const totalScore = resultados.reduce((sum, r) => sum + r.score, 0);
  const averageScore = totalTests ? (totalScore / totalTests).toFixed(2) : 0;
  const totalTime = resultados.reduce((sum, r) => sum + r.timeTaken, 0).toFixed(1);

  const totalAciertos = resultados.reduce((sum, r) => sum + r.aciertos, 0);
  const totalErrores = resultados.reduce((sum, r) => sum + r.errores, 0);
  const averageAciertos = totalTests ? (totalAciertos / totalTests).toFixed(2) : 0;
  const averageErrores = totalTests ? (totalErrores / totalTests).toFixed(2) : 0;

  const totalPreguntas = resultados.reduce((sum, r) => sum + r.aciertos + r.errores + r.en_blanco, 0);
  const aciertoRatio = totalPreguntas ? ((totalAciertos / totalPreguntas) * 100).toFixed(1) : 0;

  return (
    <div className="container-fluid p-0 min-vh-100 d-flex">
        {/* Sidebar izquierda */}
        <div className="col-md-2 col-lg-2 p-0 bg-dark">
          <Sidebar/>
        </div>
        {/* Contenido principal derecha */}
        <div className="col p-3">
            <h1 className="mb-4">Mi Perfil</h1>

            {/* Información personal */}
            <div className="card mb-4 shadow-sm">
              <div className="card-body d-flex align-items-center">
                  <img 
                    src={`${apiUrl}/uploads/${usuario.image}`}
                    className="rounded-circle me-4"
                    width="120"
                    height="120"
                    alt={usuario.name}
                    onError={(e) => {
                      e.target.onerror = null; // evita bucle si la imagen por defecto también falla
                      e.target.src = "/image_not_found.png"; // ruta de imagen por defecto (public/)
                    }}
                  />
                <div>
                  <h4>{usuario.name}</h4>
                  <p className="mb-1">
                    <FaEnvelope className="me-2" />
                    {usuario.email}
                  </p>
                  <p className="text-muted mb-0">Última actividad: {new Date(usuario.last_activity).toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* 📊 Estadísticas */}
            <div className="card mb-4">
              <div className="card-header bg-info text-white">
                <FaChartBar className="me-2" />
                Mis estadísticas
              </div>
              <div className="card-body">
                <div className="row text-center">
                  <div className="col-md-4 mb-3">
                    <div className="card shadow-sm">
                      <div className="card-body">
                        <h6 className="text-muted">Total de Tests</h6>
                        <h4>{totalTests}</h4>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 mb-3">
                    <div className="card shadow-sm">
                      <div className="card-body">
                        <h6 className="text-muted">Puntaje Promedio</h6>
                        <h4>{averageScore}</h4>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 mb-3">
                    <div className="card shadow-sm">
                      <div className="card-body">
                        <h6 className="text-muted">Puntaje Total</h6>
                        <h4>{totalScore}</h4>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 mb-3">
                    <div className="card shadow-sm">
                      <div className="card-body">
                        <h6 className="text-muted">Prom. Aciertos</h6>
                        <h4>{averageAciertos}</h4>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 mb-3">
                    <div className="card shadow-sm">
                      <div className="card-body">
                        <h6 className="text-muted">Prom. Errores</h6>
                        <h4>{averageErrores}</h4>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 mb-3">
                    <div className="card shadow-sm">
                      <div className="card-body">
                        <h6 className="text-muted">Tiempo Total</h6>
                        <h4>{totalTime} min</h4>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 mb-3">
                    <div className="card shadow-sm">
                      <div className="card-body">
                        <h6 className="text-muted">% Acierto Total</h6>
                        <h4>{aciertoRatio}%</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>


            {/* Cursos matriculados */}
            <div className="card mb-4">
              <div className="card-header bg-primary text-white">
                <FaGraduationCap className="me-2" />
                Mis cursos
              </div>

              {cursos.length === 0 ? (
                <div className="card-body">
                  <p className="mb-0">No estás inscrito en ningún curso aún.</p>
                </div>
              ) : (
                <div className="card-body">
                  <div
                    className="d-flex flex-wrap gap-3"
                    style={{ justifyContent: 'flex-start' }}
                  >
                    {cursos.map((curso) => (
                      <div className="card" style={{ width: '18rem' }} key={curso.id}>
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
                          <p className="card-text">{curso.description}</p>
                          <Link
                            to={`/cursos/${curso.id}/temas`}
                            className="btn btn-primary mt-3"
                          >
                            Ver curso
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Historial de resultados */}
            <div className="card mb-4">
              <div className="card-header bg-success text-white">
                <FaFileAlt className="me-2" />
                Historial de exámenes
              </div>
              <div className="table-responsive">
                <table className="table table-striped mb-0">
                  <thead>
                    <tr>
                      <th>Test</th>
                      <th>Aciertos</th>
                      <th>Errores</th>
                      <th>En blanco</th>
                      <th>Puntaje</th>
                      <th>Duración</th>
                      <th>Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resultados.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="text-center">Sin resultados aún.</td>
                      </tr>
                    ) : (
                      resultados.map((r) => (
                        <tr key={r.id}>
                          <td>{r.test_name}</td>
                          <td>{r.aciertos}</td>
                          <td>{r.errores}</td>
                          <td>{r.en_blanco}</td>
                          <td>{r.score}</td>
                          <td>{r.timeTaken} min</td>
                          <td>{new Date(r.created_at).toLocaleDateString()}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Acciones de seguridad */}
            <div className="card">
              <div className="card-header bg-warning">
                <FaLock className="me-2" />
                Seguridad de la cuenta
              </div>
              <div className="card-body">
                <button className="btn btn-outline-primary me-2" onClick={() => setShowModal(true)}>
                  Actualizar información del perfil
                </button>
              </div>
              <ModalActualizarPerfil
                show={showModal}
                onClose={() => setShowModal(false)}
                usuario={usuario}
                onSave={handleGuardarPerfil}
              />

            </div>
        </div>
      
    </div>
  );
}

export default PerfilUsuario;
