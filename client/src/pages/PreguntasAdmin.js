import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, InputGroup, FormControl } from 'react-bootstrap';
import API from '../services/api';
import Sidebar from '../components/SidebarAdmin';

function PreguntasAdmin() {
    const [preguntas, setPreguntas] = useState([]);
    const [testsDisponibles, setTestsDisponibles] = useState([]);
    const [filteredPreguntas, setFilteredPreguntas] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentPregunta, setCurrentPregunta] = useState({
        question: '',
        option1: '',
        option2: '',
        option3: '',
        option4: '',
        right_answer: null,
        answer_explained: '',
        difficulty: 'medium',
        test_id: ''
    });
    const [deletePreguntaId, setDeletePreguntaId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const [success, setSuccess] = useState('');
    const [errors, setErrors] = useState([]);

    const [paginaActual, setPaginaActual] = useState(1);
    const [limit] = useState(3);
    const [totalPaginas, setTotalPaginas] = useState(1);

/*
    const fetchPreguntas = async () => {
        try {
            const res = await API.get('/preguntas');
            setPreguntas(res.data);
            setFilteredPreguntas(res.data);
            setErrors([]);
        } catch (err) {
            console.error('Error al obtener preguntas', err);
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
*/
const fetchPreguntas = async (page = 1) => {
    try {
        const res = await API.get(`/preguntas?page=${page}&limit=${limit}`);
        const { questions, totalPages } = res.data;

        setPreguntas(questions);
        setFilteredPreguntas(questions);
        setTotalPaginas(totalPages);
        setErrors([]);
    } catch (err) {
        console.error('Error al obtener preguntas', err);
        setErrors([{ msg: 'Error al obtener preguntas.' }]);
    }
};


    

    const fetchTests = async () => {
        try {
            const res = await API.get('/tests');
            setTestsDisponibles(res.data);
            setErrors([]);
        } catch (err) {
            console.error('Error al obtener tests', err);
            setErrors([{ msg: 'Error al obtener los tests.' }]);
        }
    };

    useEffect(() => {
        fetchPreguntas(paginaActual); // Carga la primera página al inicio
        fetchTests(); // mantiene los tests
    }, [paginaActual]);

    useEffect(() => {
        const q = searchQuery.toLowerCase();
        setFilteredPreguntas(
            preguntas.filter(p =>
                p.question.toLowerCase().includes(q) || p.id.toString().includes(q)
            )
        );
    }, [searchQuery, preguntas]);

    // Navegación de páginas
    const handleNextPage = () => {
        if (paginaActual < totalPaginas) {
            setPaginaActual(prev => prev + 1);
        }
    };
    
    const handlePrevPage = () => {
        if (paginaActual > 1) {
            setPaginaActual(prev => prev - 1);
        }
    };


    const handleSave = async () => {
        try {
            if (!currentPregunta.question || !currentPregunta.option1 || !currentPregunta.option2 || !currentPregunta.test_id) {
                alert('Por favor, completa todos los campos obligatorios.');
                return;
            }

            if (isEditing) {
                await API.put(`/preguntas/update/${currentPregunta.id}`, currentPregunta);
            } else {
                await API.post('/preguntas/store', currentPregunta);
            }

            setShowModal(false);
            fetchPreguntas();
            setSuccess('Pregunta guardada satisfactoriamente')
        } catch (err) {
            console.error('Error al guardar pregunta', err.response?.data || err);
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
            await API.delete(`/preguntas/delete/${deletePreguntaId}`);
            setShowDeleteConfirm(false);
            fetchPreguntas();
            setSuccess('Pregunta eliminada satisfactoriamente')
        } catch (err) {
            console.error('Error al eliminar pregunta', err);
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
                    <h2 className="mb-4">Preguntas</h2>

                    <div className="d-flex justify-content-between mb-3">
                        <Button onClick={() => {
                            setIsEditing(false);
                            setCurrentPregunta({
                                question: '', option1: '', option2: '', option3: '', option4: '',
                                right_answer: null, answer_explained: '', difficulty: 'medium', test_id: ''
                            });
                            setShowModal(true);
                        }}>
                            Añadir Pregunta
                        </Button>

                        <InputGroup style={{ width: '300px' }}>
                            <FormControl
                                placeholder="Buscar por pregunta o ID"
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
                                <th>Pregunta</th>
                                <th>Opciones</th>
                                <th>Correcta</th>
                                <th>Explicación</th>
                                <th>Test</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPreguntas.map(p => (
                                <tr key={p.id}>
                                    <td>{p.id}</td>
                                    <td>{p.question}</td>
                                    <td>
                                        {[p.option1, p.option2, p.option3, p.option4].filter(Boolean).map((opt, idx) => (
                                            <div key={idx}>{idx + 1}. {opt}</div>
                                        ))}
                                    </td>
                                    <td>{p.right_answer}</td>
                                    <td>{p.answer_explained}</td>
                                    <td>{p.test_id}</td>
                                    <td>
                                        <Button variant="warning" size="sm" className="me-2" onClick={() => {
                                            setIsEditing(true);
                                            setCurrentPregunta(p);
                                            setShowModal(true);
                                        }}>
                                            Editar
                                        </Button>
                                        <Button variant="danger" size="sm" onClick={() => {
                                            setDeletePreguntaId(p.id);
                                            setShowDeleteConfirm(true);
                                        }}>
                                            Eliminar
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>


                      <div className="d-flex justify-content-between align-items-center my-4">
                        <span>Página {paginaActual} de {totalPaginas}</span>
                        <div>
                            <Button
                                variant="secondary"
                                className="me-2"
                                onClick={handlePrevPage}
                                disabled={paginaActual === 1}
                            >
                                Anterior
                            </Button>
                            
                            <Button
                                variant="secondary"
                                className="ms-2"
                                onClick={handleNextPage}
                                disabled={paginaActual === totalPaginas}
                            >
                                Siguiente
                            </Button>
                        </div>
                        
                    </div>

                    {/* Modal de pregunta */}
                    <Modal show={showModal} onHide={() => setShowModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>{isEditing ? 'Editar Pregunta' : 'Nueva Pregunta'}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label>Pregunta</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={2}
                                        value={currentPregunta.question}
                                        onChange={(e) => setCurrentPregunta({ ...currentPregunta, question: e.target.value })}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-2">
                                    <Form.Label>Opción 1</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={currentPregunta.option1}
                                        onChange={(e) => setCurrentPregunta({ ...currentPregunta, option1: e.target.value })}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-2">
                                    <Form.Label>Opción 2</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={currentPregunta.option2}
                                        onChange={(e) => setCurrentPregunta({ ...currentPregunta, option2: e.target.value })}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-2">
                                    <Form.Label>Opción 3</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={currentPregunta.option3}
                                        onChange={(e) => setCurrentPregunta({ ...currentPregunta, option3: e.target.value })}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-2">
                                    <Form.Label>Opción 4</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={currentPregunta.option4}
                                        onChange={(e) => setCurrentPregunta({ ...currentPregunta, option4: e.target.value })}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-2">
                                    <Form.Label>Respuesta correcta (1-4)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        min={1}
                                        max={4}
                                        value={currentPregunta.right_answer || ''}
                                        onChange={(e) => setCurrentPregunta({ ...currentPregunta, right_answer: parseInt(e.target.value) || null })}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-2">
                                    <Form.Label>Explicación (opcional)</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={2}
                                        value={currentPregunta.answer_explained}
                                        onChange={(e) => setCurrentPregunta({ ...currentPregunta, answer_explained: e.target.value })}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-2">
                                    <Form.Label>Dificultad</Form.Label>
                                    <Form.Select
                                        value={currentPregunta.difficulty}
                                        onChange={(e) => setCurrentPregunta({ ...currentPregunta, difficulty: e.target.value })}
                                    >
                                        <option value="easy">Fácil</option>
                                        <option value="medium">Media</option>
                                        <option value="hard">Difícil</option>
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Test</Form.Label>
                                    <Form.Select
                                        value={currentPregunta.test_id}
                                        onChange={(e) => setCurrentPregunta({ ...currentPregunta, test_id: e.target.value })}
                                    >
                                        <option value="">Seleccione un test</option>
                                        {testsDisponibles.map(test => (
                                            <option key={test.id} value={test.id}>{test.name}</option>
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
                        <Modal.Body>¿Estás seguro de que deseas eliminar esta pregunta?</Modal.Body>
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

export default PreguntasAdmin;
