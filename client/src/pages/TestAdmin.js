import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, InputGroup, FormControl } from 'react-bootstrap';
import API from '../services/api';
import Sidebar from '../components/SidebarAdmin';

const apiUrl = process.env.REACT_APP_API_URL;

function TestsAdmin() {
    const [tests, setTests] = useState([]);
    const [temasDisponibles, setTemasDisponibles] = useState([]);
    const [filteredTests, setFilteredTests] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentTest, setCurrentTest] = useState({
        name: '',
        description: '',
        image: '',
        num_questions: 0,
        tema_id: ''
    });
    const [deleteTestId, setDeleteTestId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const [expandedTestId, setExpandedTestId] = useState(null);
    const [testQuestions, setTestQuestions] = useState({});

    const [showQuestionModal, setShowQuestionModal] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState(null);
    const [showDeleteQuestionConfirm, setShowDeleteQuestionConfirm] = useState(false);
    const [questionToDelete, setQuestionToDelete] = useState(null);

    const [success, setSuccess] = useState('');
    const [errors, setErrors] = useState([]);
    

    const fetchTests = async () => {
        try {
            const res = await API.get('/tests');
            setTests(res.data);
            setFilteredTests(res.data);
            setErrors([]);
        } catch (err) {
            console.error('Error al obtener tests', err);
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
            setErrors([]);
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

    const handleExpandQuestions = async (testId) => {
        if (expandedTestId === testId) {
            setExpandedTestId(null); // Oculta si ya está visible
            return;
        }
    
        if (!testQuestions[testId]) {
            try {
                const res = await API.get(`/tests/${testId}/questions`);
                setTestQuestions(prev => ({ ...prev, [testId]: res.data }));
                setErrors([])
            } catch (err) {
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
                return;
            }
        }
    
        setExpandedTestId(testId);
    };
    

    useEffect(() => {
        fetchTests();
        fetchTemas();
    }, []);

    useEffect(() => {
        const q = searchQuery.toLowerCase();
        setFilteredTests(
            tests.filter(test =>
                test.name.toLowerCase().includes(q) || test.id.toString().includes(q)
            )
        );
    }, [searchQuery, tests]);

    const handleSave = async () => {
        try {
            if (!currentTest.name || !currentTest.tema_id) {
                alert('Por favor, completa los campos obligatorios.');
                return;
            }

            if (isEditing) {
                await API.put(`/tests/update/${currentTest.id}`, currentTest);
            } else {
                await API.post('/tests/store', currentTest);
            }
            setShowModal(false);
            fetchTests();
            setSuccess('Test guardado satisfactoriamente')
        } catch (err) {
            console.error('Error al guardar test', err.response?.data || err);
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
            await API.delete(`/tests/delete/${deleteTestId}`);
            setShowDeleteConfirm(false);
            fetchTests();
            setSuccess('Test eliminado satisfactoriamente')
        } catch (err) {
            console.error('Error al eliminar test', err);
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

    const handleSaveQuestion = async () => {
        try {
            await API.put(`/preguntas/update/${editingQuestion.id}`, editingQuestion);
            const updatedQuestions = await API.get(`/tests/${editingQuestion.test_id}/questions`);
            setTestQuestions(prev => ({ ...prev, [editingQuestion.test_id]: updatedQuestions.data }));
            setShowQuestionModal(false);
            setSuccess('Pregunta guardada satisfactoriamente')
        } catch (err) {
            console.error('Error al actualizar pregunta:', err);
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
    
    const confirmDeleteQuestion = (question) => {
        setQuestionToDelete(question);
        setShowDeleteQuestionConfirm(true);
      };
      
    const handleDeleteQuestion = async () => {
        if (!questionToDelete) return;
        
        try {
            await API.delete(`/preguntas/delete/${questionToDelete.id}`);
            const updatedQuestions = await API.get(`/tests/${questionToDelete.test_id}/questions`);
            setTestQuestions(prev => ({
            ...prev,
            [questionToDelete.test_id]: updatedQuestions.data
            }));
            setShowDeleteQuestionConfirm(false);
            setQuestionToDelete(null);
            setSuccess('Pregunta eliminada satisfactoriamente')
        } catch (err) {
            console.error('Error al eliminar pregunta:', err);
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
                    <h2 className="mb-4">Tests</h2>

                    <div className="d-flex justify-content-between mb-3">
                        <Button onClick={() => {
                            setIsEditing(false);
                            setCurrentTest({ name: '', description: '', image: '', num_questions: 0, tema_id: '' });
                            setShowModal(true);
                        }}>
                            Añadir Test
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
                                <th>Imagen</th>
                                <th>Nº preguntas</th>
                                <th>intentos max.</th>
                                <th>tiempo max.</th>
                                <th>Tema</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                        {filteredTests.map(test => (
                            <React.Fragment key={test.id}>
                            <tr>
                                <td>{test.id}</td>
                                <td>{test.name}</td>
                                <td>{test.description}</td>
                                <td>{test.image && <img 
                                        src={`${apiUrl}/uploads/${test.image}`} 
                                        className='img-thumbnail mx-auto d-block'
                                        alt={test.name} 
                                        width="50px"
                                        onError={(e) => {
                                        e.target.onerror = null; // evita bucle si la imagen por defecto también falla
                                        e.target.src = "/image_not_found.png"; // ruta de imagen por defecto (public/)
                                        }}
                                    />}</td>
                                <td>{test.num_questions}</td>
                                <td>{test.intentos_max}</td>
                                <td>{test.tiempo_limite}</td>
                                <td>{test.tema_id}</td>
                                <td>
                                <Button
                                    variant="info"
                                    size="sm"
                                    className="me-2"
                                    onClick={() => handleExpandQuestions(test.id)}
                                >
                                    {expandedTestId === test.id ? 'Ocultar Detalles' : 'Ver Detalles'}
                                </Button>
                                <Button
                                    variant="warning"
                                    size="sm"
                                    className="me-2"
                                    onClick={() => {
                                    setIsEditing(true);
                                    setCurrentTest(test);
                                    setShowModal(true);
                                    }}
                                >
                                    Editar
                                </Button>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => {
                                    setDeleteTestId(test.id);
                                    setShowDeleteConfirm(true);
                                    }}
                                >
                                    Eliminar
                                </Button>
                                </td>
                            </tr>

                            {expandedTestId === test.id && testQuestions[test.id] && (
                                <tr>
                                <td colSpan="7">
                                    <h5 className="mt-3">Preguntas del test</h5>
                                    <Table striped bordered hover responsive>
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Pregunta</th>
                                            <th>Opciones</th>
                                            <th>Correcta</th>
                                            <th>Explicación</th>
                                            <th>Dificultad</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {testQuestions[test.id].map(q => (
                                        <tr key={q.id}>
                                            <td>{q.id}</td>
                                            <td>{q.question}</td>
                                            <td>
                                            <ul className="mb-0 ps-3">
                                                {[1, 2, 3, 4].map(n => q[`option${n}`] && (
                                                <li key={n}>{q[`option${n}`]}</li>
                                                ))}
                                            </ul>
                                            </td>
                                            <td>{q[`option${q.right_answer}`]}</td>
                                            <td>{q.answer_explained || '-'}</td>
                                            <td>{q.difficulty}</td>
                                            <td>
                                                <Button
                                                    variant="warning"
                                                    size="sm"
                                                    className="me-2"
                                                    onClick={() => {
                                                        setEditingQuestion(q);
                                                        setShowQuestionModal(true);
                                                    }}
                                                    >
                                                    Editar
                                                </Button>
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    onClick={() => confirmDeleteQuestion(q)}
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
                            </React.Fragment>
                        ))}
                        </tbody>

                    </Table>

                    {/* Modal test */}
                    <Modal show={showModal} onHide={() => setShowModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>{isEditing ? 'Editar Test' : 'Nuevo Test'}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label>Nombre</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={currentTest.name}
                                        onChange={(e) => setCurrentTest({ ...currentTest, name: e.target.value })}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Descripción</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        value={currentTest.description}
                                        onChange={(e) => setCurrentTest({ ...currentTest, description: e.target.value })}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Imagen (URL)</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={currentTest.image}
                                        onChange={(e) => setCurrentTest({ ...currentTest, image: e.target.value })}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Número de preguntas</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={currentTest.num_questions}
                                        onChange={(e) => setCurrentTest({ ...currentTest, num_questions: parseInt(e.target.value) || 0 })}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Tema</Form.Label>
                                    <Form.Select
                                        value={currentTest.tema_id}
                                        onChange={(e) => setCurrentTest({ ...currentTest, tema_id: e.target.value })}
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
                        <Modal.Body>¿Estás seguro de que deseas eliminar este test?</Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>Cancelar</Button>
                            <Button variant="danger" onClick={handleDelete}>Eliminar</Button>
                        </Modal.Footer>
                    </Modal>

                    {/* Modal question */}
                    <Modal show={showQuestionModal} onHide={() => setShowQuestionModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Editar Pregunta</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {editingQuestion && (
                            <Form>
                                <Form.Group className="mb-3">
                                <Form.Label>Pregunta</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={editingQuestion.question}
                                    onChange={(e) => setEditingQuestion({ ...editingQuestion, question: e.target.value })}
                                />
                                </Form.Group>

                                {[1, 2, 3, 4].map(n => (
                                <Form.Group key={n} className="mb-3">
                                    <Form.Label>Opción {n}</Form.Label>
                                    <Form.Control
                                    type="text"
                                    value={editingQuestion[`option${n}`] || ''}
                                    onChange={(e) =>
                                        setEditingQuestion({ ...editingQuestion, [`option${n}`]: e.target.value })
                                    }
                                    />
                                </Form.Group>
                                ))}

                                <Form.Group className="mb-3">
                                <Form.Label>Respuesta Correcta</Form.Label>
                                <Form.Select
                                    value={editingQuestion.right_answer}
                                    onChange={(e) =>
                                    setEditingQuestion({ ...editingQuestion, right_answer: parseInt(e.target.value) })
                                    }
                                >
                                    {[1, 2, 3, 4].map(n => (
                                    <option key={n} value={n}>Opción {n}</option>
                                    ))}
                                </Form.Select>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                <Form.Label>Explicación</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={2}
                                    value={editingQuestion.answer_explained || ''}
                                    onChange={(e) =>
                                    setEditingQuestion({ ...editingQuestion, answer_explained: e.target.value })
                                    }
                                />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                <Form.Label>Dificultad</Form.Label>
                                <Form.Select
                                    value={editingQuestion.difficulty}
                                    onChange={(e) =>
                                    setEditingQuestion({ ...editingQuestion, difficulty: e.target.value })
                                    }
                                >
                                    <option value="easy">Fácil</option>
                                    <option value="medium">Media</option>
                                    <option value="hard">Difícil</option>
                                </Form.Select>
                                </Form.Group>
                            </Form>
                            )}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowQuestionModal(false)}>Cancelar</Button>
                            <Button variant="primary" onClick={handleSaveQuestion}>Guardar</Button>
                        </Modal.Footer>
                        </Modal>

                        {/* Modal confirmación eliminación question */}
                        <Modal show={showDeleteQuestionConfirm} onHide={() => setShowDeleteQuestionConfirm(false)}>
                            <Modal.Header closeButton>
                                <Modal.Title>Confirmar Eliminación</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                ¿Estás seguro de que deseas eliminar la pregunta con ID: <strong>{questionToDelete?.id}</strong>?
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={() => setShowDeleteQuestionConfirm(false)}>
                                Cancelar
                                </Button>
                                <Button variant="danger" onClick={handleDeleteQuestion}>
                                Eliminar
                                </Button>
                            </Modal.Footer>
                        </Modal>


                </div>
            </div>
        </div>
    );
}

export default TestsAdmin;
