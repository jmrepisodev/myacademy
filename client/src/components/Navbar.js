// src/components/Navbar.js
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import {
  FaUserCircle,
  FaHome,
  FaBookOpen,
  FaNewspaper,
  FaUsers,
  FaEnvelope,
  FaSignInAlt,
  FaSignOutAlt
} from 'react-icons/fa';

const Navbar = () => {
  const location = useLocation();
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
        userName = decoded.name || decoded.email?.split('@')[0];
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
        <Link className="navbar-brand d-flex align-items-center gap-2 text-primary fw-bold" to="/">
          <img
            src="/logo.png"
            alt="Logotipo"
            width="40"
            height="40"
            className="d-inline-block align-text-top"
          />
          MyAcademy
        </Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto gap-3 align-items-center fs-5">
            <li className="nav-item">
              <Link className={`nav-link fw-medium ${location.pathname === '/' ? 'text-primary fw-bold active' : 'text-dark'}`} to="/">
                <FaHome className="me-1" /> Inicio
              </Link>
            </li>

            <li className="nav-item">
              <Link className={`nav-link fw-medium ${location.pathname.startsWith('/cursos') ? 'text-primary fw-bold active' : 'text-dark'}`} to="/cursos">
                <FaBookOpen className="me-1" /> Cursos
              </Link>
            </li>

            <li className="nav-item">
              <Link className={`nav-link fw-medium ${location.pathname.startsWith('/blog') ? 'text-primary fw-bold active' : 'text-dark'}`} to="/blog">
                <FaNewspaper className="me-1" /> Noticias
              </Link>
            </li>

            <li className="nav-item">
              <Link className={`nav-link fw-medium ${location.pathname === '/nosotros' ? 'text-primary fw-bold active' : 'text-dark'}`} to="/nosotros">
                <FaUsers className="me-1" /> Nosotros
              </Link>
            </li>

            <li className="nav-item">
              <Link className={`nav-link fw-medium ${location.pathname === '/contacto' ? 'text-primary fw-bold active' : 'text-dark'}`} to="/contacto">
                <FaEnvelope className="me-1" /> Contacto
              </Link>
            </li>

            {isAuthenticated ? (
              <>
                <li className="nav-item d-flex align-items-center">
                  <Link
                    className="nav-link bg-primary text-white fw-medium d-flex align-items-center gap-1"
                    to={
                      rol === 'admin' ? '/admin/dashboard' :
                      rol === 'teacher' ? '/teacher/dashboard' :
                      '/usuario/perfil'
                    }
                  >
                    <FaUserCircle size={22} /> {userName}
                  </Link>
                </li>
                <li className="nav-item">
                  <button onClick={handleLogout} className="btn btn-outline-secondary d-flex align-items-center gap-2">
                    <FaSignOutAlt /> Cerrar sesión
                  </button>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <Link className="nav-link bg-primary text-white fw-medium d-flex align-items-center gap-2" to="/login">
                  <FaSignInAlt /> Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;



