import React from 'react';
const apiUrl = process.env.REACT_APP_API_URL;

const About = () => {
  return (
    <section className="container py-5">
      <h1 className="mb-4 fs-2 text-center">Sobre Nosotros</h1>

      <div className="row align-items-center mb-5">
        <div className="col-md-6">
          <p>
            En <strong>MyAcademy</strong> nos especializamos en la preparación de opositores que sueñan con un futuro
            estable. Nuestra metodología combina tecnología educativa, atención personalizada y una comunidad comprometida.
          </p>
          <p>
            Con años de experiencia, nuestro equipo docente ofrece un acompañamiento constante, evaluaciones periódicas y
            acceso a recursos actualizados que se adaptan a las necesidades de cada estudiante.
          </p>
        </div>
        <div className="col-md-6">
          <img 
            src={`${apiUrl}/uploads/graduation.png`}
            alt="Nuestra academia"
            className="img-fluid rounded shadow"
            onError={(e) => {
              e.target.onerror = null; // evita bucle si la imagen por defecto también falla
              e.target.src = "/image_not_found.png"; // ruta de imagen por defecto (public/)
            }}
          />
        </div>
      </div>

      <div className="mb-5">
        <h2 className="fs-4 mb-3">¿Qué nos hace diferentes?</h2>
        <ul className="list-unstyled">
          <li className="mb-2">✅ Plataforma online disponible 24/7 con contenidos interactivos.</li>
          <li className="mb-2">✅ Clases en vivo y grabadas para que estudies a tu ritmo.</li>
          <li className="mb-2">✅ Simulacros y evaluaciones reales periódicas.</li>
          <li className="mb-2">✅ Apoyo psicológico y coaching motivacional.</li>
          <li className="mb-2">✅ Comunidad de alumnos y foros activos.</li>
        </ul>
      </div>

      <div className="mb-5 bg-light p-4 rounded shadow">
        <h3 className="fs-4 mb-3">Nuestra Misión</h3>
        <p>
          Transformar el proceso de oposición en una experiencia formativa accesible, humana y efectiva.
          Queremos que cada estudiante que pase por nuestra academia sienta que tiene un equipo detrás que cree en su potencial.
        </p>
      </div>

      <div className="text-center mb-5">
        <h4 className="fs-5 mb-3">Síguenos en nuestras redes sociales</h4>
        <div className="d-flex justify-content-center gap-3">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary">
            <i className="bi bi-facebook"></i> Facebook
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="btn btn-outline-danger">
            <i className="bi bi-instagram"></i> Instagram
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="btn btn-outline-info">
            <i className="bi bi-twitter-x"></i> Twitter
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="btn btn-outline-secondary">
            <i className="bi bi-linkedin"></i> LinkedIn
          </a>
        </div>
      </div>

      <div className="text-center">
        <h5 className="mb-3">¿Quieres formar parte de nuestra comunidad?</h5>
        <a href="/register" className="btn btn-primary btn-lg">Únete ahora</a>
      </div>
      
    </section>
  );
};

export default About;

