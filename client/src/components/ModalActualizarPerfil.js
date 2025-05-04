import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const ModalActualizarPerfil = ({ show, onClose, usuario, onSave }) => {
  const [name, setName] = useState(usuario.name);
  const [email, setEmail] = useState(usuario.email);
  const [passwordActual, setPasswordActual] = useState('');
  const [nuevaPassword, setNuevaPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleGuardar = () => {
    if (nuevaPassword && nuevaPassword !== confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    const updatedData = {
      name,
      email,
      passwordActual,
      nuevaPassword
    };

    onSave(updatedData);
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Actualizar Perfil</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-3">
          <label>Nombre</label>
          <input className="form-control" value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div className="mb-3">
          <label>Correo</label>
          <input className="form-control" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <hr />
        <div className="mb-3">
          <label>Contraseña actual</label>
          <input type="password" className="form-control" value={passwordActual} onChange={e => setPasswordActual(e.target.value)} />
        </div>
        <div className="mb-3">
          <label>Nueva contraseña</label>
          <input type="password" className="form-control" value={nuevaPassword} onChange={e => setNuevaPassword(e.target.value)} />
        </div>
        <div className="mb-3">
          <label>Confirmar nueva contraseña</label>
          <input type="password" className="form-control" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Cancelar</Button>
        <Button variant="primary" onClick={handleGuardar}>Guardar</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalActualizarPerfil;
