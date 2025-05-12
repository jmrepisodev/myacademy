const db = require('../config/database');

// Muestra una lista de todas las videoclases en formato JSON
exports.getAllVideoclases = async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM videoclases'); // Usamos async/await para obtener los resultados de la base de datos


    res.json(results);
  } catch (error) {
    // Manejo de errores
    return res.status(500).json({ error: 'Error interno del servidor: ' + error.message });
  }
};

// Muestra un registro en función de su ID
exports.getVideoclaseById = async (req, res) => {
  try {
    const VideoclaseId = req.params.id;
    const [results] = await db.query('SELECT * FROM videoclases WHERE id = ?', [VideoclaseId]);

    if (results.length === 0) {
      return res.status(404).json({ error: 'Videoclase no encontrada' });
    }

    res.json(results[0]); // Retorna el primer resultado ya que es único
  } catch (error) {
    // Manejo de errores
    return res.status(500).json({ error: 'Error interno del servidor: ' + error.message });
  }
};

// Muestra todos los videoclases de un tema
exports.getAllVideoclaseByTema = async (req, res) => {
  try {
    const temaId = req.params.id;
    const [results] = await db.query('SELECT * FROM videoclases WHERE tema_id = ?', [temaId]);


    //res.json(results); // Retorna el primer resultado ya que es único
    res.json(results[0] || {}); // solo una videoclases por tema (ajusta si hay más)
  } catch (error) {
    // Manejo de errores
    return res.status(500).json({ error: 'Error interno del servidor: ' + error.message });
  }
};



/*
// Crea un nuevo registro
exports.storeVideoclase = async (req, res) => {
  try {
    const data = req.body;

    const [results] = await db.query('INSERT INTO videoclases SET ?', [data]);

    res.status(201).json({ message: 'Videoclase creada satisfactoriamente', id: results.insertId });
  } catch (error) {
    // Manejo de errores
    return res.status(500).json({ error: 'Error interno del servidor: ' + error.message });
  }
};
*/

exports.storeVideoclase = async (req, res) => {
  try {
      const { name, description, image, duration, tema_id } = req.body;

      const videoFile = req.file;
      if (!videoFile) return res.status(400).json({ error: 'No se ha subido ningún archivo de video' });

      const video_url = `videos/${videoFile}`

      const [result] = await db.query('INSERT INTO videoclases SET ?', {
          name,
          image,
          description,
          duration,
          video_url,
          tema_id
      });

      res.status(201).json({ message: 'Videoclase creada satisfactoriamente', id: result.insertId });

  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al crear la videoclase' });
  }
};

/*
// Actualiza un registro
exports.updateVideoclase = async (req, res) => {
  try {
    const VideoclaseId = req.params.id;
    const VideoclaseData = req.body;

    const [results] = await db.query('UPDATE videoclases SET ? WHERE id = ?', [VideoclaseData, VideoclaseId]);

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Videoclase no encontrada' });
    }

    res.json({ message: 'Videoclase actualizada satisfactoriamente' });
  } catch (error) {
    // Manejo de errores
    console.log(error)
    return res.status(500).json({ error: 'Error interno del servidor: ' + error.message });
  }
};

*/

exports.updateVideoclase = async (req, res) => {
  try {
    const id = req.params.id;
    const {name, description, image, duration, tema_id } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'El ID de la videoclase es obligatorio' });
    }

    // Buscar primero si existe la videoclase
    const [existingRows] = await db.query('SELECT * FROM videoclases WHERE id = ?', [id]);
    if (existingRows.length === 0) {
      return res.status(404).json({ error: 'Videoclase no encontrada' });
    }

    // Recolectar datos actualizables
    const updateFields = {};
    if (name !== undefined && name !== null) updateFields.name = name;
    if (description !== undefined && description !== null) updateFields.description = description;
    if (image !== undefined && image !== null && image !== '') updateFields.image = image;
    if (duration !== undefined && duration !== null) updateFields.duration = duration;
    if (tema_id !== undefined && tema_id !== null) updateFields.tema_id = tema_id;

    // Si se subió un nuevo archivo de video
    if (req.file) {
      const video_url = req.file.filename;
      updateFields.video_url = video_url;
    }

    // Si no hay campos para actualizar
    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ error: 'No se proporcionaron campos para actualizar' });
    }

    // Ejecutar la actualización
    const [result] = await db.query('UPDATE videoclases SET ? WHERE id = ?', [updateFields, id]);

    res.json({ message: 'Videoclase actualizada satisfactoriamente' });

  } catch (error) {
    console.error('Error al actualizar la videoclase:', error);
    res.status(500).json({ error: 'Error interno del servidor: ' + error.message });
  }
};


// Elimina un registro
exports.deleteVideoclase = async (req, res) => {
  try {
    const VideoclaseId = req.params.id;

    const [results] = await db.query('DELETE FROM videoclases WHERE id = ?', [VideoclaseId]);

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Videoclase no encontrada' });
    }

    res.json({ message: 'Videoclase eliminada satisfactoriamente' });
  } catch (error) {
    // Manejo de errores
    return res.status(500).json({ error: 'Error interno del servidor: ' + error.message });
  }
};



