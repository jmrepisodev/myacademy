import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { useParams, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import HiloModal from '../components/HiloModal';
import { FaStream, FaPlus, FaTrash, FaEdit, FaEye } from 'react-icons/fa';
import { jwtDecode } from 'jwt-decode';
import ConfirmModal from '../components/ConfirmModal';

const HiloList = () => {
  const { slug } = useParams();
  const [foro, setForo] = useState(null);
  const [hilos, setHilos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingHilo, setEditingHilo] = useState(null);
  const [modoModal, setModoModal] = useState('crear');
  const [userId, setUserId] = useState(null);

  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
  const [selectedHiloId, setSelectedHiloId] = useState(null);


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

  const fetchData = async () => {
    try {
      const [foroRes, hilosRes] = await Promise.all([
        API.get(`/foros/${slug}`),
        API.get(`/foros/${slug}/hilos`)
      ]);
      console.log(hilosRes.data)
      setForo(foroRes.data);
      setHilos(hilosRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [slug]);

  const handleCreate = () => {
    setModoModal('crear');
    setEditingHilo(null);
    setModalVisible(true);
  };

  const handleConfirmDelete = (hiloId) => {
  setSelectedHiloId(hiloId);
  setConfirmDeleteModal(true);
};

  const confirmDelete = async () => {
    try {
      await API.delete(`/foros/${slug}/hilos/${selectedHiloId}/delete`);
      setHilos(hilos.filter((h) => h.id !== selectedHiloId));
      setConfirmDeleteModal(false);
    } catch (err) {
      alert('Error al eliminar hilo');
    }
  };

  const handleEdit = (hilo) => {
    setModoModal('editar');
    setEditingHilo(hilo);
    setModalVisible(true);
  };


  const handleSave = async ({ titulo, contenido }) => {
    try {
      if (modoModal === 'crear') {
        await API.post(`/foros/${slug}/hilos/create`, {
          titulo,
          contenido,
          usuario_id: userId
        });
      } else if (editingHilo) {
        await API.put(`/foros/hilos/${editingHilo.id}/update`, {
          titulo,
          contenido
        });
      }
      setModalVisible(false);
      fetchData();
    } catch (err) {
      alert('Error al guardar hilo');
      console.error(err);
    }
  };

  if (loading) return <div className="alert alert-info text-center">Cargando...</div>;

  return (
    <div className="container-fluid d-flex p-0 min-vh-100">
      <aside className="col-md-2 bg-dark">
        <Sidebar />
      </aside>
      <main className="col-md-10 p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="text-primary">
            <FaStream className="me-2" />
            {foro?.name || 'Foro'}
          </h2>
          <button className="btn btn-success" onClick={handleCreate}>
            <FaPlus className="me-1" /> Nuevo hilo
          </button>
        </div>

       {hilos.length > 0 ? (
        <div className="list-group">
          {hilos.map((hilo) => (
            <div
              key={hilo.id}
              className="list-group-item d-flex justify-content-between align-items-start flex-column flex-md-row"
            >
              <div className="flex-grow-1">
                {/* Título enlazado al hilo */}
                <h5 className="mb-1">
                  <Link to={`/foro/${slug}/hilo/${hilo.id}`} className="text-decoration-none text-dark">
                    {hilo.titulo}
                  </Link>
                </h5>
                <small className="text-muted d-block mb-1">
                  Publicado por <strong>{hilo.usuario_nombre}</strong> el{' '}
                  {new Date(hilo.created_at).toLocaleDateString()} · {hilo.total_mensajes || 0} mensajes ·{' '}
                  <FaEye /> {hilo.vistas || 0} vistas
                </small>
              </div>

              {userId === hilo.usuario_id && (
                <div className="btn-group ms-2 my-auto">
                  <button className="btn btn-sm btn-outline-primary mx-1" onClick={() => handleEdit(hilo)}>
                    <FaEdit />
                  </button>
                  <button className="btn btn-sm btn-outline-danger mx-1" onClick={() => handleConfirmDelete(hilo.id)}>
                    <FaTrash />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="alert alert-warning text-center">No hay hilos en este foro.</div>
      )}




        <HiloModal
          show={modalVisible}
          onHide={() => setModalVisible(false)}
          onSave={handleSave}
          initialData={editingHilo}
          modo={modoModal}
        />

        <ConfirmModal
          show={confirmDeleteModal}
          onHide={() => setConfirmDeleteModal(false)}
          onConfirm={confirmDelete}
          title="Eliminar hilo"
          body="¿Estás seguro de que deseas eliminar este hilo? Esta acción no se puede deshacer."
          confirmText="Eliminar"
        />

      </main>
    </div>
  );
};

export default HiloList;

