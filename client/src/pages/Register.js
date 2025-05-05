import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';

const Register = () => {
  const [values, setValues] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
    setErrors([]);
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post('/auth/register', values);
      if (response.status === 200 || response.status === 201) {
        setSuccess(response.data.message || 'Registro exitoso');
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (err) {
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
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Registrar Alumno</h2>

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

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Nombre</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Correo Electrónico</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="password" className="form-label">Contraseña</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary w-100">Registrar</button>
              </form>

              <div className="text-center mt-4">
                <span>¿Ya tienes una cuenta? </span>
                <Link to="/login">Iniciar sesión</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
