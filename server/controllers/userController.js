const db = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
//const {sendVerificationEmail, sendResetEmail } = require('../utils/emailService');
//dotenv lee variables de entorno
require("dotenv").config(); 

/*
// Muestra una lista de todos los registros en formato JSON
exports.getAllUsers = async (req, res) => {
    try {
        const [results] = await db.query('SELECT * FROM usuarios');

        // Si no se encontraron usuarios
        if (results.length === 0) {
            return res.status(404).json({ error: 'No se ha encontrado ningun usuario' });
        }

        res.json(results);
    } catch (error) {
        console.error('Error al obtener la lista de usuarios:', error);
        res.status(500).json({ error: 'Error interno del servidor'});
    }
};
*/

//mostrar todos los usuarios, con paginación
exports.getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10; // elementos por página
    const offset = (page - 1) * limit;

    const [users] = await db.query(
      'SELECT * FROM usuarios ORDER BY id DESC LIMIT ? OFFSET ?',
      [limit, offset]
    );

    const [[{ total }]] = await db.query('SELECT COUNT(*) as total FROM usuarios');

    res.json({
      users,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
      console.error('Error al obtener la lista de usuarios:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
  }
};


// Muestra una lista de todos los registros en formato JSON
exports.getRankingUsers= async (req, res) => {
    try {
        const [results] = await db.query(`
            SELECT id, name, total_score FROM usuarios 
            WHERE rol = 'user' AND status = 'permitido'
            ORDER BY total_score DESC
        `);

        // Si no se encontraron usuarios
        if (results.length === 0) {
            return res.status(404).json({ error: 'No se ha encontrado ningun usuario' });
        }

        res.json(results);
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor'});
    }
};


// Muestra un registro en función de su ID
exports.getUserById = async (req, res) => {
    const userId = req.user.id; // El ID del usuario se obtiene del middleware JWT
    //const userId = req.params.id;

    try {
        const [results] = await db.query('SELECT * FROM usuarios WHERE id = ?', [userId]);

        if (results.length === 0) {
            return res.status(404).json({ error: 'usuario no encontrado' });
        }

        res.json(results[0]);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el perfil del usuario'});
    }
};


exports.storeUser= async (req, res) => {
   
    try {
      const { name, email, password } = req.body;
  
      // Verificar si el correo ya existe
      const [existingUser] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
      if (existingUser.length > 0) {
        return res.status(400).json({ error: 'Ya existe una cuenta con este email' });
      }
  
      // Encriptar la contraseña
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Insertar el nuevo usuario en la base de datos
      //const [results] = await db.query('INSERT INTO usuarios (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword]);

      const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });

      const [results] = await db.query('INSERT INTO usuarios (name, email, password, verification_token) VALUES (?, ?, ?, ?)',[name, email, hashedPassword, verificationToken]);

    //  await sendVerificationEmail(email, verificationToken);
  
      res.status(201).json({ message: 'Usuario registrado satisfactoriamente', id: results.insertId });
  
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      res.status(500).json({ message: 'Error al registrar usuario' });
    }
  };


// Update user
exports.updateUser = async (req, res) => {
    const userId = req.params.id;
    const { name, email, rol, password, image, is_verified } = req.body;
    console.log("ID usuario: " + userId);

    try {
        // 1. Obtener los datos actuales del usuario
        const currentUser = await db.query("SELECT * FROM usuarios WHERE id = ?", [userId]);
        if (currentUser.length === 0) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        const user = currentUser[0]; // El primer (y único) usuario en el resultado

        // 2. Preparar la actualización
        let query = "UPDATE usuarios SET ";
        const updates = [];
        
        // Actualización de nombre si es necesario
        if (name && name !== user.name) {
            updates.push(`name='${name}'`);
        }
        
        // Actualización de email si es necesario
        if (email && email !== user.email) {
            updates.push(`email='${email}'`);
        }

        // Actualización de is_verified si es necesario
        if (is_verified && is_verified !== user.is_verified) {
            updates.push(`is_verified='${is_verified}'`);
        }

         // Actualización de rol si es necesario
         if (rol && rol !== user.rol) {
            updates.push(`rol='${rol}'`);
        }
        
        
        // Actualización de contraseña si es necesario
        if (password) {
            // Siempre que se proporciona una nueva contraseña, se debe actualizar
            const hashedPassword = await bcrypt.hash(password, 10);
            updates.push(`password='${hashedPassword}'`);
        }

        // Actualización de imagen si es necesario
        if (image && image !== user.image) {
            updates.push(`image='${image}'`);
        }


        // Si no hay actualizaciones, respondemos sin hacer cambios
        if (updates.length === 0) {
            return res.status(400).json({ message: "No se realizaron cambios en los datos" });
        }

        // 4. Construir la consulta SQL
        query += updates.join(", ") + ` WHERE id=${userId}`;

        // 5. Ejecutar la actualización
        await db.query(query);
        console.log("Perfil actualizado exitosamente");

        // 6. Responder al cliente
        res.status(200).json({ message: "La cuenta de usuario se ha actualizado exitosamente" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// Elimina un registro
exports.deleteUser = async (req, res) => {
    const UserId = req.params.id;

    try {
        const [results] = await db.query('DELETE FROM usuarios WHERE id = ?', [UserId]);

        if (results.affectedRows === 0) {
            return res.status(404).json({error: 'usuario no encontrado'});
        }

        res.json({ message: 'usuario eliminada satisfactoriamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor'});
    }
};

// Muestra los cursos inscritos del usuario
exports.updateProfile = async (req, res) => {
    const userId = req.user.id;
    const { name, email, passwordActual, nuevaPassword } = req.body;

    try {
        const [[user]] = await db.query('SELECT * FROM usuarios WHERE id = ?', [userId]);

        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

        // Verificar contraseña actual si quiere cambiarla
        if (nuevaPassword) {
            const match = await bcrypt.compare(passwordActual, user.password);
            if (!match) return res.status(401).json({ message: 'Contraseña actual incorrecta' });
        }

        const newHashedPassword = nuevaPassword ? await bcrypt.hash(nuevaPassword, 10) : user.password;

        await db.query(
            'UPDATE usuarios SET name = ?, email = ?, password = ?, updated_at = NOW() WHERE id = ?',
            [name, email, newHashedPassword, userId]
        );

        res.json({ id: userId, name, email, image: user.image });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al actualizar el perfil' });
    }
};

// Muestra los cursos inscritos del usuario
exports.getCursosByUser = async (req, res) => {
    const userId = req.user.id; // El ID del usuario se obtiene del middleware JWT
    //const userId = req.params.id;
    
    try {
        const [cursos] = await db.query(`
          SELECT c.id, c.name, c.description, c.image
          FROM usuarios_cursos uc
          JOIN cursos c ON c.id = uc.curso_id
          WHERE uc.usuario_id = ?
        `, [userId]);
    
        res.status(200).json(cursos);
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al obtener cursos del usuario' });
      }
};

// Muestra los cursos inscritos del usuario
exports.getResultadosByUser = async (req, res) => {
    const userId = req.user.id; // El ID del usuario se obtiene del middleware JWT
    
    try {
        const [resultados] = await db.query(`
          SELECT r.id, t.name as test_name, r.aciertos, r.errores, r.en_blanco, r.score, r.timeTaken, r.created_at
          FROM resultados r
          JOIN tests t ON t.id = r.test_id
          WHERE r.user_id = ?
          ORDER BY r.created_at DESC
        `, [userId]);
    
        res.json(resultados);
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al obtener resultados del usuario' });
      }
};

// Muestra todos los cursos inscritos del usuario (administrador)
exports.getCursosPorUsuario = async (req, res) => {
    const userId = req.params.id;
  
    try {
      const [rows] = await db.query(`
        SELECT c.id, c.name
        FROM usuarios_cursos uc
        JOIN cursos c ON uc.curso_id = c.id
        WHERE uc.usuario_id = ?
      `, [userId]);
  
      res.json(rows);
    } catch (error) {
      console.error('Error al obtener cursos del usuario:', error);
      res.status(500).json({ error: 'Error al obtener los cursos del usuario' });
    }
  };
  
  // Muestra las estadísticas de todos los usuarios
exports.getAllUsersStats = async (req, res) => {
  try {
    const [users] = await db.query(`
      SELECT 
        u.id AS user_id,
        u.name,
        COUNT(r.id) AS total_tests,
        SUM(r.aciertos) AS total_aciertos,
        SUM(r.errores) AS total_errores,
        SUM(r.en_blanco) AS total_en_blanco,
        SUM(r.score) AS suma_scores,
        AVG(r.score) AS promedio_score,
        STDDEV(r.score) AS desviacion_score,
        SUM(r.timeTaken) AS tiempo_total,
        AVG(r.timeTaken) AS tiempo_promedio
      FROM usuarios u
      JOIN resultados r ON u.id = r.user_id
      GROUP BY u.id
    `);

    res.json(users);
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas de usuarios' });
  }
};