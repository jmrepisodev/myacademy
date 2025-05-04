// src/components/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { FaUserCircle } from 'react-icons/fa';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  let isAuthenticated = false;
  let rol = null;
  let userName = null;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      const isExpired = decoded.exp * 1000 < Date.now();
      if (!isExpired) {
        isAuthenticated = true;
        rol = decoded.rol;
        userName = decoded.name || decoded.email?.split('@')[0]; // Fallback si no hay "name"
      } else {
        localStorage.removeItem('token');
      }
    } catch (err) {
      console.error('Token inválido');
      localStorage.removeItem('token');
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg bg-white shadow-sm sticky-top">
      <div className="container-fluid">
        <Link className="navbar-brand text-primary fw-bold" to="/">MyAcademy</Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto gap-3 align-items-center">
            <li className="nav-item">
              <Link className="nav-link text-dark fw-medium" to="/">Inicio</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-dark fw-medium" to="/cursos">Cursos</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-dark fw-medium" to="/nosotros">Nosotros</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-dark fw-medium" to="/contacto">Contacto</Link>
            </li>

            {isAuthenticated ? (
              <>
                
                <li className="nav-item d-flex align-items-center">   
                  <Link className="nav-link bg-primary text-white fw-medium" to={
                    rol === 'admin' ? '/admin/dashboard' :
                    rol === 'teacher' ? '/teacher/dashboard' :
                    '/usuario/perfil'
                  }>
                    <FaUserCircle size={22} className="text-white me-1" />
                    <span className="fw-medium text-white">{userName}</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <button onClick={handleLogout} className="btn btn-outline-secondary">Cerrar sesión</button>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <Link className="nav-link bg-primary text-white fw-medium" to="/login">Login</Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;


