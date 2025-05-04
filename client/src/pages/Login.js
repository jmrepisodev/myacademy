import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { jwtDecode } from 'jwt-decode';

const Login = () => {
  const [values, setValues] = useState({ email: '', password: '' });
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
      const response = await API.post('/auth/login', values);
      if (response.status === 200 || response.status === 201) {
        const { token } = response.data;
        localStorage.setItem('token', token);

        const decoded = jwtDecode(token);
        const userRole = decoded.rol;

        setSuccess('Inicio de sesión exitoso');
        setErrors([]);

        switch (userRole) {
          case 'admin':
            navigate('/admin/dashboard');
            break;
          case 'teacher':
            navigate('/teacher/dashboard');
            break;
          case 'user':
          default:
            navigate('/usuario/perfil');
            break;
        }
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
              <h3 className="card-title text-center mb-4">Iniciar Sesión</h3>

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

                <button type="submit" className="btn btn-primary w-100">Iniciar sesión</button>
              </form>

              <div className="text-center mt-3">
                <Link to="/forgot-password">¿Olvidaste tu contraseña?</Link>
              </div>
              <div className="text-center mt-4">
                <span>¿Aún no tienes una cuenta? </span>
                <Link to="/register">Registrarse</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
