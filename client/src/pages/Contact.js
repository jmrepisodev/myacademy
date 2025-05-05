import React, { useState } from 'react';
const apiUrl = process.env.REACT_APP_API_URL;

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(null);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setEnviado(null);

    try {
      const response = await fetch(`${apiUrl}/api/contacto`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        setEnviado('✅ Mensaje enviado con éxito.');
        setForm({ name: '', email: '', message: '' });
      } else {
        setEnviado('❌ Error al enviar el mensaje.');
      }
    } catch (error) {
      console.error(error);
      setEnviado('❌ Error en el servidor. Intenta más tarde.');
    }

    setEnviando(false);
  };

  return (
    <section className="container p-5">
      <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Contacta con nosotros</h2>
              <form className="row g-4" onSubmit={handleSubmit}>
                <div className="col-md-6">
                  <input
                    type="text"
                    name="name"
                    className="form-control p-3"
                    placeholder="Tu nombre completo"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <input
                    type="email"
                    name="email"
                    className="form-control p-3"
                    placeholder="Tu correo electrónico"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-12">
                  <textarea
                    name="message"
                    className="form-control p-3"
                    placeholder="Escribe tu mensaje..."
                    rows="5"
                    value={form.message}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-12 text-center">
                  <button type="submit" className="btn btn-primary btn-lg" disabled={enviando}>
                    {enviando ? 'Enviando...' : 'Enviar Mensaje'}
                  </button>
                  {enviado && <div className="mt-3 alert alert-info">{enviado}</div>}
                </div>
              </form>
            </div>
      </div>
      
    </section>
  );
};

export default Contact;

