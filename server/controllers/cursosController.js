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
/*
// Muestra todas las Cursos en función del curso u oposición
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
*/
/*
// Mostrar todos los cursos, con paginación
exports.getAllCursos = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const [results] = await db.query('SELECT * FROM cursos LIMIT ? OFFSET ?', [limit, offset]);
    const [[{ total }]] = await db.query('SELECT COUNT(*) AS total FROM cursos');

    res.json({
      cursos: results,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
      return res.status(500).json({ error: 'Error interno del servidor: ' + error.message });
  }
};
*/

//Muestra todos los cursos, con filtros opcionales y paginación
exports.getAllCursos = async (req, res) => {
  try {
    // Parámetros de paginación
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Parámetros de filtro opcionales
    const query = req.query.query?.toLowerCase() || '';
    const estado = req.query.estado || '';
    const profesor = req.query.profesor || '';

    // Armado dinámico del WHERE
    let whereClauses = [];
    let params = [];

    if (query) {
      whereClauses.push('(LOWER(name) LIKE ? OR id LIKE ?)');
      params.push(`%${query}%`, `%${query}%`);
    }

    if (estado) {
      whereClauses.push('status = ?');
      params.push(estado);
    }

    if (profesor) {
      whereClauses.push('profesor_id = ?');
      params.push(profesor);
    }

    const whereSql = whereClauses.length ? 'WHERE ' + whereClauses.join(' AND ') : '';
/*
    // Consulta paginada
    const [results] = await db.query(
      `SELECT * FROM cursos ${whereSql} LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );
*/
    // Consulta paginada
    const [results] = await db.query(
      `SELECT c.*, u.name AS profesor_name 
      FROM cursos c 
      LEFT JOIN usuarios u ON c.profesor_id = u.id 
      ${whereSql} LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    // Conteo total con los mismos filtros
    const [[{ total }]] = await db.query(
      `SELECT COUNT(*) AS total FROM cursos ${whereSql}`,
      params
    );

    res.json({
      cursos: results,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Error en getAllCursos:', error);
    return res.status(500).json({ error: 'Error interno del servidor: ' + error.message });
  }
};



// Muestra todas las Cursos en función del curso u oposición
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
      return res.status(404).json({ error: 'Curso no encontrada' });
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

    res.status(201).json({ message: 'Curso creado satisfactoriamente', id: results.insertId });
  } catch (error) {
      // Manejo de errores
      return res.status(500).json({ error: 'Error interno del servidor: ' + error.message });
  }
};


// Actualiza un registro
exports.updateCurso = async (req, res) => {
  try {
    const cursoId = req.params.id;

    const { name, description, image, status, profesor_id } = req.body;

    const cursoData = {
      name,
      description,
      image,
      status,
      profesor_id,
      updated_at: new Date()
    };

    const [results] = await db.query('UPDATE cursos SET ? WHERE id = ?', [cursoData, cursoId]);

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Curso no encontrada' });
    }

    res.json({ message: 'Curso actualizada satisfactoriamente' });
  } catch (error) {
    // Manejo de errores
    console.log(error)
    return res.status(500).json({ error: 'Error interno del servidor: ' + error.message });
  }
};

// Elimina un registro
exports.deleteCurso = async (req, res) => {
  try {
    const cursoId = req.params.id;

    const [results] = await db.query('DELETE FROM cursos WHERE id = ?', [cursoId]);

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Curso no encontrada' });
    }

    res.json({ message: 'Curso eliminada satisfactoriamente' });
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

//Mostrar usuarios por curso
exports.getUsuariosPorCurso = async (req, res) => {
  const cursoId = req.params.id;

  try {
      const [rows] = await db.query(`
          SELECT u.id, u.name, u.email, u.rol, u.image, u.status
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

//Dar de baja un alumno de un curso
exports.anularMatriculaCurso = async (req, res) => {
  const { cursoId, usuarioId } = req.params;
  try {
      await db.query('DELETE FROM usuarios_cursos WHERE curso_id = ? AND usuario_id = ?', [cursoId, usuarioId]);
      res.status(200).json({ message: 'Alumno dado de baja del curso correctamente' });
  } catch (error) {
      console.error('Error al eliminar relación usuario-curso:', error);
      res.status(500).json({ message: 'Error al dar de baja al alumno del curso' });
  }
};

