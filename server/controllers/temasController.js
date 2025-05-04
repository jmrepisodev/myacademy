const db = require('../config/database');

// Muestra una lista de todas las temas en formato JSON
exports.getAllTemas = async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM temas '); // Usamos async/await para obtener los resultados de la base de datos

    // Si no se encontraron temas
    if (results.length === 0) {
      return res.status(404).json({ error: 'No se ha encontrado ninguna tema' });
    }

    res.json(results);
  } catch (error) {
    // Manejo de errores
    return res.status(500).json({ error: 'Error interno del servidor: ' + error.message });
  }
};

// Muestra una lista de todas las temas en formato JSON
exports.getAllTemasByCurso = async (req, res) => {
    const cursoId = req.params.id;
    try {
      const [results] = await db.query('SELECT * FROM temas  WHERE curso_id = ?', [cursoId]);; // Usamos async/await para obtener los resultados de la base de datos
  
      // Si no se encontraron temas
      if (results.length === 0) {
        return res.status(404).json({ error: 'No se ha encontrado ninguna tema' });
      }
  
      res.json(results);
    } catch (error) {
      // Manejo de errores
      return res.status(500).json({ error: 'Error interno del servidor: ' + error.message });
    }
  };

// Muestra un registro en función de su ID
exports.getTemaById = async (req, res) => {
  try {
    const temaId = req.params.id;
    const [results] = await db.query('SELECT * FROM temas WHERE id = ?', [temaId]);

    if (results.length === 0) {
      return res.status(404).json({ error: 'tema no encontrada' });
    }

    res.json(results[0]); // Retorna el primer resultado ya que es único
  } catch (error) {
    // Manejo de errores
    return res.status(500).json({ error: 'Error interno del servidor: ' + error.message });
  }
};

/*
// Crea un nuevo registro
exports.storeTema = async (req, res) => {

  try {
    const data = req.body;

    const [results] = await db.query('INSERT INTO temas SET ?', [data]);

    res.status(201).json({ message: 'tema creada satisfactoriamente', id: results.insertId });
  } catch (error) {
    // Manejo de errores
    return res.status(500).json({ error: 'Error interno del servidor: ' + error.message });
  }
};
*/

exports.storeTema = async (req, res) => {
  try {
    const { indice_tema, name, image, description, curso_id, category_id } = req.body;
    const pdf_url = req.file ? req.file.filename : null;

    const [result] = await db.query('INSERT INTO temas SET ?', {
      indice_tema,
      name,
      image,
      description,
      curso_id,
      category_id,
      pdf_url
    });

    res.status(201).json({ message: 'Tema creado exitosamente', id: result.insertId });

  } catch (error) {
    console.error('Error al guardar tema:', error);
    res.status(500).json({ error: 'Error al guardar el tema' });
  }
};


/*
// Actualiza un registro
exports.updateTema = async (req, res) => {
  try {
    const TemaId = req.params.id;
    const TemaData = req.body;

    const [results] = await db.query('UPDATE temas SET ? WHERE id = ?', [TemaData, TemaId]);

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'tema no encontrada' });
    }

    res.json({ message: 'tema actualizada satisfactoriamente' });
  } catch (error) {
    // Manejo de errores
    return res.status(500).json({ error: 'Error interno del servidor: ' + error.message });
  }
};
*/

exports.updateTema = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({ error: 'El ID del tema es obligatorio' });
    }

    // Verificar si el tema existe
    const [existingRows] = await db.query('SELECT * FROM temas WHERE id = ?', [id]);
    if (existingRows.length === 0) {
      return res.status(404).json({ error: 'Tema no encontrado' });
    }

    // Recolectar los campos actualizables
    const { indice_tema, name, image, description, category_id, curso_id } = req.body;
    const updateFields = {};

    if (indice_tema !== undefined) updateFields.indice_tema = indice_tema;
    if (name !== undefined) updateFields.name = name;
    if (image !== undefined && image !== null && image !== '') updateFields.image = image;
    if (description !== undefined) updateFields.description = description;
    if (category_id !== undefined) updateFields.category_id = category_id;
    if (curso_id !== undefined) updateFields.curso_id = curso_id;

    // Si se subió un nuevo archivo PDF
    if (req.file) {
      const pdf_url = req.file.filename;
      updateFields.pdf_url = pdf_url;
    }

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ error: 'No se proporcionaron campos para actualizar' });
    }

    // Ejecutar la actualización
    const [result] = await db.query('UPDATE temas SET ? WHERE id = ?', [updateFields, id]);

    res.json({ message: 'Tema actualizado satisfactoriamente' });

  } catch (error) {
    console.error('Error al actualizar el tema:', error);
    return res.status(500).json({ error: 'Error interno del servidor: ' + error.message });
  }
};


// Elimina un registro
exports.deleteTema = async (req, res) => {
  try {
    const TemaId = req.params.id;

    const [results] = await db.query('DELETE FROM temas WHERE id = ?', [TemaId]);

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'tema no encontrada' });
    }

    res.json({ message: 'tema eliminada satisfactoriamente' });
  } catch (error) {
    // Manejo de errores
    return res.status(500).json({ error: 'Error interno del servidor: ' + error.message });
  }
};


