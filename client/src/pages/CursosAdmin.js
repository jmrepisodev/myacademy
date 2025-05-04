import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, InputGroup, FormControl } from 'react-bootstrap';
import API from '../services/api';
import Sidebar from '../components/SidebarAdmin';

const apiUrl = process.env.REACT_APP_API_URL;

function Cursos() {
    const [cursos, setCursos] = useState([]);
    const [filteredCursos, setFilteredCursos] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentCurso, setCurrentCurso] = useState({ name: '', description: '', image: '' });
    const [deleteCursoId, setDeleteCursoId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
   
    
    const [showTemaModal, setShowTemaModal] = useState(false);
    const [temaActual, setTemaActual] = useState(null);
    const [showDeleteTemaConfirm, setShowDeleteTemaConfirm] = useState(false);
    const [deleteTemaId, setDeleteTemaId] = useState(null);

    const [cursoExpandido, setCursoExpandido] = useState(null);
    const [temasCurso, setTemasCurso] = useState([]);
    const [usuariosCurso, setUsuariosCurso] = useState([]);

    const [errorMessage, setErrorMessage] = useState('');



    const fetchCursos = async () => {
        try {
            const res = await API.get('/cursos');
            setCursos(res.data);
            setFilteredCursos(res.data);
            setErrorMessage(''); //limpia los errores anteriores
        } catch (err) {
            console.error('Error al obtener cursos', err);
            setErrorMessage('Error al intentar obtener los cursos');
        }
    };


    useEffect(() => {
        fetchCursos();
    }, []);

    useEffect(() => {
        const q = searchQuery.toLowerCase();
        setFilteredCursos(
            cursos.filter(curso =>
                curso.name.toLowerCase().includes(q) || curso.id.toString().includes(q)
            )
        );
    }, [searchQuery, cursos]);

    const handleSave = async () => {
        try {
            if (isEditing) {
                await API.put(`/cursos/update/${currentCurso.id}`, currentCurso);
            } else {
                await API.post('/cursos/store', currentCurso);
            }
            setShowModal(false);
            fetchCursos();
        } catch (err) {
            console.error('Error al guardar curso', err);
            setErrorMessage('Error al guardar curso');
        }
    };

    const handleDelete = async () => {
        try {
            await API.delete(`/cursos/delete/${deleteCursoId}`);
            setShowDeleteConfirm(false);
            fetchCursos();
        } catch (err) {
            console.error('Error al eliminar curso', err);
            setErrorMessage('Error al intentar eliminar el curso');
        }
    };

    const fetchTemasPorCurso = async (cursoId) => {
        try {
            const res = await API.get(`/temas/curso/${cursoId}`);
            setTemasCurso(res.data);
            setCursoExpandido(cursoId);
            setErrorMessage('');
        } catch (err) {
            console.error('Error al obtener temas:', err);
            setErrorMessage('Error al intentar obtener los temas');
        }
    };
   
    const handleDeleteTema = async () => {
        try {
            await API.delete(`/temas/delete/${deleteTemaId}`);
            fetchTemasPorCurso(cursoExpandido);
            setShowDeleteTemaConfirm(false);
        } catch (err) {
            console.error('Error al eliminar tema:', err);
            setErrorMessage('Error al intentar eliminar el tema');
        }
    };
    
    const handleSaveTema = async () => {
        try {
            if (temaActual.id) {
                await API.put(`/temas/update/${temaActual.id}`, temaActual, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await API.post('/temas/store', temaActual, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }

            fetchTemasPorCurso(cursoExpandido);
            setShowTemaModal(false);
        } catch (err) {
            console.error('Error al guardar tema:', err);
            setErrorMessage('Error al guardar el tema');
        }
    };


    const handleExpandCurso = async (cursoId) => {
        if (cursoExpandido === cursoId) {
            setCursoExpandido(null); // Cierra si ya está abierto
            return;
        }
    
        try {
            const [temasRes, usuariosRes] = await Promise.all([
                API.get(`/temas/curso/${cursoId}`),
                API.get(`/cursos/${cursoId}/usuarios`)
            ]);
    
            setTemasCurso(temasRes.data);
            setUsuariosCurso(usuariosRes.data);
            setCursoExpandido(cursoId);
            setErrorMessage('');
        } catch (err) {
            console.error('Error al expandir curso:', err);
            setErrorMessage('Error al cargar datos del curso');
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
                            setCurrentCurso({ name: '', description: '', image: '' });
                            setShowModal(true);
                        }}>
                            Añadir Curso
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
                                <th>Descripción</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCursos.map(curso => (
                               <tr key={curso.id}>
                               <td>{curso.id}</td>
                               <td>{curso.name}</td>
                               <td>{curso.description}</td>
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

                                <Table striped bordered hover responsive>
                                    <thead>
                                        <tr>
                                            <th>ID</th>
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
                                <Table striped bordered hover responsive>
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Nombre</th>
                                            <th>Email</th>
                                            <th>Rol</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {usuariosCurso.length > 0 ? usuariosCurso.map(usuario => (
                                            <tr key={usuario.id}>
                                                <td>{usuario.id}</td>
                                                <td>{usuario.name}</td>
                                                <td>{usuario.email}</td>
                                                <td>{usuario.rol}</td>
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

                </div>
            </div>
        </div>
    );
}

export default Cursos;
