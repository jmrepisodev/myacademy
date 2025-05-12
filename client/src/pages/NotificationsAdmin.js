import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import Sidebar from '../components/SidebarAdmin';
import API from '../services/api';

const NotificacionesPage = () => {
  const [notificaciones, setNotificaciones] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({
    mensaje: '',
    tipo: 'sistema',
    leido: false,
    allUsers: true,
    userId: '',
  });
  
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resNotificaciones = await API.get('/notificaciones');
        setNotificaciones(resNotificaciones.data);

        const resUsuarios = await API.get('/usuarios');
        setUsuarios(resUsuarios.data.users);
        setErrorMessage('');
      } catch (err) {
        setErrorMessage('Error al cargar los datos');
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const handleShowModal = () => {
    setFormData({
      mensaje: '',
      tipo: 'sistema',
      leido: false,
      allUsers: true,
      userId: '',
    });
    setShowModal(true);
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSave = async () => {
    if (!formData.mensaje || !formData.tipo || (!formData.allUsers && !formData.userId)) {
      setErrorMessage('Todos los campos son obligatorios');
      return;
    }

    try {
      const payload = {
        message: formData.mensaje,
        type: formData.tipo,
        allUsers: formData.allUsers,
        userId: formData.allUsers ? null : formData.userId,
      };

      await API.post('/notificaciones', payload);
      setSuccessMessage('Notificación enviada correctamente');
      setShowModal(false);

      const res = await API.get('/notificaciones');
      setNotificaciones(res.data);
    } catch (err) {
      setErrorMessage('Error al enviar la notificación');
      console.error(err);
    }
  };


    const handleDelete = async () => {
    try {
        await API.delete(`/notificaciones/${deleteId}`);
        setSuccessMessage('Notificación eliminada correctamente');
        setShowDeleteConfirm(false);

        const res = await API.get('/notificaciones');
        setNotificaciones(res.data);
    } catch (err) {
        setErrorMessage('Error al eliminar la notificación');
        console.error(err);
    }
    };

  return (
    <div className="container-fluid p-0 min-vh-100 d-flex">
      <div className="col-md-2 col-lg-2 p-0 bg-dark">
        <Sidebar />
      </div>

      <div className="col-md-8 col-lg-8 p-3">
        <div className="container">
          <h2 className="my-3">Administrar Notificaciones</h2>

          <Button className="my-2" variant="primary" onClick={handleShowModal}>
            Crear Notificación
          </Button>

          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
          {successMessage && <Alert variant="success">{successMessage}</Alert>}

          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Mensaje</th>
                <th>Usuario</th>
                <th>Tipo</th>
                <th>Leído</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {notificaciones.map((n) => (
                <tr key={n.id}>
                  <td>{n.id}</td>
                  <td>{n.mensaje}</td>
                  <td>{n.usuario_nombre || 'Todos'}</td>
                  <td>{n.tipo}</td>
                  <td>{n.leido ? 'Sí' : 'No'}</td>
                  <td>
                    <Button
                        variant="danger"
                        size="sm"
                        onClick={() => {
                        setDeleteId(n.id);
                        setShowDeleteConfirm(true);
                        }}
                    >
                        Eliminar
                    </Button>
                    </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Modal de creación */}
          <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
              <Modal.Title>Crear Notificación</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group controlId="formMensaje">
                  <Form.Label>Mensaje</Form.Label>
                  <Form.Control
                    type="text"
                    name="mensaje"
                    value={formData.mensaje}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group controlId="formTipo">
                  <Form.Label>Tipo</Form.Label>
                  <Form.Control
                    as="select"
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleChange}
                  >
                    <option value="sistema">Sistema</option>
                    <option value="curso">Curso</option>
                    <option value="foro">Foro</option>
                    <option value="otro">Otro</option>
                  </Form.Control>
                </Form.Group>

                <Form.Group controlId="formAllUsers">
                  <Form.Check
                    type="checkbox"
                    label="Enviar a todos los usuarios"
                    name="allUsers"
                    checked={formData.allUsers}
                    onChange={handleChange}
                  />
                </Form.Group>

                {!formData.allUsers && (
                  <Form.Group controlId="formUserId">
                    <Form.Label>Seleccionar Usuario</Form.Label>
                    <Form.Control
                      as="select"
                      name="userId"
                      value={formData.userId}
                      onChange={handleChange}
                    >
                      <option value="">Seleccione un usuario</option>
                      {usuarios.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                )}
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>
                Cancelar
              </Button>
              <Button variant="primary" onClick={handleSave}>
                Enviar
              </Button>
            </Modal.Footer>
          </Modal>

        {/* Modal de confirmación */}
          <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Confirmar Eliminación</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                ¿Estás seguro de que deseas eliminar esta notificación?
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>
                Cancelar
                </Button>
                <Button variant="danger" onClick={handleDelete}>
                Eliminar
                </Button>
            </Modal.Footer>
            </Modal>

        </div>
      </div>
    </div>
  );
};

export default NotificacionesPage;

