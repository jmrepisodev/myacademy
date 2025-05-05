import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function Carousel() {
  return (
    <div id="heroCarousel" className="carousel slide carousel-fade" data-bs-ride="carousel">
      <div className="carousel-inner">

        <div className="carousel-item active">
          <img src="/carousel1.jpg" className="d-block w-100" alt="Aprende con nosotros" />
          <div className="carousel-caption d-none d-md-block bg-dark bg-opacity-50 rounded p-5">
            <h2 className="fw-bold">Bienvenido a MyAcademy</h2>
            <p className='mt-3'>Tu plataforma educativa para alcanzar el éxito académico y profesional.</p>
          </div>
        </div>

        <div className="carousel-item">
          <img src="/carousel1.jpg" className="d-block w-100" alt="Clases en vivo" />
          <div className="carousel-caption d-none d-md-block bg-dark bg-opacity-50 rounded p-5">
            <h2 className="fw-bold">Clases en vivo y grabadas</h2>
            <p className='mt-3'>Accede a contenido actualizado por profesionales en cada área.</p>
          </div>
        </div>

        <div className="carousel-item">
          <img src="/carousel1.jpg" className="d-block w-100" alt="Certificaciones" />
          <div className="carousel-caption d-none d-md-block bg-dark bg-opacity-50 rounded p-5">
            <h2 className="fw-bold">Certificaciones que suman</h2>
            <p className='mt-3'>Obtén diplomas digitales al completar cada curso con éxito.</p>
          </div>
        </div>

      </div>

      <button className="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Anterior</span>
      </button>
      <button className="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Siguiente</span>
      </button>

    </div>
  );
}

export default Carousel;
