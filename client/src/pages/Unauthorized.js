// src/pages/Unauthorized.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized = () => (
  <div className="container text-center mt-5">
    <h1>⛔ Acceso denegado</h1>
    <p>No tienes permisos para acceder a esta página.</p>
    <Link to="/">Volver al inicio</Link>
  </div>
);

export default Unauthorized;
