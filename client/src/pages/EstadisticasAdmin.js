import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Spinner } from 'react-bootstrap';
import { Bar, Line } from 'react-chartjs-2';
import API from '../services/api';
import Sidebar from '../components/SidebarAdmin';
import jsPDF from 'jspdf';
import html2pdf from 'html2pdf.js';  // Para convertir HTML en PDF

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
  
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend
  );

function EstadisticasAdmin() {

  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [ultimosTests, setUltimosTests] = useState([]);

  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await API.get('/usuarios/user-stats');
        setStats(response.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching stats:', error);
        setError('Error al cargar las estadísticas')
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    const fetchUltimosTests = async () => {
      try {
        const response = await API.get('/tests/ultimos'); // Asegúrate de que esta ruta exista en tu backend
        setUltimosTests(response.data);
      } catch (error) {
        console.error('Error al cargar los últimos tests:', error);
      }
    };
    
    fetchUltimosTests();
  }, []);


  const handleShowModal = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setShowModal(false);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const content = document.getElementById('stats-content');  // Contenido a generar en PDF

    // Generar PDF a partir del contenido HTML
    html2pdf()
      .from(content)
      .toPdf()
      .get('pdf')
      .then((pdf) => {
        pdf.save('reporte_estadisticas.pdf');
      });
  };

  const renderTable = () => (
    <div>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Tests Realizados</th>
              <th>Media</th>
              <th>Tiempo Promedio</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((user) => (
              <tr key={user.user_id}>
                <td>{user.name}</td>
                <td>{user.total_tests}</td>
                <td>{user.promedio_score.toFixed(2)}</td>
                <td>{user.tiempo_promedio.toFixed(2)}s</td>
                <td>
                  <Button variant="info" onClick={() => handleShowModal(user)}>
                    Ver Detalles
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <Table striped bordered hover responsive className="mt-4">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Total Preguntas</th>
              <th>% Aciertos</th>
              <th>% Errores</th>
              <th>% En Blanco</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((user) => {
              const total = user.total_aciertos + user.total_errores + user.total_en_blanco;
              return (
                <tr key={user.user_id}>
                  <td>{user.name}</td>
                  <td>{total}</td>
                  <td>{((user.total_aciertos / total) * 100).toFixed(2)}%</td>
                  <td>{((user.total_errores / total) * 100).toFixed(2)}%</td>
                  <td>{((user.total_en_blanco / total) * 100).toFixed(2)}%</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
    </div>
    

  );

  const renderCharts = () => (
    <div className="my-4">
        <h5 className="mb-3 text-center">📈 Gráficos de Progreso</h5>
          <div className='row g-3 mt-3'>
              <div className="mb-5 mx-auto" style={{ maxWidth: '600px', height: '300px' }}>
                  <Bar
                    data={{
                      labels: stats.map((user) => user.name),
                      datasets: [
                        {
                          label: 'Puntuación Promedio',
                          data: stats.map((user) => user.promedio_score),
                          backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          position: 'top',
                        },
                      },
                    }}
                  />
              </div>
  
              <div className="mb-5 mx-auto" style={{ maxWidth: '600px', height: '300px' }}>
                    <Line
                      data={{
                        labels: stats.map((user) => user.name),
                        datasets: [
                          {
                            label: 'Tiempo Promedio (s)',
                            data: stats.map((user) => user.tiempo_promedio),
                            borderColor: 'rgba(153, 102, 255, 1)',
                            backgroundColor: 'rgba(153, 102, 255, 0.2)',
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        plugins: {
                          legend: {
                            position: 'top',
                          },
                        },
                      }}
                    />
              </div>
  
              <div  className="mb-5 mx-auto" style={{ maxWidth: '600px', height: '300px' }}>
                  <Bar
                    data={{
                      labels: stats.map((user) => user.name),
                      datasets: [
                        {
                          label: 'Aciertos',
                          data: stats.map((user) => user.total_aciertos),
                          backgroundColor: 'rgba(75, 192, 192, 0.6)',
                        },
                        {
                          label: 'Errores',
                          data: stats.map((user) => user.total_errores),
                          backgroundColor: 'rgba(255, 99, 132, 0.6)',
                        },
                        {
                          label: 'En Blanco',
                          data: stats.map((user) => user.total_en_blanco),
                          backgroundColor: 'rgba(255, 206, 86, 0.6)',
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          position: 'top',
                        },
                        title: {
                          display: true,
                          text: 'Distribución de Respuestas por Usuario',
                        },
                      },
                    }}
                  />
              </div>
          </div>
    </div>
  
  );


  const renderUltimosTests = () => (
    <div className="mt-5">
      <h4>Últimos Tests Realizados</h4>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Test</th>
            <th>Curso</th>
            <th>Aciertos</th>
            <th>Errores</th>
            <th>En Blanco</th>
            <th>Puntuación</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {ultimosTests.length === 0 ? (
            <tr>
              <td colSpan="8" className="text-center">No hay tests recientes</td>
            </tr>
          ) : (
            ultimosTests.map((test, idx) => (
              <tr key={idx}>
                <td>{test.usuario_nombre}</td>
                <td>{test.test_nombre}</td>
                <td>{test.curso_nombre}</td>
                <td>{test.aciertos}</td>
                <td>{test.errores}</td>
                <td>{test.en_blanco}</td>
                <td>{test.puntuacion}</td>
                <td>{new Date(test.fecha).toLocaleDateString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </div>
  );
  
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!stats) return <div className="text-center my-5">Cargando estadísticas...</div>;

  return (
    <div className="container-fluid p-0 min-vh-100 d-flex">
        <div className="col-md-2 col-lg-2 p-0 bg-dark">
            <Sidebar />
        </div>
        <div className="col p-3">
            <div className="container mt-4">
            <h2 className='mb-3'>Estadísticas</h2>
            {loading ? (
                <div className="d-flex justify-content-center">
                <Spinner animation="border" variant="primary" />
                </div>
            ) : (
                <>
                <div id="stats-content">
                  {renderTable()}
                  {renderCharts()}
                  {renderUltimosTests()}
                </div>
                <Button variant="primary" onClick={generatePDF} className="mt-3">
                  Generar Reporte en PDF
                </Button>
                </>
            )}

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                <Modal.Title>Detalles del Usuario</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                {selectedUser && (
                    <div>
                    <h5>{selectedUser.name}</h5>
                    <p>Tests Realizados: {selectedUser.total_tests}</p>
                    <p>Puntuación Promedio: {selectedUser.promedio_score.toFixed(2)}</p>
                    <p>Tiempo Promedio: {selectedUser.tiempo_promedio.toFixed(2)}s</p>
                    <p>Total de Aciertos: {selectedUser.total_aciertos}</p>
                    <p>Total de Errores: {selectedUser.total_errores}</p>
                    <p>Total en Blanco: {selectedUser.total_en_blanco}</p>
                    </div>
                )}
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModal}>
                    Cerrar
                </Button>
                </Modal.Footer>
            </Modal>
            </div>
        </div>
    </div>
  );
}

export default EstadisticasAdmin;
