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
    <nav className="bg-dark text-white d-flex flex-column p-3 vh-100 shadow-sm" style={{ width: '260px' }}>
      {/* Imagen y nombre del usuario */}
      {usuario && (
        <div className="text-center mb-4">
          <img
            src={`${apiUrl}/uploads/${usuario.image}`}
            alt="Perfil"
            className="rounded-circle border border-light mb-2"
            style={{ width: '100px', height: '100px' }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/image_not_found.png';
            }}
          />
          <h5 className="mb-0">{usuario.name}</h5>
          <small className="text-secondary">{usuario.email}</small>
        </div>
      )}

      {/* Enlaces de navegación */}
      <ul className="nav nav-pills flex-column mb-auto fs-5">
        <li className="nav-item mb-2">
          <Link to="/usuario/perfil" className="nav-link text-white d-flex align-items-center gap-2">
            <FaUser /> Mi Perfil
          </Link>
        </li>
        <li className="nav-item mb-2">
          <Link to="/" className="nav-link text-white d-flex align-items-center gap-2">
            <FaHome /> Inicio
          </Link>
        </li>
        <li className="nav-item mb-2">
          <Link to="/usuario/configuracion" className="nav-link text-white d-flex align-items-center gap-2">
            <FaCog /> Configuración
          </Link>
        </li>
      </ul>

      {/* Separador y botón de logout */}
      <hr className="border-light mt-auto" />
      <div>
        <button className="btn btn-outline-light w-100 d-flex align-items-center justify-content-center gap-2" onClick={handleLogout}>
          <FaSignOutAlt /> Cerrar Sesión
        </button>
      </div>
    </nav>
  );
}

export default Sidebar;



