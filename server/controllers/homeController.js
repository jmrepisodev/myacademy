
const db = require('../config/database');

// Muestra todas las preguntas frecuentes publicadas
exports.getAllFaqs= async (req, res) => {
    try {
  
      const [results] = await db.query('SELECT * FROM faqs WHERE publicada = 1 ORDER BY orden ASC');
  
  
      res.json(results); // Retorna el primer resultado ya que es único
    } catch (error) {
      // Manejo de errores
      return res.status(500).json({ error: 'Error interno del servidor: error al obtener faqs' + error.message });
    }
  };


//Obtiene la lista de testimonios
exports.getApprovedTestimonials = async (req, res) => {
    const query = `
        SELECT t.id, t.contenido, u.name AS usuario_nombre, c.name AS curso_nombre
        FROM testimonios t
        LEFT JOIN usuarios u ON t.usuario_id = u.id
        LEFT JOIN cursos c ON t.curso_id = c.id
        WHERE t.aprobado = 1
        ORDER BY t.created_at DESC
        LIMIT 10
    `;

    try {
        const [results] = await db.query(query);

        res.json(results);
    } catch (error) {
        // Manejo de errores
        return res.status(500).json({ error: 'Error interno del servidor: error al obtener testimonios' + error.message });
    }

};


    // Muestra todos los testimonios por curso
    exports.getTestimonialsByCurso= async (req, res) => {
      const curso_id = req.params.id;
      try {
    
        const [results] = await db.query('SELECT * FROM testimonios WHERE curso_id = ?', [curso_id]);
    
    
        res.json(results);
      } catch (error) {
        // Manejo de errores
        return res.status(500).json({ error: 'Error interno del servidor: error al obtener testimonios' + error.message });
      }
    };