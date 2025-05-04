import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    if (password !== confirm) {
      setErrors([{ msg: 'Las contraseñas no coinciden' }]);
      return;
    }

    try {
      const res = await API.post('/auth/reset-password', { token, password });
      setMessage(res.data.message || 'Contraseña actualizada con éxito');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      if (err.response?.data?.error) {
        setErrors([{ msg: err.response.data.error }]);
      } else {
        setErrors([{ msg: 'Error al conectar con el servidor.' }]);
      }
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h3 className="card-title text-center mb-4">Nueva Contraseña</h3>

              {message && <div className="alert alert-success">{message}</div>}
              {errors.length > 0 && (
                <div className="alert alert-danger">
                  <ul className="mb-0">
                    {errors.map((err, index) => (
                      <li key={index}>{err.msg}</li>
                    ))}
                  </ul>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Nueva Contraseña</label>
                  <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label">Confirmar Contraseña</label>
                  <input
                    type="password"
                    className="form-control"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary w-100">Actualizar Contraseña</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
