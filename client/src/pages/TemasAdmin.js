import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, InputGroup, FormControl } from 'react-bootstrap';
import API from '../services/api';
import Sidebar from '../components/SidebarAdmin';

const apiUrl = process.env.REACT_APP_API_URL;

function Temas() {
    const [temas, setTemas] = useState([]);
    const [filteredTemas, setFilteredTemas] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentTema, setCurrentTema] = useState({
        orden: '',
        name: '',
        image: '',
        description: '',
        pdf_url: '',
        curso_id: ''
    });
    const [deleteTemaId, setDeleteTemaId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [cursosDisponibles, setCursosDisponibles] = useState([]);

    const [success, setSuccess] = useState('');
    const [errors, setErrors] = useState([]);
    
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


    const fetchTemas = async () => {
        try {
            const res = await API.get('/temas');
            setTemas(res.data);
            setFilteredTemas(res.data);
            setErrors([]);
        } catch (err) {
            console.error('Error al obtener temas', err);
            setErrors([{ msg: 'Error al cargar la lista de temas' }]);
        }
    };

    
    const fetchCursos = async () => {
        try {
            const res = await API.get('/cursos');
            setCursosDisponibles(res.data.cursos);
            setErrors([])
        } catch (err) {
            console.error('Error al obtener cursos', err);
            handleApiError(err);
        }
    };

useEffect(() => {
    fetchTemas();
    fetchCursos(); 
}, []);

    useEffect(() => {
        fetchTemas();
    }, []);

    useEffect(() => {
        const q = searchQuery.toLowerCase();
        setFilteredTemas(
            temas.filter(tema =>
                tema.name.toLowerCase().includes(q) ||
                tema.id.toString().includes(q)
            )
        );
    }, [searchQuery, temas]);

    const handleSave = async () => {
        try {
          const formData = new FormData();
          formData.append('orden', currentTema.orden);
          formData.append('name', currentTema.name);
          formData.append('image', currentTema.image);
          formData.append('description', currentTema.description);
          formData.append('curso_id', currentTema.curso_id);
      
          if (currentTema.pdfFile) {
            formData.append('pdf', currentTema.pdfFile);
          }
      
          if (isEditing) {
                await API.put(`/temas/update/${currentTema.id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
                });
          } else {
                await API.post('/temas/store', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
                });
          }
      
          setShowModal(false);
          fetchTemas();
          setSuccess('Tema guardado satisfactoriamente')
        } catch (err) {
            console.error('Error al guardar tema', err);
            setSuccess('');
            handleApiError(err);
        }
      };
      

    const handleDelete = async () => {
        try {
            await API.delete(`/temas/delete/${deleteTemaId}`);
            setShowDeleteConfirm(false);
            fetchTemas();
            setSuccess('Tema eliminado satisfactoriamente')
        } catch (err) {
            console.error('Error al eliminar tema', err);
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
                    <h2 className="mb-4">Temas</h2>

                    <div className="d-flex justify-content-between mb-3">
                        <Button onClick={() => {
                            setIsEditing(false);
                            setCurrentTema({
                                orden: '',
                                name: '',
                                image: '',
                                description: '',
                                pdf_url: '',
                                curso_id: ''
                            });
                            setShowModal(true);
                        }}>
                            Añadir Tema
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
                                <th>Índice</th>
                                <th>Nombre</th>
                                <th>Imagen</th>
                                <th>Descripción</th>
                                <th>PDF</th>
                                <th>Curso ID</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTemas.map(tema => (
                                <tr key={tema.id}>
                                    <td>{tema.id}</td>
                                    <td>{tema.orden}</td>
                                    <td>{tema.name}</td>
                                    <td>{tema.image && <img 
                                        src={`${apiUrl}/uploads/${tema.image}`} 
                                        className='img-thumbnail mx-auto d-block'
                                        alt={tema.name} 
                                        width="50px"
                                        onError={(e) => {
                                        e.target.onerror = null; // evita bucle si la imagen por defecto también falla
                                        e.target.src = "/image_not_found.png"; // ruta de imagen por defecto (public/)
                                        }}
                                    />}</td>
                                    <td>{tema.description}</td>
                                    <td><a href={`${apiUrl}/uploads/${tema.pdf_url}`} target="_blank" rel="noopener noreferrer">Ver PDF</a></td>
                                    <td>{tema.curso_id}</td>
                                    <td>
                                        <Button variant="warning" size="sm" className="me-2" onClick={() => {
                                            setIsEditing(true);
                                            setCurrentTema(tema);
                                            setShowModal(true);
                                        }}>
                                            Editar
                                        </Button>
                                        <Button variant="danger" size="sm" onClick={() => {
                                            setDeleteTemaId(tema.id);
                                            setShowDeleteConfirm(true);
                                        }}>
                                            Eliminar
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    {/* Modal de Tema */}
                    <Modal show={showModal} onHide={() => setShowModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>{isEditing ? 'Editar Tema' : 'Nuevo Tema'}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label>Índice</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={currentTema.orden}
                                        onChange={(e) => setCurrentTema({ ...currentTema, orden: e.target.value })}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Nombre</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={currentTema.name}
                                        onChange={(e) => setCurrentTema({ ...currentTema, name: e.target.value })}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Descripción</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        value={currentTema.description}
                                        onChange={(e) => setCurrentTema({ ...currentTema, description: e.target.value })}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Imagen (URL)</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={currentTema.image}
                                        onChange={(e) => setCurrentTema({ ...currentTema, image: e.target.value })}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>PDF</Form.Label>
                                    <Form.Control
                                        type="file"
                                        accept="application/pdf"
                                        onChange={(e) => setCurrentTema({ ...currentTema, pdfFile: e.target.files[0] })}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Curso</Form.Label>
                                    <Form.Select
                                        value={currentTema.curso_id}
                                        onChange={(e) => setCurrentTema({ ...currentTema, curso_id: e.target.value })}
                                    >
                                        <option value="">Seleccione un curso</option>
                                        {cursosDisponibles.map(curso => (
                                            <option key={curso.id} value={curso.id}>
                                                {curso.name}
                                            </option>
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
                        <Modal.Body>¿Estás seguro de que deseas eliminar este tema?</Modal.Body>
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

export default Temas;
