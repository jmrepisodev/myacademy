import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, InputGroup, FormControl, Row, Col } from 'react-bootstrap';
import API from '../services/api';
import Sidebar from '../components/SidebarAdmin';

function App() {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentUser, setCurrentUser] = useState({ name: '', email: '', rol: '', status: '' });
    const [deleteUserId, setDeleteUserId] = useState(null);

    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const [expandedUserId, setExpandedUserId] = useState(null);
    const [userCourses, setUserCourses] = useState([]);

    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    const [errors, setErrors] = useState([]);
    const [success, setSuccess] = useState('');
    
  
    /*
     //Devuelve resultados paginados, no filtrados desde el backend (solo filtro local)
    const fetchUsers = async () => {
      try {
        const res = await API.get(`/usuarios?page=${page}&limit=${limit}`);
        setUsers(res.data.data);
        setFilteredUsers(res.data.data);
        setTotalPages(res.data.totalPages);
        setPage(res.data.page);
        setErrorMessage('');
      } catch (err) {
        console.error('Error al obtener usuarios', err);
        setErrorMessage('Error al intentar obtener la lista de usuarios');
      }
    };

    useEffect(() => {
      fetchUsers();
    }, [page, limit]);
  */

    //Devuelve resultados con filtros opcionales del backend y paginación
    const fetchUsers = async () => {
      try {

        const queryParams = new URLSearchParams({
          page: page,
          limit,
          query: searchQuery,
          estado: statusFilter,
          rol: roleFilter,
      });

        const res = await API.get(`/usuarios?${queryParams.toString()}`);
        setUsers(res.data.users);
        setFilteredUsers(res.data.users);
        setTotalPages(res.data.totalPages);
        setPage(res.data.page);
        setErrors([]);
      } catch (err) {
          console.error('Error al obtener usuarios', err);
          if (err.response) {
            const data = err.response.data;
            if (data.errors) {
              setErrors(data.errors.map((err) => ({ msg: err.msg })));
            } else if (data.error) {
              setErrors([{ msg: data.error }]);
            } else {
              setErrors([{ msg: 'Error desconocido del servidor.' }]);
            }
          } else {
            setErrors([{ msg: 'No se pudo conectar con el servidor.' }]);
          }
      }
    };

    useEffect(() => {
      fetchUsers();
    }, [page, limit, searchQuery, statusFilter, roleFilter]);

    // Navegación de páginas
    const handleNextPage = () => {
      if (page < totalPages) setPage(prev => prev + 1);
    };
    const handlePrevPage = () => {
      if (page > 1) setPage(prev => prev - 1);
    };

 /* //filtros locales del frontend
    useEffect(() => {
      const query = searchQuery.toLowerCase();
    
      const filtered = users.filter(user =>
        (user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query)) &&
        (roleFilter === '' || user.rol === roleFilter) &&
        (statusFilter === '' || user.status === statusFilter)
      );
    
      setFilteredUsers(filtered);
    }, [searchQuery, users, roleFilter, statusFilter]);
 */

    useEffect(() => {
      setFilteredUsers(users); // Ya vienen filtrados del backend
    }, [users]);

    const handleSave = async () => {
      try {
          if (isEditing) {
            await API.put(`/usuarios/update/${currentUser.id}`, currentUser);
          } else {
            await API.post('/usuarios/store', currentUser);
          }
          setShowModal(false);
          fetchUsers();
          setSuccess('Usuario guardadado con éxito')
      } catch (err) {
          setSuccess('');
          if (err.response) {
            const data = err.response.data;
            if (data.errors) {
              setErrors(data.errors.map((err) => ({ msg: err.msg })));
            } else if (data.error) {
              setErrors([{ msg: data.error }]);
            } else {
              setErrors([{ msg: 'Error desconocido del servidor.' }]);
            }
          } else {
            setErrors([{ msg: 'No se pudo conectar con el servidor.' }]);
          }
      }
    };
  
    const handleDelete = async () => {
      try {
        await API.delete(`/usuarios/delete/${deleteUserId}`);
        setShowDeleteConfirm(false);
        fetchUsers();
        setSuccess('Usuario eliminado satisfactoriamente')
      } catch (err) {
          console.error('Error al eliminar usuario', err);
          setSuccess('');
          if (err.response) {
            const data = err.response.data;
            if (data.errors) {
              setErrors(data.errors.map((err) => ({ msg: err.msg })));
            } else if (data.error) {
              setErrors([{ msg: data.error }]);
            } else {
              setErrors([{ msg: 'Error desconocido del servidor.' }]);
            }
          } else {
            setErrors([{ msg: 'No se pudo conectar con el servidor.' }]);
          }
        }
    };

    const fetchCursosPorUsuario = async (userId) => {
      try {
        const res = await API.get(`/usuarios/${userId}/cursos`);
        setUserCourses(res.data);
        setExpandedUserId(userId);
        setErrors([]);
      } catch (err) {
          console.error('Error al obtener cursos del usuario:', err);
          if (err.response) {
            const data = err.response.data;
            if (data.errors) {
              setErrors(data.errors.map((err) => ({ msg: err.msg })));
            } else if (data.error) {
              setErrors([{ msg: data.error }]);
            } else {
              setErrors([{ msg: 'Error desconocido del servidor.' }]);
            }
          } else {
            setErrors([{ msg: 'No se pudo conectar con el servidor.' }]);
          }
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
                setCurrentUser({ name: '', email: '', rol: '', status: 'activo' });
                setShowModal(true);
                }}>
                Añadir Usuario
                </Button>

                <Row className="mb-3">
                  <Col md={4}>
                      <InputGroup>
                          <FormControl
                              style={{ width: '300px' }}
                              placeholder="Buscar por nombre o email"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                          />
                      </InputGroup>
                  </Col>
                  <Col md={3}>
                      <Form.Select 
                        style={{ width: '150px' }}
                        value={roleFilter} 
                        onChange={(e) => setRoleFilter(e.target.value)}
                        >
                          <option value="">Todos los roles</option>
                          <option value="user">Estudiante</option>
                          <option value="teacher">Profesor</option>
                          <option value="admin">Administrador</option>
                      </Form.Select>
                  </Col>
                  <Col md={3}>
                      <Form.Select 
                        style={{ width: '150px' }}
                        value={statusFilter} 
                        onChange={(e) => setStatusFilter(e.target.value)}
                      >
                          <option value="">Todos los estados</option>
                          <option value="activo">Activo</option>
                          <option value="inactivo">Inactivo</option>
                      </Form.Select>
                  </Col>
              </Row>
            </div>

            {success && <div className="alert alert-success">{success}</div>}
            {errors.length > 0 && (
            <div className="alert alert-danger">
                <ul className="mb-0 ms-2">
                {errors.map((err, index) => (
                    <li key={index}>{err.msg}</li>
                ))}
                </ul>
            </div>
            )}

            <p>Total de usuarios: {filteredUsers.length}</p>
            <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Estado</th>
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
                    <td>{user.status}</td>
                    <td>{user.is_verified ? 'Sí' : 'No'}</td>
                    <td>{user.last_activity ? new Date(user.last_activity).toLocaleString() : '—'}</td>
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
                        <Form.Select
                            value={currentUser.rol}
                            onChange={(e) => setCurrentUser({ ...currentUser, rol: e.target.value })}
                        >
                            <option value="">Seleccionar</option>
                            <option value="user">Estudiante</option>
                            <option value="teacher">Profesor</option>
                            <option value="admin">Administrador</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Estado</Form.Label>
                      <Form.Select
                          value={currentUser.status || 'activo'}
                          onChange={(e) => setCurrentUser({ ...currentUser, status: e.target.value })}
                      >
                          <option value="activo">Activo</option>
                          <option value="inactivo">Inactivo</option>
                      </Form.Select>
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
