const db = require('../config/database');

// Muestra una lista de todos los mensajes por tema
exports.getMessagesByTemaId = async (req, res) => {
    const temaId = req.params.id;
    try {
      const [results] = await db.query(
        `SELECT m.texto, m.created_at, u.name AS user
         FROM chat_mensajes m
         JOIN usuarios u ON m.usuario_id = u.id
         WHERE m.tema_id = ?
         ORDER BY m.created_at ASC`,
        [temaId]
      ); // Usamos async/await para obtener los resultados de la base de datos
  
  
      res.json(results);
    } catch (error) {
      // Manejo de errores
      console.log(error);
      return res.status(500).json({ error: 'Error interno del servidor: ' + error.message });
    }
  };

  //Almacena un nuevo mensaje del chat
exports.createMessage = async (req, res) => {
    try {
      const {temaId, userId, texto} = req.body;
  
      const [results] = await db.query('INSERT INTO chat_mensajes (tema_id, usuario_id, texto) VALUES (?, ?, ?)',[temaId, userId, texto]);
  
      res.status(201).json({ message: 'Mensaje guardado satisfactoriamente', id: results.insertId });
    } catch (error) {
      // Manejo de errores
      return res.status(500).json({ error: 'Error interno del servidor: ' + error.message });
    }
  };
