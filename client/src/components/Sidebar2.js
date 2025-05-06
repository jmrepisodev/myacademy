import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  
  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <div className="sidebar bg-dark text-white vh-100 p-3">
      <h3>Dashboard Admin</h3>
      <ul className="nav flex-column">
        <li>
          <Link className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`} to="/dashboard">Inicio</Link>
        </li>
        <li>
          <Link className={`nav-link ${isActive('/usuarios') ? 'active' : ''}`} to="/usuarios">Gestión de Usuarios</Link>
        </li>
        <li>
          <Link className={`nav-link ${isActive('/cursos') ? 'active' : ''}`} to="/cursos">Gestión de Cursos</Link>
        </li>
        <li>
          <Link className={`nav-link ${isActive('/actividad') ? 'active' : ''}`} to="/actividad">Actividad del Sistema</Link>
        </li>
        <li>
          <Link className={`nav-link ${isActive('/informes') ? 'active' : ''}`} to="/informes">Informes</Link>
        </li>
        <li>
          <Link className={`nav-link ${isActive('/configuracion') ? 'active' : ''}`} to="/configuracion">Configuración</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
