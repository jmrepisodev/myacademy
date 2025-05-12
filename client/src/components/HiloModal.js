import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const HiloModal = ({ show, onHide, onSave, initialData = {}, modo = 'crear' }) => {
  const [titulo, setTitulo] = useState('');
  const [contenido, setContenido] = useState('');

  useEffect(() => {
    if (modo === 'editar' && initialData) {
      setTitulo(initialData.titulo || '');
      setContenido(initialData.contenido || '');
    } else {
      setTitulo('');
      setContenido('');
    }
  }, [initialData, modo]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ titulo, contenido });
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>{modo === 'editar' ? 'Editar Hilo' : 'Crear Nuevo Hilo'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Título</Form.Label>
            <Form.Control
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Contenido</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={contenido}
              onChange={(e) => setContenido(e.target.value)}
              required
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit">
            {modo === 'editar' ? 'Actualizar' : 'Crear'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default HiloModal;
