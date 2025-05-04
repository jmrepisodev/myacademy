import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { useParams, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const apiUrl = process.env.REACT_APP_API_URL;

const Temas = () => {
  const { temaId } = useParams();
  const [tests, setTests] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
  
    API.get(`/tests/tema/${temaId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        console.log('Dashboard data:', res.data); 
        setTests(res.data);
      })
      .catch(err => {
        console.error(err);
        if (err.response?.status === 401 || err.response?.status === 403) {
          alert('Sesión expirada. Inicia sesión nuevamente.');
        }
      });
  }, [temaId]);

  if (!tests) return <p>No hay temas disponibles</p>;

  return (
    <div  className="d-flex vh-100">
        <Sidebar />
         <div className="container row p-3">
          {tests.map((test) => (
            <div className="col-md-4 mb-4" key={test.id}>
              <div className="card" style={{ width: '18rem' }}>
                <img 
                  src={`${apiUrl}/uploads/${test.image}`}
                  className="card-img-top"
                  alt={test.name}
                  onError={(e) => {
                    e.target.onerror = null; // evita bucle si la imagen por defecto también falla
                    e.target.src = "/image_not_found.png"; // ruta de imagen por defecto (public/)
                  }}
                />
                <div className="card-body">
                  <h5 className="card-title">Test: {test.name}</h5>
                  <p className="card-text">Descripción: {test.description}</p>
                  <p className="card-text">Nº preguntas: {test.num_questions}</p>
                  <Link to={`/tests/${test.id}/questions`} className="btn btn-primary mt-3">
                    Realizar test
                  </Link>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
   
  );
};

export default Temas;