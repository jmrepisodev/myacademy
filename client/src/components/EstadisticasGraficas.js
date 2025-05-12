// components/EstadisticasGraficas.js
import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
  TimeScale
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Tooltip, Legend, TimeScale);

function EstadisticasGraficas({ resultados }) {
  if (!resultados || resultados.length === 0) return <p>No hay suficientes datos para mostrar gráficos.</p>;

  const labels = resultados.map(r => new Date(r.created_at).toLocaleDateString());

  const aciertosData = {
    labels,
    datasets: [
      {
        label: 'Aciertos',
        data: resultados.map(r => r.aciertos),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
    ],
  };

  const puntuacionData = {
    labels,
    datasets: [
      {
        label: 'Puntuación',
        data: resultados.map(r => r.score),
        fill: false,
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.3,
      },
    ],
  };

  const totalAciertos = resultados.reduce((sum, r) => sum + r.aciertos, 0);
  const totalErrores = resultados.reduce((sum, r) => sum + r.errores, 0);
  const totalEnBlanco = resultados.reduce((sum, r) => sum + r.en_blanco, 0);

  const pieData = {
    labels: ['Aciertos', 'Errores', 'En blanco'],
    datasets: [
      {
        data: [totalAciertos, totalErrores, totalEnBlanco],
        backgroundColor: ['#4caf50', '#f44336', '#9e9e9e'],
      },
    ],
  };

  return (
    <div className="my-4">
      <h5 className="mb-3 text-center">📈 Gráficos de Progreso</h5>
       <div className='row g-4 mt-3'>
            <div className="mb-5 mx-auto" style={{ maxWidth: '600px', height: '300px' }}>
                <h6 className='text-center'>Aciertos por Test</h6>
                <Bar data={aciertosData} options={{ responsive: true, maintainAspectRatio: false }}/>
            </div>

            <div className="mb-5 mx-auto" style={{ maxWidth: '600px', height: '300px' }}>
                <h6 className='text-center'>Evolución de Puntuación</h6>
                <Line data={puntuacionData} options={{ responsive: true, maintainAspectRatio: false }}/>
            </div>

            <div  className="mb-5 mx-auto" style={{ maxWidth: '500px', height: '300px' }}>
                <h6 className='text-center'>Distribución Total de Respuestas</h6>
                <Pie data={pieData} options={{ responsive: true, maintainAspectRatio: false }}/>
            </div>
       </div>

     
    </div>
  );
}

export default EstadisticasGraficas;
