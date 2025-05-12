const db = require('../config/database');
  
  // Muestra todas las preguntas frecuentes publicadas
  exports.getAllPosts= async (req, res) => {
    try {
  
      const [results] = await db.query('SELECT * FROM blog WHERE publicado = 1 ORDER BY created_at DESC');
  
      res.json(results); // Retorna el primer resultado ya que es único
    } catch (error) {
      // Manejo de errores
      return res.status(500).json({ error: 'Error interno del servidor: error al obtener noticias' + error.message });
    }
  };

    // Muestra todas las preguntas frecuentes publicadas
exports.getPostById= async (req, res) => {
    const { id } = req.params;
    try {
  
      const [results] = await db.query('SELECT * FROM blog WHERE id = ? AND publicado = 1', [id]);
  
      if (results.length === 0) {
        return res.status(404).json({ error: 'Post no encontrado' });
      }
  
      res.json(results[0]);
    } catch (error) {
      // Manejo de errores
      return res.status(500).json({ error: 'Error interno del servidor: error al obtener posts' + error.message });
    }
  };

  exports.storePost = async (req, res) => {
    const { titulo, contenido, image, autor, publicado } = req.body;
  
    try {
      const [result] = await db.query(
        'INSERT INTO blog (titulo, contenido, image, autor, publicado) VALUES (?, ?, ?, ?, ?)',
        [titulo, contenido, image || null, autor || 'Anónimo', publicado ?? true]
      );
  
      res.status(201).json({ message: 'Post creado correctamente', postId: result.insertId });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Error al crear el post: ' + error.message });
    }
  };

  exports.updatePost = async (req, res) => {
    const { id } = req.params;
    const { titulo, contenido, image, autor, publicado } = req.body;
  
    try {
      const [result] = await db.query(
        `UPDATE blog SET 
          titulo = ?, 
          contenido = ?, 
          image = ?, 
          autor = ?, 
          publicado = ? 
        WHERE id = ?`,
        [titulo, contenido, image || null, autor || 'Anónimo', publicado ?? true, id]
      );
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Post no encontrado' });
      }
  
      res.json({ message: 'Post actualizado correctamente' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Error al actualizar el post: ' + error.message });
    }
  };

  exports.deletePost = async (req, res) => {
    const { id } = req.params;
  
    try {
      const [result] = await db.query('DELETE FROM blog WHERE id = ?', [id]);
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Post no encontrado o ya eliminado' });
      }
  
      res.json({ message: 'Post eliminado correctamente' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Error al eliminar el post: ' + error.message });
    }
  };
  