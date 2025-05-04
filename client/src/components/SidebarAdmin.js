import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Función para saber si la ruta está activa
  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <nav className="bg-dark text-white vh-100 p-3">
      <h3 className="text-center mb-4">MyAcademy Admin</h3>
      <ul className="nav nav-pills flex-column mb-auto fs-5">
        <li className="nav-item">
          <Link
            className={`nav-link ${isActive('/admin/dashboard') ? 'active text-white bg-primary' : 'text-white'}`}
            to="/admin/dashboard"
          >
            Mi perfil
          </Link>
        </li>
        <li>
          <Link
            className={`nav-link ${isActive('/admin/usuarios') ? 'active text-white bg-primary' : 'text-white'}`}
            to="/admin/usuarios"
          >
            Usuarios
          </Link>
        </li>
        <li>
          <Link
            className={`nav-link ${isActive('/admin/estadisticas') ? 'active text-white bg-primary' : 'text-white'}`}
            to="/admin/estadisticas"
          >
            Estadísticas
          </Link>
        </li>
        <li>
          <Link
            className={`nav-link ${isActive('/admin/cursos') ? 'active text-white bg-primary' : 'text-white'}`}
            to="/admin/cursos"
          >
            Cursos
          </Link>
        </li>
        <li>
          <Link
            className={`nav-link ${isActive('/admin/temas') ? 'active text-white bg-primary' : 'text-white'}`}
            to="/admin/temas"
          >
            Temas
          </Link>
        </li>
        <li>
          <Link
            className={`nav-link ${isActive('/admin/tests') ? 'active text-white bg-primary' : 'text-white'}`}
            to="/admin/tests"
          >
            Tests
          </Link>
        </li>
        <li>
          <Link
            className={`nav-link ${isActive('/admin/preguntas') ? 'active text-white bg-primary' : 'text-white'}`}
            to="/admin/preguntas"
          >
            Preguntas
          </Link>
        </li>
        <li>
          <Link
            className={`nav-link ${isActive('/admin/videoclases') ? 'active text-white bg-primary' : 'text-white'}`}
            to="/admin/videoclases"
          >
            Videoclases
          </Link>
        </li>
        <li>
          <Link
            className={`nav-link ${isActive('/admin/noticias') ? 'active text-white bg-primary' : 'text-white'}`}
            to="/admin/noticias"
          >
            Blog/Noticias
          </Link>
        </li>
      </ul>

      <div className="mt-auto">
        <button className="btn btn-outline-light w-100 mt-5" onClick={handleLogout}>
          Cerrar Sesión
        </button>
      </div>
    </nav>
  );
}

export default Sidebar;
