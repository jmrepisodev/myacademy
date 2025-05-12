import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaHome, FaCog, FaSignOutAlt } from 'react-icons/fa';

const apiUrl = process.env.REACT_APP_API_URL;

function Sidebar({ usuario }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-dark text-white d-flex flex-column p-3 vh-100 shadow-sm" style={{  width: 'min(100%, 260px)' }}>
      {/* Usuario (condicional: imagen y nombre solo visibles en md o más) */}
      {usuario && (
        <div className="text-center mb-4">
          <img
            src={`${apiUrl}/uploads/${usuario.image}`}
            alt="Perfil"
            className="rounded-circle border border-light mb-2"
            style={{ width: '50px', height: '50px' }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/image_not_found.png';
            }}
          />
          <div className="d-none d-md-block">
            <h6 className="mb-0">{usuario.name}</h6>
            <small className="text-secondary">{usuario.email}</small>
          </div>
        </div>
      )}

      {/* Navegación */}
      <ul className="nav nav-pills flex-column mb-auto fs-5 text-center text-md-start">
        <li className="nav-item mb-2">
          <Link to="/usuario/perfil" className="nav-link text-white d-flex align-items-center justify-content-center justify-content-md-start gap-2">
            <FaUser />
            <span className="d-none d-md-inline">Mi Perfil</span>
          </Link>
        </li>
        <li className="nav-item mb-2">
          <Link to="/" className="nav-link text-white d-flex align-items-center justify-content-center justify-content-md-start gap-2">
            <FaHome />
            <span className="d-none d-md-inline">Inicio</span>
          </Link>
        </li>
        <li className="nav-item mb-2">
          <Link to="/foros" className="nav-link text-white d-flex align-items-center justify-content-center justify-content-md-start gap-2">
            <FaHome />
            <span className="d-none d-md-inline">Foro</span>
          </Link>
        </li>
        <li className="nav-item mb-2">
          <Link to="/usuario/configuracion" className="nav-link text-white d-flex align-items-center justify-content-center justify-content-md-start gap-2">
            <FaCog />
            <span className="d-none d-md-inline">Configuración</span>
          </Link>
        </li>
      </ul>

      <hr className="border-light mt-auto" />
      <button
        className="btn btn-outline-light w-100 d-flex align-items-center justify-content-center justify-content-md-start gap-2"
        onClick={handleLogout}
      >
        <FaSignOutAlt />
        <span className="d-none d-md-inline">Cerrar Sesión</span>
      </button>
    </nav>
  );
}

export default Sidebar;
