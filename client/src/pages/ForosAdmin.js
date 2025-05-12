import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, InputGroup, FormControl } from 'react-bootstrap';
import API from '../services/api';
import Sidebar from '../components/SidebarAdmin';

function ForosAdmin() {
    const [foros, setForos] = useState([]);
    const [filteredForos, setFilteredForos] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentForo, setCurrentForo] = useState({ name: '', description: '', slug: '' });
    const [deleteForoId, setDeleteForoId] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const [expandedForoId, setExpandedForoId] = useState(null);
    const [hilosPorForo, setHilosPorForo] = useState({});
    const [showHiloModal, setShowHiloModal] = useState(false);
    const [editingHilo, setEditingHilo] = useState(null);
    const [showDeleteHiloConfirm, setShowDeleteHiloConfirm] = useState(false);
    const [hiloToDelete, setHiloToDelete] = useState(null);

    const [success, setSuccess] = useState('');
    const [errors, setErrors] = useState([]);

    useEffect(() => {
        fetchForos();
    }, []);

    useEffect(() => {
        const q = searchQuery.toLowerCase();
        setFilteredForos(foros.filter(f =>
            f.name.toLowerCase().includes(q) || f.id.toString().includes(q)
        ));
    }, [searchQuery, foros]);

    const handleApiError = (err) => {
        console.error(err);
        if (err.response) {
            const data = err.response.data;
            if (data.errors) {
                setErrors(data.errors.map((e) => ({ msg: e.msg })));
            } else if (data.error) {
                setErrors([{ msg: data.error }]);
            } else {
                setErrors([{ msg: 'Error desconocido del servidor.' }]);
            }
        } else {
            setErrors([{ msg: 'No se pudo conectar con el servidor.' }]);
        }
    };

    const fetchForos = async () => {
        try {
            const res = await API.get('/foros');
            setForos(res.data);
            setFilteredForos(res.data);
            setErrors([]);
        } catch (err) {
            handleApiError(err);
        }
    };

    const handleSave = async () => {
        if (!currentForo.name || !currentForo.slug) {
            alert('Por favor, completa los campos obligatorios.');
            return;
        }

        try {
            if (isEditing) {
                await API.put(`/foros/update/${currentForo.id}`, currentForo);
            } else {
                await API.post('/foros/store', currentForo);
            }
            setShowModal(false);
            setSuccess('Foro guardado correctamente');
            setErrors([]);
            fetchForos();
        } catch (err) {
            setSuccess('');
            handleApiError(err);
        }
    };

    const handleDelete = async () => {
        try {
            await API.delete(`/foros/delete/${deleteForoId}`);
            setShowDeleteConfirm(false);
            setSuccess('Foro eliminado correctamente');
            fetchForos();
        } catch (err) {
            setSuccess('');
            handleApiError(err);
        }
    };

    //Gestionar los hilos
    const fetchHilosForo = async (foroId) => {
    try {
        const res = await API.get(`/foros/id/${foroId}/hilos`);
        console.log(res.data)
        setHilosPorForo(prev => ({ ...prev, [foroId]: res.data }));
    } catch (err) {
        handleApiError(err);
    }
};

const toggleHilos = (foroId) => {
    if (expandedForoId === foroId) {
        setExpandedForoId(null);
    } else {
        if (!hilosPorForo[foroId]) {
            fetchHilosForo(foroId);
        }
        setExpandedForoId(foroId);
    }
};

const handleSaveHilo = async () => {
    try {
        const { foro_id } = editingHilo;
        if (!editingHilo.titulo || !foro_id) {
            alert('Título y foro son obligatorios');
            return;
        }

        if (editingHilo.id) {
            await API.put(`/hilos/update/${editingHilo.id}`, editingHilo);
        } else {
            await API.post('/hilos/store', editingHilo);
        }

        setShowHiloModal(false);
        setSuccess('Hilo guardado correctamente');
        fetchHilosForo(foro_id);
    } catch (err) {
        setSuccess('');
        handleApiError(err);
    }
};

const handleDeleteHilo = async () => {
    try {
        await API.delete(`/hilos/delete/${hiloToDelete.id}`);
        fetchHilosForo(hiloToDelete.foro_id);
        setShowDeleteHiloConfirm(false);
        setSuccess('Hilo eliminado correctamente');
    } catch (err) {
        setSuccess('');
        handleApiError(err);
    }
};


    return (
        <div className="container-fluid p-0 min-vh-100 d-flex">
            <div className="col-md-2 col-lg-2 p-0 bg-dark">
                <Sidebar />
            </div>

            <div className="col p-3">
                <div className="container mt-4">
                    <h2 className="mb-4">Administrar Foros</h2>

                    <div className="d-flex justify-content-between mb-3">
                        <Button onClick={() => {
                            setIsEditing(false);
                            setCurrentForo({ name: '', description: '', slug: '' });
                            setShowModal(true);
                        }}>
                            Añadir Foro
                        </Button>

                        <InputGroup style={{ width: '300px' }}>
                            <FormControl
                                placeholder="Buscar por nombre o ID"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </InputGroup>
                    </div>

                    {success && <div className="alert alert-success">{success}</div>}
                    {errors.length > 0 && (
                        <div className="alert alert-danger">
                            <ul className="mb-0">
                                {errors.map((err, i) => (
                                    <li key={i}>{err.msg}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Descripción</th>
                                <th>Slug</th>
                                <th>Creado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredForos.map(foro => (
                                <>
                                <tr key={foro.id}>
                                    <td>{foro.id}</td>
                                    <td>{foro.name}</td>
                                    <td>{foro.description}</td>
                                    <td>{foro.slug}</td>
                                    <td>{new Date(foro.created_at).toLocaleString()}</td>
                                    <td>
                                    <Button
                                        variant="info"
                                        size="sm"
                                        className="me-2"
                                        onClick={() => toggleHilos(foro.id)}
                                    >
                                        {expandedForoId === foro.id ? 'Ocultar Hilos' : 'Ver Hilos'}
                                    </Button>
                                    <Button
                                        variant="warning"
                                        size="sm"
                                        className="me-2"
                                        onClick={() => {
                                        setIsEditing(true);
                                        setCurrentForo(foro);
                                        setShowModal(true);
                                        }}
                                    >
                                        Editar
                                    </Button>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => {
                                        setDeleteForoId(foro.id);
                                        setShowDeleteConfirm(true);
                                        }}
                                    >
                                        Eliminar
                                    </Button>
                                    </td>
                                </tr>

                                {expandedForoId === foro.id && (
                                    <tr>
                                    <td colSpan="6">
                                        <h5 className="mt-3">Hilos del foro</h5>
                                        <Button
                                        variant="success"
                                        size="sm"
                                        className="mb-2"
                                        onClick={() => {
                                            setEditingHilo({
                                            titulo: '',
                                            contenido: '',
                                            foro_id: foro.id,
                                            usuario_id: 1 // Ajusta esto según tu lógica de autenticación
                                            });
                                            setShowHiloModal(true);
                                        }}
                                        >
                                        Añadir Hilo
                                        </Button>

                                        <Table striped bordered hover size="sm">
                                        <thead>
                                            <tr>
                                            <th>ID</th>
                                            <th>Título</th>
                                            <th>Vistas</th>
                                            <th>Fecha</th>
                                            <th>Autor</th>
                                            <th>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {(hilosPorForo[foro.id] || []).map(hilo => (
                                            <tr key={hilo.id}>
                                                <td>{hilo.id}</td>
                                                <td>{hilo.titulo}</td>
                                                <td>{hilo.vistas}</td>
                                                <td>{new Date(hilo.created_at).toLocaleString()}</td>
                                                <td>{hilo.autor}</td>
                                                <td>
                                                
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    onClick={() => {
                                                    setHiloToDelete(hilo);
                                                    setShowDeleteHiloConfirm(true);
                                                    }}
                                                >
                                                    Eliminar
                                                </Button>
                                                </td>
                                            </tr>
                                            ))}
                                        </tbody>
                                        </Table>
                                    </td>
                                    </tr>
                                )}
                                </>
                            ))}
                            </tbody>

                    </Table>

                    {/* Modal de creación/edición */}
                    <Modal show={showModal} onHide={() => setShowModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>{isEditing ? 'Editar Foro' : 'Nuevo Foro'}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label>Nombre</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={currentForo.name}
                                        onChange={(e) => setCurrentForo({ ...currentForo, name: e.target.value })}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Descripción</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        value={currentForo.description}
                                        onChange={(e) => setCurrentForo({ ...currentForo, description: e.target.value })}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Slug (URL amigable)</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={currentForo.slug}
                                        onChange={(e) => setCurrentForo({ ...currentForo, slug: e.target.value })}
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

                    {/* Modal de confirmación de eliminación de foro*/}
                    <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Confirmar Eliminación</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>¿Estás seguro de que deseas eliminar este foro?</Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>Cancelar</Button>
                            <Button variant="danger" onClick={handleDelete}>Eliminar</Button>
                        </Modal.Footer>
                    </Modal>

                     {/* Modal de confirmación de eliminación de hilo*/}
                    <Modal show={showDeleteHiloConfirm} onHide={() => setShowDeleteHiloConfirm(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Confirmar Eliminación</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>¿Estás seguro de que deseas eliminar este hilo?</Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowDeleteHiloConfirm(false)}>Cancelar</Button>
                            <Button variant="danger" onClick={handleDeleteHilo}>Eliminar</Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </div>
        </div>
    );
}

export default ForosAdmin;
