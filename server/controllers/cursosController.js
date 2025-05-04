const authMiddleware = require('../middleware/authMiddleware');
const db = require('../config/database');


exports.getDashboard = async (req, res) => {
  const userId = req.user.id; //id como parte de jwt token

  try {
    const [user] = await db.query(
      'SELECT id, name, image, rol FROM usuarios WHERE id = ?',
      [userId]
    );

    const [cursos] = await db.query(
      `SELECT c.id, c.name, c.image, c.description 
      FROM cursos c
      JOIN usuarios_cursos uc ON uc.curso_id = c.id
      WHERE uc.usuario_id = ?`,
      [userId]
    );

    const [stats] = await db.query(
      `SELECT 
        COUNT(*) AS total_tests,
        IFNULL(AVG(score), 0) AS promedio_score,
        IFNULL(SUM(timeTaken), 0) AS tiempo_total
      FROM resultados
      WHERE user_id = ?`,
      [userId]
    );

    
    res.json({
      user: user[0],
      cursos,
      estadisticas: stats[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al cargar el dashboard' });
  }
};

// Muestra todas las categorías en función del curso u oposición
exports.getAllCursos= async (req, res) => {
  try {

    const [results] = await db.query('SELECT * FROM cursos');

    if (results.length === 0) {
      return res.status(404).json({ error: 'subcategoria no encontrada' });
    }

    res.json(results); // Retorna el primer resultado ya que es único
  } catch (error) {
    // Manejo de errores
    return res.status(500).json({ error: 'Error interno del servidor: ' + error.message });
  }
};

// Muestra todas las categorías en función del curso u oposición
exports.getAllCursosByUser= async (req, res) => {
  try {
    const userId = req.params.id; //id como parámetro
    //const userId = req.user.id; //id como parte de jwt token

    const [results] = await db.query(
      `SELECT c.id, c.name, c.image, c.description 
      FROM cursos c
      JOIN usuarios_cursos uc ON uc.curso_id = c.id
      WHERE uc.usuario_id = ?`,
      [userId]
    );

    if (results.length === 0) {
      return res.status(404).json({ error: 'subcategoria no encontrada' });
    }

    res.json(results); // Retorna el primer resultado ya que es único
  } catch (error) {
    // Manejo de errores
    return res.status(500).json({ error: 'Error interno del servidor: ' + error.message });
  }
};

// Muestra un registro en función de su ID
exports.getCursoById = async (req, res) => {
  try {
    const cursoId = req.params.id;
    const [results] = await db.query('SELECT * FROM cursos WHERE id = ?', [cursoId]);

    if (results.length === 0) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    res.json(results[0]); // Retorna el primer resultado ya que es único
  } catch (error) {
      // Manejo de errores
      return res.status(500).json({ error: 'Error interno del servidor: ' + error.message });
  }
};

// Crea un nuevo registro
exports.storeCurso = async (req, res) => {
  try {
    const data = req.body;

    const [results] = await db.query('INSERT INTO cursos SET ?', [data]);

    res.status(201).json({ message: 'Categoría creada satisfactoriamente', id: results.insertId });
  } catch (error) {
      // Manejo de errores
      return res.status(500).json({ error: 'Error interno del servidor: ' + error.message });
  }
};


// Actualiza un registro
exports.updateCurso = async (req, res) => {
  try {
    const cursoId = req.params.id;
    const cursoData = req.body;

    const [results] = await db.query('UPDATE cursos SET ? WHERE id = ?', [cursoData, cursoId]);

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    res.json({ message: 'Categoría actualizada satisfactoriamente' });
  } catch (error) {
    // Manejo de errores
    return res.status(500).json({ error: 'Error interno del servidor: ' + error.message });
  }
};

// Elimina un registro
exports.deleteCurso = async (req, res) => {
  try {
    const cursoId = req.params.id;

    const [results] = await db.query('DELETE FROM cursos WHERE id = ?', [cursoId]);

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    res.json({ message: 'Categoría eliminada satisfactoriamente' });
  } catch (error) {
    // Manejo de errores
    return res.status(500).json({ error: 'Error interno del servidor: ' + error.message });
  }
};

// Crea un nuevo registro
exports.matricularAlumno = async (req, res) => {
    const { cursoId } = req.body;
    const usuarioId = req.user.id;

    try {
      // Validar si ya está inscrito
      const [existing] = await db.query(
        'SELECT * FROM usuarios_cursos WHERE usuario_id = ? AND curso_id = ?',
        [usuarioId, cursoId]
      );

      if (existing.length > 0) {
        console.error('Error: el usuario ya está inscrito en este curso');
        return res.status(400).json({ message: 'Ya estás inscrito en este curso.' });
      }

      // Insertar matrícula
      await db.query(
        'INSERT INTO usuarios_cursos (usuario_id, curso_id) VALUES (?, ?)',
        [usuarioId, cursoId]
      );
      res.status(200).json({ message: 'Matrícula realizada con éxito.' });
    } catch (error) {
        console.error('Error en matrícula:', error);
        res.status(500).json({ message: 'Error al inscribirse.' });
    }
};

exports.getUsuariosPorCurso = async (req, res) => {
  const cursoId = req.params.id;

  try {
      const [rows] = await db.query(`
          SELECT u.id, u.name, u.email, u.rol, u.image
          FROM usuarios u
          INNER JOIN usuarios_cursos uc ON u.id = uc.usuario_id
          WHERE uc.curso_id = ?
      `, [cursoId]);

      res.json(rows);
  } catch (error) {
      console.error('Error al obtener alumnos del curso:', error);
      res.status(500).json({ error: 'Error al obtener alumnos inscritos' });
  }
};