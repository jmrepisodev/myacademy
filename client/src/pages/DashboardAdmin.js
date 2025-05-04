import React, { useEffect, useState } from 'react';
import API from '../services/api';
import Sidebar from '../components/SidebarAdmin';

const Dashboard = () => {
  const [stats, setStats] = useState({
    alumnos: 0,
    cursos: 0,
    videoclases: 0,
  });
  const [actividad, setActividad] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [alumnosRes, cursosRes, videoclasesRes, actividadRes] = await Promise.all([
          API.get('/usuarios'),
          API.get('/cursos'),
          API.get('/videoclases'),
          //API.get('/actividad'),
        ]);
  
        // Asegúrate de que los campos existan antes de usarlos
        const totalAlumnos = alumnosRes.data?.total ?? alumnosRes.data?.users?.length ?? 0;
        const totalCursos = cursosRes.data?.count ?? cursosRes.data?.length ?? 0;
        const totalVideoclases = videoclasesRes.data?.count ?? videoclasesRes.data?.length ?? 0;
  
        setStats({
          alumnos: totalAlumnos,
          cursos: totalCursos,
          videoclases: totalVideoclases,
        });
  
        setActividad(actividadRes.data || []);
      } catch (error) {
        console.error('Error al cargar datos del dashboard:', error);
      }
    };
  
    fetchData();
  }, []);
  

  return (
    <div className="container-fluid p-0 min-vh-100 d-flex">
      <div className="col-md-2 col-lg-2 p-0 bg-dark">
        <Sidebar />
      </div>
      <div className="col p-3">
        <div className="container-fluid py-4">
          <h2 className="mb-4">Bienvenido, Administrador 👋</h2>
          <div className="row g-4 mb-4">
            <div className="col-md-4">
              <div className="card text-white bg-primary shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">Alumnos inscritos</h5>
                  <p className="card-text fs-4">{stats.alumnos}</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card text-white bg-success shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">Cursos activos</h5>
                  <p className="card-text fs-4">{stats.cursos}</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card text-white bg-info shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">Videoclases</h5>
                  <p className="card-text fs-4">{stats.videoclases}</p>
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
                  {actividad.length > 0 ? (
                    actividad.map((item, index) => (
                      <li key={index} className="list-group-item">
                        📌 {item.descripcion}
                      </li>
                    ))
                  ) : (
                    <li className="list-group-item">No hay actividad reciente.</li>
                  )}
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


