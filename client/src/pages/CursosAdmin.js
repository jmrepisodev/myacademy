import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, InputGroup, FormControl, Row, Col } from 'react-bootstrap';
import API from '../services/api';
import Sidebar from '../components/SidebarAdmin';

const apiUrl = process.env.REACT_APP_API_URL;

function Cursos() {
    const [cursos, setCursos] = useState([]);
    const [filteredCursos, setFilteredCursos] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentCurso, setCurrentCurso] = useState({
        name: '',
        description: '',
        image: '',
        status: 'activo', 
        profesor_id: ''
    });
    const [deleteCursoId, setDeleteCursoId] = useState(null);

    const [searchQuery, setSearchQuery] = useState('');
    const [estadoFiltro, setEstadoFiltro] = useState('');
    const [profesorFiltro, setProfesorFiltro] = useState('');
   
    
    const [showTemaModal, setShowTemaModal] = useState(false);
    const [temaActual, setTemaActual] = useState(null);
    const [showDeleteTemaConfirm, setShowDeleteTemaConfirm] = useState(false);
    const [deleteTemaId, setDeleteTemaId] = useState(null);

    const [cursoExpandido, setCursoExpandido] = useState(null);
    const [temasCurso, setTemasCurso] = useState([]);
    const [usuariosCurso, setUsuariosCurso] = useState([]);
   
    const [profesores, setProfesores] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit= 10;

    const [errors, setErrors] = useState([]);
    const [success, setSuccess] = useState('');
     

    const [showUnenrollConfirm, setShowUnenrollConfirm] = useState(false);
    const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);
/*
    //Devuelve resultados paginados, no filtrados desde el backend (filtro local)
    const fetchCursos = async () => {
        try {
            const res = await API.get(`/cursos?page=${currentPage}&limit=${limit}`);
            setCursos(res.data.cursos);
            setFilteredCursos(res.data.cursos); 
            setTotalPages(res.data.totalPages);
            setCurrentPage(res.data.page);
            setErrorMessage('');
        } catch (err) {
            console.error('Error al obtener cursos', err);
            setErrorMessage('Error al intentar obtener los cursos');
        }
    };

    useEffect(() => {
        fetchCursos();
    }, [currentPage, limit]);
*/
    
    //Devuelve resultados paginados y filtrados del backend
    const fetchCursos = async () => {
        try {
            const queryParams = new URLSearchParams({
                page: currentPage,
                limit,
                query: searchQuery,
                estado: estadoFiltro,
                profesor: profesorFiltro,
            });
    
            const res = await API.get(`/cursos?${queryParams.toString()}`);
            setCursos(res.data.cursos);
            setFilteredCursos(res.data.cursos);
            setTotalPages(res.data.totalPages);
            setCurrentPage(res.data.page);
            setErrors([]);
        } catch (err) {
            console.error('Error al obtener cursos', err);        
            setErrors([{ msg: 'Error al obtener la lista de cursos.' }]);
        }
    };

    useEffect(() => {
    fetchCursos();
}, [currentPage, limit, searchQuery, estadoFiltro, profesorFiltro]);

   

    const fetchProfesores = async () => {
        try {
            const res = await API.get('/usuarios?rol=teacher');
            setProfesores(res.data.users);
        } catch (err) {
            console.error('Error al obtener profesores', err);
            setErrors([{ msg: 'Error al obtener la lista de profesores.' }]);
        }
    };

    useEffect(() => {
        fetchProfesores();
    }, []);

    // Navegación de páginas
     const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
      };

      const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(prev => prev - 1);
      };

   
/*   //filtros locales del frontend
    useEffect(() => {
        const q = searchQuery.toLowerCase();
        const estado = estadoFiltro.toLowerCase();
        const profesor = profesorFiltro.toLowerCase();
    
        const cursosFiltrados = cursos.filter(curso => {
            const matchesNombre = curso.name.toLowerCase().includes(q) || curso.id.toString().includes(q);
            const matchesEstado = !estado || curso.status.toLowerCase() === estado;
           // const matchesProfesor = !profesor || (curso.profesor_id && curso.profesor_id.toString().toLowerCase().includes(profesor));
            const matchesProfesor = !profesor || curso.profesor_id?.toString() === profesor;
            return matchesNombre && matchesEstado && matchesProfesor;
        });
    
        setFilteredCursos(cursosFiltrados);
    }, [searchQuery, estadoFiltro, profesorFiltro, cursos]);
*/
    useEffect(() => {
        setFilteredCursos(cursos); // Ya vienen filtrados del backend
    }, [cursos]);

    const handleSave = async () => {
        try {
            if (isEditing) {
                await API.put(`/cursos/update/${currentCurso.id}`, currentCurso);
            } else {
                await API.post('/cursos/store', currentCurso);
            }
            setShowModal(false);
            fetchCursos();

            setSuccess(isEditing ? 'Curso actualizado correctamente' : 'Curso creado exitosamente');
            setTimeout(() => setSuccess(''), 3000); // Oculta a los 3 segundos
        } catch (err) {
            console.error('Error al guardar curso', err);
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
            await API.delete(`/cursos/delete/${deleteCursoId}`);
            setShowDeleteConfirm(false);

            fetchCursos();
            setSuccess('Curso eliminado correctamente');
            setTimeout(() => setSuccess(''), 3000); // Oculta a los 3 segundos
        } catch (err) {
            console.error('Error al eliminar curso', err);
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

    const fetchTemasPorCurso = async (cursoId) => {
        try {
            const res = await API.get(`/temas/curso/${cursoId}`);
            setTemasCurso(res.data);
            setCursoExpandido(cursoId);
            setErrors([]);
        } catch (err) {
            console.error('Error al obtener temas:', err);
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
   
    const handleDeleteTema = async () => {
        try {
            await API.delete(`/temas/delete/${deleteTemaId}`);
            fetchTemasPorCurso(cursoExpandido);
            setShowDeleteTemaConfirm(false);
            setSuccess('Tema eliminado satisfactoriamente')
        } catch (err) {
            console.error('Error al eliminar tema:', err);
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
    
    const handleSaveTema = async () => {
        try {
            const formData = new FormData();
            formData.append('indice_tema', temaActual.indice_tema);
            formData.append('name', temaActual.name);
            formData.append('description', temaActual.description);
            formData.append('curso_id', temaActual.curso_id);

            if (temaActual.pdf instanceof File) {
                formData.append('pdf', temaActual.pdf);
            }

            if (temaActual.id) {
                await API.put(`/temas/update/${temaActual.id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await API.post('/temas/store', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }

            fetchTemasPorCurso(cursoExpandido);
            setShowTemaModal(false);
            setSuccess('Tema guardado satisfactoriamente')
        } catch (err) {
            console.error('Error al guardar tema:', err);
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


    //Expande los detalles del curso: temas y alumnos inscritos
    const handleExpandCurso = async (cursoId) => {
        if (cursoExpandido === cursoId) {
            setCursoExpandido(null); // Cierra si ya está abierto
            return;
        }
    
        try {
            /*
            const [temasRes, usuariosRes] = await Promise.all([
                API.get(`/temas/curso/${cursoId}`),
                API.get(`/cursos/${cursoId}/usuarios`)
            ]);
    */

            const [temasRes, usuariosRes] = await Promise.all([
                API.get(`/temas/curso/${cursoId}`).catch(err => {
                    if (err.response && err.response.status === 404) return { data: [] }; // No hay temas
                    throw err; // Re-lanza otros errores
                }),
                API.get(`/cursos/${cursoId}/usuarios`).catch(err => {
                    if (err.response && err.response.status === 404) return { data: [] }; // No hay usuarios
                    throw err;
                })
            ]);
            
            setTemasCurso(temasRes.data);
            setUsuariosCurso(usuariosRes.data);
            setCursoExpandido(cursoId);
            setErrors([])
        } catch (err) {
            console.error('Error al expandir curso:', err);
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

    const confirmarBajaAlumno = (usuario) => {
        setUsuarioAEliminar(usuario);
        setShowUnenrollConfirm(true);
    };

    const handleUnenrollUser = async () => {
        if (!usuarioAEliminar) return;
    
        try {
            await API.delete(`/cursos/${cursoExpandido}/usuarios/${usuarioAEliminar.id}`);
            handleExpandCurso(cursoExpandido);
            setShowUnenrollConfirm(false);

            setSuccess(`El alumno ${usuarioAEliminar.name} ha sido dado de baja correctamente`);
            setTimeout(() => setSuccess(''), 3000); // Oculta a los 3 segundos
            setUsuarioAEliminar(null);
            
        } catch (err) {
            console.error('Error al dar de baja al usuario:', err);
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
    

    return (
        <div className="container-fluid p-0 min-vh-100 d-flex">
            {/* Sidebar */}
            <div className="col-md-2 col-lg-2 p-0 bg-dark">
                <Sidebar />
            </div>

            {/* Contenido */}
            <div className="col p-3">
                <div className="container mt-4">
                    <h2 className="mb-4">Cursos</h2>

                    <div className="d-flex justify-content-between mb-3">
                        <Button onClick={() => {
                            setIsEditing(false);
                            setCurrentCurso({
                                name: '',
                                description: '',
                                image: '',
                                status: 'activo', 
                                profesor_id: ''
                            });
                            setShowModal(true);
                        }}>
                            Añadir Curso
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
                                    value={estadoFiltro}
                                    onChange={(e) => setEstadoFiltro(e.target.value)}
                                >
                                    <option value="">Todos</option>
                                    <option value="activo">Activo</option>
                                    <option value="inactivo">Inactivo</option>
                                </Form.Select>
                            </Col>
                            <Col md={3}>
                                <Form.Select
                                    style={{ width: '200px' }}
                                    value={profesorFiltro}
                                    onChange={(e) => setProfesorFiltro(e.target.value)}
                                >
                                    <option value="">Todos los Profesores</option>
                                    {profesores.map(p => (
                                        <option key={p.id} value={p.id}>{p.name}</option>
                                    ))}
                                </Form.Select>
                            </Col>
                        </Row>
                    </div>

                    {success && <div className="alert alert-success">{success}</div>}
                    {errors.length > 0 && (
                    <div className="alert alert-danger">
                        <ul className="mb-0">
                        {errors.map((err, index) => (
                            <li key={index}>{err.msg}</li>
                        ))}
                        </ul>
                    </div>
                    )}

                    <p>Total de cursos: {filteredCursos.length}</p>
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Descripción</th>
                                <th>ID profesor</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCursos.map(curso => (
                               <tr key={curso.id}>
                               <td>{curso.id}</td>
                               <td>{curso.name}</td>
                               <td>{curso.description}</td>
                               <td>{curso.profesor_name || 'Sin asignar'}</td>
                               <td>{curso.status}</td>
                               <td>
                                    <Button
                                        variant="info"
                                        size="sm"
                                        className="me-2"
                                        onClick={() => handleExpandCurso(curso.id)}
                                    >
                                        {cursoExpandido === curso.id ? 'Cerrar Detalles' : 'Ver Detalles'}
                                    </Button>
                           
                                   <Button
                                       variant="warning"
                                       size="sm"
                                       className="me-2"
                                       onClick={() => {
                                           setIsEditing(true);
                                           setCurrentCurso(curso);
                                           setShowModal(true);
                                       }}
                                   >
                                       Editar
                                   </Button>
                           
                                   <Button
                                       variant="danger"
                                       size="sm"
                                       onClick={() => {
                                           setDeleteCursoId(curso.id);
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

                    <div className="d-flex justify-content-between align-items-center my-4">
                        <span>Página {currentPage} de {totalPages}</span>
                        <div>
                            <Button
                                variant="secondary"
                                className="me-2"
                                onClick={handlePrevPage}
                                disabled={currentPage === 1}
                            >
                                Anterior
                            </Button>
                            
                            <Button
                                variant="secondary"
                                className="ms-2"
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages}
                            >
                                Siguiente
                            </Button>
                        </div>
                        
                    </div>

                    {cursoExpandido && (
                        <div className="mt-5 border p-4 rounded bg-light shadow-sm">
                            <h4>Detalles del curso ID {cursoExpandido}</h4>

                            {/* Temas */}
                            <div className="mt-4">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <h5>Temas</h5>
                                    <Button size="sm" onClick={() => {
                                        setTemaActual({ name: '', description: '', image: '', pdf: '', curso_id: cursoExpandido });
                                        setShowTemaModal(true);
                                    }}>
                                        Añadir Tema
                                    </Button>
                                </div>

                                <p>Total de temas: {temasCurso.length}</p>
                                <Table striped bordered hover responsive>
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Índice</th>
                                            <th>Nombre</th>
                                            <th>Descripción</th>
                                            <th>PDF</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {temasCurso.length > 0 ? temasCurso.map(tema => (
                                            <tr key={tema.id}>
                                                <td>{tema.id}</td>
                                                <td>{tema.orden}</td>
                                                <td>{tema.name}</td>
                                                <td>{tema.description}</td>
                                                <td>
                                                    {tema.pdf_url && (
                                                        <a href={`${apiUrl}/uploads/${tema.pdf_url}`} target="_blank" rel="noopener noreferrer">Ver PDF</a>
                                                    )}
                                                </td>
                                                <td>
                                                    <Button variant="warning" size="sm" className="me-2" onClick={() => {
                                                        setTemaActual(tema);
                                                        setShowTemaModal(true);
                                                    }}>
                                                        Editar
                                                    </Button>
                                                    <Button variant="danger" size="sm" onClick={() => {
                                                        setDeleteTemaId(tema.id);
                                                        setShowDeleteTemaConfirm(true);
                                                    }}>
                                                        Eliminar
                                                    </Button>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="5">No hay temas disponibles.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </div>

                            {/* Usuarios */}
                            <div className="mt-4">
                                <h5>Alumnos Inscritos</h5>

                                <p>Total de alumnos: {usuariosCurso.length}</p>
                                <Table striped bordered hover responsive>
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Nombre</th>
                                            <th>Email</th>
                                            <th>Estado</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {usuariosCurso.length > 0 ? usuariosCurso.map(usuario => (
                                            <tr key={usuario.id}>
                                                <td>{usuario.id}</td>
                                                <td>{usuario.name}</td>
                                                <td>{usuario.email}</td>
                                                <td>{usuario.status}</td>
                                                <td>
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    onClick={() => confirmarBajaAlumno(usuario)}
                                                >
                                                    Dar de Baja
                                                </Button>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="4">No hay alumnos inscritos.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </div>
                        </div>
                    )}


                    {/* Modal de Curso */}
                    <Modal show={showModal} onHide={() => setShowModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>{isEditing ? 'Editar Curso' : 'Nuevo Curso'}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label>Nombre</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={currentCurso.name}
                                        onChange={(e) => setCurrentCurso({ ...currentCurso, name: e.target.value })}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Descripción</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        value={currentCurso.description}
                                        onChange={(e) => setCurrentCurso({ ...currentCurso, description: e.target.value })}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>URL de la imagen</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={currentCurso.image}
                                        onChange={(e) => setCurrentCurso({ ...currentCurso, image: e.target.value })}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Estado</Form.Label>
                                    <Form.Select
                                        value={currentCurso.status || 'activo'}
                                        onChange={(e) => setCurrentCurso({ ...currentCurso, status: e.target.value })}
                                    >
                                        <option value="activo">Activo</option>
                                        <option value="inactivo">Inactivo</option>
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Profesor</Form.Label>
                                        <Form.Select
                                            value={currentCurso.profesor_id}
                                            onChange={(e) => setCurrentCurso({ ...currentCurso, profesor_id: e.target.value })}
                                        >
                                            <option value="">Profesor</option>
                                            {profesores.map(p => (
                                                <option key={p.id} value={p.id}>{p.name}</option>
                                            ))}
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
                        <Modal.Body>¿Estás seguro de que deseas eliminar este curso?</Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>Cancelar</Button>
                            <Button variant="danger" onClick={handleDelete}>Eliminar</Button>
                        </Modal.Footer>
                    </Modal>

                    {/* Modal para actualizar los temas */}
                    <Modal show={showTemaModal} onHide={() => setShowTemaModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>{temaActual?.id ? 'Editar Tema' : 'Nuevo Tema'}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label>Índice</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={temaActual?.indice_tema || ''}
                                        onChange={(e) => setTemaActual({ ...temaActual, indice_tema: e.target.value })}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Nombre</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={temaActual?.name || ''}
                                        onChange={(e) => setTemaActual({ ...temaActual, name: e.target.value })}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Descripción</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        value={temaActual?.description || ''}
                                        onChange={(e) => setTemaActual({ ...temaActual, description: e.target.value })}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>PDF</Form.Label>
                                    <Form.Control
                                        type="file"
                                        accept="application/pdf"
                                        onChange={(e) => setTemaActual({ ...temaActual, pdf: e.target.files[0] })}
                                    />
                                </Form.Group>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowTemaModal(false)}>Cancelar</Button>
                            <Button variant="primary" onClick={handleSaveTema}>Guardar</Button>
                        </Modal.Footer>
                    </Modal>

                     {/* Modal de confirmación para eliminar los temas */}
                     <Modal show={showDeleteTemaConfirm} onHide={() => setShowDeleteTemaConfirm(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Confirmar Eliminación</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>¿Estás seguro de que deseas eliminar este tema?</Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowDeleteTemaConfirm(false)}>Cancelar</Button>
                            <Button variant="danger" onClick={handleDeleteTema}>Eliminar</Button>
                        </Modal.Footer>
                    </Modal>

                    {/* Modal de confirmación para dar de baja un alumno de un curso */}
                    <Modal show={showUnenrollConfirm} onHide={() => setShowUnenrollConfirm(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Confirmar Baja</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            ¿Estás seguro de que deseas dar de baja al alumno <strong>{usuarioAEliminar?.name}</strong> del curso?
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowUnenrollConfirm(false)}>Cancelar</Button>
                            <Button variant="danger" onClick={handleUnenrollUser}>Dar de Baja</Button>
                        </Modal.Footer>
                    </Modal>

                </div>
            </div>
        </div>
    );
}

export default Cursos;
