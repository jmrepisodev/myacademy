
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Carousel from '../components/Carousel'

const apiUrl = process.env.REACT_APP_API_URL;

const Home = () => {
  const [cursos, setCursos] = useState([]);
  const [testimonios, setTestimonios] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [faqs, setFaqs] = useState([]);

  useEffect(() => {
    Promise.all([
      fetch(`${apiUrl}/api/cursos`).then(res => res.json()),
      fetch(`${apiUrl}/api/testimonios`).then(res => res.json()),
      fetch(`${apiUrl}/api/blog`).then(res => res.json()),
      fetch(`${apiUrl}/api/faq`).then(res => res.json())
    ])
      .then(([cursosData, testimoniosData, blogData, faqsData]) => {
        setCursos(cursosData);
        setTestimonios(testimoniosData);
        setBlogPosts(blogData);
        setFaqs(faqsData);
      })
      .catch(error => console.error('Error al cargar datos de inicio:', error));
  }, []);

 /*
  useEffect(() => {
    fetch(`${apiUrl}/api/cursos`)
      .then(res => res.json())
      .then(data => setCursos(data))
      .catch(error => console.error('Error al cargar cursos:', error));
  }, []);

  useEffect(() => {
    fetch(`${apiUrl}/api/testimonios`)
      .then(res => res.json())
      .then(data => setTestimonios(data))
      .catch(error => console.error('Error al cargar testimonios:', error));
  }, []);

  useEffect(() => {
    fetch(`${apiUrl}/api/blog`)
      .then(res => res.json())
      .then(data => setBlogPosts(data))
      .catch(error => console.error('Error al cargar blog:', error));
  }, []);

  useEffect(() => {
    fetch(`${apiUrl}/api/faq`)
      .then(res => res.json())
      .then(data => setFaqs(data))
      .catch(error => console.error('Error al cargar FAQs:', error));
  }, []);
  
*/
  return (
    <div className="container-fluid p-0 d-flex flex-column min-vh-100 flex-grow-1">
      <Carousel />

        {/* CURSOS */}
      <section id="cursos" className="py-5 bg-white text-center">
        <div className="container">
          <h2 className="mb-4">Nuestros Cursos</h2>
          <div className="row g-4">
            {cursos.length > 0 ? (
                cursos.map((curso, index) => (
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
                      <Link to={`/curso/${curso.id}`} className="btn btn-primary mt-3">Ver Detalles</Link>
                    </div>
                  </div>
                </div>
              ))
              ) : (
                <p>No hay cursos disponibles en este momento.</p>
              )}
          </div>
        </div>
      </section>

     {/* BLOG / NOTICIAS */}
      <section className="py-5 bg-light text-center">
        <div className="container">
          <h2 className="mb-4">Últimas Noticias</h2>
          <div className="row g-4">
            {blogPosts.length > 0 ? (
              blogPosts.map((post, index) => (
                <div key={index} className="col-md-4">
                  <div className="card h-100 shadow-sm">
                    {post.image && (
                      <img 
                        src={`${apiUrl}/uploads/${post.image}`} 
                        className="card-img-top" 
                        alt={post.titulo} 
                        onError={(e) => {
                          e.target.onerror = null; // evita bucle si la imagen por defecto también falla
                          e.target.src = "/image_not_found.png"; // ruta de imagen por defecto (public/)
                        }}
                      />
                    )}
                    <div className="card-body">
                      <h5 className="card-title">{post.titulo}</h5>
                      <p className="card-text">{post.contenido.slice(0, 100)}...</p>
                      <a href={`/blog/${post.id}`} className="btn btn-primary btn-sm mt-2">Leer más</a>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No hay publicaciones recientes.</p>
            )}
          </div>
        </div>
      </section>


       {/* SOBRE NOSOTROS */}
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

      {/* TESTIMONIOS */}
      <section className="py-5 bg-white text-center">
        <div className="container">
          <h2>Testimonios</h2>
          <div className="row mt-4">
            {testimonios.length > 0 ? (
              testimonios.map((testimonio, index) => (
                <div key={index} className="col-md-4">
                  <blockquote className="blockquote">
                    <p>"{testimonio.contenido}"</p>
                    <footer className="blockquote-footer mt-1">{testimonio.usuario_nombre || 'Alumno anónimo'}</footer>
                  </blockquote>
                </div>
              ))
            ) : (
              <p>No hay testimonios disponibles en este momento.</p>
            )}
          </div>
        </div>
      </section>

       {/* PREGUNTAS FRECUENTES */}
       <section className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-4">Preguntas Frecuentes</h2>
          <div className="accordion" id="faqAccordion">
            {faqs.length > 0 ? (
                faqs.map((faq, index) => (
                <div className="accordion-item" key={faq.id}>
                  <h2 className="accordion-header" id={`faq${index}`}>
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse${index}`}>
                      {faq.pregunta}
                    </button>
                  </h2>
                  <div id={`collapse${index}`} className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                    <div className="accordion-body">{faq.respuesta}</div>
                  </div>
                </div>
              ))
              ) : (
                <p className='text-center'>No hay preguntas frecuentes disponibles en este momento.</p>
              )}
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
