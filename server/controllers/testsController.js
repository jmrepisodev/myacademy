const db = require('../config/database');


// Muestra una lista de todas las tests en formato JSON
exports.getAllTests = async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM tests'); // Usamos async/await para obtener los resultados de la base de datos

    // Si no se encontraron tests
    if (results.length === 0) {
      return res.status(404).json({ error: 'No se ha encontrado ningún Test' });
    }

    res.json(results);
  } catch (error) {
    // Manejo de errores
    return res.status(500).json({ error: 'Error interno del servidor: ' + error.message });
  }
};

// Muestra un registro en función de su ID
exports.getTestById = async (req, res) => {
  try {
    const testId = req.params.id;
    const [results] = await db.query('SELECT * FROM tests WHERE id = ?', [testId]);

    if (results.length === 0) {
      return res.status(404).json({ error: 'Test no encontrada' });
    }

    res.json(results[0]); // Retorna el primer resultado ya que es único
  } catch (error) {
    // Manejo de errores
    return res.status(500).json({ error: 'Error interno del servidor: ' + error.message });
  }
};

// Muestra todos los tests de un tema
exports.getAllTestByTema = async (req, res) => {
  try {
    const temaId = req.params.id;
    const [results] = await db.query('SELECT * FROM tests WHERE tema_id = ?', [temaId]);

    if (results.length === 0) {
      return res.status(404).json({ error: 'No se ha encontrado ningún test' });
    }

    res.json(results); // Retorna el primer resultado ya que es único
  } catch (error) {
    // Manejo de errores
    return res.status(500).json({ error: 'Error interno del servidor: ' + error.message });
  }
};

// Muestra todos las preguntas de un test
exports.getAllQuestionsByTest = async (req, res) => {
  try {
    const testId = req.params.id;
    const [results] = await db.query('SELECT * FROM preguntas WHERE test_id = ?', [testId]);

    if (results.length === 0) {
      return res.status(404).json({ error: 'No se ha encontrado ningún test' });
    }

    res.json(results); // Retorna el primer resultado ya que es único
  } catch (error) {
    // Manejo de errores
    return res.status(500).json({ error: 'Error interno del servidor: ' + error.message });
  }
};



// Crea un nuevo registro
exports.storeTest = async (req, res) => {
  try {
    const data = req.body;

    const [results] = await db.query('INSERT INTO tests SET ?', [data]);

    res.status(201).json({ message: 'Test creada satisfactoriamente', id: results.insertId });
  } catch (error) {
    // Manejo de errores
    return res.status(500).json({ error: 'Error interno del servidor: ' + error.message });
  }
};

// Actualiza un registro
exports.updateTest = async (req, res) => {
  try {
    const TestId = req.params.id;
    const TestData = req.body;

    const [results] = await db.query('UPDATE tests SET ? WHERE id = ?', [TestData, TestId]);

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Test no encontrada' });
    }

    res.json({ message: 'Test actualizada satisfactoriamente' });
  } catch (error) {
    // Manejo de errores
    return res.status(500).json({ error: 'Error interno del servidor: ' + error.message });
  }
};


// Elimina un registro
exports.deleteTest = async (req, res) => {
  try {
    const TestId = req.params.id;

    const [results] = await db.query('DELETE FROM tests WHERE id = ?', [TestId]);

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Test no encontrada' });
    }

    res.json({ message: 'Test eliminada satisfactoriamente' });
  } catch (error) {
    // Manejo de errores
    return res.status(500).json({ error: 'Error interno del servidor: ' + error.message });
  }
};


// Guardar resultado de un test
exports.saveResultTest = async (req, res) => {
  const testId = req.params.id;
  const { aciertos, errores, en_blanco, score, timeTaken, respuestas } = req.body;
  const user_id = req.user.id; //id como parte de jwt token

  const connection = await db.getConnection(); // Obtener conexión del pool
  try {
    await connection.beginTransaction(); //inicia una transacción

      // Insertar resultado principal
      const [result] = await connection.query(
        `INSERT INTO resultados (aciertos, errores, en_blanco, score, timeTaken, test_id, user_id)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [aciertos, errores, en_blanco, score, timeTaken, testId, user_id]
      );

      const resultado_id = result.insertId;

      // Insertar respuestas individuales
      const values = respuestas.map(r => [
        resultado_id,
        r.question_id,
        r.respuesta_usuario,
        r.respuesta_correcta,
        r.es_respondida,
        r.es_correcta
      ]);

      await connection.query(
        `INSERT INTO respuestas_usuario
          (resultado_id, question_id, respuesta_usuario, respuesta_correcta, es_respondida, es_correcta)
        VALUES ?`,
        [values]
      );

      await connection.commit();
      res.status(201).json({ message: 'Resultado guardado correctamente', resultado_id });

  } catch (error) {
      await connection.rollback();
      console.error(error);
      res.status(500).json({ error: 'Error al guardar resultados' });
  } finally {
      connection.release();
  }
};

exports.getAllResultsByTest = async (req, res) => {
    const resultadoId = req.params.id;
    console.log(resultadoId)

    try {
      // Obtener el resumen del resultado
      const [resultadoRows] = await db.query(
        `SELECT * FROM resultados WHERE id = ?`,[resultadoId]
      );

      if (resultadoRows.length === 0) {
        return res.status(404).json({ error: 'Resultado no encontrado' });
      }

      const resultado = resultadoRows[0];

      // Obtener las respuestas individuales
      const [respuestas] = await db.query(
        `SELECT
          ru.id AS respuesta_id,
          p.id AS question_id,
          p.question,
          p.option1,
          p.option2,
          p.option3,
          p.option4,
          ru.respuesta_usuario,
          ru.respuesta_correcta,
          ru.es_correcta,
          ru.es_respondida
        FROM respuestas_usuario ru
        JOIN preguntas p ON ru.question_id = p.id
        WHERE ru.resultado_id = ?`,
        [resultadoId]
      );

      // Devolver ambos
      res.json({
        resultado,
        respuestas
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al obtener el resultado completo' });
    }
};


