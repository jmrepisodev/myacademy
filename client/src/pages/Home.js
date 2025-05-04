
import React, { useEffect, useState } from 'react';

const apiUrl = process.env.REACT_APP_API_URL;

const Home = () => {
  const [cursos, setCursos] = useState([]);

  useEffect(() => {
    fetch(`${apiUrl}/api/cursos`)
      .then(res => res.json())
      .then(data => setCursos(data))
      .catch(error => console.error('Error al cargar cursos:', error));
  }, []);

  return (
    <div className="container-fluid p-0 d-flex flex-column min-vh-100 flex-grow-1">
      <header className="bg-primary text-white text-center py-5">
        <div className="container">
          <h1 className="display-4 fw-bold mt-3">Academia MyAcademy</h1>
          <p className="lead mt-2">Tu futuro empieza aquí. Prepárate con los mejores.</p>
          <a href="#cursos" className="btn btn-light text-primary fw-bold mt-3">Ver Cursos</a>
        </div>
      </header>

      <section id="cursos" className="py-5 bg-white text-center">
        <div className="container">
          <h2 className="mb-4">Nuestros Cursos</h2>
          <div className="row g-4">
            {cursos.map((curso, index) => (
              <div key={index} className="col-md-4">
                <div className="card shadow-sm h-100">
                <img 
                    src={`${apiUrl}/uploads/${curso.image}`}
                    className="card-img-top"
                    alt={curso.name}
                    onError={(e) => {
                      e.target.onerror = null; // evita bucle si la imagen por defecto también falla
                      e.target.src = "/image_not_found.png"; // ruta de imagen por defecto (public/)
                    }}
                  />
                  <div className="card-body">
                    <h3 className="card-title">{curso.name}</h3>
                    <p className="card-text">{curso.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-5 bg-light">
        <div className="container text-center">
          <h2>¿Por qué elegirnos?</h2>
          <div className="row mt-4">
            <div className="col-md-4">
              <i className="bi bi-person-check-fill fs-1 text-primary"></i>
              <h5 className="mt-3">Aprobados Garantizados</h5>
              <p>Más de 3.000 alumnos han alcanzado su plaza con nosotros.</p>
            </div>
            <div className="col-md-4">
              <i className="bi bi-laptop-fill fs-1 text-primary"></i>
              <h5 className="mt-3">Plataforma Online</h5>
              <p>Accede a tus clases y recursos desde cualquier dispositivo, en cualquier momento.</p>
            </div>
            <div className="col-md-4">
              <i className="bi bi-people-fill fs-1 text-primary"></i>
              <h5 className="mt-3">Docentes Expertos</h5>
              <p>Un equipo comprometido con tu éxito profesional y personal.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5 bg-white text-center">
        <div className="container">
          <h2>Testimonios</h2>
          <div className="row mt-4">
            <div className="col-md-4">
              <blockquote className="blockquote">
                <p>"Gracias a MyAcademy aprobé mi oposición en el primer intento. Siempre estaré agradecida."</p>
                <footer className="blockquote-footer mt-1">Laura G.</footer>
              </blockquote>
            </div>
            <div className="col-md-4">
              <blockquote className="blockquote">
                <p>"El apoyo del equipo y los simulacros fueron clave para mantenerme motivado."</p>
                <footer className="blockquote-footer mt-1">Carlos M.</footer>
              </blockquote>
            </div>
            <div className="col-md-4">
              <blockquote className="blockquote">
                <p>"Lo mejor fue la flexibilidad. Pude estudiar a mi ritmo sin perder calidad."</p>
                <footer className="blockquote-footer mt-1">Sara D.</footer>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-4">Preguntas Frecuentes</h2>
          <div className="accordion" id="faqAccordion">
            <div className="accordion-item">
              <h2 className="accordion-header" id="faq1">
                <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse1">
                  ¿Cuándo comienzan los cursos?
                </button>
              </h2>
              <div id="collapse1" className="accordion-collapse collapse show" data-bs-parent="#faqAccordion">
                <div className="accordion-body">Los cursos tienen convocatorias mensuales. Puedes inscribirte en cualquier momento.</div>
              </div>
            </div>
            <div className="accordion-item">
              <h2 className="accordion-header" id="faq2">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse2">
                  ¿Puedo estudiar a distancia?
                </button>
              </h2>
              <div id="collapse2" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                <div className="accordion-body">Sí, toda nuestra formación es 100% online, con acceso desde cualquier dispositivo.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5 text-center bg-primary text-white">
        <div className="container">
          <h2 className="mb-4">¿Estás listo para comenzar?</h2>
          <p className="mb-4">Inscríbete hoy y empieza tu camino hacia una plaza fija.</p>
          <a href="/register" className="btn btn-light text-primary btn-lg">Quiero Inscribirme</a>
        </div>
      </section>

      <footer className="bg-dark text-white py-4">
        <div className="container text-center">
          <p>© 2025 MyAcademy. Todos los derechos reservados.</p>
          <div className="d-flex justify-content-center gap-3 mt-2">
            <a href="https://facebook.com" className="text-white"><i className="bi bi-facebook"></i></a>
            <a href="https://instagram.com" className="text-white"><i className="bi bi-instagram"></i></a>
            <a href="https://twitter.com" className="text-white"><i className="bi bi-twitter-x"></i></a>
            <a href="https://linkedin.com" className="text-white"><i className="bi bi-linkedin"></i></a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
