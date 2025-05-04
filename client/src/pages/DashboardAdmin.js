import React, { useEffect, useState } from 'react';
import API from '../services/api';
import Sidebar from '../components/SidebarAdmin';


const Dashboard = () => {
  
  return (
    <div className="container-fluid p-0 min-vh-100 d-flex">
      {/* Sidebar izquierda */}
      <div className="col-md-2 col-lg-2 p-0 bg-dark">
        <Sidebar/>
      </div>
      {/* Contenido principal derecha */}
      <div className="col p-3">
        <div className="container-fluid py-4">
        <h2 className="mb-4">Bienvenido, Administrador 👋</h2>
        <div className="row g-4 mb-4">
          <div className="col-md-4">
            <div className="card text-white bg-primary shadow-sm">
              <div className="card-body">
                <h5 className="card-title">Alumnos inscritos</h5>
                <p className="card-text fs-4">320</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card text-white bg-success shadow-sm">
              <div className="card-body">
                <h5 className="card-title">Cursos activos</h5>
                <p className="card-text fs-4">32</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card text-white bg-info shadow-sm">
              <div className="card-body">
                <h5 className="card-title">Videoclases</h5>
                <p className="card-text fs-4">114</p>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-8">
            <div className="card shadow-sm">
              <div className="card-header bg-light">
                Actividad reciente
              </div>
              <ul className="list-group list-group-flush">
                <li className="list-group-item">📌 Juan Pérez se inscribió en "Constitución Española"</li>
                <li className="list-group-item">📌 Se publicó una nueva videoclase de "Psicotécnicos"</li>
                <li className="list-group-item">📌 María Gómez completó el test de "Administración Pública"</li>
              </ul>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title">Accesos rápidos</h5>
                <div className="d-grid gap-2">
                  <button className="btn btn-outline-primary">Añadir Curso</button>
                  <button className="btn btn-outline-primary">Añadir Test</button>
                  <button className="btn btn-outline-success">Subir Videoclase</button>
                  <button className="btn btn-outline-warning">Enviar Notificación</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>

   
    
  );
};

export default Dashboard;

