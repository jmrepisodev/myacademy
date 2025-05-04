
import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


function Sidebar() {
    const navigate = useNavigate();

    const handleLogout = () => {
      localStorage.removeItem('token');
      navigate('/login');
    };

    return (
      <nav className="bg-dark vh-100 p-3">
        <ul className="nav nav-pills flex-column mb-auto text-white fs-5">
          <li className="nav-item">
            <Link className="nav-link text-white" to="/usuario/perfil">
              Mi perfil
            </Link>
          </li>
          <li>
            <Link className="nav-link text-white" to="/cursos">
              Mis cursos
            </Link>
          </li>
          <li>
            <Link className="nav-link text-white" to="/estadisticas">
              Mis estadísticas
            </Link>
          </li>
        </ul>
        <div className="mt-auto pt-3">
          <button className="btn btn-outline-light w-100" onClick={handleLogout}>
            Cerrar Sesión
          </button>
        </div>
      </nav>
    );
}


export default Sidebar;