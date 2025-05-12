import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  FaUserCircle, FaUsers, FaChartBar, FaBookOpen, FaLayerGroup,
  FaClipboardList, FaQuestion, FaVideo, FaBlog, FaSignOutAlt, FaGraduationCap
} from 'react-icons/fa';

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const isActive = (path) => location.pathname.startsWith(path);

  const menuItems = [
    { icon: <FaUserCircle />, label: 'Mi perfil', path: '/admin/dashboard' },
    { icon: <FaUsers />, label: 'Usuarios', path: '/admin/usuarios' },
    { icon: <FaChartBar />, label: 'Estadísticas', path: '/admin/estadisticas' },
    { icon: <FaBookOpen />, label: 'Cursos', path: '/admin/cursos' },
    { icon: <FaLayerGroup />, label: 'Temas', path: '/admin/temas' },
    { icon: <FaClipboardList />, label: 'Tests', path: '/admin/tests' },
    { icon: <FaQuestion />, label: 'Preguntas', path: '/admin/preguntas' },
    { icon: <FaVideo />, label: 'Videoclases', path: '/admin/videoclases' },
    { icon: <FaBlog />, label: 'Blog/Noticias', path: '/admin/noticias' },
     { icon: <FaGraduationCap />, label: 'Foros', path: '/admin/foros' },
      { icon: <FaGraduationCap />, label: 'Notificaciones', path: '/admin/notificaciones' },
  ];

  return (
    <nav className="bg-dark text-white d-flex flex-column p-3 vh-100" style={{ minWidth: '70px' }}>
      <div className="text-center mb-4">
        <FaUserCircle size={30} className="mb-1" />
        <div className="fw-bold d-none d-md-block">MyAcademy</div>
      </div>

      <ul className="nav nav-pills flex-column mb-auto">
        {menuItems.map(({ icon, label, path }) => (
          <li key={path} className="nav-item mb-2">
            <Link
              to={path}
              className={`nav-link d-flex align-items-center justify-content-start ${
                isActive(path) ? 'bg-primary text-white' : 'text-white'
              }`}
            >
              <span className="me-2">{icon}</span>
              <span className="d-none d-md-inline">{label}</span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-auto">
        <button className="btn btn-outline-light w-100 mt-4 d-flex align-items-center justify-content-center" onClick={handleLogout}>
          <FaSignOutAlt className="me-2" />
          <span className="d-none d-md-inline">Cerrar Sesión</span>
        </button>
      </div>
    </nav>
  );
}

export default Sidebar;

