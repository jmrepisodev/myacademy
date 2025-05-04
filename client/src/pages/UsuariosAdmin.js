import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, InputGroup, FormControl } from 'react-bootstrap';
import API from '../services/api';
import Sidebar from '../components/SidebarAdmin';

function App() {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentUser, setCurrentUser] = useState({ name: '', email: '', rol: '' });
    const [deleteUserId, setDeleteUserId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const [expandedUserId, setExpandedUserId] = useState(null);
    const [userCourses, setUserCourses] = useState([]);

    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    const [errorMessage, setErrorMessage] = useState('');
  
    const fetchUsers = async () => {
      try {
        const res = await API.get(`/usuarios?page=${page}&limit=${limit}`);
        setUsers(res.data.users);
        setFilteredUsers(res.data.users);
        setTotalPages(res.data.totalPages);
        setErrorMessage('');
      } catch (err) {
        console.error('Error al obtener usuarios', err);
        setErrorMessage('Error al intentar obtener la lista de usuarios');
      }
    };
    
    // useEffect actualizado para cambios de página
    useEffect(() => {
      fetchUsers();
    }, [page]);
    
    // Navegación de páginas
    const handleNextPage = () => {
      if (page < totalPages) setPage(prev => prev + 1);
    };
    const handlePrevPage = () => {
      if (page > 1) setPage(prev => prev - 1);
    };
  
    useEffect(() => {
      const q = searchQuery.toLowerCase();
      setFilteredUsers(users.filter(user =>
        user.name.toLowerCase().includes(q) || user.id.toString().includes(q)
      ));
    }, [searchQuery, users]);
  
    const handleSave = async () => {
      try {
          if (isEditing) {
            await API.put(`/usuarios/update/${currentUser.id}`, currentUser);
          } else {
            await API.post('/usuarios/store', currentUser);
          }
          setShowModal(false);
          fetchUsers();
      } catch (err) {
          console.error('Error al guardar usuario', err);
          setErrorMessage('Error al intentar guardar el usuario');
      }
    };
  
    const handleDelete = async () => {
      try {
        await API.delete(`/usuarios/delete/${deleteUserId}`);
        setShowDeleteConfirm(false);
        fetchUsers();
      } catch (err) {
          console.error('Error al eliminar usuario', err);
          setErrorMessage('Error al intentar eliminar el usuario');
        }
    };

    const fetchCursosPorUsuario = async (userId) => {
      try {
        const res = await API.get(`/usuarios/${userId}/cursos`);
        setUserCourses(res.data);
        setExpandedUserId(userId);
      } catch (err) {
        console.error('Error al obtener cursos del usuario:', err);
        setUserCourses([]);
        setExpandedUserId(userId); // aún expandimos aunque esté vacío
      }
    };

  return (
    <div className="container-fluid p-0 min-vh-100 d-flex">
        {/* Sidebar izquierda */}
        <div className="col-md-2 col-lg-2 p-0 bg-dark">
            <Sidebar/>
        </div>
        {/* Contenido principal derecha */}
        <div className="col p-3">
          <div className="container mt-4">
            <h2 className="mb-4">Usuarios</h2>

            <div className="d-flex justify-content-between mb-3">
                <Button onClick={() => {
                setIsEditing(false);
                setCurrentUser({ name: '', email: '', rol: '' });
                setShowModal(true);
                }}>
                Añadir Usuario
                </Button>

                <InputGroup style={{ width: '300px' }}>
                <FormControl
                    placeholder="Buscar por nombre o ID"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                </InputGroup>
            </div>

            {errorMessage && (
              <div className="mb-3">
                  <div className="alert alert-danger" role="alert">
                  {errorMessage}
                  </div>
              </div>
              )}

            <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Verificado</th>
                <th>Última actividad</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <>
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.rol}</td>
                    <td>{user.is_verified ? 'Sí' : 'No'}</td>
                    <td>{new Date(user.last_activity).toLocaleString()}</td>
                    <td>
                      <Button
                        variant="info"
                        size="sm"
                        className="me-2"
                        onClick={() => {
                          if (expandedUserId === user.id) {
                            setExpandedUserId(null);
                            setUserCourses([]);
                          } else {
                            fetchCursosPorUsuario(user.id);
                          }
                        }}
                      >
                        {expandedUserId === user.id ? 'Ocultar Cursos' : 'Ver Cursos'}
                      </Button>
                      <Button variant="warning" size="sm" className="me-2" onClick={() => {
                        setIsEditing(true);
                        setCurrentUser(user);
                        setShowModal(true);
                      }}>
                        Editar
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => {
                        setDeleteUserId(user.id);
                        setShowDeleteConfirm(true);
                      }}>
                        Eliminar
                      </Button>
                    </td>
                  </tr>

                  {expandedUserId === user.id && (
                    <tr>
                      <td colSpan="8">
                        <strong>Cursos matriculados:</strong>
                        {userCourses.length > 0 ? (
                          <ul>
                            {userCourses.map(curso => (
                              <li key={curso.id}>{curso.name}</li>
                            ))}
                          </ul>
                        ) : (
                          <p>Este usuario no está inscrito en ningún curso.</p>
                        )}
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>


            </Table>

            <div className="d-flex justify-content-between align-items-center mt-4">
              <span>Página {page} de {totalPages}</span>
              <div>
                <Button
                  variant="secondary"
                  className="me-2"
                  onClick={handlePrevPage}
                  disabled={page === 1}
                >
                  ← Anterior
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleNextPage}
                  disabled={page === totalPages}
                >
                  Siguiente →
                </Button>
              </div>
            </div>


            {/* Modal Añadir/Editar */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                <Modal.Title>{isEditing ? 'Editar Usuario' : 'Nuevo Usuario'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control
                            type="text"
                            value={currentUser.name}
                            onChange={(e) => setCurrentUser({ ...currentUser, name: e.target.value })}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            value={currentUser.email}
                            onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="text"
                            onChange={(e) => setCurrentUser({ ...currentUser, password: e.target.value })}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Rol</Form.Label>
                        <Form.Control
                            type="text"
                            value={currentUser.rol}
                            onChange={(e) => setCurrentUser({ ...currentUser, rol: e.target.value })}
                        />
                    </Form.Group>

  
                </Form>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
                <Button variant="primary" onClick={handleSave}>
                    {isEditing ? 'Actualizar' : 'Guardar'}
                </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal Confirmación de Eliminación */}
            <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)}>
                <Modal.Header closeButton>
                <Modal.Title>Confirmar Eliminación</Modal.Title>
                </Modal.Header>
                <Modal.Body>¿Estás seguro de que deseas eliminar este usuario?</Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>Cancelar</Button>
                <Button variant="danger" onClick={handleDelete}>Eliminar</Button>
                </Modal.Footer>
            </Modal>
            </div>
        </div>
    </div>
   
  );
}

export default App;
