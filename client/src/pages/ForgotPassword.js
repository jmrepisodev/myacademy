import React, { useState } from 'react';
import API from '../services/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setErrors([]);
    try {
      const res = await API.post('/auth/request-password-reset', { email });
      setMessage(res.data.message || 'Revisa tu correo para el enlace de restablecimiento.');
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
              <h3 className="card-title text-center mb-4">Recuperar Contraseña</h3>

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
                  <label htmlFor="email" className="form-label">Introduce tu email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">Enviar enlace</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
