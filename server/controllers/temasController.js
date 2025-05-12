const db = require('../config/database');

// Muestra una lista de todas las temas en formato JSON
exports.getAllTemas = async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM temas '); // Usamos async/await para obtener los resultados de la base de datos

   
    res.json(results);
  } catch (error) {
    // Manejo de errores
    return res.status(500).json({ error: 'Error interno del servidor: ' + error.message });
  }
};
/*
// Muestra una lista de todas las temas en formato JSON
exports.getAllTemasByCurso = async (req, res) => {
    const cursoId = req.params.id;
    try {
      const [results] = await db.query('SELECT * FROM temas  WHERE curso_id = ?', [cursoId]);; // Usamos async/await para obtener los resultados de la base de datos
  
      res.json(results);
    } catch (error) {
      // Manejo de errores
      return res.status(500).json({ error: 'Error interno del servidor: ' + error.message });
    }
  };
*/

// Muestra una lista de todas los temas del curso con progreso del usuario
exports.getAllTemasByCurso = async (req, res) => {
  const cursoId = req.params.id;
  const usuarioId = req.user?.id; // proviene del token jwt

  if (!usuarioId) {
    return res.status(401).json({ error: 'Usuario no autenticado' });
  }

  try {
    const [results] = await db.query(
      `
      SELECT 
        t.*,
        pu.completado,
        pu.tiempo_dedicado
      FROM temas t
      LEFT JOIN progreso_usuario pu
        ON pu.tema_id = t.id AND pu.usuario_id = ?
      WHERE t.curso_id = ? AND t.status = 'activo'
      ORDER BY t.orden ASC
      `,
      [usuarioId, cursoId]
    );

    return res.status(200).json(results);

  } catch (error) {
    console.error('Error al obtener temas:', error);
    res.status(500).json({ error: 'Error interno del servidor: ' + error.message });
  }
};


// Muestra un registro en función de su ID
exports.getTemaById = async (req, res) => {
  try {
    const temaId = req.params.id;
    const [results] = await db.query('SELECT * FROM temas WHERE id = ?', [temaId]);

    if (results.length === 0) {
      return res.status(404).json({ error: 'tema no encontrado' });
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
    const { orden, name, image, description, curso_id, category_id } = req.body;
    const pdf_url = req.file ? `archivos/${req.file.filename}` : null;
/*
    const pdfFile = req.files['pdf']?.[0];
    const imageFile = req.files['image']?.[0];
*/
    const [result] = await db.query('INSERT INTO temas SET ?', {
      orden,
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

//Marcar como completado un tema
exports.marcarComoCompletado = async (req, res) => {
  const temaId = req.params.id;
  const usuarioId = req.user.id; // viene del token JWT

  

    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      // Actualizar progreso
      await connection.query(
        `INSERT INTO progreso_usuario (usuario_id, tema_id, completado)
        VALUES (?, ?, TRUE)
        ON DUPLICATE KEY UPDATE completado = TRUE, updated_at = CURRENT_TIMESTAMP`,
        [usuarioId, temaId]
      );

      // Contar progreso usando la MISMA conexión
      const [progresoCurso] = await connection.query(`
        SELECT
          COUNT(DISTINCT t.id) AS total_temasy,
          COUNT(DISTINCT CASE WHEN pu.completado = TRUE THEN pu.tema_id END) AS completados
        FROM temas t
        LEFT JOIN progreso_usuario pu ON pu.tema_id = t.id AND pu.usuario_id = ?
        WHERE t.curso_id = (SELECT curso_id FROM temas WHERE id = ?)
      `, [usuarioId, temaId]);

      const { total_temasy, completados } = progresoCurso[0];
      const porcentaje = total_temasy > 0 ? Math.round((completados / total_temasy) * 100) : 0;

      // Actualizar usuarios_cursos
      await connection.query(`
        UPDATE usuarios_cursos
        SET progreso = ?, estado = ?, completado = ?, fecha_completado = ?
        WHERE usuario_id = ? AND curso_id = (
          SELECT curso_id FROM temas WHERE id = ?
        )
      `, [
        porcentaje,
        porcentaje >= 100 ? 'finalizado' : 'en progreso',
        porcentaje >= 100,
        porcentaje >= 100 ? new Date() : null,
        usuarioId,
        temaId
      ]);

      await connection.commit();
      connection.release();

      return res.status(200).json({ message: 'Tema marcado como completado y progreso actualizado.' });

    } catch (error) {
      await connection.rollback();
      connection.release();
      console.error(error);
      return res.status(500).json({ error: 'Error al actualizar el progreso del curso.' });
    }

};


