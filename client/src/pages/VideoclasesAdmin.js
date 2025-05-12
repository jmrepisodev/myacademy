import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, InputGroup, FormControl } from 'react-bootstrap';
import API from '../services/api';
import Sidebar from '../components/SidebarAdmin';

const apiUrl = process.env.REACT_APP_API_URL;

function VideoclasesAdmin() {
    const [videoclases, setVideoclases] = useState([]);
    const [temasDisponibles, setTemasDisponibles] = useState([]);
    const [filteredVideoclases, setFilteredVideoclases] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentClase, setCurrentClase] = useState({
      name: '',
      image: '',
      description: '',
      videoFile: null,
      duration: '',
      tema_id: ''
    });
    const [deleteClaseId, setDeleteClaseId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const [success, setSuccess] = useState('');
    const [errors, setErrors] = useState([]);
    

    const fetchVideoclases = async () => {
        try {
            const res = await API.get('/videoclases');
            setVideoclases(res.data);
            setFilteredVideoclases(res.data);
            setErrors([]);
        } catch (err) {
            console.error('Error al obtener videoclases', err);
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

    const fetchTemas = async () => {
        try {
            const res = await API.get('/temas');
            setTemasDisponibles(res.data);
            setErrors([])
        } catch (err) {
            console.error('Error al obtener temas', err);
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
        fetchVideoclases();
        fetchTemas();
    }, []);

    useEffect(() => {
        const q = searchQuery.toLowerCase();
        setFilteredVideoclases(
            videoclases.filter(vc =>
                vc.name.toLowerCase().includes(q) || vc.id.toString().includes(q)
            )
        );
    }, [searchQuery, videoclases]);

    const handleSave = async () => {
        try {
            
            const formData = new FormData();
            formData.append('name', currentClase.name);
            formData.append('description', currentClase.description);
           // formData.append('image', currentClase.image);
            formData.append('duration', currentClase.duration);
            formData.append('tema_id', currentClase.tema_id);
            formData.append('video', currentClase.videoFile);  
    
            if (isEditing) {
                await API.put(`/videoclases/update/${currentClase.id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await API.post('/videoclases/store', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
    
            setShowModal(false);
            fetchVideoclases();
            setSuccess('Videoclase guardadda satisfactoriamente');
        } catch (err) {
            console.error('Error al guardar videoclase', err.response?.data || err);
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
            await API.delete(`/videoclases/delete/${deleteClaseId}`);
            setShowDeleteConfirm(false);
            fetchVideoclases();
            setErrors('Videoclase eliminada satisfactoriamente');
        } catch (err) {
            console.error('Error al eliminar videoclase', err);
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
            <div className="col-md-2 col-lg-2 p-0 bg-dark">
                <Sidebar />
            </div>

            <div className="col p-3">
                <div className="container mt-4">
                    <h2 className="mb-4">Videoclases</h2>

                    <div className="d-flex justify-content-between mb-3">
                        <Button onClick={() => {
                            setIsEditing(false);
                            setCurrentClase({
                                name: '',
                                image: '',
                                description: '',
                                video_url: '',
                                duration: '',
                                tema_id: ''
                            });
                            setShowModal(true);
                        }}>
                            Añadir Videoclase
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
                        {errors.map((err, index) => (
                            <li key={index}>{err.msg}</li>
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
                                <th>Duración</th>
                                <th>Video</th>
                                <th>Tema</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredVideoclases.map(clase => (
                                <tr key={clase.id}>
                                    <td>{clase.id}</td>
                                    <td>{clase.name}</td>
                                    <td>{clase.description}</td>
                                    <td>{clase.duration} min</td>
                                    <td><a href={`${apiUrl}/uploads/${clase.video_url}`} target="_blank" rel="noopener noreferrer">Ver</a></td>
                                    <td>{clase.tema_id}</td>
                                    <td>
                                        <Button variant="warning" size="sm" className="me-2" onClick={() => {
                                            setIsEditing(true);
                                            setCurrentClase(clase);
                                            setShowModal(true);
                                        }}>
                                            Editar
                                        </Button>
                                        <Button variant="danger" size="sm" onClick={() => {
                                            setDeleteClaseId(clase.id);
                                            setShowDeleteConfirm(true);
                                        }}>
                                            Eliminar
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    {/* Modal Videoclase */}
                    <Modal show={showModal} onHide={() => setShowModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>{isEditing ? 'Editar Videoclase' : 'Nueva Videoclase'}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                <Form.Group className="mb-2">
                                    <Form.Label>Nombre</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={currentClase.name}
                                        onChange={(e) => setCurrentClase({ ...currentClase, name: e.target.value })}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-2">
                                    <Form.Label>Descripción</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={2}
                                        value={currentClase.description}
                                        onChange={(e) => setCurrentClase({ ...currentClase, description: e.target.value })}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-2">
                                    <Form.Label>Imagen (URL)</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={currentClase.image}
                                        onChange={(e) => setCurrentClase({ ...currentClase, image: e.target.value })}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-2">
                                    <Form.Label>Video (archivo .mp4, .webm...)</Form.Label>
                                    <Form.Control
                                        type="file"
                                        accept="video/*"
                                        onChange={(e) => setCurrentClase({ ...currentClase, videoFile: e.target.files[0] })}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-2">
                                    <Form.Label>Duración (minutos)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        min="0"
                                        value={currentClase.duration}
                                        onChange={(e) => setCurrentClase({ ...currentClase, duration: parseInt(e.target.value) || '' })}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Tema</Form.Label>
                                    <Form.Select
                                        value={currentClase.tema_id}
                                        onChange={(e) => setCurrentClase({ ...currentClase, tema_id: e.target.value })}
                                    >
                                        <option value="">Seleccione un tema</option>
                                        {temasDisponibles.map(tema => (
                                            <option key={tema.id} value={tema.id}>{tema.name}</option>
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

                    {/* Confirmación de eliminación */}
                    <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Confirmar Eliminación</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>¿Estás seguro de que deseas eliminar esta videoclase?</Modal.Body>
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

export default VideoclasesAdmin;

