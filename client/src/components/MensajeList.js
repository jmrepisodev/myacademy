import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { useParams } from 'react-router-dom';
import { FaComments, FaEdit, FaTrash } from 'react-icons/fa';
import Sidebar from '../components/Sidebar';
import { jwtDecode } from 'jwt-decode';

const apiUrl = process.env.REACT_APP_API_URL;

const MensajeList = () => {
  const { slug, hiloId } = useParams();
  const [mensajes, setMensajes] = useState([]);
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const [editandoId, setEditandoId] = useState(null);
  const [editContenido, setEditContenido] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [showModal, setShowModal] = useState(false); // Estado para mostrar el modal
  const [mensajeAEliminar, setMensajeAEliminar] = useState(null); // Mensaje a eliminar
  const [tituloHilo, setTituloHilo] = useState(''); // Título del hilo

  // Obtener el token y decodificarlo para obtener el userId
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded.id || decoded.user_id);
      } catch (error) {
        console.error('Token inválido:', error);
        setUserId(null);
      }
    }
  }, []);

  // Obtener mensajes y título del hilo
  useEffect(() => {
   
    const fetchMensajes = async () => {
      try {
        const response = await API.get(`/foros/${slug}/hilos/${hiloId}/mensajes`);
        setMensajes(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Hubo un error al obtener los mensajes:', error);
        setError('No se pudieron cargar los mensajes.');
        setLoading(false);
      }
    };

    const fetchTituloHilo = async () => {
      try {
        const response = await API.get(`/foros/${slug}/hilos/${hiloId}`);
        setTituloHilo(response.data.titulo);
      } catch (error) {
        console.error('Hubo un error al obtener el título del hilo:', error);
        setError('No se pudo obtener el título del hilo.');
      }
    };

    fetchMensajes();
    fetchTituloHilo();
  }, [slug, hiloId]);

  const handleChange = (e) => {
    setNuevoMensaje(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nuevoMensaje.trim()) {
      setError('El mensaje no puede estar vacío.');
      return;
    }

    try {
      const response = await API.post(`/foros/${slug}/hilos/${hiloId}/mensajes`, {
        contenido: nuevoMensaje
      });

      setMensajes((prev) => [...prev, response.data]);
      setNuevoMensaje('');
      setError(null);
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      setError('No se pudo enviar el mensaje.');
    }
  };

  const iniciarEdicion = (mensaje) => {
    setEditandoId(mensaje.id);
    setEditContenido(mensaje.contenido);
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
    setEditContenido('');
  };

  const guardarEdicion = async (id) => {
    try {
      const response = await API.put(`/foros/${slug}/hilos/${hiloId}/mensajes/${id}`, { contenido: editContenido });
      setMensajes((prev) =>
        prev.map((m) => (m.id === id ? { ...m, contenido: editContenido } : m))
      );
      cancelarEdicion();
    } catch (error) {
      console.error('Error al editar mensaje:', error);
      setError('No se pudo editar el mensaje.');
    }
  };

  const confirmarEliminacion = async () => {
    if (!mensajeAEliminar) return;
    try {
      await API.delete(`/foros/${slug}/hilos/${hiloId}/mensajes/${mensajeAEliminar.id}`);
      setMensajes((prev) => prev.filter((m) => m.id !== mensajeAEliminar.id));
      setMensajeAEliminar(null);
      setShowModal(false); // Cerrar el modal después de la eliminación
    } catch (error) {
      console.error('Error al eliminar mensaje:', error);
      setError('No se pudo eliminar el mensaje.');
    }
  };

  const mostrarModal = (mensaje) => {
    setMensajeAEliminar(mensaje);
    setShowModal(true); // Abrir el modal
  };

  const cerrarModal = () => {
    setShowModal(false);
  };

  return (
    <div className="container-fluid p-0 min-vh-100 d-flex">
      <aside className="col-md-2 bg-dark"><Sidebar /></aside>
      <main className="col-md-8 p-3">
        <div className="container my-5">
          <h2 className="text-primary text-center mb-4">
            <FaComments className="me-2" /><strong>{tituloHilo}</strong>
          </h2>

          {loading && <div className="alert alert-info text-center">Cargando mensajes...</div>}
          {error && <div className="alert alert-danger text-center">{error}</div>}

          {!loading && !error && (
            <>
              {mensajes.length > 0 ? (
                <div className="list-group shadow-sm">
                  {mensajes.map((mensaje) => (
                    <div key={mensaje.id} className="list-group-item d-flex">
                      <img
                        src={`${apiUrl}/uploads/${mensaje.usuario_image}`}
                        className="rounded-circle me-3"
                        style={{ width: '40px', height: '40px' }}
                        alt={mensaje.usuario_nombre}
                        onError={(e) => {
                          e.target.onerror = null; // evita bucle si la imagen por defecto también falla
                          e.target.src = "/profile.png"; // ruta de imagen por defecto (public/)
                        }}
                      />
                      <div className="flex-grow-1">
                        <h6 className="mb-1">{mensaje.usuario_nombre}</h6>
                        {editandoId === mensaje.id ? (
                          <>
                            <textarea
                              className="form-control mb-2"
                              value={editContenido}
                              onChange={(e) => setEditContenido(e.target.value)}
                            />
                            <button
                              className="btn btn-sm btn-success me-2"
                              onClick={() => guardarEdicion(mensaje.id)}
                            >
                              Guardar
                            </button>
                            <button
                              className="btn btn-sm btn-secondary"
                              onClick={cancelarEdicion}
                            >
                              Cancelar
                            </button>
                          </>
                        ) : (
                          <>
                            <p className="mb-1">{mensaje.contenido}</p>
                            <small className="text-muted">
                              Publicado el {new Date(mensaje.created_at).toLocaleString()}
                            </small>
                          </>
                        )}
                      </div>
                      {mensaje.usuario_id === userId && editandoId !== mensaje.id && (
                        <div className="ms-2 d-flex flex-column align-items-end">
                          <button
                            className="btn btn-sm btn-outline-primary mb-1"
                            onClick={() => iniciarEdicion(mensaje)}
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => mostrarModal(mensaje)} // Abrir modal con el mensaje a eliminar
                          >
                            <FaTrash />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="alert alert-warning text-center">No hay mensajes en este hilo todavía.</div>
              )}

              {/* Formulario para nuevo mensaje */}
              <div className="mt-4">
                <h4 className="text-center">Escribe un mensaje</h4>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <textarea
                      className="form-control"
                      rows="4"
                      placeholder="Escribe tu mensaje..."
                      value={nuevoMensaje}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="text-center">
                    <button type="submit" className="btn btn-primary">
                      Enviar mensaje
                    </button>
                  </div>
                </form>
              </div>
            </>
          )}
        </div>

        {/* Modal de confirmación de eliminación */}
        <div
          className={`modal fade ${showModal ? 'show' : ''}`}
          id="confirmarEliminacionModal"
          tabIndex="-1"
          aria-labelledby="confirmarEliminacionLabel"
          aria-hidden={!showModal}
          style={{ display: showModal ? 'block' : 'none' }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="confirmarEliminacionLabel">Confirmar eliminación</h5>
                <button type="button" className="btn-close" onClick={cerrarModal} aria-label="Cerrar"></button>
              </div>
              <div className="modal-body">
                ¿Estás seguro de que deseas eliminar este mensaje?
                <p className="mt-2"><em>"{mensajeAEliminar?.contenido}"</em></p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={cerrarModal}>Cancelar</button>
                <button type="button" className="btn btn-danger" onClick={confirmarEliminacion}>Eliminar</button>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default MensajeList;
