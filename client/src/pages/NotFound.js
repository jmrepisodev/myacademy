// src/pages/NotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="container d-flex flex-column justify-content-center align-items-center vh-100 text-center">
      <h1 className="display-1 fw-bold text-danger">404 Not Found</h1>
      <p className="fs-3"> <span className="text-danger">¡Ups!</span> Página no encontrada.</p>
      <p className="lead">
        La página solicitada no existe o ha sido eliminada.
      </p>
      <Link to="/" className="btn btn-primary btn-lg mt-3">
        Volver al inicio
      </Link>
    </div>
  );
};

export default NotFound;
